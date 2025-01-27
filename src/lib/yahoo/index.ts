// @ts-ignore
import YahooFantasy from 'yahoo-fantasy'
import { cookies } from "next/headers"
import { Resource } from "sst"
import * as jose from "jose"

export const createYahooClient = async () => {
  const cookieStore = await cookies()
  const access_token = cookieStore.get('access_token')
  const jwt = jose.decodeJwt(access_token?.value!)

  const yf = new YahooFantasy(
    Resource.YAHOO_CLIENT_ID.value,
    Resource.YAHOO_CLIENT_SECRET.value,
  )

  yf.setUserToken(jwt.properties.access)

  return yf;
}

export async function getYahooAccessToken () {
}

export async function getUserTeams() {
  const yf = await createYahooClient();
  let data = null;
  try {
    data = await yf.user.games()
  }catch(e) {
    console.log("yahoo-fantasy err", e)
  }

  return data;
}

