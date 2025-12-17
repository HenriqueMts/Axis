import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { and, count, gte, lte, eq, sql } from "drizzle-orm";
import { goalsCompletions, goals } from "../db/schema";

dayjs.extend(weekOfYear);

export async function getWeekPendingGoals() {
    const firstDayOfTheWeek = dayjs().startOf('week').toDate();
    const lastDayOfTheWeek = dayjs().endOf('week').toDate();


    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db
            .select({
                id: goals.id,
                title: goals.title,
                desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
                createdAt: goals.createdAt,
            })
            .from(goals)
            .where(lte(goals.createdAt, lastDayOfTheWeek))
    );


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
                    lte(goalsCompletions.createdAt, lastDayOfTheWeek)
                )
            )
            .groupBy(goalsCompletions.goalId)
    );


    const pendingGoals = await db
        .with(goalsCreatedUpToWeek, goalCompletionsCount)
        .select({
            id: goalsCreatedUpToWeek.id,
            title: goalsCreatedUpToWeek.title,
            desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
            // COALESCE garante que se for null, retorna 0. mapWith(Number) garante tipagem numérica.
            completionCount: sql<number>`COALESCE(${goalCompletionsCount.completionCount}, 0)`.mapWith(Number),
        })
        .from(goalsCreatedUpToWeek)
        .leftJoin(
            goalCompletionsCount,
            eq(goalCompletionsCount.goalId, goalsCreatedUpToWeek.id)
        );

    return {
        pendingGoals,
    };
}