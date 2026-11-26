---
issue: 8
epic: 4
slug: abrir-e-anotar
status: backlog
---

# #8 — Abrir na lista de hoje e anotar uma tarefa

> Épico: #4 Lista de hoje, sem conta · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** abrir o Pauta e anotar uma tarefa na hora, sem criar conta, **para** começar a organizar o meu dia antes de desistir.

### Contexto

Esqueleto que anda: atravessa o produto de ponta a ponta (primeira tela, criar tarefa, guardar e reabrir). CAP-1: a primeira tela é sempre a lista de hoje com a data visível, nenhum dado pessoal é pedido e, com a lista vazia, aparece só o campo para anotar e uma frase curta de orientação. A lista fica vinculada ao aparelho e navegador.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-8.1 — Primeiro acesso abre direto na lista de hoje

```gherkin
Cenário: Primeiro acesso abre direto na lista de hoje
  Dado que nunca abri o Pauta neste navegador
  Quando abro o Pauta
  Então vejo a lista de hoje com a data do dia no formato brasileiro
  E não vejo pedido de cadastro, login nem tutorial
```

#### AC-8.2 — Lista vazia mostra só o campo e uma orientação

```gherkin
Cenário: Lista vazia mostra só o campo e uma orientação
  Dado que não tenho tarefas hoje
  Quando abro o Pauta
  Então vejo o campo para anotar uma tarefa
  E vejo uma frase curta de orientação
```

#### AC-8.3 — Anota uma tarefa

```gherkin
Cenário: Anota uma tarefa
  Dado que estou na lista de hoje
  Quando digito Ligar para o contador e confirmo
  Então vejo Ligar para o contador na lista de hoje
```

#### AC-8.4 — A lista continua ao voltar no mesmo navegador

```gherkin
Cenário: A lista continua ao voltar no mesmo navegador
  Dado que anotei Ligar para o contador hoje
  Quando fecho o Pauta e abro de novo no mesmo navegador
  Então vejo Ligar para o contador na lista de hoje
```

### Fora de escopo

- Validação do tamanho do texto e anotação em sequência (story de anotar várias tarefas)
- Editar, remover ou concluir tarefas
- Aviso de que a lista fica só neste aparelho
- Usar a mesma lista em outro aparelho

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
