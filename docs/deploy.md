# Deploy — Pauta

> Runbook gerado por `/esteira:deploy`. Vale para todo o ciclo: preview por PR, produção na `main`, migrações e rollback.

## Como funciona

| Quando | O que acontece | Banco |
|---|---|---|
| Abre ou atualiza um PR | A Vercel publica um **preview** com URL própria (comentário no PR) | Branch do Neon criado para o preview (integração Neon) |
| Merge na `main` | A Vercel publica em **produção** | Banco principal do Neon |
| Todo build na Vercel | `scripts/esteira/migrate.mjs` aplica as migrações de `drizzle/` antes do `next build` | Só se `ESTEIRA_MIGRATE=1` naquele ambiente |
| CI (GitHub Actions) | Lint, tipos, unidade, build, rastreabilidade e aceite com banco em memória | Nenhum banco remoto |

## Configuração (uma vez)

1. **Vercel:** vercel.com/new → *Import Git Repository* → este repo. Framework: Next.js (detectado). Não mude o build command: ele já é `npm run build`, que migra e builda.
2. **Neon:** no projeto da Vercel, *Storage* → *Neon* → criar o banco. Marque **criar um branch do banco para cada preview**. A integração define `DATABASE_URL` em Production e Preview.
3. **Migração:** em *Settings → Environment Variables*, crie `ESTEIRA_MIGRATE=1`:
   - em **Production**, sempre;
   - em **Preview**, **só** se o passo 2 cria um branch por preview. Senão, deixe desligado: o preview estaria apontando para o banco de produção.
4. Faça um redeploy da `main` e confira o log do build: `[esteira] migrações aplicadas`.

## Rollback

- **Código:** no painel da Vercel, *Deployments* → o deploy anterior → *Instant Rollback*. É imediato e não refaz o build.
- **Atenção:** depois de um Instant Rollback, a Vercel **para de promover sozinha** os deploys novos da `main` para produção. Quando o PR com a correção for mergeado, use **Undo Rollback** (ou *Promote* no deploy novo) para produção voltar a acompanhar a `main`.
- **Banco:** as migrações da esteira são **só aditivas** (tabelas e colunas novas; coluna nova é nullable ou tem DEFAULT). Por isso o código anterior continua funcionando com o banco novo, e o rollback de código não exige rollback de banco.
- Se uma migração estiver errada: corrija com **uma nova migração** num PR (nunca edite a que já rodou).

## Diagnóstico

- `/esteira:deploy status` mostra o **último** deploy de produção (depois de um rollback, pode não ser o que está no ar) e o preview de cada PR aberto.
- Build falhou com `[esteira] migração falhou`: o deploy não sobe, e a versão anterior continua no ar. Leia o erro no log da Vercel.
