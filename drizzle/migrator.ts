import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export async function handler() {
  const pool = new Pool({
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: +process.env.PORT!,
    user: process.env.USERNAME,
    password: process.env.PASS,
    ssl: { requestCert: true, rejectUnauthorized: false },
  });

  const db = drizzle({ client: pool });
  try {
    await migrate(db, {
      migrationsTable: "migrations",
      migrationsFolder: "./migrations",
    });
    console.log("Migration completed ✅");
  } catch (error) {
    console.error("Migration failed 🚨:", error);
  } finally {
    await pool.end();
  }
}
