---
issue: 8
epic: 4
slug: abrir-e-anotar
status: spec
---

# #8 — Abrir na lista de hoje e anotar uma tarefa

> Épico: #4 Lista de hoje, sem conta · Gerado por `/esteira:backlog`. Cada etapa seguinte preenche a sua seção.

## Produto

### User story

**Como** profissional sobrecarregada, **quero** abrir o Pauta e anotar uma tarefa na hora, sem criar conta, **para** começar a organizar o meu dia antes de desistir.

### Contexto

Esqueleto que anda: atravessa o produto de ponta a ponta (primeira tela, criar tarefa, guardar e reabrir). CAP-1: a primeira tela é sempre a lista de hoje com a data visível, nenhum dado pessoal é pedido e, com a lista vazia, aparece só o campo para anotar e uma frase curta de orientação. A lista fica vinculada ao aparelho e navegador.

### Critérios de aceite

<!-- Cada critério tem um ID estável AC-<issue>.<n>. Os testes E2E referenciam esse ID no título. Não renumere. -->

#### AC-8.1 — Primeiro acesso abre direto na lista de hoje

```gherkin
Cenário: Primeiro acesso abre direto na lista de hoje
  Dado que nunca abri o Pauta neste navegador
  Quando abro o Pauta
  Então vejo a lista de hoje com a data do dia no formato brasileiro
  E não vejo pedido de cadastro, login nem tutorial
```

#### AC-8.2 — Lista vazia mostra só o campo e uma orientação

```gherkin
Cenário: Lista vazia mostra só o campo e uma orientação
  Dado que não tenho tarefas hoje
  Quando abro o Pauta
  Então vejo o campo para anotar uma tarefa
  E vejo uma frase curta de orientação
```

#### AC-8.3 — Anota uma tarefa

```gherkin
Cenário: Anota uma tarefa
  Dado que estou na lista de hoje
  Quando digito Ligar para o contador e confirmo
  Então vejo Ligar para o contador na lista de hoje
```

#### AC-8.4 — A lista continua ao voltar no mesmo navegador

```gherkin
Cenário: A lista continua ao voltar no mesmo navegador
  Dado que anotei Ligar para o contador hoje
  Quando fecho o Pauta e abro de novo no mesmo navegador
  Então vejo Ligar para o contador na lista de hoje
```

### Fora de escopo

- Validação do tamanho do texto e anotação em sequência (story de anotar várias tarefas)
- Editar, remover ou concluir tarefas
- Aviso de que a lista fica só neste aparelho
- Usar a mesma lista em outro aparelho

## Design

> **Decisão sem consulta:** a pessoa responsável não pôde responder perguntas nesta etapa e pediu para seguir com o plano recomendado.

### Rotas
- `/` — lista de hoje: título "Hoje", data do dia no formato brasileiro (ex.: "Quinta-feira, 26/11/2026"), campo para anotar com o botão "Anotar" e a lista de tarefas num `Card`. O cabeçalho do app mostra só o nome Pauta e o link "Hoje", sem cadastro, login nem tutorial. Substitui o "Hello world" de `src/app/page.tsx`.

### Como ver cada critério
| AC | Onde | Como |
|---|---|---|
| AC-8.1 | `/?estado=vazio` | Abra a URL: a primeira tela já é a lista de hoje, com "Hoje" e a data em dd/mm/aaaa. Não há cadastro, login nem tutorial. |
| AC-8.2 | `/?estado=vazio` | Com a lista vazia aparecem só o campo "Anote uma tarefa" e a frase "Nada para hoje ainda. Anote a primeira tarefa." |
| AC-8.3 | `/?estado=vazio` ou `/` | Digite "Ligar para o contador" e aperte Enter (ou "Anotar"): a tarefa aparece na lista e o campo fica limpo. |
| AC-8.4 | `/` | Anote "Ligar para o contador", feche a aba e abra `/` de novo no mesmo navegador: a tarefa continua na lista (mock em `localStorage`). |

### Estados
| Estado | URL |
|---|---|
| Padrão (lista do aparelho, começa com 3 tarefas mock e guarda o que for anotado) | `/` ou `/?estado=padrao` |
| Vazio (primeiro acesso; fica só em memória) | `/?estado=vazio` |
| Carregando | `/?estado=carregando` |
| Erro | `/?estado=erro` |

