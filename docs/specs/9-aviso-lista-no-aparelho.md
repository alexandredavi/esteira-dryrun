---
issue: 9
epic: 4
slug: aviso-lista-no-aparelho
status: design
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

> **Decisão sem consulta:** a pessoa responsável não pôde responder perguntas nesta etapa e pediu para seguir com o plano. As escolhas abaixo são a recomendação da etapa, para revisão no PR.

### Rotas
- `/` (Hoje) — a lista real da #8 ganha, abaixo do card da lista, o aviso fixo "Sua lista fica neste aparelho". O aviso é estático (fora do `<Suspense>`), aparece em todos os estados e não tem botão de fechar: não fica por cima de nada nem exige ação.

### Como ver cada critério
| AC | Onde | Como |
|---|---|---|
| AC-9.1 | `/` | Abaixo da lista, leia o aviso: a lista fica só neste aparelho e navegador, e limpar os dados do navegador apaga a lista. |
| AC-9.2 | `/` ou `/?estado=vazio` | Abra a página: o campo "Anote uma tarefa" já está com foco. Digite e clique em Anotar sem fechar nenhum aviso. |
| AC-9.3 | `/?estado=vazio` | Simula o Pauta aberto em outro navegador: a lista aparece vazia ("Nada para hoje ainda.") e o aviso continua abaixo dela. Para ver de verdade, abra a produção ou o preview em outro navegador. |

### Estados
| Estado | URL |
|---|---|
| Padrão (dados reais do aparelho) | `/` |
| Vazio (outro navegador) | `/?estado=vazio` |
| Carregando | `/?estado=carregando` |
| Erro | `/?estado=erro` |

### Componentes do DS
`Alert` (aviso, com `role="note"` e fundo `muted` para ficar discreto e não ser anunciado como urgente por leitores de tela; `variant="destructive"` no estado de erro), `Button`, `Card`, `Input`, `Label`, `Separator`, `Skeleton`. Novos: nenhum componente de UI. Dois componentes de tela em `src/components/hoje/`: `aviso-do-aparelho.tsx` e `lista-com-erro.tsx` (o estado de erro para o preview, com "Tentar de novo").

### Mocks
`src/lib/mocks/aparelho.ts` — o seletor `?estado=` e a lista vazia que simula outro navegador. Sem `?estado=`, a página usa os dados reais da #8. No `?estado=vazio`, anotar grava de verdade no aparelho, mas a lista do preview continua vazia. O /esteira:dev decide se mantém ou remove o seletor de estados.

## Técnica

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
