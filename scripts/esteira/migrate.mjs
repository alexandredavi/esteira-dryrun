#!/usr/bin/env node
// Aplica as migrações do Drizzle (./drizzle) no Neon, no começo do build da Vercel.
// Instalado por /esteira:deploy; o script "build" do package.json roda este arquivo antes do `next build`.
//
// Só migra quando os DOIS estão definidos no ambiente:
//   DATABASE_URL       — o banco daquele ambiente (a integração Neon da Vercel define)
//   ESTEIRA_MIGRATE=1  — ligado À MÃO, por ambiente, na Vercel:
//                        • Production: sempre.
//                        • Preview: SÓ se a integração Neon cria um branch do banco por preview.
//                          Senão o preview migraria o banco de produção.
// Sem isso (dev local, CI, build sem banco), apenas avisa e segue.
// As migrações são só aditivas e com colunas novas nullable ou com DEFAULT (regra do /esteira:dev):
// um rollback do deploy não quebra o banco.
//
// Segurança da migração:
// - Driver neon-serverless (WebSocket), não o HTTP: o migrador do Drizzle aplica TODAS as migrações
//   pendentes numa transação. Se uma falha no meio, nada fica pela metade e o próximo build tenta de novo.
// - Advisory lock do Postgres: dois builds ao mesmo tempo (produção + preview no mesmo banco, ou builds
//   paralelos) migram um de cada vez; o segundo encontra tudo aplicado e não faz nada.

import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function shouldMigrate(env, cwd = process.cwd()) {
  if (!env.DATABASE_URL) return { run: false, reason: "sem DATABASE_URL (dev local ou CI): migração pulada" };
  if (env.ESTEIRA_MIGRATE !== "1") {
    return { run: false, reason: `ESTEIRA_MIGRATE não está ligado neste ambiente${env.VERCEL_ENV ? ` (${env.VERCEL_ENV})` : ""}: migração pulada` };
  }
  if (!existsSync(join(cwd, "drizzle", "meta", "_journal.json"))) return { run: false, reason: "nenhuma migração em ./drizzle" };
  return { run: true, reason: `migrando${env.VERCEL_ENV ? ` (${env.VERCEL_ENV})` : ""}` };
}

// Chave fixa do advisory lock da esteira (qualquer bigint; só precisa ser a mesma em todo build).
export const MIGRATION_LOCK = 4207202611;

async function main() {
  const decision = shouldMigrate(process.env);
  console.log(`[esteira] ${decision.reason}`);
  if (!decision.run) return;
  const { Client } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-serverless");
  const { migrate } = await import("drizzle-orm/neon-serverless/migrator");
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();
  try {
    await client.query("SELECT pg_advisory_lock($1)", [MIGRATION_LOCK]);
    await migrate(drizzle(client), { migrationsFolder: join(process.cwd(), "drizzle") });
    console.log("[esteira] migrações aplicadas");
  } finally {
    await client.query("SELECT pg_advisory_unlock($1)", [MIGRATION_LOCK]).catch(() => {});
    await client.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((err) => {
    console.error(`[esteira] migração falhou: ${err?.message || err?.type || String(err)}`);
    process.exitCode = 1; // falha o build: nada de subir código novo com banco velho
  });
}
