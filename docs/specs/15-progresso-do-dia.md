---
issue: 15
epic: 6
slug: progresso-do-dia
status: backlog
---

# #15 — Ver o progresso do dia

> Épico: #6 Concluir e ver o que falta · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** estudante com rotina própria, **quero** ver quantas tarefas já fiz e quantas tenho no dia, **para** saber onde estou sem precisar contar.

### Contexto

CAP-3: o app mostra o progresso do dia como X de Y feitas e atualiza na hora ao concluir, desmarcar, anotar ou remover uma tarefa.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-15.1 — Mostra o progresso

```gherkin
Cenário: Mostra o progresso
  Dado que tenho 3 tarefas hoje e 1 está feita
  Quando olho a lista de hoje
  Então vejo 1 de 3 feitas
```

#### AC-15.2 — Atualiza ao concluir

```gherkin
Cenário: Atualiza ao concluir
  Dado que vejo 1 de 3 feitas
  Quando marco mais uma tarefa como feita
  Então vejo 2 de 3 feitas
```

#### AC-15.3 — Atualiza ao anotar uma tarefa nova

```gherkin
Cenário: Atualiza ao anotar uma tarefa nova
  Dado que vejo 2 de 3 feitas
  Quando anoto uma tarefa nova
  Então vejo 2 de 4 feitas
```

#### AC-15.4 — Sem tarefas não mostra progresso

```gherkin
Cenário: Sem tarefas não mostra progresso
  Dado que não tenho tarefas hoje
  Quando olho a lista de hoje
  Então não vejo o progresso do dia
```

### Fora de escopo

- Gráficos, sequências de dias ou estatísticas
- Progresso de dias anteriores

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