### Componentes do DS
`Card`, `Input`, `Label` (oculto visualmente, para leitor de tela), `Button`, `Separator`, `Skeleton` (carregando e data), `Alert` destrutivo (erro, com "Tentar de novo" via `buttonVariants`). Novos: nenhum componente de DS. Composições da tela em `src/components/hoje/` (`lista-de-hoje.tsx`, `data-de-hoje.tsx`) e o shell em `src/components/app-shell.tsx`.

### Mocks
`src/lib/mocks/tarefas.ts` — simula a lista de hoje guardada neste aparelho e navegador (`localStorage`, chave `pauta:prototipo:tarefas`), com 3 tarefas realistas na primeira visita, e uma lista vazia só em memória para o primeiro acesso. A tela usa o contrato `ListaDeHojeStore` (`subscribe`, `getSnapshot`, `anotar`). O /esteira:dev troca por dados reais.

## Técnica

> **Decisão sem consulta:** a pessoa responsável não pôde responder perguntas nesta etapa e pediu para seguir com o desenho recomendado. Cada escolha está registrada em "Decisões e riscos".

### Visão geral
A lista sai do `localStorage` e passa a morar no Postgres, vinculada a um **aparelho anônimo**: um UUID guardado num cookie `httpOnly` (`pauta_aparelho`), sem nenhum dado pessoal. A rota `/` lê as tarefas de hoje desse aparelho num server component dentro de `<Suspense>`. Anotar é uma server action que, na primeira tarefa, cria o aparelho e grava o cookie. A tela atualiza na hora com `useOptimistic` e se confirma com `refresh()`. Esta story cria o primeiro `src/db/schema.ts` do produto (Drizzle) e as duas tabelas que as próximas stories vão estender.

