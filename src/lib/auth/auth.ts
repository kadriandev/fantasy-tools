import { Resource } from "sst";
import { createClient, VerifyResult } from "@openauthjs/openauth/client";
import { cookies as getCookies } from "next/headers";
import { subjects } from "../../../auth/subjects";

export const client = createClient({
  clientID: "fantasy-tools",
  issuer: Resource.Auth.url,
});

export async function setTokens(verified: VerifyResult<typeof subjects>) {
  const cookies = await getCookies();

  if (verified.subject?.properties) {
    cookies.set({
      name: "yahoo_access_token",
      value: verified.subject.properties.access,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 3600,
    });

    cookies.set({
      name: "user_sub",
      value: verified.subject.properties.sub,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 34560000,
    });
  }

  if (!verified.tokens) return;

  cookies.set({
    name: "access_token",
    value: verified.tokens.access,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  });
  cookies.set({
    name: "refresh_token",
    value: verified.tokens.refresh,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  });
}
