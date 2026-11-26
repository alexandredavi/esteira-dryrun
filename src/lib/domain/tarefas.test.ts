import { describe, expect, it } from "vitest";
import { criarDbDeTeste } from "@/db/testing";
import { aparelhos, tarefas } from "@/db/schema";
import {
  ERRO_TAREFA_LONGA,
  ERRO_TAREFA_VAZIA,
  anotarTarefa,
  listarTarefasDeHoje,
  normalizarTexto,
} from "./tarefas";

const APARELHO = "0b0f6c1e-6f1a-4c1a-9d4e-1a2b3c4d5e6f";
const OUTRO_APARELHO = "5a9d2c3b-1e4f-4a6b-8c7d-9e0f1a2b3c4d";
const HOJE = new Date("2026-11-26T15:00:00Z");

describe("normalizarTexto", () => {
  it("tira os espaços das pontas", () => {
    expect(normalizarTexto("  Ligar para o contador  ")).toEqual({ ok: true, valor: "Ligar para o contador" });
  });

  it("recusa texto vazio ou só com espaços", () => {
    expect(normalizarTexto("")).toEqual({ ok: false, erro: ERRO_TAREFA_VAZIA });
    expect(normalizarTexto("   ")).toEqual({ ok: false, erro: ERRO_TAREFA_VAZIA });
  });

  it("aceita 200 caracteres e recusa 201", () => {
    expect(normalizarTexto("a".repeat(200))).toEqual({ ok: true, valor: "a".repeat(200) });
    expect(normalizarTexto("a".repeat(201))).toEqual({ ok: false, erro: ERRO_TAREFA_LONGA });
  });
});

describe("listarTarefasDeHoje", () => {
  it("sem aparelho devolve lista vazia", async () => {
    const db = await criarDbDeTeste();
    expect(await listarTarefasDeHoje(db, null, HOJE)).toEqual([]);
  });

  it("aparelho que não existe no banco devolve lista vazia", async () => {
    const db = await criarDbDeTeste();
    expect(await listarTarefasDeHoje(db, APARELHO, HOJE)).toEqual([]);
  });

  it("não mostra tarefa de ontem", async () => {
    const db = await criarDbDeTeste();
    await anotarTarefa(db, APARELHO, "Tarefa de ontem", new Date("2026-11-25T15:00:00Z"));
    expect(await listarTarefasDeHoje(db, APARELHO, HOJE)).toEqual([]);
  });

  it("devolve só as tarefas do próprio aparelho, na ordem em que foram anotadas", async () => {
    const db = await criarDbDeTeste();
    await anotarTarefa(db, APARELHO, "Primeira", new Date("2026-11-26T12:00:00Z"));
    await anotarTarefa(db, OUTRO_APARELHO, "De outro aparelho", new Date("2026-11-26T12:30:00Z"));
    await anotarTarefa(db, APARELHO, "Segunda", new Date("2026-11-26T13:00:00Z"));

    const lista = await listarTarefasDeHoje(db, APARELHO, HOJE);
    expect(lista.map((t) => t.texto)).toEqual(["Primeira", "Segunda"]);
    expect(lista[0].criadaEm).toBe("2026-11-26T12:00:00.000Z");
  });
});

describe("anotarTarefa", () => {
  it("cria o aparelho e a tarefa de hoje num único comando", async () => {
    const db = await criarDbDeTeste();
    const resultado = await anotarTarefa(db, APARELHO, "  Ligar para o contador ", HOJE);

    expect(resultado).toMatchObject({
      ok: true,
      valor: { texto: "Ligar para o contador", criadaEm: "2026-11-26T15:00:00.000Z" },
    });
    expect(await db.select().from(aparelhos)).toHaveLength(1);
    const [gravada] = await db.select().from(tarefas);
    expect(gravada).toMatchObject({ aparelhoId: APARELHO, texto: "Ligar para o contador", dia: "2026-11-26" });
  });

  it("grava o dia de São Paulo perto da meia-noite", async () => {
    const db = await criarDbDeTeste();
    await anotarTarefa(db, APARELHO, "Tarde da noite", new Date("2026-11-27T02:59:00Z"));
    const [gravada] = await db.select().from(tarefas);
    expect(gravada.dia).toBe("2026-11-26");
  });

  it("com aparelho já existente não duplica o aparelho e entra no fim da lista", async () => {
    const db = await criarDbDeTeste();
    await anotarTarefa(db, APARELHO, "Primeira", new Date("2026-11-26T12:00:00Z"));
    await anotarTarefa(db, APARELHO, "Ligar para o contador", new Date("2026-11-26T13:00:00Z"));

    expect(await db.select().from(aparelhos)).toHaveLength(1);
    const lista = await listarTarefasDeHoje(db, APARELHO, HOJE);
    expect(lista.at(-1)?.texto).toBe("Ligar para o contador");
  });

  it("anotar num aparelho novo não altera as tarefas de outro aparelho", async () => {
    const db = await criarDbDeTeste();
    await anotarTarefa(db, APARELHO, "Do primeiro navegador", new Date("2026-11-26T12:00:00Z"));
    await anotarTarefa(db, OUTRO_APARELHO, "Do outro navegador", new Date("2026-11-26T13:00:00Z"));

    expect(await db.select().from(aparelhos)).toHaveLength(2);
    expect((await listarTarefasDeHoje(db, APARELHO, HOJE)).map((t) => t.texto)).toEqual(["Do primeiro navegador"]);
    expect((await listarTarefasDeHoje(db, OUTRO_APARELHO, HOJE)).map((t) => t.texto)).toEqual(["Do outro navegador"]);
  });

  it("texto vazio não grava nada", async () => {
    const db = await criarDbDeTeste();
    expect(await anotarTarefa(db, APARELHO, "   ", HOJE)).toEqual({ ok: false, erro: ERRO_TAREFA_VAZIA });
    expect(await db.select().from(aparelhos)).toHaveLength(0);
    expect(await db.select().from(tarefas)).toHaveLength(0);
  });

  it("texto com mais de 200 caracteres não grava nada", async () => {
    const db = await criarDbDeTeste();
    expect(await anotarTarefa(db, APARELHO, "a".repeat(201), HOJE)).toEqual({ ok: false, erro: ERRO_TAREFA_LONGA });
    expect(await db.select().from(tarefas)).toHaveLength(0);
  });

  it("recusa um id de aparelho que não é UUID", async () => {
    const db = await criarDbDeTeste();
    await expect(anotarTarefa(db, "nao-e-uuid", "Tarefa", HOJE)).rejects.toThrow("Aparelho inválido.");
  });
});
