import { db } from '../db'
import { goalsCompletions, goals } from '../db/schema'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import dayjs from 'dayjs'

export async function getWeekPendingGoals() {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    // CTE: Contagem de conclusões APENAS desta semana
    const goalCompletionCounts = db.$with('goal_completion_counts').as(
        db
            .select({
                goalId: goalsCompletions.goalId,
                completionCount: count(goalsCompletions.id).as('completionCount'),
            })
            .from(goalsCompletions)
            .where(
                and(
                    gte(goalsCompletions.createdAt, firstDayOfWeek),
                    lte(goalsCompletions.createdAt, lastDayOfWeek)
                )
            )
            .groupBy(goalsCompletions.goalId)
    )

    // Query Principal
    const pendingGoals = await db
        .with(goalCompletionCounts)
        .select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            // Se não houver completions na semana, retorna 0 (graças ao Left Join + Coalesce)
            completionCount: sql/*sql*/ `
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
        })
        .from(goals)

        .leftJoin(goalCompletionCounts, eq(goals.id, goalCompletionCounts.goalId))
        .where(
            // IMPORTANTE: Traz metas criadas até o FIM da semana (inclui as criadas agora)
            lte(goals.createdAt, lastDayOfWeek)
        )

    return { pendingGoals }
}