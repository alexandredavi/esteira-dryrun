// Vitrine do Design System — gerada por /esteira:design-system. Rota: /design
// Mostra os tokens e os componentes do DS nos temas claro e escuro, lado a lado.
// Só usa tokens semânticos: a regra esteira-ds/no-raw-styles vale aqui também.
import type { Metadata } from "next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Design System" };

const PRODUCT = "Pauta";

const SWATCHES: { token: string; className: string }[] = [
  { token: "background", className: "bg-background" },
  { token: "foreground", className: "bg-foreground" },
  { token: "primary", className: "bg-primary" },
  { token: "primary-foreground", className: "bg-primary-foreground" },
  { token: "secondary", className: "bg-secondary" },
  { token: "muted", className: "bg-muted" },
  { token: "muted-foreground", className: "bg-muted-foreground" },
  { token: "accent", className: "bg-accent" },
  { token: "destructive", className: "bg-destructive" },
  { token: "border", className: "bg-border" },
  { token: "card", className: "bg-card" },
  { token: "ring", className: "bg-ring" },
];

function Showcase({ theme }: { theme: "claro" | "escuro" }) {
  return (
    <section className={theme === "escuro" ? "dark" : undefined} aria-label={`Tema ${theme}`}>
      <div className="flex flex-col gap-8 rounded-xl border bg-background p-6 text-foreground">
        <header className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Tema {theme}</h2>
          <Badge variant="outline">{theme}</Badge>
        </header>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {SWATCHES.map((s) => (
            <div key={s.token} className="flex flex-col gap-1">
              <div className={`h-12 rounded-md border ${s.className}`} />
              <span className="text-xs text-muted-foreground">{s.token}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="font-heading text-3xl font-semibold tracking-tight">Título de página</p>
          <p className="font-heading text-xl font-medium">Subtítulo de seção</p>
          <p className="text-base">Texto corrido com acentuação: ação, atenção, último lançamento às 08:45.</p>
          <p className="text-sm text-muted-foreground">Texto de apoio em muted-foreground.</p>
          <p className="text-2xl font-semibold tabular-nums">01:23:45 · R$ 1.234,56</p>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-2">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="destructive">Excluir</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Desabilitado</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Padrão</Badge>
          <Badge variant="secondary">Secundário</Badge>
          <Badge variant="outline">Contorno</Badge>
          <Badge variant="destructive">Erro</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card</CardTitle>
              <CardDescription>Superfície com card e card-foreground.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Label htmlFor={`campo-${theme}`}>Campo</Label>
              <Input id={`campo-${theme}`} placeholder="Digite algo" />
            </CardContent>
            <CardFooter>
              <Button size="sm">Salvar</Button>
            </CardFooter>
          </Card>
          <div className="flex flex-col gap-3">
            <Alert>
              <AlertTitle>Informação</AlertTitle>
              <AlertDescription>Mensagem neutra para a pessoa.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Algo deu errado</AlertTitle>
              <AlertDescription>Mensagem de erro com o token destructive.</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DesignPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <div>
        <p className="text-sm text-muted-foreground">Design System</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{PRODUCT}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Showcase theme="claro" />
        <Showcase theme="escuro" />
      </div>
    </main>
  );
}
