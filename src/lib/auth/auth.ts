import { Resource } from "sst";
import { createClient } from "@openauthjs/openauth/client";
import { cookies as getCookies } from "next/headers";
import { decodeJwt } from "jose";
import { decodedAuthTokenSchema, ParsedAuthToken } from "./schemas";

export const client = createClient({
  clientID: "nextjs",
  issuer: Resource.MyAuth.url,
});

export async function setTokens(tokens: { access: string; refresh: string }) {
  const cookies = await getCookies();
  cookies.set({
    name: "access_token",
    value: tokens.access,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });
  cookies.set({
    name: "refresh_token",
    value: tokens.refresh,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  });
}

export async function getUserJWT(): Promise<ParsedAuthToken> {
  const cookies = await getCookies();
  const access_token = cookies.get("access_token");
  const jwt = decodeJwt(access_token?.value!);
  return decodedAuthTokenSchema.parse(jwt);
}

export async function getUserId() {
  const user = await getUserJWT();
  return user.properties.sub;
}
