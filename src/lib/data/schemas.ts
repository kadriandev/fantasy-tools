import { z } from "zod";

// Fantasy Stats Schema
export const fantasyStatsSchema = z
  .object({
    team_id: z.string(),
    team_name: z.string(),
  })
  .catchall(z.string());

export type FantasyStats = z.infer<typeof fantasyStatsSchema>;

// DB Fantasy Stats Schema
export const dbFantasyStatsWeekSchema = z.object({
  league_key: z.string(),
  team_id: z.number(),
  team_name: z.string(),
  week: z.number(),
  stats: z.array(
    z.object({
      value: z.string(),
      stat_id: z.string(),
    }),
  ),
});
export type DBFantasyStatsWeek = z.infer<typeof dbFantasyStatsWeekSchema>;

export const dbFantasyStatsSchema = z.array(dbFantasyStatsWeekSchema);
export type DBFantasyStats = z.infer<typeof dbFantasyStatsSchema>;
