---
issue: 14
epic: 6
slug: concluir-tarefa
status: backlog
---

# #14 — Marcar e desmarcar uma tarefa como feita

> Épico: #6 Concluir e ver o que falta · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** marcar uma tarefa como feita e desmarcar se me enganar, **para** saber o que já resolvi e o que ainda está pendente.

### Contexto

CAP-3: uma tarefa está pendente ou feita, e marcar e desmarcar são o mesmo gesto. As pendentes aparecem primeiro e as feitas ficam abaixo, atenuadas, até o fim do dia. Concluir não dispara som, animação longa, pontos nem conquistas.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-14.1 — Marca uma tarefa como feita

```gherkin
Cenário: Marca uma tarefa como feita
  Dado que tenho as tarefas pendentes Pagar boleto e Revisar a apresentação
  Quando marco Pagar boleto como feita
  Então Pagar boleto aparece abaixo das pendentes, atenuada
  E Revisar a apresentação continua no topo da lista
```

#### AC-14.2 — Desmarca uma tarefa feita

```gherkin
Cenário: Desmarca uma tarefa feita
  Dado que Pagar boleto está feita
  Quando desmarco Pagar boleto
  Então Pagar boleto volta para as pendentes
```

#### AC-14.3 — Concluir não gera distração

```gherkin
Cenário: Concluir não gera distração
  Dado que tenho a tarefa pendente Pagar boleto
  Quando marco Pagar boleto como feita
  Então não ouço som
  E não vejo pontos, conquistas nem animação longa
```

#### AC-14.4 — Conclusão continua ao voltar

```gherkin
Cenário: Conclusão continua ao voltar
  Dado que marquei Pagar boleto como feita hoje
  Quando fecho e abro o Pauta de novo no mesmo dia
  Então Pagar boleto continua feita
```

### Fora de escopo

- Contador de progresso do dia
- Histórico de tarefas feitas em dias anteriores

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
