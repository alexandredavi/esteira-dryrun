---
issue: 17
epic: 7
slug: indicador-de-origem
status: backlog
---

# #17 — Ver de quando é cada pendência

> Épico: #7 Pendências passam sozinhas para amanhã · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** ver de forma discreta há quanto tempo uma tarefa está pendente, **para** decidir se ela ainda faz sentido ou se devo removê-la.

### Contexto

CAP-4: uma tarefa que veio de outro dia tem um indicador discreto, de ontem ou há N dias. Tarefas criadas hoje não têm indicador.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-17.1 — Pendência de ontem

```gherkin
Cenário: Pendência de ontem
  Dado que Pagar boleto foi criada ontem e ficou pendente
  Quando abro o Pauta hoje
  Então vejo o indicador de ontem em Pagar boleto
```

#### AC-17.2 — Pendência de vários dias

```gherkin
Cenário: Pendência de vários dias
  Dado que Revisar a apresentação foi criada há 4 dias e continua pendente
  Quando abro o Pauta hoje
  Então vejo o indicador há 4 dias em Revisar a apresentação
```

#### AC-17.3 — Tarefa de hoje não tem indicador

```gherkin
Cenário: Tarefa de hoje não tem indicador
  Dado que anotei Ligar para o contador hoje
  Quando olho a lista de hoje
  Então não vejo indicador de origem em Ligar para o contador
```

### Fora de escopo

- Data exata de criação da tarefa
- Destaque ou alerta para pendências antigas

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
