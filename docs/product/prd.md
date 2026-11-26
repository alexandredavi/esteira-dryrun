# PRD — Pauta

> Gerado por `/esteira:prd` em 2026-11-26 a partir de [discovery.md](discovery.md). Aprovado quando o PR deste arquivo é mergeado.

## 1. Visão

O Pauta quer ser o jeito mais rápido de saber o que fazer hoje: abrir, anotar, marcar como feito e seguir o dia. Para a P1 (profissional sobrecarregada) e a P2 (estudante com rotina própria), que já largaram apps de tarefas por excesso de recurso e de cadastro, ele entrega só o dia de hoje, sem conta e sem distrações, e leva sozinho para amanhã o que ficou pendente.

## 2. Objetivos do MVP e métricas de sucesso

**Métrica principal:** retenção D1 ativa, ou seja, a porcentagem de pessoas que voltam no dia seguinte ao primeiro uso e marcam ao menos 1 tarefa como feita. Meta: **30%**.

| Objetivo | Métrica | Meta | Como medir |
|---|---|---|---|
| A pessoa volta no dia seguinte e usa de verdade (principal) | Retenção D1 ativa: voltou no dia seguinte ao primeiro uso e concluiu ao menos 1 tarefa | ≥ 30% | Evento anônimo de conclusão por aparelho, comparando o dia do primeiro uso com o dia seguinte |
| Começar a usar sem atrito | Porcentagem de primeiros acessos que criam ao menos 1 tarefa | ≥ 70% | Eventos anônimos de primeiro acesso e de primeira tarefa criada |
| Montar o dia rápido (job 1) | Tempo mediano entre abrir o app pela primeira vez e criar a primeira tarefa | ≤ 60 s | Diferença entre os eventos de primeiro acesso e de primeira tarefa |
| Hábito, não só curiosidade | Retenção D7 ativa | ≥ 15% | Mesmo evento da D1, no sétimo dia após o primeiro uso |

## 3. Personas atendidas

- **P1 — Profissional sobrecarregada:** persona principal do MVP. As decisões de escopo e de prioridade são tomadas por ela.
- **P2 — Estudante com rotina própria:** persona secundária. É atendida pelo mesmo recorte, porque também usa sobretudo o celular e foge de distração.

## 4. Escopo do MVP — capacidades

### CAP-1 — Lista de hoje, sem conta

- **Job atendido:** 5 (usar na hora, sem conta) e 1 (listar o dia rápido)
- **Descrição:** a pessoa abre o Pauta e já está na lista do dia de hoje, pronta para anotar, sem cadastro, login ou onboarding. A lista continua lá quando ela fecha e volta no mesmo aparelho e navegador.
- **Regras de negócio:**
  - A primeira tela é sempre a lista de hoje, com a data do dia visível. Não há outra tela obrigatória antes dela.
  - Nenhum dado pessoal é pedido para usar o app (nome, e-mail ou telefone).
  - A lista fica vinculada ao aparelho e navegador em que foi criada. Trocar de aparelho ou limpar os dados do navegador começa uma lista nova, e o app avisa isso de forma discreta.
  - Com a lista vazia, o app mostra só o campo para anotar e uma frase curta de orientação, sem tutorial.

### CAP-2 — Anotar e ajustar tarefas do dia

- **Job atendido:** 1 (listar o dia em menos de um minuto) e 2 (anotar no meio do dia sem perder o foco)
- **Descrição:** a pessoa digita uma tarefa e ela entra na lista de hoje na hora. Também pode corrigir o texto ou remover uma tarefa.
- **Regras de negócio:**
  - Uma tarefa tem só um texto. Não há data, projeto, etiqueta, prioridade nem descrição.
  - O texto tem de 1 a 200 caracteres, sem espaços nas pontas. Texto vazio não cria tarefa.
  - Toda tarefa criada entra no dia de hoje, no fim da lista.
  - Depois de criar uma tarefa, o campo fica pronto para a próxima, para dar para anotar várias em sequência.
  - Remover uma tarefa pode ser desfeito por alguns segundos e depois é definitivo.

### CAP-3 — Concluir e ver o que falta

- **Job atendido:** 3 (marcar como feita e ver o que falta)
- **Descrição:** a pessoa marca uma tarefa como feita e vê na hora quantas faltam no dia.
- **Regras de negócio:**
  - Uma tarefa está pendente ou feita. Marcar e desmarcar são o mesmo gesto e podem ser feitos a qualquer momento do dia.
  - As pendentes aparecem primeiro. As feitas ficam abaixo, visualmente atenuadas, até o fim do dia.
  - O app mostra o progresso do dia como "X de Y feitas".
  - Concluir uma tarefa não dispara som, animação longa, pontos nem conquistas.

### CAP-4 — Pendências passam sozinhas para amanhã

- **Job atendido:** 4 (pendências passam para amanhã sem reescrever)
- **Descrição:** quando a pessoa abre o Pauta num dia novo, o que ficou pendente nos dias anteriores já está na lista de hoje, sem ela fazer nada.
- **Regras de negócio:**
  - O dia vira à meia-noite no fuso horário do aparelho.
  - Ao abrir num dia novo, todas as tarefas pendentes de dias anteriores passam para hoje, na mesma ordem e antes das tarefas criadas hoje.
  - Uma tarefa que veio de outro dia tem um indicador discreto ("de ontem" ou "há N dias"), para a pessoa decidir se ainda faz sentido.
  - As tarefas feitas em dias anteriores saem da lista. Não há tela de histórico no MVP.
  - Se a pessoa ficar dias sem abrir, as pendências chegam todas juntas no dia em que ela voltar, sem duplicar.

