"use server";

import { db } from "@/db";
import { goals, goalsCompletions } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import dayjs from "dayjs";


const createGoalSchema = z.object({
    title: z.string().min(1, "Informe a atividade"),
    desiredWeeklyFrequency: z.number().min(1).max(7),
});


export async function createGoalAction(data: z.infer<typeof createGoalSchema>) {
    const session = await auth();


    if (!session?.user?.id) {
        throw new Error("Você precisa estar logado para criar metas.");
    }

    const { title, desiredWeeklyFrequency } = createGoalSchema.parse(data);

    await db.insert(goals).values({
        title,
        desiredWeeklyFrequency,
        userId: session.user.id,
    });


    revalidatePath("/");
}


export async function getSummaryAction() {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    const userId = session.user.id;

    const firstDayOfWeek = dayjs().startOf("week").toDate();
    const lastDayOfWeek = dayjs().endOf("week").toDate();

    const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
        db
            .select({
                id: goals.id,
                title: goals.title,
                desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
                createdAt: goals.createdAt,
            })
            .from(goals)
            .where(and(
                lte(goals.createdAt, lastDayOfWeek),
                eq(goals.userId, userId)
            ))
    );

    const goalsCompletedInWeek = db.$with("goals_completed_in_week").as(
        db
            .select({
                id: goalsCompletions.id,
                title: goals.title,
                completedAt: goalsCompletions.createdAt,
                completedAtDate: sql`DATE(${goalsCompletions.createdAt})`.as("completedAtDate"),
                goalId: goalsCompletions.goalId, // <--- ADICIONADO: Precisamos disso!
            })
            .from(goalsCompletions)
            .innerJoin(goals, eq(goals.id, goalsCompletions.goalId))
            .where(and(
                gte(goalsCompletions.createdAt, firstDayOfWeek),
                lte(goalsCompletions.createdAt, lastDayOfWeek),
                eq(goals.userId, userId)
            ))
    );

    const goalsCompletedByWeekDay = db.$with("goals_completed_by_week_day").as(
        db
            .select({
                completedAtDate: goalsCompletedInWeek.completedAtDate,
                completions: sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt},
              'goalId', ${goalsCompletedInWeek.goalId} 
            )
          )
        `.as("completions"), // <--- ADICIONADO: Incluindo goalId no JSON
            })
            .from(goalsCompletedInWeek)
            .groupBy(goalsCompletedInWeek.completedAtDate)
            .orderBy(desc(goalsCompletedInWeek.completedAtDate))
    );

    type GoalsPerDay = Record<string, {
        id: string;
        title: string;
        completedAt: string;
        goalId: string; // <--- ADICIONADO na tipagem
    }[]>;

    const [summary] = await db
        .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
        .select({
            completed: sql`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(Number),
            total: sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(Number),
            goalsPerDay: sql<GoalsPerDay>`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `,
        })
        .from(goalsCompletedByWeekDay);

    return summary || { completed: 0, total: 0, goalsPerDay: {} };
}

// ... (imports anteriores de db, goals, auth, etc)

// --- ACTION: COMPLETE GOAL ---
export async function createGoalCompletionAction(goalId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Você precisa estar logado.");
    }

    // Verifica se a meta pertence ao usuário antes de completar (Segurança)
    const [goal] = await db
        .select()
        .from(goals)
        .where(and(
            eq(goals.id, goalId),
            eq(goals.userId, session.user.id)
        ));

    if (!goal) {
        throw new Error("Meta não encontrada ou não pertence a você.");
    }

    // Registra a conclusão
    await db.insert(goalsCompletions).values({
        goalId,
    });

    // Atualiza a tela
    revalidatePath("/");
}

// ... imports anteriores

// --- ACTION: GET PENDING GOALS ---
export async function getPendingGoalsAction() {
    const session = await auth();

    if (!session?.user?.id) {
        return [];
    }

    const userId = session.user.id;
    const firstDayOfWeek = dayjs().startOf("week").toDate();
    const lastDayOfWeek = dayjs().endOf("week").toDate();

    // 1. Busca metas criadas até o fim desta semana
    const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
        db
            .select({
                id: goals.id,
                title: goals.title,
                desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
                createdAt: goals.createdAt,
            })
            .from(goals)
            .where(and(
                lte(goals.createdAt, lastDayOfWeek),
                eq(goals.userId, userId) // Filtro de usuário
            ))
    );

    // 2. Conta as conclusões da semana para cada meta
    const goalCompletionCounts = db.$with("goal_completion_counts").as(
        db
            .select({
                goalId: goalsCompletions.goalId,
                completionCount: count(goalsCompletions.id).as("completionCount"),
            })
            .from(goalsCompletions)
            .innerJoin(goals, eq(goals.id, goalsCompletions.goalId)) // Join para garantir segurança
            .where(and(
                gte(goalsCompletions.createdAt, firstDayOfWeek),
                lte(goalsCompletions.createdAt, lastDayOfWeek),
                eq(goals.userId, userId)
            ))
            .groupBy(goalsCompletions.goalId)
    );

    // 3. Junta tudo e retorna
    const pendingGoals = await db
        .with(goalsCreatedUpToWeek, goalCompletionCounts)
        .select({
            id: goalsCreatedUpToWeek.id,
            title: goalsCreatedUpToWeek.title,
            desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
            completionCount: sql`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(Number),
        })
        .from(goalsCreatedUpToWeek)
        .leftJoin(goalCompletionCounts, eq(goalsCreatedUpToWeek.id, goalCompletionCounts.goalId));

    return pendingGoals;
}