### Modelo de dados
| Tabela | Coluna | Tipo | Regras |
|---|---|---|---|
| `aparelhos` (nova) | `id` | `uuid` | PK. Gerado no servidor (`crypto.randomUUID()`) e gravado no cookie `pauta_aparelho` |
| `aparelhos` (nova) | `criado_em` | `timestamptz` | not null, default `now()` (UTC) |
| `tarefas` (nova) | `id` | `uuid` | PK, default `gen_random_uuid()` |
| `tarefas` (nova) | `aparelho_id` | `uuid` | not null, FK → `aparelhos.id` `on delete cascade` |
| `tarefas` (nova) | `texto` | `text` | not null, check `char_length(texto) between 1 and 200` (regra do CAP-2; o texto chega já sem espaços nas pontas) |
| `tarefas` (nova) | `dia` | `date` | not null. Dia de calendário em que a tarefa foi anotada, em `America/Sao_Paulo`. Base para a passagem de pendências (#16) e o indicador de origem (#17) |
| `tarefas` (nova) | `criada_em` | `timestamptz` | not null, default `now()` (UTC). Define a ordem da lista (fim da lista = mais recente) |

Índice: `tarefas_aparelho_dia_idx` em (`aparelho_id`, `dia`, `criada_em`), que cobre a leitura da lista de hoje já na ordem certa.

Fora desta story (ficam para as stories donas, sem coluna agora): `feita_em` (#14), remoção com desfazer (#13).

### Regras de negócio
- `diaDeHoje(agora: Date)` em `src/lib/domain/dia.ts` — função pura: devolve o dia de calendário (`AAAA-MM-DD`) de `agora` em `America/Sao_Paulo`. É a única fonte de "hoje" do servidor. (AC-8.1, AC-8.3)
- `formatarDataDeHoje(agora: Date)` em `src/lib/domain/dia.ts` — função pura: data por extenso no formato brasileiro em `America/Sao_Paulo` (ex.: "Quinta-feira, 26/11/2026"), com a primeira letra maiúscula. (AC-8.1)
- `normalizarTexto(texto: string)` em `src/lib/domain/tarefas.ts` — função pura: tira os espaços das pontas; devolve erro "Escreva a tarefa antes de anotar." se ficar vazio e "A tarefa pode ter até 200 caracteres." se passar de 200. A mensagem dos 200 caracteres aparece na tela só na #11, mas o servidor já a aplica. (AC-8.3)
- `listarTarefasDeHoje(db, aparelhoId: string | null, agora: Date)` em `src/lib/domain/tarefas.ts` — sem aparelho, devolve `[]` sem consultar o banco (primeiro acesso). Com aparelho, devolve as tarefas com `dia = diaDeHoje(agora)` ordenadas por `criada_em, id`. Um aparelho que não existe no banco devolve `[]`. (AC-8.1, AC-8.2, AC-8.4)
- `anotarTarefa(db, aparelhoId: string, texto: string, agora: Date)` em `src/lib/domain/tarefas.ts` — normaliza o texto e grava a tarefa no fim da lista de hoje. **Atômico num único comando SQL** (sem transação): uma CTE `WITH a AS (INSERT INTO aparelhos (id) VALUES ($1) ON CONFLICT (id) DO NOTHING) INSERT INTO tarefas (aparelho_id, texto, dia, criada_em) VALUES ($1, $2, $3, $4) RETURNING …`. Assim o primeiro anotar cria o aparelho e a tarefa juntos, e um cookie apontando para um aparelho que sumiu do banco se recupera sozinho. Devolve a `Tarefa` criada. (AC-8.3, AC-8.4)

### Contratos
- **Leitura:** `listarTarefasDeHoje(db, aparelhoId, new Date())` → `src/app/(app)/page.tsx`. Um componente assíncrono `ListaDeHojeDoAparelho` lê o cookie com `cookies()` dentro do `<Suspense>` e passa `tarefas: Tarefa[]` para o client component `ListaDeHoje`. O cabeçalho recebe a data já formatada por `formatarDataDeHoje(new Date())`, calculada no servidor, também dentro de `<Suspense>` (fallback: o `Skeleton` atual).
- **Server action** `anotar(texto: string)` em `src/app/(app)/actions.ts` → `{ ok: true, tarefa: Tarefa } | { ok: false, erro: string }`.
  - Lê o cookie `pauta_aparelho`. Se faltar ou não for um UUID válido, gera um novo e grava o cookie (`httpOnly`, `secure` em produção, `sameSite: "lax"`, `path: "/"`, `maxAge` de 400 dias).
  - Chama `anotarTarefa` e depois `refresh()`.
  - Erros: "Escreva a tarefa antes de anotar." · "A tarefa pode ter até 200 caracteres." · "Não deu para anotar agora. Tente de novo." (falha do banco, registrada no log do servidor sem o texto da tarefa).
- **Tipo** `Tarefa` (`src/lib/types/tarefa.ts`) continua `{ id, texto, criadaEm }`, com `criadaEm` em ISO 8601 UTC. `dia` fica só no servidor até a #17 precisar dele.

### Troca dos mocks
| Mock do protótipo | Vira |
|---|---|
| `TAREFAS_MOCK` (3 tarefas iniciais) | Removido. Primeiro acesso começa vazio |
| `criarListaDoAparelho()` + `localStorage` (`pauta:prototipo:tarefas`) | `listarTarefasDeHoje` no servidor + cookie `pauta_aparelho` |
| `criarListaVazia()` e `?estado=vazio` | Um navegador sem cookie (ou sem tarefas hoje) |
| `ListaDeHojeStore` (`subscribe`/`getSnapshot`/`anotar`) com `useSyncExternalStore` | `ListaDeHoje` recebe `tarefas` por prop; `useOptimistic` adiciona a tarefa na hora e chama a action `anotar` dentro de `startTransition` |
| `?estado=carregando` e `?estado=erro` | Fallback do `<Suspense>` e `error.tsx` da rota. Os parâmetros `?estado=` saem |
| `DataDeHoje` no fuso do navegador (`useSyncExternalStore`) | Data formatada no servidor em `America/Sao_Paulo` (mesma fonte de "hoje" da consulta) |
| `src/lib/mocks/tarefas.ts` | Apagado |

### Estados reais
| Estado | Como aparece com dados reais |
|---|---|
| Vazio | `listarTarefasDeHoje` devolve `[]` (sem cookie, aparelho inexistente ou nenhuma tarefa com `dia` = hoje): campo "Anote uma tarefa" e a frase "Nada para hoje ainda. Anote a primeira tarefa." |
| Carregando | Fallback do `<Suspense>`: `ListaCarregando` (skeleton do campo e de 3 linhas) e o `Skeleton` da data |
| Erro | Leitura: `src/app/(app)/error.tsx` (client) com o mesmo `Alert` destrutivo do protótipo ("Não deu para abrir sua lista.") e o botão "Tentar de novo" chamando `reset()`/`router.refresh()`. Anotar: a tarefa otimista some, o texto volta para o campo e a mensagem da action aparece abaixo dele (`role="alert"`) |

### Plano de testes
| AC | Teste de aceite (`e2e/8-abrir-e-anotar.spec.ts`) | Como preparar o "Dado" | Unidade (Vitest) |
|---|---|---|---|
| AC-8.1 | `AC-8.1 primeiro acesso abre direto na lista de hoje`: abre `/`, vê o título "Hoje" e a data esperada; não há texto nem link de "Cadastr", "Entrar", "Login" ou "tutorial" | Contexto novo do Playwright (sem cookie) e banco zerado. A data esperada é calculada no teste com `Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", … })` na hora do teste | `diaDeHoje` (virada à meia-noite de São Paulo, ex.: 02:59 UTC ainda é o dia anterior); `formatarDataDeHoje` (formato e maiúscula) |
| AC-8.2 | `AC-8.2 lista vazia mostra só o campo e uma orientação`: vê o campo "Nova tarefa", a frase de orientação e nenhum item na lista "Tarefas de hoje" | Contexto novo, sem cookie, banco zerado | `listarTarefasDeHoje` sem aparelho e com aparelho sem tarefas de hoje (tarefa de ontem não aparece) → `[]` |
| AC-8.3 | `AC-8.3 anota uma tarefa`: digita "Ligar para o contador", aperta Enter, vê o item na lista e o campo limpo | Contexto novo, pela própria UI | `normalizarTexto` (espaços nas pontas, vazio, 200 e 201 caracteres); `anotarTarefa` cria aparelho + tarefa num comando, grava `dia` de hoje e entra no fim da lista; com aparelho já existente não duplica o aparelho; texto vazio não grava nada |
| AC-8.4 | `AC-8.4 a lista continua ao voltar no mesmo navegador`: anota "Ligar para o contador", fecha a página, abre uma página nova no **mesmo contexto** em `/` e vê a tarefa; uma página num **contexto novo** não vê | Anotar pela UI no próprio teste. O mesmo contexto guarda o cookie, como o mesmo navegador | `listarTarefasDeHoje` devolve só as tarefas do próprio aparelho, na ordem de `criada_em` |

Os testes de unidade de `src/lib/domain/tarefas.ts` rodam contra o PGlite em memória, com o `db` passado por parâmetro e `agora` fixo (sem depender do relógio).

### Decisões e riscos
- **Dados no servidor, identificados por um aparelho anônimo em cookie** — o PRD (premissa 5) deixou para a spec escolher entre "só no aparelho" e "servidor com identificador anônimo". O servidor segue a arquitetura da esteira (Drizzle + Postgres), torna as regras testáveis e prepara o "outro aparelho" do Depois. O cookie carrega só um UUID aleatório: nenhum dado pessoal (LGPD). Limpar os dados do navegador apaga o cookie e começa uma lista nova, como o CAP-1 prevê.
- **O aparelho só nasce no primeiro anotar** — server components não gravam cookie, e criar registro para quem só olhou geraria lixo no banco. Sem cookie, a leitura devolve `[]` sem tocar no banco.
- **"Hoje" em `America/Sao_Paulo`, calculado no servidor** — o PRD diz que o dia vira à meia-noite "no fuso do aparelho", mas o servidor não conhece esse fuso no primeiro acesso, e a arquitetura exibe datas em `America/Sao_Paulo`. O mercado do MVP é o Brasil. **Risco:** quem usa o app em outro fuso vê a virada do dia na hora de Brasília. A #16 (passagem para amanhã) é o lugar para rever isso, guardando o fuso no `aparelhos` se for preciso.
- **Data do cabeçalho vem do servidor** — com a mesma fonte da consulta, a data mostrada e as tarefas listadas nunca discordam perto da meia-noite.
- **Tempo nos testes de aceite** — `page.clock` só controla o relógio do navegador, e o "hoje" desta story é calculado no servidor. Os testes de aceite usam a hora real e calculam a data esperada no próprio teste; as viradas de dia ficam nos testes de unidade, com `agora` fixo.
- **Atualização otimista** — o NFR pede resposta na hora sem esperar o servidor. `useOptimistic` mostra a tarefa na hora; `refresh()` na action traz a lista real.
- **Check de 1 a 200 caracteres já no banco** — é regra do CAP-2 e não custa nada agora. A mensagem na tela e os ACs dela são da #11.
- **Sem dependência de outras stories** — esta story cria `aparelhos` e `tarefas` do zero; os testes preparam tudo pela UI.
