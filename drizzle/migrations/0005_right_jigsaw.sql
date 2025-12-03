ALTER TABLE "leagues" ALTER COLUMN "end_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_to_league" ADD COLUMN "is_hidden" integer DEFAULT 0 NOT NULL;