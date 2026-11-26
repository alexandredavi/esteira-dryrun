#!/usr/bin/env node
// Rastreabilidade da esteira: todo critério de aceite (AC) de uma story em desenvolvimento precisa de um
// teste de aceite com o ID no título. Roda no CI do produto; instalado por /esteira:testes.
//
// node scripts/esteira/traceability.mjs [--json]
//
// - Specs: docs/specs/*.md. ACs: cabeçalhos "#### AC-<issue>.<n> — título". Status no frontmatter.
// - Exigidas: specs com status "dev" ou "done" (a partir do /esteira:dev). Status inválido é erro.
// - Testes: e2e/**/*.spec.ts. Contam test("AC-12.1 — …") e test.only(…), fora de comentários.
//   NÃO contam: test.skip/test.fixme, testes dentro de describe.skip/describe.fixme, e testes que
//   chamam test.skip()/test.fixme() no corpo.
// - Falha (exit 1) se faltar teste para AC exigido, se um teste citar AC que não existe, se uma spec
//   exigida não tiver nenhum AC ou se um status for inválido.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const AC_HEADING = /^####\s+(AC-\d+\.\d+)\b/gm;
const AC_ID = /AC-\d+\.\d+/g;
export const STATUSES = ["backlog", "design", "spec", "dev", "done"];
const REQUIRED = new Set(["dev", "done"]);

export function parseSpec(text) {
  const clean = text.replace(/^﻿/, "");
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(clean)?.[1] ?? "";
  const field = (k) => {
    const raw = new RegExp(`^${k}:\\s*(.*)$`, "m").exec(fm)?.[1];
    if (raw == null) return null;
    return raw.replace(/\s+#.*$/, "").trim().replace(/^(["'])(.*)\1$/, "$2").trim();
  };
  const status = field("status");
  return {
    issue: field("issue") ? Number(field("issue")) : null,
    status: status || "backlog",
    invalidStatus: status && !STATUSES.includes(status) ? status : null,
    acs: [...clean.matchAll(AC_HEADING)].map((m) => m[1]),
  };
}

// Remove comentários de TS/JS preservando strings e templates (com ${} aninhado).
export function stripComments(src) {
  let out = "";
  const stack = []; // "`" dentro de template; "{" dentro de ${…}
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    const n = src[i + 1];
    const inTemplate = stack.at(-1) === "`";
    if (inTemplate) {
      out += c;
      if (c === "\\") { out += n ?? ""; i++; }
      else if (c === "`") stack.pop();
      else if (c === "$" && n === "{") { out += n; i++; stack.push("{"); }
      continue;
    }
    if (c === "/" && n === "/") { while (i < src.length && src[i] !== "\n") i++; out += "\n"; continue; }
    if (c === "/" && n === "*") { const end = src.indexOf("*/", i + 2); const chunk = src.slice(i, end < 0 ? src.length : end + 2); out += chunk.replace(/[^\n]/g, " "); i = (end < 0 ? src.length : end + 2) - 1; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < src.length && src[j] !== c && src[j] !== "\n") j += src[j] === "\\" ? 2 : 1;
      out += src.slice(i, j + 1);
      i = j;
      continue;
    }
    if (c === "`") { stack.push("`"); out += c; continue; }
    if (c === "{" && stack.length) stack.push("{");
    if (c === "}" && stack.at(-1) === "{") stack.pop();
    out += c;
  }
  return out;
}

// Índice do ")" que fecha o "(" em `open`, pulando strings e templates.
function closeParen(code, open) {
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    const c = code[i];
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < code.length && code[j] !== c) j += code[j] === "\\" ? 2 : 1;
      i = j;
    } else if (c === "(") depth++;
    else if (c === ")" && --depth === 0) return i;
  }
  return code.length;
}

function readTitle(code, from) {
  const m = /^\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1/.exec(code.slice(from));
  return m ? m[2] : null;
}

