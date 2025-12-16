import { text, pgTable, integer, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";




export const goals = pgTable("goals", {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    title: text('title').notNull(),
    desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});





export const goalCompletion = pgTable("goal_completion", {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    goalId: text('goal_id').references(() => goals.id).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});