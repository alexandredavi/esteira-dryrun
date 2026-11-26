import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Aviso discreto e persistente (#9): a lista fica só neste aparelho e navegador.
 * Não bloqueia o uso: não tem botão de fechar nem aparece por cima da lista.
 * `role="note"` em vez do `role="alert"` padrão do Alert, para leitores de tela
 * não anunciarem o aviso como urgente a cada visita.
 */
export function AvisoDoAparelho() {
  return (
    <Alert role="note" aria-labelledby="aviso-do-aparelho" className="bg-muted">
      <AlertTitle id="aviso-do-aparelho">Sua lista fica neste aparelho</AlertTitle>
      <AlertDescription>
        <p>
          Ela fica guardada só neste aparelho e neste navegador. Em outro navegador, você começa uma lista nova.
        </p>
        <p>Se você limpar os dados do navegador, a lista é apagada.</p>
      </AlertDescription>
    </Alert>
  );
}
