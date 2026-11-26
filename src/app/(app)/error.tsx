"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AvisoDoAparelho } from "@/components/hoje/aviso-do-aparelho";
import { Button } from "@/components/ui/button";

export default function ErroDaListaDeHoje({ retry }: { error: unknown; retry: () => void }) {
  return (
    <>
      <Alert variant="destructive">
        <AlertTitle>Não deu para abrir sua lista.</AlertTitle>
        <AlertDescription className="flex flex-col items-start gap-4">
          <p>Suas tarefas continuam guardadas neste aparelho. Tente de novo.</p>
          <Button variant="outline" onClick={() => retry()}>
            Tentar de novo
          </Button>
        </AlertDescription>
      </Alert>
      <AvisoDoAparelho />
    </>
  );
}
