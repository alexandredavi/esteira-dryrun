---
issue: 18
epic: 7
slug: voltar-apos-dias
status: backlog
---

# #18 — Voltar depois de dias sem abrir

> Épico: #7 Pendências passam sozinhas para amanhã · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** estudante com rotina própria, **quero** encontrar todas as pendências juntas quando volto depois de dias sem abrir, **para** retomar a rotina sem perder nada nem ver tarefas repetidas.

### Contexto

CAP-4: se a pessoa ficar dias sem abrir, as pendências de todos os dias anteriores chegam juntas no dia em que ela voltar, na ordem original e sem duplicar.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-18.1 — Pendências de vários dias chegam juntas

```gherkin
Cenário: Pendências de vários dias chegam juntas
  Dado que deixei Pagar boleto pendente há 3 dias e Revisar a apresentação pendente há 2 dias
  E não abri o Pauta desde então
  Quando abro o Pauta hoje
  Então vejo Pagar boleto e depois Revisar a apresentação na lista de hoje
```

#### AC-18.2 — Pendências não se duplicam

```gherkin
Cenário: Pendências não se duplicam
  Dado que deixei Pagar boleto pendente há 3 dias
  Quando abro o Pauta hoje duas vezes seguidas
  Então vejo Pagar boleto uma única vez na lista de hoje
```

### Fora de escopo

- Descartar pendências antigas em lote
- Resumo dos dias em que a pessoa não abriu o app

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
