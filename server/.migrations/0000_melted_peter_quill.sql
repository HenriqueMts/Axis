CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"desired_weekly_frequency" integer DEFAULT 0 NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
