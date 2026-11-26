---
issue: 11
epic: 5
slug: anotar-em-sequencia
status: backlog
---

# #11 — Anotar várias tarefas em sequência

> Épico: #5 Anotar e ajustar tarefas do dia · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** anotar várias tarefas seguidas sem tirar a mão do teclado, **para** montar o meu dia em menos de um minuto.

### Contexto

CAP-2: uma tarefa tem só um texto, de 1 a 200 caracteres, sem espaços nas pontas. Texto vazio não cria tarefa. Toda tarefa entra no fim da lista de hoje e o campo fica pronto para a próxima.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-11.1 — O campo fica pronto para a próxima tarefa

```gherkin
Cenário: O campo fica pronto para a próxima tarefa
  Dado que estou na lista de hoje
  Quando anoto Responder e-mail do cliente
  Então o campo fica vazio e com o foco
  E consigo anotar a próxima tarefa em seguida
```

#### AC-11.2 — Novas tarefas entram no fim da lista

```gherkin
Cenário: Novas tarefas entram no fim da lista
  Dado que tenho a tarefa Responder e-mail do cliente
  Quando anoto Revisar a apresentação
  Então Revisar a apresentação aparece depois de Responder e-mail do cliente
```

#### AC-11.3 — Texto vazio não cria tarefa

```gherkin
Cenário: Texto vazio não cria tarefa
  Dado que estou na lista de hoje
  Quando confirmo o campo só com espaços
  Então nenhuma tarefa é criada
```

#### AC-11.4 — Espaços nas pontas são removidos

```gherkin
Cenário: Espaços nas pontas são removidos
  Dado que estou na lista de hoje
  Quando anoto o texto com espaços antes e depois de Pagar boleto
  Então vejo a tarefa Pagar boleto sem os espaços nas pontas
```

#### AC-11.5 — Texto acima de 200 caracteres não é aceito

```gherkin
Cenário: Texto acima de 200 caracteres não é aceito
  Dado que estou na lista de hoje
  Quando tento anotar uma tarefa com 201 caracteres
  Então a tarefa não é criada
  E vejo que o limite é de 200 caracteres
```

### Fora de escopo

- Data, projeto, etiqueta, prioridade ou descrição na tarefa
- Reordenar tarefas

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