## 5. Fora de escopo (MVP)

| Item | Motivo | Quando volta |
|---|---|---|
| Planejar o dia de amanhã antes | Pedido real no fórum do Microsoft To Do, mas a proposta de valor se sustenta só com o dia de hoje | Depois do beta, se aparecer nas entrevistas |
| Usar em outro aparelho (conta opcional, link ou código) | Contraria o "sem conta" e ainda não está decidido como fazer (pergunta em aberto) | Quando a perda de dados por troca de aparelho aparecer como motivo de abandono |
| PWA instalável e uso offline | Útil, mas não é condição para a proposta de valor. Aumenta a complexidade | Logo após o MVP, se a retenção mostrar uso diário no celular |
| Lembrete ou notificação diária | Pode virar a distração que o produto quer evitar (pergunta em aberto) | Teste A/B depois de medir a retenção D1 sem lembrete |
| Histórico de dias anteriores | Não atende nenhum job do MVP | Se a P2 pedir para ver o que já fez |
| Reordenar tarefas (arrastar) | Na dúvida, fica fora. A ordem de criação basta para começar | Primeira melhoria se for pedida no beta |
| Projetos, etiquetas, prioridades, datas e recorrência | São exatamente o excesso de recurso que afastou as personas | Sem previsão. Só com evidência forte |
| Monetização | O modelo de receita ainda não está definido e cobrar agora afastaria a persona | Depois de validar a retenção |
| Exportar ou fazer backup da lista | Mitiga o risco dos dados só no aparelho, mas não é essencial para o primeiro teste | Junto com o uso em outro aparelho |

## 6. Requisitos não funcionais

- **Mobile first:** o layout é pensado primeiro para celular (a partir de 360 px de largura) e funciona bem em notebook. Toda ação cabe numa mão só, com alvos de toque de pelo menos 44 px.
- **Privacidade e LGPD:** nenhum dado pessoal é coletado. O texto das tarefas nunca é usado em métricas. As métricas usam só eventos anônimos por aparelho (primeiro acesso, tarefa criada, tarefa concluída), sem cookies de rastreamento de terceiros. O app tem uma página curta de privacidade explicando isso.
- **Performance perceptível:** a lista aparece pronta para anotar em até 2 s numa conexão 4G comum. Criar, concluir e remover tarefa respondem na hora, sem esperar o servidor para atualizar a tela.
- **Acessibilidade:** WCAG 2.1 AA (contraste, foco visível, uso só pelo teclado e leitores de tela no fluxo de anotar e concluir).
- **Idioma:** só PT-BR no MVP, com datas no formato brasileiro.
- **Sem distração:** nenhuma notificação, som, badge ou gamificação no MVP.

## 7. Premissas e dependências

Esta etapa foi feita sem entrevista (a pessoa pediu para seguir com as recomendações). Cada recomendação está registrada aqui:

| # | Premissa | Origem |
|---|---|---|
| 1 | O corte do MVP são as 4 capacidades acima. Planejar amanhã, reordenar, PWA offline e lembrete ficaram em Depois por "na dúvida, Depois" | Recomendação sem consulta |
| 2 | A métrica principal é a retenção D1 ativa, com meta de 30%. Ela testa direto as premissas 7 e 8 do discovery (o valor da passagem automática e a volta sem notificação) | Recomendação sem consulta |
| 3 | Os requisitos não funcionais que mudam decisão são mobile first, LGPD sem dados pessoais e nenhuma distração. Offline completo não é requisito do MVP | Recomendação sem consulta |
| 4 | A P1 é a persona principal e a P2 é secundária | Premissa 1 do discovery |
| 5 | A lista é vinculada ao aparelho e navegador, sem conta. Onde os dados ficam guardados (só no aparelho ou num servidor com identificador anônimo) é decisão da spec técnica, desde que nenhuma conta seja exigida | Premissa 5 do discovery |
| 6 | O mercado é o Brasil, em PT-BR | Premissa 4 do discovery |

**Dependências:** uma ferramenta de métricas que aceite eventos anônimos sem cookies de terceiros, para medir os objetivos da seção 2. O app web já está montado (`/esteira:setup`).

## 8. Riscos

- **Perda de dados:** sem conta, quem limpa o navegador ou troca de aparelho perde a lista. Mitigação no MVP: aviso discreto (CAP-1). A mitigação de verdade (backup ou outro aparelho) está em Depois.
- **Retenção sem lembrete:** sem notificação, o app pode ser esquecido como um post-it. A métrica principal mede isso direto e decide se o lembrete entra.
- **Pouca diferenciação:** Google Tasks e Apple Lembretes já estão instalados. A aposta é que a passagem automática (CAP-4) e o "zero cadastro" (CAP-1) bastam. Se a D1 ficar abaixo da meta, essa aposta cai.
- **Acúmulo de pendências:** quem fica dias sem abrir pode encontrar uma lista longa de tarefas antigas e desanimar. O indicador "há N dias" (CAP-4) ajuda a decidir o que remover.
- **Medição com aparelho anônimo:** a mesma pessoa em dois navegadores conta como duas, o que distorce um pouco as métricas. É aceitável no MVP.

## 9. Perguntas em aberto

- A passagem automática deve permitir que a pessoa descarte em lote as pendências antigas, ou remover uma a uma basta?
- Quando a retenção D1 for medida, vale testar um lembrete diário opcional?
- Qual é o caminho para usar em outro aparelho sem conta (link, código ou conta opcional depois)?
- Qual é o modelo de receita, se houver um?
