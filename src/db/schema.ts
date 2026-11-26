// Schema do banco (Drizzle). Cada story adiciona as suas tabelas aqui, conforme a seção Técnica da spec.
// Depois de mudar: `npm run db:generate` cria a migração em ./drizzle (commitada junto).
import { sql } from "drizzle-orm";
import { check, date, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Aparelho anônimo (#8): um UUID guardado no cookie `pauta_aparelho`, sem nenhum dado pessoal. */
export const aparelhos = pgTable("aparelhos", {
  id: uuid("id").primaryKey(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

/** Tarefas de um aparelho, por dia de calendário em America/Sao_Paulo (#8). */
export const tarefas = pgTable(
  "tarefas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    aparelhoId: uuid("aparelho_id")
      .notNull()
      .references(() => aparelhos.id, { onDelete: "cascade" }),
    texto: text("texto").notNull(),
    dia: date("dia", { mode: "string" }).notNull(),
    criadaEm: timestamp("criada_em", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("tarefas_aparelho_dia_idx").on(t.aparelhoId, t.dia, t.criadaEm),
    check("tarefas_texto_tamanho", sql`char_length(${t.texto}) between 1 and 200`),
  ],
);
