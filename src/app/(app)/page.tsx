import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { getDb } from "@/db";
import { AvisoDoAparelho } from "@/components/hoje/aviso-do-aparelho";
import { DataDeHoje, DataDeHojeCarregando } from "@/components/hoje/data-de-hoje";
import { ListaCarregando, ListaDeHoje } from "@/components/hoje/lista-de-hoje";
import { formatarDataDeHoje } from "@/lib/domain/dia";
import { listarTarefasDeHoje } from "@/lib/domain/tarefas";
import { COOKIE_DO_APARELHO } from "./aparelho";

export default function HojePage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Hoje</h1>
        <Suspense fallback={<DataDeHojeCarregando />}>
          <DataDoServidor />
        </Suspense>
      </header>
      <Suspense fallback={<ListaCarregando />}>
        <ListaDeHojeDoAparelho />
      </Suspense>
      <AvisoDoAparelho />
    </>
  );
}

async function DataDoServidor() {
  await connection();
  return <DataDeHoje data={formatarDataDeHoje(new Date())} />;
}

async function ListaDeHojeDoAparelho() {
  await connection();
  const aparelhoId = (await cookies()).get(COOKIE_DO_APARELHO)?.value ?? null;
  const tarefas = await listarTarefasDeHoje(await getDb(), aparelhoId, new Date());
  return <ListaDeHoje tarefas={tarefas} />;
}
