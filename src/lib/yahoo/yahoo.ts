import { cookies } from "next/headers";
import { YahooLeagueResource } from "./league/league-resource";
import { YahooUserResource } from "./user/user-resource";
import { auth } from "../auth/actions";
import { redirect } from "next/navigation";

export class YahooFantasy {
  private token: string;

  league: YahooLeagueResource;
  user: YahooUserResource;

  private constructor(token: string) {
    this.token = token;

    this.league = new YahooLeagueResource(this);
    this.user = new YahooUserResource(this);
  }

  static async createClient() {
    const cookieStore = await cookies();
    const access = cookieStore.get("yahoo_access_token");

    if (!access) {
      const subject = await auth();
      if (!subject) redirect("/");
      return new YahooFantasy(subject.access);
    }

    return new YahooFantasy(access.value);
  }

  async api(resource: string) {
    const options: RequestInit = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };

    const url = new URL(
      "/fantasy/v2" + resource,
      "https://fantasysports.yahooapis.com",
    );

    url.searchParams.append("format", "json");

    return fetch(url, options).then((r) => r.json());
  }
}
