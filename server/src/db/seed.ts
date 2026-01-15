import { client, db } from ".";
import { goalsCompletions, goals, users } from "./schema";
import dayjs from "dayjs";

async function seed() {
  await db.delete(goalsCompletions);
  await db.delete(goals);
  await db.delete(users);

  const [user] = await db
    .insert(users)
    .values([
      {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    ])
    .returning();

  const results = await db
    .insert(goals)
    .values([
      {
        title: "Read 10 pages of a book",
        desiredWeeklyFrequency: 1,
        userId: user.id,
      },
      {
        title: "Exercise for 30 minutes",
        desiredWeeklyFrequency: 3,
        userId: user.id,
      },
      {
        title: "Meditate for 10 minutes",
        desiredWeeklyFrequency: 2,
        userId: user.id,
      },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalsCompletions).values([
    {
      goalId: results[0].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: results[1].id,
      createdAt: startOfWeek.add(1, "day").toDate(),
    },
  ]);
}

seed().finally(() => {
  client.end();
});