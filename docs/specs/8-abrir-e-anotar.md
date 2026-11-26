---
issue: 8
epic: 4
slug: abrir-e-anotar
status: design
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

<!-- Preenchido por /esteira:spec: modelo de dados, contratos, regras, plano de testes, troca dos mocks, decisões. -->

_Pendente._
