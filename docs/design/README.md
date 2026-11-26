# Design System — Pauta

> Gerado por `/esteira:design-system` em 2026-11-26 a partir do [discovery](../product/discovery.md). Vitrine: rota `/design`. Aprovado quando o PR é mergeado.

## 1. Identidade

> **Decisão sem consulta:** a pessoa responsável não pôde responder perguntas nesta etapa e pediu para seguir com as recomendações. Todas as escolhas abaixo são a recomendação da etapa. As alternativas estão registradas para revisão no PR.

**Personalidade**

- **Calma:** a interface tem fundo quase branco levemente esverdeado, poucos elementos por tela e nenhum alerta chamativo. O Pauta não compete com o dia da pessoa.
- **Direta:** cada tela tem uma ação principal e uma cor de destaque só (a primária). Nada de ícones decorativos, etiquetas ou camadas de menu.
- **Acolhedora:** cantos arredondados, espaçamento confortável e textos que não cobram. Pendência é "ficou para hoje", não "atrasada".

**Tom de voz:** frases curtas, em segunda pessoa, sem jargão de produtividade e sem exclamações. Ex.: "Nada para hoje ainda. Anote a primeira tarefa."

**Alternativas consideradas**

| Item | Escolhido | Alternativas |
|---|---|---|
| Primária | **Verde-petróleo** `oklch(0.48 0.09 170)`: calmo, remete a "feito" e progresso sem o verde saturado de sucesso | Azul-tinta `oklch(0.45 0.12 255)` (sóbrio, mas genérico entre apps de tarefas); Terracota `oklch(0.55 0.14 40)` (caloroso, mas lembra alerta) |
| Fonte | **Inter**: excelente leitura em telas pequenas, acentos PT-BR bem desenhados, `tabular-nums` nativo | Nunito Sans (mais arredondada e amigável, porém menos neutra em números) |
| Raio | **0.875rem (amigável)** | 0.375rem (sóbrio), 0.625rem (padrão) |
| Densidade | **Confortável**: uso principal no celular, com o dedo | Compacta |

## 2. Princípios

1. **Hoje em primeiro lugar.** Se algo não ajuda a pessoa a ver ou mexer na lista de hoje, não aparece na tela principal.
2. **Um toque para anotar.** O campo de nova tarefa está sempre à vista. Anotar nunca exige abrir outra tela.
3. **Uma cor de destaque.** A primária marca só a ação principal e o progresso. O resto da interface é neutro.
4. **Feito é visível, não barulhento.** Concluir uma tarefa muda o estado com clareza (cor e texto), sem animação comemorativa.

## 3. Cores

Neutros puxam levemente o matiz 170 da primária (croma ≤ 0.02). Valores iguais aos de `src/app/globals.css`.

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `background` | `oklch(0.99 0.004 170)` | `oklch(0.17 0.012 170)` | Fundo da página |
| `foreground` | `oklch(0.2 0.015 170)` | `oklch(0.96 0.006 170)` | Texto principal |
| `card` | `oklch(1 0 0)` | `oklch(0.21 0.014 170)` | Superfície de cards e da lista |
| `card-foreground` | `oklch(0.2 0.015 170)` | `oklch(0.96 0.006 170)` | Texto em cards |
| `popover` | `oklch(1 0 0)` | `oklch(0.21 0.014 170)` | Menus, diálogos, tooltips |
| `popover-foreground` | `oklch(0.2 0.015 170)` | `oklch(0.96 0.006 170)` | Texto em popovers |
| `primary` | `oklch(0.48 0.09 170)` | `oklch(0.74 0.11 170)` | Ação principal, check de tarefa feita, progresso |
| `primary-foreground` | `oklch(0.985 0.005 170)` | `oklch(0.2 0.03 170)` | Texto sobre a primária |
| `secondary` | `oklch(0.955 0.012 170)` | `oklch(0.27 0.015 170)` | Botões secundários |
| `secondary-foreground` | `oklch(0.27 0.02 170)` | `oklch(0.96 0.006 170)` | Texto sobre secondary |
| `muted` | `oklch(0.96 0.008 170)` | `oklch(0.27 0.015 170)` | Áreas de apoio, estado vazio |
| `muted-foreground` | `oklch(0.47 0.015 170)` | `oklch(0.73 0.015 170)` | Texto de apoio, tarefa feita, origem da pendência |
| `accent` | `oklch(0.94 0.02 170)` | `oklch(0.29 0.02 170)` | Hover e item focado |
| `accent-foreground` | `oklch(0.27 0.02 170)` | `oklch(0.96 0.006 170)` | Texto sobre accent |
| `destructive` | `oklch(0.55 0.2 27)` | `oklch(0.7 0.19 22)` | Remover tarefa, erros |
| `border` | `oklch(0.91 0.01 170)` | `oklch(1 0 0 / 10%)` | Bordas e divisores |
| `input` | `oklch(0.91 0.01 170)` | `oklch(1 0 0 / 15%)` | Borda de campos |
| `ring` | `oklch(0.6 0.09 170)` | `oklch(0.58 0.09 170)` | Anel de foco |
| `chart-1` | `oklch(0.82 0.08 170)` | `oklch(0.85 0.08 170)` | Rampa da primária (mais clara) |
| `chart-2` | `oklch(0.68 0.1 170)` | `oklch(0.74 0.11 170)` | Rampa da primária |
| `chart-3` | `oklch(0.56 0.1 170)` | `oklch(0.62 0.1 170)` | Rampa da primária |
| `chart-4` | `oklch(0.45 0.08 170)` | `oklch(0.5 0.08 170)` | Rampa da primária |
| `chart-5` | `oklch(0.35 0.06 170)` | `oklch(0.4 0.06 170)` | Rampa da primária (mais escura) |
| `sidebar` | `oklch(0.975 0.006 170)` | `oklch(0.21 0.014 170)` | Barra lateral (se houver) |
| `sidebar-primary` | `oklch(0.48 0.09 170)` | `oklch(0.74 0.11 170)` | Igual à primária |
| `sidebar-ring` | `oklch(0.6 0.09 170)` | `oklch(0.58 0.09 170)` | Igual ao ring |

