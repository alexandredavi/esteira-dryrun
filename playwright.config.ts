import { defineConfig, devices } from "@playwright/test";

// Testes de aceite: um teste por critério, com o ID AC-<issue>.<n> no título (rastreabilidade).
// Sem E2E_BASE_URL: sobe o app local com banco em memória e a rota de reset (E2E=1).
// Com E2E_BASE_URL (ex.: preview da Vercel, F4): testa a URL informada.
const PORT = 3100;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // um banco só no servidor: testes em série
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL, locale: "pt-BR", timezoneId: "America/Sao_Paulo", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: process.env.CI ? `npm run start -- -p ${PORT}` : `npm run dev -- -p ${PORT}`,
        url: baseURL,
        env: { E2E: "1" },
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
