import { test, expect } from "./support"; // banco zerado antes de cada teste

/** Data esperada no cabeçalho, no formato brasileiro, em America/Sao_Paulo (fonte de "hoje" do Pauta). */
function dataDeHojeEsperada(): string {
  const texto = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
  return texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1);
}

test("AC-8.1 — Primeiro acesso abre direto na lista de hoje", async ({ page }) => {
  // Dado que nunca abri o Pauta neste navegador
  // (contexto novo do Playwright: sem cookie, banco zerado)
  await expect(page.context().cookies()).resolves.toHaveLength(0);

  // Quando abro o Pauta
  await page.goto("/");

  // Então vejo a lista de hoje com a data do dia no formato brasileiro
  await expect(page.getByRole("heading", { level: 1, name: "Hoje" })).toBeVisible();
  const data = dataDeHojeEsperada();
  expect(data).toMatch(/\d{2}\/\d{2}\/\d{4}$/);
  await expect(page.getByText(data, { exact: true })).toBeVisible();

  // E não vejo pedido de cadastro, login nem tutorial
  await expect(page.getByText(/cadastr|entrar|login|tutorial/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /cadastr|entrar|login|tutorial/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /cadastr|entrar|login|tutorial/i })).toHaveCount(0);
});

test("AC-8.2 — Lista vazia mostra só o campo e uma orientação", async ({ page }) => {
  // Dado que não tenho tarefas hoje
  // (contexto novo, sem cookie, banco zerado)

  // Quando abro o Pauta
  await page.goto("/");

  // Então vejo o campo para anotar uma tarefa
  await expect(page.getByLabel("Nova tarefa")).toBeVisible();

  // E vejo uma frase curta de orientação
  await expect(page.getByText("Nada para hoje ainda. Anote a primeira tarefa.")).toBeVisible();
  await expect(page.getByRole("list", { name: "Tarefas de hoje" })).toHaveCount(0);
});

test("AC-8.3 — Anota uma tarefa", async ({ page }) => {
  // Dado que estou na lista de hoje
  await page.goto("/");
  const campo = page.getByLabel("Nova tarefa");
  await expect(campo).toBeVisible();

  // Quando digito Ligar para o contador e confirmo
  await campo.fill("Ligar para o contador");
  await campo.press("Enter");

  // Então vejo Ligar para o contador na lista de hoje
  const lista = page.getByRole("list", { name: "Tarefas de hoje" });
  await expect(lista.getByRole("listitem").filter({ hasText: "Ligar para o contador" })).toBeVisible();
  await expect(campo).toHaveValue("");
});

test("AC-8.4 — A lista continua ao voltar no mesmo navegador", async ({ page, context, browser }) => {
  // Dado que anotei Ligar para o contador hoje
  await page.goto("/");
  const campo = page.getByLabel("Nova tarefa");
  await campo.fill("Ligar para o contador");
  await campo.press("Enter");
  // Espera o servidor confirmar (o cookie do aparelho só é gravado quando a tarefa é gravada)
  await expect.poll(async () => (await context.cookies()).some((c) => c.name === "pauta_aparelho")).toBe(true);

  // Quando fecho o Pauta e abro de novo no mesmo navegador
  await page.close();
  const denovo = await context.newPage();
  await denovo.goto("/");

  // Então vejo Ligar para o contador na lista de hoje
  await expect(
    denovo.getByRole("list", { name: "Tarefas de hoje" }).getByRole("listitem").filter({ hasText: "Ligar para o contador" }),
  ).toBeVisible();

  // (Em outro navegador, a lista é outra: começa vazia.)
  const outro = await browser.newContext();
  const pagina = await outro.newPage();
  await pagina.goto(denovo.url());
  await expect(pagina.getByText("Nada para hoje ainda. Anote a primeira tarefa.")).toBeVisible();
  await outro.close();
});
