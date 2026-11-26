import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Pauta",
  description:
    "A lista de tarefas do dia que abre e funciona na hora, sem conta e sem distrações, e passa sozinha o que ficou pendente para amanhã.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={cn("font-sans", inter.variable)}>
      <body>{children}</body>
    </html>
  );
}
