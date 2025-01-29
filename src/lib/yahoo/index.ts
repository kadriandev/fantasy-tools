// @ts-ignore
import YahooFantasy from "yahoo-fantasy";
import { cookies } from "next/headers";
import { Resource } from "sst";
import * as jose from "jose";

export const createYahooClient = async () => {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");
  const jwt = jose.decodeJwt(access_token?.value!);

  const yf = new YahooFantasy(
    Resource.YAHOO_CLIENT_ID.value,
    Resource.YAHOO_CLIENT_SECRET.value,
  );

  // @ts-ignore
  yf.setUserToken(jwt.properties.access);

  return yf;
};

export async function getUserGames() {
  const yf = await createYahooClient();

  try {
    const data = await yf.user.games();
    const active_games = data.games.filter((game) => !game.is_game_over);
    return active_games;
  } catch (e) {
    console.log("yahoo-fantasy err", e);
  }

  return null;
}

// export async function fetchUserLeagues() {
//   const yf = await createYahooClient();
//
//   const games = await yf.user.games();
//   const active_games = games.games.filter((game) => !game.is_game_over);
//
//   for (const game of active_games) {
//     const teams_promise: Promise<any> = yf.user.game_teams(game.game_key);
//     const leagues_promise: Promise<any> = yf.user.game_leagues(game.game_key);
//
//     const [teams, game_leagues] = await Promise.all([
//       teams_promise,
//       leagues_promise,
//     ]);
//
//     const lls = game_leagues.games.find(
//       (g) => g.game_key === game.game_key,
//     )?.leagues;
//     if (!lls) return;
//
//     let leagues = [];
//     for (const league of lls) {
//       const settings: YahooLeagueSettings = await yf.league.settings(
//         league.league_key,
//       );
//       leagues.push({
//         league_key: league.league_key,
//         name: league.name,
//         num_teams: league.num_teams,
//         game: game.code,
//         url: league.url,
//         stat_categories: settings.settings.stat_categories,
//       });
//     }
//
//     const user_leagues = leagues.map((l) => {
//       const team_id = teams.teams
//         .find((t) => t.game_key === game.game_key)
//         ?.teams.find((t) => t.team_key.startsWith(l.league_key))?.team_id;
//       return {
//         league_key: l.league_key,
//         team_id: team_id ?? "",
//       };
//     });
//     if (!user_leagues) return;
//
//     await insertUserLeagues(leagues, user_leagues);
//   }
//   revalidatePath("/fantasy");
// }
