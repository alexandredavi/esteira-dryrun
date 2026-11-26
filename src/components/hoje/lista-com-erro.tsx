"use client";

import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/** Estado de erro da lista no preview (`?estado=erro`). Tentar de novo volta para a lista real. */
export function ListaComErro() {
  const router = useRouter();
  return (
    <Alert variant="destructive">
      <AlertTitle>Não deu para abrir sua lista.</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-4">
        <p>Suas tarefas continuam guardadas neste aparelho. Tente de novo.</p>
        <Button variant="outline" onClick={() => router.replace("/")}>
          Tentar de novo
        </Button>
      </AlertDescription>
    </Alert>
  );
}
