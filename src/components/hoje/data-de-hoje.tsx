"use client";

import { useSyncExternalStore } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const formato = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const nadaAOuvir = () => () => {};

/** Data do dia no fuso do aparelho, no formato brasileiro (ex.: quinta-feira, 26/11/2026). */
export function DataDeHoje() {
  const hoje = useSyncExternalStore(
    nadaAOuvir,
    () => formato.format(new Date()),
    () => null,
  );

  if (hoje === null) return <Skeleton className="h-5 w-48" />;

  return (
    <p className="text-sm text-muted-foreground tabular-nums first-letter:uppercase">{hoje}</p>
  );
}
