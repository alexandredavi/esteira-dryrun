// Regras da lista de hoje (#8). Recebem o `db` por parâmetro; quem chama passa `getDb()` ou o banco de teste.
import { and, asc, eq, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { tarefas } from "@/db/schema";
import type { Tarefa } from "@/lib/types/tarefa";
import { diaDeHoje } from "./dia";

export const TAMANHO_MAXIMO_DA_TAREFA = 200;

export const ERRO_TAREFA_VAZIA = "Escreva a tarefa antes de anotar.";
export const ERRO_TAREFA_LONGA = `A tarefa pode ter até ${TAMANHO_MAXIMO_DA_TAREFA} caracteres.`;

export type Resultado<T> = { ok: true; valor: T } | { ok: false; erro: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** O valor do cookie `pauta_aparelho` só vale se for um UUID. */
export function ehIdDeAparelho(valor: string | null | undefined): valor is string {
  return typeof valor === "string" && UUID.test(valor);
}

/** Tira os espaços das pontas e aplica o tamanho de 1 a 200 caracteres. */
export function normalizarTexto(texto: string): Resultado<string> {
  const limpo = texto.trim();
  if (limpo.length === 0) return { ok: false, erro: ERRO_TAREFA_VAZIA };
  if (limpo.length > TAMANHO_MAXIMO_DA_TAREFA) return { ok: false, erro: ERRO_TAREFA_LONGA };
  return { ok: true, valor: limpo };
}

/** Tarefas de hoje do aparelho, na ordem em que foram anotadas. Sem aparelho, `[]` sem tocar no banco. */
export async function listarTarefasDeHoje(db: Db, aparelhoId: string | null, agora: Date): Promise<Tarefa[]> {
  if (!ehIdDeAparelho(aparelhoId)) return [];
  const linhas = await db
    .select({ id: tarefas.id, texto: tarefas.texto, criadaEm: tarefas.criadaEm })
    .from(tarefas)
    .where(and(eq(tarefas.aparelhoId, aparelhoId), eq(tarefas.dia, diaDeHoje(agora))))
    .orderBy(asc(tarefas.criadaEm), asc(tarefas.id));
  return linhas.map((linha) => ({ id: linha.id, texto: linha.texto, criadaEm: linha.criadaEm.toISOString() }));
}

type LinhaCriada = { id: string; texto: string; criada_em: string };

/**
 * Grava a tarefa no fim da lista de hoje. Um único comando SQL (sem transação): a CTE cria o aparelho
 * se ele ainda não existe, e a tarefa entra junto. Um cookie que aponta para um aparelho que sumiu se recupera.
 */
export async function anotarTarefa(db: Db, aparelhoId: string, texto: string, agora: Date): Promise<Resultado<Tarefa>> {
  if (!ehIdDeAparelho(aparelhoId)) throw new Error("Aparelho inválido.");
  const normalizado = normalizarTexto(texto);
  if (!normalizado.ok) return normalizado;

  const resultado = await db.execute(sql`
    with a as (
      insert into aparelhos (id) values (${aparelhoId}::uuid) on conflict (id) do nothing
    )
    insert into tarefas (aparelho_id, texto, dia, criada_em)
    values (${aparelhoId}::uuid, ${normalizado.valor}, ${diaDeHoje(agora)}::date, ${agora.toISOString()}::timestamptz)
    returning id::text as id, texto,
      to_char(criada_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as criada_em
  `);
  const [linha] = (resultado as unknown as { rows: LinhaCriada[] }).rows;
  if (!linha) throw new Error("A tarefa não voltou do banco.");
  return { ok: true, valor: { id: linha.id, texto: linha.texto, criadaEm: linha.criada_em } };
}
