import { YahooFantasy } from "../yahoo";
import { mapGames, mapUserLeagues, mapUserTeams } from "../mappers/user-mapper";
import {
  YahooUserGameLeagues,
  YahooUserGames,
  YahooUserGameTeams,
} from "./schemas";

export class YahooUserResource {
  private yf: YahooFantasy;

  constructor(yf: YahooFantasy) {
    this.yf = yf;
  }

  async games(): Promise<YahooUserGames[]> {
    const data = await this.yf.api(`/users;use_login=1/games`);
    return mapGames(data.fantasy_content.users[0].user[1].games);
  }

  async game_leagues(game_key: string): Promise<YahooUserGameLeagues[]> {
    const data = await this.yf.api(
      `/users;use_login=1/games;game_keys=${game_key}/leagues`,
    );
    return mapUserLeagues(data.fantasy_content.users[0].user[1].games);
  }

  async game_teams(game_key: string): Promise<YahooUserGameTeams[]> {
    const data = await this.yf.api(
      `/users;use_login=1/games;game_keys=${game_key}/teams`,
    );
    return mapUserTeams(data.fantasy_content.users[0].user[1].games);
  }
}
