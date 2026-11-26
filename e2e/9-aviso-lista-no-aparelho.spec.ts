import { test, expect } from "./support"; // banco zerado antes de cada teste

test("AC-9.1 — Aviso discreto está disponível na lista", async ({ page }) => {
  // Dado que estou na lista de hoje
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Hoje" })).toBeVisible();

  // Quando procuro informações sobre onde a lista fica guardada
  const aviso = page.getByRole("note", { name: "Sua lista fica neste aparelho" });

  // Então vejo que a lista fica só neste aparelho e navegador
  await expect(aviso).toBeVisible();
  await expect(aviso.getByText("só neste aparelho e neste navegador")).toBeVisible();

  // E que limpar os dados do navegador apaga a lista
  await expect(aviso.getByText("limpar os dados do navegador, a lista é apagada")).toBeVisible();
});

test("AC-9.2 — Aviso não bloqueia o uso", async ({ page }) => {
  // Dado que abro o Pauta pela primeira vez
  // (contexto novo do Playwright: sem cookie, banco zerado)
  await expect(page.context().cookies()).resolves.toHaveLength(0);
  await page.goto("/");

  // Quando a lista de hoje aparece
  const campo = page.getByLabel("Nova tarefa");
  await expect(campo).toBeVisible();

  // Então consigo anotar uma tarefa sem fechar nenhum aviso antes
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.getByRole("note", { name: "Sua lista fica neste aparelho" }).getByRole("button")).toHaveCount(0);
  await campo.fill("Pagar o boleto");
  await campo.press("Enter");
  await expect(
    page.getByRole("list", { name: "Tarefas de hoje" }).getByRole("listitem").filter({ hasText: "Pagar o boleto" }),
  ).toBeVisible();
});

test("AC-9.3 — Outro navegador começa uma lista nova", async ({ page, context, browser }) => {
  // Dado que tenho tarefas no Pauta em um navegador
  await page.goto("/");
  const campo = page.getByLabel("Nova tarefa");
  await campo.fill("Ligar para o contador");
  await campo.press("Enter");
  await expect(
    page.getByRole("list", { name: "Tarefas de hoje" }).getByRole("listitem").filter({ hasText: "Ligar para o contador" }),
  ).toBeVisible();
  await expect.poll(async () => (await context.cookies()).some((c) => c.name === "pauta_aparelho")).toBe(true);

  // Quando abro o Pauta em outro navegador
  const outro = await browser.newContext();
  const pagina = await outro.newPage();
  await pagina.goto("/");

  // Então vejo a lista de hoje vazia
  await expect(pagina.getByText("Nada para hoje ainda. Anote a primeira tarefa.")).toBeVisible();
  await expect(pagina.getByText("Ligar para o contador")).toHaveCount(0);

  // E vejo o aviso de que a lista fica só no aparelho e navegador em que foi criada
  await expect(pagina.getByRole("note", { name: "Sua lista fica neste aparelho" })).toBeVisible();
  await outro.close();
});
