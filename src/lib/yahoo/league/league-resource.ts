import { withCache } from "@/lib/kv";
import { YahooFantasy } from "../yahoo";
import {
  YahooLeagueMeta,
  YahooLeagueScoreboard,
  YahooLeagueSettings,
  YahooLeagueStandings,
} from "./schemas";
import {
  mapMetadata,
  mapScoreboard,
  mapSettings,
  mapStandings,
} from "../mappers/league-mapper";

export class YahooLeagueResource {
  private yf: YahooFantasy;

  constructor(yf: YahooFantasy) {
    this.yf = yf;
  }

  async meta(league_key: string): Promise<YahooLeagueMeta> {
    return withCache(`yahoo:league:${league_key}:metadata`, 3600, async () => {
      const data = await this.yf.api(`/league/${league_key}/metadata`);
      return mapMetadata(data.fantasy_content.league[0]);
    });
  }

  async settings(league_key: string): Promise<YahooLeagueSettings> {
    return withCache(`yahoo:league:${league_key}:settings`, 3600, async () => {
      const data = await this.yf.api(`/league/${league_key}/settings`);
      return mapSettings(data.fantasy_content.league[1].settings[0]);
    });
  }

  async standings(league_key: string): Promise<YahooLeagueStandings> {
    return withCache(`yahoo:league:${league_key}:standings`, 3600, async () => {
      const data = await this.yf.api(`/league/${league_key}/standings`);
      return mapStandings(data.fantasy_content.league[1].standings[0].teams);
    });
  }

  async scoreboard(
    league_key: string,
    week: number = -1,
  ): Promise<YahooLeagueScoreboard> {
    const cacheKey = `yahoo:league:${league_key}:scoreboard:${week === -1 ? "current" : week}`;
    return withCache(cacheKey, 3600, async () => {
      let url = `/league/${league_key}/scoreboard`;

      if (week !== -1) {
        url += `;week=${week}`;
      }

      const data = await this.yf.api(url);
      return mapScoreboard(
        data.fantasy_content.league[1].scoreboard[0].matchups,
      );
    });
  }
}
