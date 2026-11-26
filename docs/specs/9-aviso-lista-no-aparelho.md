---
issue: 9
epic: 4
slug: aviso-lista-no-aparelho
status: spec
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

> **Decisão sem consulta:** a pessoa responsável não pôde responder perguntas nesta etapa e pediu para seguir com o desenho recomendado. Cada escolha está registrada em "Decisões e riscos".

### Visão geral
A story é de apresentação: o comportamento que ela avisa ("a lista fica neste aparelho") já existe desde a #8, porque a lista é lida pelo cookie anônimo `pauta_aparelho`. O que muda é tirar o seletor de preview `?estado=` e os mocks da #9, deixar o `AvisoDoAparelho` estático na rota `/` (fora do `<Suspense>`, sem dado nenhum) e mostrar o mesmo aviso também no `error.tsx` da rota, para ele aparecer em todos os estados reais. Não há tabela, coluna, regra de domínio nem server action nova.

### Modelo de dados
| Tabela | Coluna | Tipo | Regras |
|---|---|---|---|
| `aparelhos` (existente) | — | — | Sem mudança. Um navegador novo não tem cookie, então não tem aparelho: a lista começa vazia (AC-9.3) |
| `tarefas` (existente) | — | — | Sem mudança. A leitura já filtra por `aparelho_id` (AC-9.3) |

Sem migração nesta story.

### Regras de negócio
Nenhuma função de domínio nova. As regras que sustentam os ACs já existem e não mudam:
- `listarTarefasDeHoje(db, aparelhoId, agora)` em `src/lib/domain/tarefas.ts` — sem cookie (`null`), devolve `[]` sem consultar o banco; com cookie, devolve só as tarefas daquele aparelho. É o que faz outro navegador ver a lista vazia. (AC-9.3)
- `anotarTarefa(db, aparelhoId, texto, agora)` em `src/lib/domain/tarefas.ts` — cria o aparelho e a tarefa num único comando SQL; no navegador novo, o primeiro anotar cria um aparelho novo, sem tocar no aparelho do outro navegador. (AC-9.3)
- O texto do aviso é conteúdo fixo da UI (`src/components/hoje/aviso-do-aparelho.tsx`), não uma regra: diz que a lista fica só neste aparelho e navegador, que em outro navegador começa uma lista nova e que limpar os dados do navegador apaga a lista. (AC-9.1, AC-9.3)

### Contratos
- **Leitura:** sem mudança no contrato da #8. `src/app/(app)/page.tsx` volta a ser: cabeçalho com a data em `<Suspense>`, `ListaDeHojeDoAparelho` em `<Suspense>` (só `cookies()` + `listarTarefasDeHoje`) e `AvisoDoAparelho` logo abaixo, fora do `<Suspense>`, renderizado no servidor sem `await`. A página deixa de receber `searchParams`.
- **Server action:** nenhuma nova. `anotar(texto)` da #8 continua igual.
- **Aviso no erro:** `src/app/(app)/error.tsx` renderiza o `Alert` destrutivo atual e, abaixo dele, o mesmo `AvisoDoAparelho` (componente sem hooks, importável no client).
- **Acessibilidade do aviso:** `role="note"` com `aria-labelledby` no título "Sua lista fica neste aparelho". O teste de aceite encontra o aviso por esse papel e nome.

### Troca dos mocks
| Mock do protótipo | Vira |
|---|---|
| `lerEstadoDePreview` e `?estado=` (`padrao`, `vazio`, `carregando`, `erro`) | Removidos. A página não lê `searchParams` |
| `TAREFAS_DE_OUTRO_NAVEGADOR` (`?estado=vazio`) | Um navegador sem o cookie `pauta_aparelho`: `listarTarefasDeHoje` devolve `[]` |
| `?estado=carregando` | Fallback do `<Suspense>` (`ListaCarregando`), com o aviso já visível abaixo |
| `?estado=erro` + `src/components/hoje/lista-com-erro.tsx` | `src/app/(app)/error.tsx` (já existe, com `retry()`), agora com o aviso abaixo do erro. `lista-com-erro.tsx` é apagado |
| `src/lib/mocks/aparelho.ts` | Apagado (e a pasta `src/lib/mocks/`, que fica vazia) |
| `src/components/hoje/aviso-do-aparelho.tsx` | Fica como está: é UI real, não mock |

