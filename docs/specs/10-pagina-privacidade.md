---
issue: 10
epic: 4
slug: pagina-privacidade
status: backlog
---

# #10 — Consultar como meus dados são tratados

> Épico: #4 Lista de hoje, sem conta · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** ler uma página curta de privacidade, **para** confiar que o Pauta não coleta meus dados pessoais nem o texto das minhas tarefas.

### Contexto

Requisito não funcional de privacidade e LGPD do PRD: nenhum dado pessoal é coletado, o texto das tarefas nunca vai para métricas e as métricas usam só eventos anônimos por aparelho, sem cookies de terceiros.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-10.1 — Acessa a privacidade a partir da lista

```gherkin
Cenário: Acessa a privacidade a partir da lista
  Dado que estou na lista de hoje
  Quando abro o link de privacidade
  Então vejo a página de privacidade em PT-BR
  E consigo voltar para a lista de hoje
```

#### AC-10.2 — Página explica o que é e o que não é coletado

```gherkin
Cenário: Página explica o que é e o que não é coletado
  Dado que estou na página de privacidade
  Quando leio o conteúdo
  Então vejo que nenhum dado pessoal é pedido nem coletado
  E vejo que o texto das tarefas não é usado em métricas
  E vejo que as métricas usam só eventos anônimos por aparelho
```

### Fora de escopo

- Banner de consentimento de cookies
- Excluir ou exportar dados pelo app

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
