"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { anotarTarefa, ehIdDeAparelho } from "@/lib/domain/tarefas";
import type { Tarefa } from "@/lib/types/tarefa";
import { COOKIE_DO_APARELHO } from "./aparelho";

const QUATROCENTOS_DIAS = 400 * 24 * 60 * 60;

export type ResultadoDeAnotar = { ok: true; tarefa: Tarefa } | { ok: false; erro: string };

/** Anota uma tarefa na lista de hoje deste aparelho. No primeiro anotar, cria o aparelho e grava o cookie. */
export async function anotar(texto: string): Promise<ResultadoDeAnotar> {
  const cookieStore = await cookies();
  const atual = cookieStore.get(COOKIE_DO_APARELHO)?.value;
  const aparelhoId = ehIdDeAparelho(atual) ? atual : crypto.randomUUID();

  let resultado;
  try {
    resultado = await anotarTarefa(await getDb(), aparelhoId, texto, new Date());
  } catch (erro) {
    // Sem o texto da tarefa no log.
    console.error("Falha ao anotar tarefa:", erro instanceof Error ? erro.message : erro);
    return { ok: false, erro: "Não deu para anotar agora. Tente de novo." };
  }
  if (!resultado.ok) return resultado;

  if (aparelhoId !== atual) {
    cookieStore.set(COOKIE_DO_APARELHO, aparelhoId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: QUATROCENTOS_DIAS,
    });
  }
  refresh();
  return { ok: true, tarefa: resultado.valor };
}
