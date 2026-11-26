// Só existe em modo E2E (E2E=1, ligado pelo playwright.config.ts): zera o banco entre testes.
// Fora do modo E2E responde 403, e o e2e/support.ts falha em vez de seguir com dados sujos.
// Nunca roda contra um banco remoto: com DATABASE_URL (Neon) a rota se recusa, mesmo com E2E=1.
import { is, sql } from "drizzle-orm";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import { getDb } from "@/db";
import * as schema from "@/db/schema";

export async function POST() {
  if (process.env.E2E !== "1") return new Response("Reset só existe com E2E=1.", { status: 403 });
  if (process.env.DATABASE_URL || process.env.VERCEL_ENV) {
    return new Response("Reset recusado: DATABASE_URL/VERCEL_ENV definidos. O E2E roda só com o banco local em memória.", { status: 403 });
  }
  const tabelas = (Object.values(schema) as unknown[])
    .filter((t): t is PgTable => is(t, PgTable))
    .map((t) => {
      const { name, schema: s } = getTableConfig(t);
      return s ? `"${s}"."${name}"` : `"${name}"`;
    });
  if (tabelas.length) {
    const db = await getDb();
    await db.execute(sql.raw(`TRUNCATE ${tabelas.join(", ")} RESTART IDENTITY CASCADE`));
  }
  return Response.json({ ok: true, tabelas: tabelas.length });
}
