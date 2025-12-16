ALTER TABLE "goal_completion" RENAME TO "goals_completions";--> statement-breakpoint
ALTER TABLE "goals_completions" DROP CONSTRAINT "goal_completion_goal_id_goals_id_fk";
--> statement-breakpoint
ALTER TABLE "goals_completions" ADD CONSTRAINT "goals_completions_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE no action ON UPDATE no action;