// Títulos dos testes que contam (counted) e dos que não contam (skipped).
export function parseTests(text) {
  const code = stripComments(text);
  const skippedRanges = [];
  for (const m of code.matchAll(/\b(?:test\.)?describe\.(?:skip|fixme)\s*\(/g)) {
    const open = m.index + m[0].length - 1;
    skippedRanges.push([open, closeParen(code, open)]);
  }
  const inSkipped = (i) => skippedRanges.some(([a, b]) => i > a && i < b);
  const counted = [];
  const skipped = [];
  for (const m of code.matchAll(/\btest(\.only|\.skip|\.fixme)?\s*\(/g)) {
    const open = m.index + m[0].length - 1;
    const title = readTitle(code, open + 1);
    if (title == null) continue; // test.skip() condicional dentro de um teste, sem título
    const ids = title.match(AC_ID) ?? [];
    const body = code.slice(open, closeParen(code, open));
    const skipsItself = /\btest\.(?:skip|fixme)\s*\(\s*\)|\btest\.(?:skip|fixme)\s*\(\s*[^"'`\s)]/.test(body.slice(1));
    const isSkip = m[1] === ".skip" || m[1] === ".fixme" || inSkipped(m.index) || skipsItself;
    (isSkip ? skipped : counted).push(...ids);
  }
  return { counted, skipped };
}

export function analyze(specs, tests) {
  const known = new Map();
  for (const s of specs) for (const ac of s.acs) known.set(ac, s);
  const covered = new Map();
  const skipped = new Set();
  for (const t of tests) {
    for (const id of t.counted) covered.set(id, [...(covered.get(id) ?? []), t.file]);
    for (const id of t.skipped) skipped.add(id);
  }
  const invalid = specs.filter((s) => s.invalidStatus).map((s) => ({ spec: s.file, status: s.invalidStatus }));
  const required = specs.filter((s) => REQUIRED.has(s.status));
  const empty = required.filter((s) => s.acs.length === 0).map((s) => s.file);
  const missing = required.flatMap((s) => s.acs.filter((ac) => !covered.has(ac)).map((ac) => ({ ac, spec: s.file, skipped: skipped.has(ac) })));
  const unknown = [...covered.keys()].filter((id) => !known.has(id)).map((ac) => ({ ac, tests: covered.get(ac) }));
  return {
    ok: missing.length === 0 && unknown.length === 0 && invalid.length === 0 && empty.length === 0,
    required: required.map((s) => ({ spec: s.file, status: s.status, acs: s.acs.length, covered: s.acs.filter((a) => covered.has(a)).length })),
    missing,
    unknown,
    invalid,
    empty,
  };
}

function walk(dir, pred, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== "node_modules") walk(p, pred, out); }
    else if (pred(name)) out.push(p);
  }
  return out;
}

export function run(cwd) {
  const specs = walk(join(cwd, "docs/specs"), (n) => n.endsWith(".md"))
    .map((p) => ({ file: relative(cwd, p).replace(/\\/g, "/"), ...parseSpec(readFileSync(p, "utf8")) }));
  const tests = walk(join(cwd, "e2e"), (n) => n.endsWith(".spec.ts"))
    .map((p) => ({ file: relative(cwd, p).replace(/\\/g, "/"), ...parseTests(readFileSync(p, "utf8")) }));
  return analyze(specs, tests);
}

function report(r) {
  const lines = ["Rastreabilidade AC → teste"];
  if (!r.required.length) lines.push("  Nenhuma story em desenvolvimento (status dev/done): nada exigido.");
  for (const s of r.required) lines.push(`  ${s.covered === s.acs && s.acs > 0 ? "✔" : "✖"} ${s.spec} — ${s.covered}/${s.acs} ACs com teste`);
  for (const m of r.missing) lines.push(`  ✖ ${m.ac} (${m.spec}) sem teste de aceite${m.skipped ? " — só há teste pulado (skip/fixme), que não conta" : ""}`);
  for (const u of r.unknown) lines.push(`  ✖ ${u.ac} citado em ${u.tests.join(", ")} não existe em nenhuma spec`);
  for (const e of r.empty) lines.push(`  ✖ ${e} está em desenvolvimento e não tem nenhum AC ("#### AC-<issue>.<n> — título")`);
  for (const i of r.invalid) lines.push(`  ✖ ${i.spec} tem status inválido "${i.status}" (válidos: ${STATUSES.join(", ")})`);
  lines.push(r.ok ? "OK" : "FALHOU: todo AC de story em desenvolvimento precisa de um teste com o ID no título.");
  return lines.join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const r = run(process.cwd());
  process.stdout.write((process.argv.includes("--json") ? JSON.stringify(r, null, 2) : report(r)) + "\n");
  process.exitCode = r.ok ? 0 : 1;
}
