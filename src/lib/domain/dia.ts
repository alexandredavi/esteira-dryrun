// "Hoje" do Pauta (#8): o dia de calendário em America/Sao_Paulo, calculado no servidor.
export const FUSO_DO_PAUTA = "America/Sao_Paulo";

const formatoDia = new Intl.DateTimeFormat("en-CA", {
  timeZone: FUSO_DO_PAUTA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const formatoPorExtenso = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO_DO_PAUTA,
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Dia de calendário (AAAA-MM-DD) de `agora` em America/Sao_Paulo. Única fonte de "hoje" do servidor. */
export function diaDeHoje(agora: Date): string {
  return formatoDia.format(agora);
}

/** Data no formato brasileiro em America/Sao_Paulo, ex.: "Quinta-feira, 26/11/2026". */
export function formatarDataDeHoje(agora: Date): string {
  const texto = formatoPorExtenso.format(agora);
  return texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1);
}
