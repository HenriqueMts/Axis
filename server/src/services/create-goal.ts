import { db } from "../db";
import { goals } from "../db/schema";


interface CreateGoalRequest {
    userId: string;
    title: string;
    desiredWeeklyFrequency: number;
}

export async function createGoal({
    userId,
    title,
    desiredWeeklyFrequency
}: CreateGoalRequest) {


    const [goal] = await db
        .insert(goals)
        .values({
            userId, // Referência ao dono da meta
            title,
            desiredWeeklyFrequency,
        })
        .returning();


    return {
        goal,
    };
}