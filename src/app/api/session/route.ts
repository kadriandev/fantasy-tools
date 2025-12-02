import { cookies as getCookies } from "next/headers";
import { client, setTokens } from "@/lib/auth/auth";
import { subjects } from "../../../../auth/subjects";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const cookies = await getCookies();
  const accessToken = cookies.get("access_token");
  const refreshToken = cookies.get("refresh_token");

  if (!accessToken) {
    return false;
  }

  const verified = await client.verify(subjects, accessToken.value, {
    refresh: refreshToken?.value,
  });
  if (verified.err) return false;

  await setTokens(verified);
  redirect("/leagues");
}
