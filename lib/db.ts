import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import { NeonPg } from "@neondatabase/serverless";

const connection = new NeonPg({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(connection);
