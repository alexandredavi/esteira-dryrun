import { Suspense } from "react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { DataDeHoje } from "@/components/hoje/data-de-hoje";
import { ListaCarregando, ListaDeHoje } from "@/components/hoje/lista-de-hoje";

// Protótipo da story #8. Estados pela URL: ?estado=padrao | vazio | carregando | erro
export default function HojePage({ searchParams }: PageProps<"/">) {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Hoje</h1>
        <DataDeHoje />
      </header>
      <Suspense fallback={<ListaCarregando />}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Conteudo({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { estado } = await searchParams;

  if (estado === "carregando") return <ListaCarregando />;
  if (estado === "erro") return <ListaErro />;
  const modo = estado === "vazio" ? "vazio" : "aparelho";
  return <ListaDeHoje key={modo} modo={modo} />;
}

function ListaErro() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Não deu para abrir sua lista.</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-4">
        <p>Suas tarefas continuam guardadas neste aparelho. Tente de novo.</p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Tentar de novo
        </Link>
      </AlertDescription>
    </Alert>
  );
}
