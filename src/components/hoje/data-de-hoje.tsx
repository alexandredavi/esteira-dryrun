import { Skeleton } from "@/components/ui/skeleton";

/** Data do dia já formatada no servidor (America/Sao_Paulo), ex.: Quinta-feira, 26/11/2026. */
export function DataDeHoje({ data }: { data: string }) {
  return <p className="text-sm text-muted-foreground tabular-nums first-letter:uppercase">{data}</p>;
}

export function DataDeHojeCarregando() {
  return <Skeleton className="h-5 w-48" />;
}
