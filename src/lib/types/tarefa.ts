/** Uma tarefa da lista de hoje. */
export type Tarefa = {
  id: string;
  texto: string;
  /** Data e hora em que a tarefa foi anotada (ISO 8601). */
  criadaEm: string;
};
