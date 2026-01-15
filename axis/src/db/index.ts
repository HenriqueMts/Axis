import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@/db/schema";


if (!process.env.DATABASE_URL) {
    throw new Error("Erro Crítico: A variável DATABASE_URL não foi encontrada no .env");
}

const sql = neon(process.env.DATABASE_URL);


export const db = drizzle(sql, { schema });