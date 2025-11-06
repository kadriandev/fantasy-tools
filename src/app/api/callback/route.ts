import { db } from "@/db";
import { users } from "@/db/users.sql";
import { client, setTokens } from "@/lib/auth/auth";
import { refreshLeagues } from "@/lib/data/leagues";
import { InvalidAuthorizationCodeError } from "@openauthjs/openauth/error";
import { eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { Resource } from "sst";
import { subjects } from "../../../../auth/subjects";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const host = `${Resource.App.stage === "production" ? "https://" : "http://"}${req.headers.get("host")}`;
  const exchanged = await client.exchange(code!, `${host}/api/callback`);

  if (exchanged.err) {
    if (exchanged.err instanceof InvalidAuthorizationCodeError)
      console.log("[AUTH][YAHOO] Invalid authorization code.");
    return NextResponse.json(exchanged.err, { status: 400 });
  }

  // Check if user exists
  const user = await client.verify(subjects, exchanged.tokens.access);
  if (user.err) {
    return NextResponse.json(exchanged.err, { status: 400 });
  }

  const res = await db
    .select()
    .from(users)
    .where(eq(users.user_id, user.subject.properties.sub));

  // Insert user into table if not existing
  if (!res.length) {
    await db.insert(users).values({
      user_id: user.subject.properties.sub,
      email: user.subject.properties.email,
      name: user.subject.properties.name,
      created_at: sql`NOW()`,
    });
  }

  // If successfully found or inserted, set tokens
  await setTokens(exchanged.tokens);

  return NextResponse.redirect(`${host}/leagues`);
}
