import { Resource } from "sst";
import { createClient } from "@openauthjs/openauth/client";
import { cookies as getCookies } from "next/headers";

export const client = createClient({
  clientID: "fantasy-tools",
  issuer: Resource.Auth.url,
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