### Estados reais
| Estado | Como aparece com dados reais |
|---|---|
| Vazio | `listarTarefasDeHoje` devolve `[]` (navegador sem cookie, como outro navegador, ou sem tarefas hoje): campo "Anote uma tarefa", "Nada para hoje ainda. Anote a primeira tarefa." e o aviso abaixo |
| Carregando | Fallback do `<Suspense>` da lista (`ListaCarregando`) e da data (`DataDeHojeCarregando`); o aviso já aparece, porque está fora do `<Suspense>` |
| Erro | `src/app/(app)/error.tsx`: `Alert` destrutivo "Não deu para abrir sua lista." com "Tentar de novo" (`retry()`) e o aviso abaixo. Anotar com erro continua como na #8 (mensagem abaixo do campo) |

### Plano de testes
| AC | Teste de aceite (`e2e/9-aviso-lista-no-aparelho.spec.ts`) | Como preparar o "Dado" | Unidade (Vitest) |
|---|---|---|---|
| AC-9.1 | `AC-9.1 — Aviso discreto está disponível na lista`: abre `/`, encontra `getByRole("note", { name: "Sua lista fica neste aparelho" })` e, dentro dele, os textos "só neste aparelho e neste navegador" e "limpar os dados do navegador, a lista é apagada" | Contexto novo, banco zerado; abrir `/` já é "estar na lista de hoje" | — (texto fixo da UI, coberto pelo aceite) |
| AC-9.2 | `AC-9.2 — Aviso não bloqueia o uso`: abre `/` num contexto novo, confirma que não há `dialog`/`alertdialog` na página e que o aviso não tem botão; preenche "Nova tarefa" com "Pagar o boleto", aperta Enter e vê o item na lista "Tarefas de hoje", sem clicar em nada antes | Contexto novo do Playwright (sem cookie) = primeira vez; banco zerado | — |
| AC-9.3 | `AC-9.3 — Outro navegador começa uma lista nova`: anota "Ligar para o contador" pela UI e espera o cookie `pauta_aparelho`; abre `browser.newContext()` (outro navegador), vai a `/`, vê "Nada para hoje ainda. Anote a primeira tarefa.", não vê "Ligar para o contador" e vê o aviso por papel e nome | Anotar pela UI no primeiro contexto; o segundo contexto não compartilha cookie, como outro navegador | Já coberto na #8: `listarTarefasDeHoje` com `aparelhoId` `null` e com outro aparelho → `[]`; `anotarTarefa` para um aparelho novo não altera as tarefas de outro aparelho (acrescentar o caso se não existir) |

Nenhum AC depende de tempo: o teste não usa `page.clock`.

### Decisões e riscos
- **Sem mudança no banco** — o "fica neste aparelho" já é verdade desde a #8 (cookie anônimo + `aparelho_id`). A #9 só torna isso visível; criar coluna ou tabela (ex.: "aviso já visto") não serve a nenhum AC.
- **Aviso sempre visível, sem "já vi"** — o design pediu um aviso fixo, sem fechar. Guardar que a pessoa já viu exigiria estado por aparelho e um botão, o que o AC-9.2 quer evitar. **Risco:** quem usa todo dia vê o aviso sempre; ele é discreto (`bg-muted`, abaixo da lista) e pode virar um link curto depois da #10 (página de privacidade), se o beta pedir.
- **Aviso fora do `<Suspense>`** — é estático, então sai no HTML inicial (Cache Components o pré-renderiza no shell) e aparece mesmo com a lista carregando.
- **Aviso também no `error.tsx`** — o `error.tsx` da rota substitui a página inteira; sem repetir o aviso ali, o estado de erro perderia a mensagem que o design quer em todos os estados. Não fica no `layout.tsx` para não aparecer na futura página de privacidade (#10), que tem o próprio texto.
- **Seletor `?estado=` removido** — o protótipo deixou a decisão para o dev; com os estados reais (Suspense, `error.tsx`, navegador sem cookie) cobertos pelos testes, o seletor vira código morto e deixaria um `?estado=vazio` em produção que esconde a lista real.
- **"Outro navegador" no teste é outro contexto do Playwright** — contextos não compartilham cookies, o mesmo efeito de outro navegador ou de limpar os dados. Nada de acesso direto ao banco.
- **Sem dependência de outras stories** — usa só o que a #8 já entregou (`aparelhos`, `tarefas`, `anotar`).
