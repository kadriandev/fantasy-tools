"use server";

import { redirect } from "next/navigation";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { subjects, UserSubject } from "../../../auth/subjects";
import { client, setTokens } from "./auth";

export async function getVerifiedUser() {
  const cookies = await getCookies();
  const accessToken = cookies.get("access_token");
  const refreshToken = cookies.get("refresh_token");

  if (!accessToken) {
    return false;
  }

  const verified = await client.verify(subjects, accessToken.value, {
    refresh: refreshToken?.value,
  });

  if (verified.err) {
    return redirect("/");
  }

  return verified.subject.properties as UserSubject;
}

export async function auth(): Promise<UserSubject | false> {
  const cookies = await getCookies();
  const accessToken = cookies.get("access_token");
  const refreshToken = cookies.get("refresh_token");

  if (!accessToken) {
    return false;
  }

  const verified = await client.verify(subjects, accessToken.value, {
    refresh: refreshToken?.value,
  });

  if (verified.err) {
    return redirect("/");
  }
  await setTokens(verified);

  return verified.subject.properties as UserSubject;
}

export async function login() {
  const cookies = await getCookies();
  const accessToken = cookies.get("access_token");
  const refreshToken = cookies.get("refresh_token");

  if (accessToken) {
    const verified = await client.verify(subjects, accessToken.value, {
      refresh: refreshToken?.value,
    });
    if (!verified.err && verified.tokens) {
      await setTokens(verified);
      redirect("/leagues");
    }
  }

  const headers = await getHeaders();
  const host = headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const { url } = await client.authorize(
    `${protocol}://${host}/api/callback`,
    "code",
  );
  redirect(url);
}

export async function logout() {
  const cookies = await getCookies();
  cookies.delete("access_token");
  cookies.delete("refresh_token");
  cookies.delete("yahoo_access_token");
  cookies.delete("yahoo_refresh_token");
  cookies.delete("user_sub");

  redirect("/");
}

export async function getUserId() {
  const cookies = await getCookies();
  const sub = cookies.get("user_sub")!;

  if (!sub) {
    const subject = await auth();
    if (!subject) redirect("/");
    return subject.sub;
  }

  return sub.value;
}
