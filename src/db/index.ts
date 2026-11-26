// Acesso ao banco — instalado pela esteira (/esteira:dev). Um único ponto de entrada: getDb().
//
// - Com DATABASE_URL (Neon, em preview e produção): Postgres serverless via HTTP.
// - Sem DATABASE_URL (dev local, testes, CI): PGlite, um Postgres em processo. Em memória por padrão;
//   PGLITE_DIR=.esteira/pglite guarda os dados entre reinícios do `npm run dev`.
//   As migrações de ./drizzle são aplicadas na primeira conexão.
// - Com E2E=1 (Playwright): SEMPRE PGlite em memória, mesmo que um .env.local traga DATABASE_URL.
//   O reset dos testes nunca pode alcançar um banco remoto.
//
// Sem transações: o driver HTTP do Neon não tem db.transaction(). Operações atômicas são um único
// comando SQL (ex.: CTE com DELETE … RETURNING + INSERT). O banco local bloqueia transaction() também,
// para que testes e produção se comportem igual.
//
// Regras de negócio NÃO chamam getDb(): recebem o `db` por parâmetro (src/lib/domain/*), para os testes
// passarem um banco em memória (src/db/testing.ts).
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

const global = globalThis as unknown as { __esteiraDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  global.__esteiraDb ??= conectar().catch((erro) => {
    // Não deixa uma falha de conexão/migração presa no cache até reiniciar o servidor.
    global.__esteiraDb = undefined;
    throw erro;
  });
  return global.__esteiraDb;
}

async function conectar(): Promise<Db> {
  const e2e = process.env.E2E === "1";
  const url = process.env.DATABASE_URL;
  if (url && !e2e) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle(neon(url), { schema }) as unknown as Db;
  }
  const { criarDbLocal } = await import("./local");
  return criarDbLocal(e2e ? "memory://" : (process.env.PGLITE_DIR ?? "memory://"));
}