### Contraste (WCAG)

Resultado de `contrast.mjs`. Texto: AA 4.5:1. Destrutivo sobre o fundo: 3:1.

| Par | Claro | Escuro | Mínimo |
|---|---|---|---|
| foreground / background | 17.54 | 17.01 | 4.5 |
| card-foreground / card | 18.03 | 15.74 | 4.5 |
| popover-foreground / popover | 18.03 | 15.74 | 4.5 |
| primary-foreground / primary | 5.97 | 8.18 | 4.5 |
| secondary-foreground / secondary | 13.17 | 13.36 | 4.5 |
| muted-foreground / muted | 6.04 | 6.30 | 4.5 |
| muted-foreground / background | 6.58 | 8.03 | 4.5 |
| accent-foreground / accent | 12.63 | 12.48 | 4.5 |
| destructive / background | 5.22 | 6.54 | 3 |

## 4. Tipografia

- **Família:** Inter (Google Fonts, via `next/font/google`, variável `--font-sans`), usada em texto e títulos. Escolhida pela leitura em telas pequenas, pelos acentos bem desenhados em PT-BR e pelos números tabulares.
- **Pesos:** 400 (texto), 500 (subtítulos e rótulos), 600 (títulos e contadores).
- **Escala:**
  - `text-3xl font-semibold tracking-tight`: título da página ("Hoje").
  - `text-xl font-medium`: título de seção ("Pendências de ontem").
  - `text-base`: texto da tarefa. É o tamanho mínimo para o texto principal no celular.
  - `text-sm`: rótulos, botões, descrições.
  - `text-xs text-muted-foreground`: metadados (ex.: "de ontem").
- **Números:** `tabular-nums` em contadores de progresso ("3 de 7") e datas, para não "pularem" quando mudam.

## 5. Forma e espaço

- **Raio:** `--radius: 0.875rem` (amigável). Escala derivada: `rounded-sm` ≈ 0.53rem, `rounded-md` 0.7rem, `rounded-lg` 0.875rem, `rounded-xl` ≈ 1.23rem.
- **Densidade:** confortável. Alvos de toque com pelo menos 44px de altura nos itens da lista; botões no tamanho padrão.
- **Espaçamento:** `gap-2` dentro de um item (check + texto + ação), `gap-4` entre itens e campos, `gap-6` entre seções. Margem lateral `p-4` no celular, `p-6` a partir de `sm`.

## 6. Componentes

| Componente | Quando usar |
|---|---|
| `Button` | Ações. `default` só para a ação principal da tela; `ghost` para ações por item (editar, remover); `destructive` para confirmar remoção |
| `Input` | Campo de nova tarefa e edição de texto da tarefa |
| `Textarea` | Textos longos (pouco usado no MVP) |
| `Label` | Rótulo de campos; em campo sem rótulo visível, use `aria-label` |
| `Card` | Contêiner da lista do dia e de blocos de conteúdo |
| `Badge` | Marcadores curtos, como a origem da pendência ("de ontem") |
| `Alert` | Avisos persistentes na página, como "sua lista fica neste aparelho" |
| `Dialog` | Confirmações que bloqueiam (raras; prefira desfazer) |
| `DropdownMenu` | Ações secundárias de um item quando não cabem na linha |
| `Select` | Escolha entre opções fixas |
| `Tabs` | Alternar visões dentro de uma página |
| `Separator` | Dividir seções da lista (hoje × pendências) |
| `Skeleton` | Estado carregando da lista |
| `Sonner` (toast) | Retorno breve com "Desfazer" após remover uma tarefa |
| `Table` | Dados tabulares (fora da tela principal) |
| `Tooltip` | Explicar ícones sem texto |

## 7. Regras

- Use só tokens semânticos (`bg-primary`, `text-muted-foreground`, `rounded-lg`). A regra `esteira-ds/no-raw-styles` barra no lint cores da paleta crua, valores arbitrários de cor, espaçamento, fonte e raio, e cor em `style={{}}`.
- Antes de criar um componente novo, combine os de `src/components/ui`. Se um componente novo for necessário, ele entra em `src/components/` e é justificado na seção Design da spec.
- Um token novo é uma mudança de DS: entra em `globals.css` (claro e escuro), passa pelo contraste e é documentado aqui.
