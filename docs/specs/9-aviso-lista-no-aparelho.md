---
issue: 9
epic: 4
slug: aviso-lista-no-aparelho
status: backlog
---

# #9 — Saber que a lista fica neste aparelho

> Épico: #4 Lista de hoje, sem conta · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** ser avisada de forma discreta que a minha lista fica só neste aparelho e navegador, **para** não ser pega de surpresa se trocar de aparelho ou limpar o navegador.

### Contexto

CAP-1: sem conta, trocar de aparelho ou limpar os dados do navegador começa uma lista nova. O app avisa isso de forma discreta, sem bloquear o uso. É a mitigação do risco de perda de dados no MVP.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-9.1 — Aviso discreto está disponível na lista

```gherkin
Cenário: Aviso discreto está disponível na lista
  Dado que estou na lista de hoje
  Quando procuro informações sobre onde a lista fica guardada
  Então vejo que a lista fica só neste aparelho e navegador
  E que limpar os dados do navegador apaga a lista
```

#### AC-9.2 — Aviso não bloqueia o uso

```gherkin
Cenário: Aviso não bloqueia o uso
  Dado que abro o Pauta pela primeira vez
  Quando a lista de hoje aparece
  Então consigo anotar uma tarefa sem fechar nenhum aviso antes
```

#### AC-9.3 — Outro navegador começa uma lista nova

```gherkin
Cenário: Outro navegador começa uma lista nova
  Dado que tenho tarefas no Pauta em um navegador
  Quando abro o Pauta em outro navegador
  Então vejo a lista de hoje vazia
  E vejo o aviso de que a lista fica só no aparelho e navegador em que foi criada
```

### Fora de escopo

- Backup, exportação ou uso em outro aparelho
- Recuperar uma lista perdida

## Design

<!-- Preenchido por /esteira:prototipo: telas, estados (vazio, carregando, erro), componentes do DS usados, link do preview. -->

_Pendente._

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
