---
issue: 13
epic: 5
slug: remover-tarefa
status: backlog
---

# #13 — Remover uma tarefa com opção de desfazer

> Épico: #5 Anotar e ajustar tarefas do dia · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** remover uma tarefa que não faz mais sentido e poder desfazer se errar, **para** que a lista mostre só o que importa, sem medo de apagar por engano.

### Contexto

CAP-2: remover uma tarefa pode ser desfeito por alguns segundos e depois é definitivo.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-13.1 — Remove uma tarefa

```gherkin
Cenário: Remove uma tarefa
  Dado que tenho a tarefa Comprar café
  Quando removo Comprar café
  Então Comprar café some da lista de hoje
  E vejo a opção de desfazer
```

#### AC-13.2 — Desfaz a remoção

```gherkin
Cenário: Desfaz a remoção
  Dado que acabei de remover a tarefa Comprar café
  Quando escolho desfazer
  Então Comprar café volta para o mesmo lugar da lista
```

#### AC-13.3 — Remoção vira definitiva depois do prazo

```gherkin
Cenário: Remoção vira definitiva depois do prazo
  Dado que removi a tarefa Comprar café
  Quando o prazo para desfazer termina
  Então a opção de desfazer some
  E Comprar café não aparece ao abrir o Pauta de novo
```

#### AC-13.4 — Remover a última tarefa volta ao estado vazio

```gherkin
Cenário: Remover a última tarefa volta ao estado vazio
  Dado que Comprar café é a única tarefa de hoje
  Quando removo Comprar café
  Então vejo o campo para anotar e a frase de orientação da lista vazia
```

### Fora de escopo

- Lixeira ou recuperar tarefas removidas depois do prazo de desfazer
- Remover várias tarefas de uma vez

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
