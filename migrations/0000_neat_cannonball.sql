CREATE TABLE "stats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"league_key" text NOT NULL,
	"team_id" integer NOT NULL,
	"week" integer NOT NULL,
	"stats" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leagues" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "leagues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"league_key" text,
	"name" text NOT NULL,
	"num_teams" integer NOT NULL,
	"game" text NOT NULL,
	"url" text NOT NULL,
	"stat_categories" jsonb,
	CONSTRAINT "leagues_league_key_unique" UNIQUE("league_key")
);
--> statement-breakpoint
CREATE TABLE "user_to_league" (
	"user_id" text NOT NULL,
	"league_key" text NOT NULL,
	"team_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"lastUpdated" timestamp,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stats" ADD CONSTRAINT "stats_league_key_leagues_league_key_fk" FOREIGN KEY ("league_key") REFERENCES "public"."leagues"("league_key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_league" ADD CONSTRAINT "user_to_league_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_league" ADD CONSTRAINT "user_to_league_league_key_leagues_league_key_fk" FOREIGN KEY ("league_key") REFERENCES "public"."leagues"("league_key") ON DELETE no action ON UPDATE no action;
