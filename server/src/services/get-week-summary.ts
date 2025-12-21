import { and, gte, lte, eq, sql } from "drizzle-orm";
import { goalsCompletions, goals } from "../db/schema";
import { db } from "../db/index";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

export async function getWeekSummary() {

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

    const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
        db
            .select({
                id: goalsCompletions.goalId,
                title: goals.title,
                completedAt: goalsCompletions.createdAt,
                completedAtDate: sql`DATE(${goalsCompletions.createdAt})`.as('completedAtDate'),
            })
            .from(goalsCompletions)
            .innerJoin(goals, eq(goals.id, goalsCompletions.goalId))
            .where(
                and(
                    gte(goalsCompletions.createdAt, firstDayOfTheWeek),
                    lte(goalsCompletions.createdAt, lastDayOfTheWeek)
                )
            )
    );

    const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
        db
            .select({
                completedDate: goalsCompletedInWeek.completedAtDate,
                completions: sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )`.as('completions'), // Corrigido typo: completetions -> completions
            })
            .from(goalsCompletedInWeek)
            .groupBy(goalsCompletedInWeek.completedAtDate)
    );

    const [summary] = await db
        .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
        .select({
            completed: sql`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(Number),
            total: sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(Number),
            goalsPerDay: sql`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedDate}, 
          ${goalsCompletedByWeekDay.completions}
        )`
        })
        .from(goalsCompletedByWeekDay);

    return {
        summary: summary,
    };
}