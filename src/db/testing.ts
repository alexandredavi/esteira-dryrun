// Banco em memória para testes (Vitest): um banco novo e migrado por chamada, isolado entre testes.
import { criarDbLocal } from "./local";

export function criarDbDeTeste() {
  return criarDbLocal("memory://");
}
