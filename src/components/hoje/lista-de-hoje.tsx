"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { criarListaDoAparelho, criarListaVazia } from "@/lib/mocks/tarefas";

type Modo = "aparelho" | "vazio";

export function ListaDeHoje({ modo }: { modo: Modo }) {
  const [store] = useState(() => (modo === "vazio" ? criarListaVazia() : criarListaDoAparelho()));
  const tarefas = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const [texto, setTexto] = useState("");
  const campoId = useId();

  if (tarefas === null) return <ListaCarregando />;

  function confirmar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!texto.trim()) return;
    store.anotar(texto);
    setTexto("");
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={confirmar} className="flex gap-2">
          <Label htmlFor={campoId} className="sr-only">
            Nova tarefa
          </Label>
          <Input
            id={campoId}
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            placeholder="Anote uma tarefa"
            autoComplete="off"
            autoFocus
            className="h-11"
          />
          <Button type="submit" className="h-11 px-4">
            Anotar
          </Button>
        </form>

        {tarefas.length === 0 ? (
          <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            Nada para hoje ainda. Anote a primeira tarefa.
          </p>
        ) : (
          <>
            <Separator />
            <ul aria-label="Tarefas de hoje" className="flex flex-col">
              {tarefas.map((tarefa) => (
                <li key={tarefa.id} className="flex min-h-11 items-center border-b py-2 text-base last:border-b-0">
                  {tarefa.texto}
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function ListaCarregando() {
  return (
    <Card aria-busy="true" aria-label="Carregando a lista de hoje">
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 w-20" />
        </div>
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-5/6" />
        <Skeleton className="h-11 w-2/3" />
      </CardContent>
    </Card>
  );
}
