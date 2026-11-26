import type { Tarefa } from "@/lib/types/tarefa";

/**
 * Estados de preview da lista de hoje (#9), escolhidos por `?estado=` na URL.
 * Sem `?estado=` (ou `padrao`), a página usa os dados reais do aparelho (#8).
 * O /esteira:dev decide se mantém ou remove este seletor.
 */
export const ESTADOS_DE_PREVIEW = ["padrao", "vazio", "carregando", "erro"] as const;
export type EstadoDePreview = (typeof ESTADOS_DE_PREVIEW)[number];

export function lerEstadoDePreview(valor: string | string[] | undefined): EstadoDePreview {
  const texto = Array.isArray(valor) ? valor[0] : valor;
  return ESTADOS_DE_PREVIEW.find((estado) => estado === texto) ?? "padrao";
}

/** Simula o Pauta aberto em outro navegador: o aparelho é novo, a lista começa vazia (AC-9.3). */
export const TAREFAS_DE_OUTRO_NAVEGADOR: Tarefa[] = [];
