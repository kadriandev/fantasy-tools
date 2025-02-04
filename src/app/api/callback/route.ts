import { db } from "@/db";
import { users } from "@/db/users.sql";
import { client, setTokens } from "@/lib/auth/auth";
import { eq, sql } from "drizzle-orm";
import * as jose from "jose";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const exchanged = await client.exchange(code!, `${url.origin}/api/callback`);
  if (exchanged.err) return NextResponse.json(exchanged.err, { status: 400 });

  // Check if user exists
  const jwt: any = jose.decodeJwt(exchanged.tokens.access);
  const res = await db
    .select()
    .from(users)
    .where(eq(users.user_id, jwt.properties.sub));

  // Insert user into table if not existing
  if (!res.length) {
    await db.insert(users).values({
      user_id: jwt.properties.sub,
      email: jwt.properties.email,
      name: jwt.properties.name,
      created_at: sql`NOW()`,
    });
  }

  // If successfully found or inserted, set tokens
  await setTokens(exchanged.tokens);

  return NextResponse.redirect(`${url.origin}/leagues`);
}
