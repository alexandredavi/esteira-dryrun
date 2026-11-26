---
issue: 16
epic: 7
slug: pendencias-para-hoje
status: backlog
---

# #16 — Receber as pendências de ontem na lista de hoje

> Épico: #7 Pendências passam sozinhas para amanhã · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** encontrar na lista de hoje o que ficou pendente ontem, **para** não precisar reescrever nada para continuar.

### Contexto

CAP-4: o dia vira à meia-noite no fuso do aparelho. Ao abrir num dia novo, as pendentes de dias anteriores passam para hoje, na mesma ordem e antes das tarefas criadas hoje. As tarefas feitas em dias anteriores saem da lista.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-16.1 — Pendências de ontem aparecem hoje

```gherkin
Cenário: Pendências de ontem aparecem hoje
  Dado que ontem deixei pendentes Pagar boleto e Revisar a apresentação, nessa ordem
  Quando abro o Pauta hoje
  Então vejo Pagar boleto e Revisar a apresentação na lista de hoje, nessa ordem
```

#### AC-16.2 — Pendências vêm antes das tarefas de hoje

```gherkin
Cenário: Pendências vêm antes das tarefas de hoje
  Dado que a pendência Pagar boleto veio de ontem
  Quando anoto Ligar para o contador hoje
  Então Pagar boleto aparece antes de Ligar para o contador
```

#### AC-16.3 — Tarefas feitas ontem saem da lista

```gherkin
Cenário: Tarefas feitas ontem saem da lista
  Dado que ontem marquei Comprar café como feita
  Quando abro o Pauta hoje
  Então não vejo Comprar café na lista de hoje
```

#### AC-16.4 — O dia vira à meia-noite

```gherkin
Cenário: O dia vira à meia-noite
  Dado que deixei Pagar boleto pendente às 23h50
  Quando abro o Pauta às 00h10 do dia seguinte
  Então vejo a data do novo dia
  E vejo Pagar boleto na lista de hoje
```

### Fora de escopo

- Indicador de há quanto tempo a tarefa está pendente
- Descartar pendências antigas em lote
- Tela de histórico

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
