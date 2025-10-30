ALTER TABLE "stats" DROP CONSTRAINT "stats_league_key_leagues_league_key_fk";
--> statement-breakpoint
ALTER TABLE "user_to_league" DROP CONSTRAINT "user_to_league_league_key_leagues_league_key_fk";
--> statement-breakpoint
ALTER TABLE "stats" ADD CONSTRAINT "stats_league_key_leagues_league_key_fk" FOREIGN KEY ("league_key") REFERENCES "public"."leagues"("league_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_league" ADD CONSTRAINT "user_to_league_league_key_leagues_league_key_fk" FOREIGN KEY ("league_key") REFERENCES "public"."leagues"("league_key") ON DELETE cascade ON UPDATE no action;