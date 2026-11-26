CREATE TABLE "aparelhos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tarefas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"aparelho_id" uuid NOT NULL,
	"texto" text NOT NULL,
	"dia" date NOT NULL,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tarefas_texto_tamanho" CHECK (char_length("tarefas"."texto") between 1 and 200)
);
--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_aparelho_id_aparelhos_id_fk" FOREIGN KEY ("aparelho_id") REFERENCES "public"."aparelhos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tarefas_aparelho_dia_idx" ON "tarefas" USING btree ("aparelho_id","dia","criada_em");