// Apoio aos testes de aceite. Use o `test` daqui: cada teste começa com o banco zerado.
import { test as base, expect } from "@playwright/test";

export const test = base.extend<{ banco: void }>({
  banco: [
    async ({ request }, use) => {
      if (process.env.E2E_NO_RESET !== "1") {
        const r = await request.post("/api/e2e/reset");
        // 404 = o app ainda não tem banco (nenhuma story com dados): nada para zerar.
        // 403 = servidor fora do modo E2E ou apontando para banco remoto: parar, para não testar com dados sujos.
        if (!r.ok() && r.status() !== 404) {
          throw new Error(`Reset do banco recusado (${r.status()}): ${await r.text()} — suba o app com E2E=1 (o playwright.config.ts faz isso) ou use E2E_NO_RESET=1 de propósito.`);
        }
      }
      await use();
    },
    { auto: true },
  ],
});

export { expect };
