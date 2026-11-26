import Link from "next/link";

const ROTAS = [{ href: "/", rotulo: "Hoje" }] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4 p-4 sm:px-6">
          <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
            Pauta
          </Link>
          <nav aria-label="Principal">
            <ul className="flex gap-4 text-sm">
              {ROTAS.map((rota) => (
                <li key={rota.href}>
                  <Link href={rota.href} className="text-muted-foreground hover:text-foreground">
                    {rota.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 p-4 sm:p-6">{children}</main>
    </div>
  );
}
