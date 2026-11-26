---
issue: 12
epic: 5
slug: editar-tarefa
status: backlog
---

# #12 — Corrigir o texto de uma tarefa

> Épico: #5 Anotar e ajustar tarefas do dia · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** corrigir o texto de uma tarefa já anotada, **para** que a lista diga exatamente o que preciso fazer.

### Contexto

CAP-2: a pessoa pode corrigir o texto de uma tarefa. As mesmas regras de texto da criação valem na edição (1 a 200 caracteres, sem espaços nas pontas).

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-12.1 — Corrige o texto

```gherkin
Cenário: Corrige o texto
  Dado que tenho a tarefa Ligar pro contador
  Quando altero o texto para Ligar para o contador e confirmo
  Então vejo Ligar para o contador no mesmo lugar da lista
```

#### AC-12.2 — Cancela a edição

```gherkin
Cenário: Cancela a edição
  Dado que estou editando a tarefa Ligar para o contador
  Quando cancelo a edição
  Então a tarefa continua com o texto Ligar para o contador
```

#### AC-12.3 — Não aceita texto vazio

```gherkin
Cenário: Não aceita texto vazio
  Dado que estou editando a tarefa Ligar para o contador
  Quando apago todo o texto e confirmo
  Então a tarefa continua com o texto Ligar para o contador
```

### Fora de escopo

- Histórico de edições
- Mover a tarefa para outro dia

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
