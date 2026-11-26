import { describe, expect, it } from "vitest";
import { diaDeHoje, formatarDataDeHoje } from "./dia";

describe("diaDeHoje", () => {
  it("devolve o dia de calendário em America/Sao_Paulo", () => {
    expect(diaDeHoje(new Date("2026-11-26T15:00:00Z"))).toBe("2026-11-26");
  });

  it("antes da meia-noite de São Paulo ainda é o dia anterior", () => {
    expect(diaDeHoje(new Date("2026-11-27T02:59:00Z"))).toBe("2026-11-26");
  });

  it("vira o dia à meia-noite de São Paulo", () => {
    expect(diaDeHoje(new Date("2026-11-27T03:00:00Z"))).toBe("2026-11-27");
  });
});

describe("formatarDataDeHoje", () => {
  it("formata por extenso no padrão brasileiro com a primeira letra maiúscula", () => {
    expect(formatarDataDeHoje(new Date("2026-11-26T15:00:00Z"))).toBe("Quinta-feira, 26/11/2026");
  });

  it("usa o dia de São Paulo, não o UTC", () => {
    expect(formatarDataDeHoje(new Date("2026-11-27T02:59:00Z"))).toBe("Quinta-feira, 26/11/2026");
  });
});
