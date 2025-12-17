import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { goals, goalsCompletions } from "../db/schema";
import dayjs from "dayjs";

interface createGoalCompletionRequest {
    goalId: string;
}

export async function createGoalCompletion({ goalId }: createGoalCompletionRequest) {

    const firstDayOfTheWeek = dayjs().startOf('week').toDate();
    const lastDayOfTheWeek = dayjs().endOf('week').toDate();

    const goalCompletionsCount = db.$with('goals_completions_counts').as(
        db
            .select({
                goalId: goalsCompletions.goalId,
                completionCount: count(goalsCompletions.id).as('completionCount'),
            })
            .from(goalsCompletions)
            .where(
                and(
                    gte(goalsCompletions.createdAt, firstDayOfTheWeek),
                    lte(goalsCompletions.createdAt, lastDayOfTheWeek),
                    eq(goalsCompletions.goalId, goalId)
                )
            )
            .groupBy(goalsCompletions.goalId)
    );



    const result = await db.with(goalCompletionsCount)
        .select({
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            completionCount: sql<number>`COALESCE(${goalCompletionsCount.completionCount}, 0)`.mapWith(Number),

        })
        .from(goals)
        .leftJoin(goalCompletionsCount, eq(goalCompletionsCount.goalId, goals.id))
        .where(eq(goals.id, goalId))
        .limit(1);

    const { desiredWeeklyFrequency, completionCount } = result[0];
    if (completionCount >= desiredWeeklyFrequency) {
        throw new Error('Goal Already Completed for the Week');
    }

    const insertResult = await db.insert(goalsCompletions).values({
        goalId,
    }).returning();

    const goalCompletion = insertResult[0]
    return {
        goalCompletion
    }
}

