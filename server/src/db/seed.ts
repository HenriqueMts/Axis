import { client, db } from ".";
import { goalCompletion, goals } from "./schema";
import dayjs from "dayjs";

async function seed() {

    await db.delete(goalCompletion)
    await db.delete(goals);


    const results = await db.insert(goals).values([
        {
            title: "Read 10 pages of a book",
            desiredWeeklyFrequency: 1,
        },
        {
            title: "Exercise for 30 minutes",
            desiredWeeklyFrequency: 3,
        },
        {
            title: "Meditate for 10 minutes",
            desiredWeeklyFrequency: 2,
        },
    ]).returning();

    const startOfWeek = dayjs().startOf('week')

    await db.insert(goalCompletion).values([
        {
            goalId: results[0].id, createdAt: startOfWeek.toDate()
        },
        {
            goalId: results[1].id, createdAt: startOfWeek.add(1, 'day').toDate()
        }
    ])


}


seed().finally(() => {
    client.end()
})
