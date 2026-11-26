// MOCK do protótipo da story #8. O /esteira:dev troca por dados reais.
// Simula a lista de hoje guardada neste aparelho e navegador, sem conta.
import type { Tarefa } from "@/lib/types/tarefa";

export const TAREFAS_MOCK: Tarefa[] = [
  { id: "mock-1", texto: "Responder o e-mail da Fernanda sobre o orçamento", criadaEm: "2026-11-26T08:12:00-03:00" },
  { id: "mock-2", texto: "Pagar o boleto do condomínio (R$ 640,00)", criadaEm: "2026-11-26T08:15:00-03:00" },
  { id: "mock-3", texto: "Revisar a pauta da reunião das 14h", criadaEm: "2026-11-26T09:03:00-03:00" },
];

/** Contrato mínimo que a tela usa. A versão real implementa o mesmo contrato. */
export type ListaDeHojeStore = {
  subscribe: (aoMudar: () => void) => () => void;
  /** Lista atual; `null` enquanto ainda não foi lida (no servidor, por exemplo). */
  getSnapshot: () => Tarefa[] | null;
  getServerSnapshot: () => Tarefa[] | null;
  anotar: (texto: string) => void;
};

const CHAVE_APARELHO = "pauta:prototipo:tarefas";

let sequencia = 0;
function novoId() {
  sequencia += 1;
  return `t-${Date.now()}-${sequencia}`;
}

function criarStore(inicial: () => Tarefa[], salvar?: (tarefas: Tarefa[]) => void): ListaDeHojeStore {
  let tarefas: Tarefa[] | null = null;
  const ouvintes = new Set<() => void>();

  return {
    subscribe(aoMudar) {
      ouvintes.add(aoMudar);
      return () => ouvintes.delete(aoMudar);
    },
    getSnapshot() {
      if (tarefas === null) tarefas = inicial();
      return tarefas;
    },
    getServerSnapshot() {
      return null;
    },
    anotar(texto) {
      const limpo = texto.trim();
      if (!limpo) return;
      const atual = tarefas ?? inicial();
      tarefas = [...atual, { id: novoId(), texto: limpo, criadaEm: new Date().toISOString() }];
      salvar?.(tarefas);
      ouvintes.forEach((ouvinte) => ouvinte());
    },
  };
}

/**
 * Lista guardada neste navegador (localStorage). Na primeira visita começa com
 * as tarefas mock; depois mantém o que a pessoa anotou, mesmo fechando a aba.
 */
export function criarListaDoAparelho(): ListaDeHojeStore {
  return criarStore(
    () => {
      try {
        const salvo = window.localStorage.getItem(CHAVE_APARELHO);
        return salvo ? (JSON.parse(salvo) as Tarefa[]) : TAREFAS_MOCK;
      } catch {
        return TAREFAS_MOCK;
      }
    },
    (tarefas) => {
      try {
        window.localStorage.setItem(CHAVE_APARELHO, JSON.stringify(tarefas));
      } catch {
        // Navegador sem armazenamento: a lista fica só em memória no protótipo.
      }
    },
  );
}

/** Lista que começa vazia e vive só em memória (primeiro acesso). */
export function criarListaVazia(): ListaDeHojeStore {
  return criarStore(() => []);
}
