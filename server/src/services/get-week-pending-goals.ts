import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { and, count, gte, lte, sql } from "drizzle-orm";
import { goalsCompletions, goals } from "../db/schema";


dayjs.extend(weekOfYear);

export async function getWeekPendingGoals() {

    const firstDayOfTheWeek = dayjs().startOf('week').toDate();
    const lastDayOfTheWeek = dayjs().endOf('week').toDate();




    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt,
        }).from(goals).where(lte(goals.createdAt, lastDayOfTheWeek))
    )


    const goalCompletionsCount = db.$with('goals_completions_counts').as(
        db.select({
            goalId: goalsCompletions.goalId,
            completionsCount: count(goalsCompletions.id),
        }).from(goalsCompletions).where(and(
            gte(goalsCompletions.createdAt, firstDayOfTheWeek),
            lte(goalsCompletions.createdAt, lastDayOfTheWeek))).groupBy(goalsCompletions.goalId))


    const pendingGoals = await db.with(goalsCreatedUpToWeek, goalCompletionsCount).select().from(goalsCreatedUpToWeek)


    return {
        pendingGoals
    }
}