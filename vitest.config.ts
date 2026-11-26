import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Story só de UI (sem regra de negócio) não tem teste de unidade: não é falha.
    passWithNoTests: true,
    // PGlite sobe um Postgres por teste: dá folga no primeiro.
    testTimeout: 20_000,
  },
});
