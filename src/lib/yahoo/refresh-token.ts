import { Resource } from "sst";

type YahooTokenResponse = {
  access_token: string;
  refresh_token: string;
  tojen_type: string;
  expires_in: number;
};

export async function refreshYahooTokens(
  refresh: string,
): Promise<YahooTokenResponse> {
  const url = new URL("https://api.login.yahoo.com/oauth2/get_token");

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${Resource.YAHOO_CLIENT_ID.value}:${Resource.YAHOO_CLIENT_SECRET.value}`,
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }).toString(),
  }).then((r) => r.json());
}
