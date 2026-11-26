// Regra de lint da esteira: o Design System é imposto, não sugerido.
// Barra estilos crus nas classes Tailwind e em style={{}}: o código usa só os tokens semânticos
// do DS (bg-primary, text-muted-foreground, rounded-lg…). Os primitivos em src/components/ui ficam de fora.
//
// Instalado por /esteira:setup em eslint-rules/esteira-ds.mjs e registrado em eslint.config.mjs.

const COLOR_UTILS = "bg|text|border|border-[trblxyse]|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|accent|caret|placeholder|divide|shadow|text-shadow|drop-shadow|inset-shadow|inset-ring";
const PALETTE = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const SPACING_UTILS = "p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y";
// Modificador de opacidade: /50, /[.3], /(--o)
const OPACITY = "(?:/(?:\\d+|\\[[^\\]]+\\]|\\([^)]+\\)))?";
// Conteúdo de colchete que é cor. Larguras, porcentagens e imagens (url) não são.
// ATENÇÃO: o Tailwind v4 varre este arquivo atrás de classes. Não escreva exemplos com url() entre
// colchetes aqui: viram CSS com url(...) e o build do Next quebra ("Can't resolve '...'").
const COLOR_VALUE = "(?:#|rgba?\\(|hsla?\\(|oklch\\(|oklab\\(|lab\\(|lch\\(|hwb\\(|color(?:-mix)?[:(]|var\\(--)";

const RULES = [
  { re: /^text-\[(?:\d|length:)/, reason: "tamanho de fonte arbitrário; use a escala tipográfica (text-sm, text-lg…)" },
  { re: new RegExp(`^-?(?:${COLOR_UTILS})-(?:${PALETTE})-\\d{2,3}${OPACITY}$`), reason: "cor da paleta crua do Tailwind; use um token do DS (ex.: bg-primary, text-muted-foreground)" },
  { re: new RegExp(`^(?:${COLOR_UTILS})-(?:black|white)${OPACITY}$`), reason: "preto/branco cru; use um token do DS (ex.: bg-background, text-primary-foreground)" },
  { re: new RegExp(`^(?:${COLOR_UTILS})-\\[${COLOR_VALUE}`, "i"), reason: "cor arbitrária; use um token do DS ou crie um token em globals.css" },
  { re: new RegExp(`^-?(?:${SPACING_UTILS})-\\[`), reason: "espaçamento arbitrário; use a escala do Tailwind (p-4, gap-2…)" },
  { re: /^rounded(?:-[a-z]{1,2})?-\[/, reason: "raio arbitrário; use rounded-sm/md/lg/xl (derivados de --radius)" },
  { re: /^font-\[/, reason: "fonte arbitrária; use font-sans/font-heading do DS" },
];

const STYLE_PROPS = new Set(["color", "background", "backgroundColor", "borderColor", "fontSize", "fontFamily"]);

// Remove variantes (hover:, md:, dark:, [&>svg]:) e o modificador ! — sobra a utilidade.
function utility(cls) {
  let depth = 0;
  let last = 0;
  for (let i = 0; i < cls.length; i++) {
    const c = cls[i];
    if (c === "[") depth++;
    else if (c === "]") depth--;
    else if (c === ":" && depth === 0) last = i + 1;
  }
  return cls.slice(last).replace(/^!/, "").replace(/!$/, "");
}

/** Lista violações numa string de classes. Puro e testável. */
export function findRawStyleViolations(classString) {
  const out = [];
  for (const cls of String(classString).split(/\s+/).filter(Boolean)) {
    const u = utility(cls);
    const rule = RULES.find((r) => r.re.test(u));
    if (rule) out.push({ cls, reason: rule.reason });
  }
  return out;
}

const CLASS_FNS = new Set(["cn", "clsx", "cva", "twMerge", "classNames"]);

function strings(node, acc = []) {
  if (!node || typeof node !== "object") return acc;
  if (node.type === "Literal" && typeof node.value === "string") acc.push({ node, value: node.value });
  else if (node.type === "TemplateLiteral") {
    for (const q of node.quasis) acc.push({ node: q, value: q.value.cooked ?? "" });
    for (const e of node.expressions) strings(e, acc);
  }
  else if (node.type === "JSXExpressionContainer") strings(node.expression, acc);
  else if (node.type === "TSAsExpression" || node.type === "TSSatisfiesExpression" || node.type === "TSNonNullExpression") strings(node.expression, acc);
  else if (node.type === "ConditionalExpression") { strings(node.consequent, acc); strings(node.alternate, acc); }
  else if (node.type === "LogicalExpression") { strings(node.left, acc); strings(node.right, acc); }
  else if (node.type === "ArrayExpression") for (const e of node.elements) strings(e, acc);
  else if (node.type === "ObjectExpression") for (const p of node.properties) { if (p.type === "Property") { strings(p.key, acc); strings(p.value, acc); } }
  else if (node.type === "CallExpression" && !isClassFn(node)) for (const a of node.arguments) strings(a, acc);
  return acc;
}

// cn()/clsx()/cva() são checados pelo visitante de CallExpression; não repetir dentro do className.
const isClassFn = (node) => node.callee?.type === "Identifier" && CLASS_FNS.has(node.callee.name);
const argStrings = (call) => call.arguments.flatMap((a) => strings(a));

const rule = {
  meta: {
    type: "problem",
    docs: { description: "Proíbe estilos crus fora do Design System (cores da paleta, valores arbitrários, cor em style)." },
    schema: [],
    messages: { raw: "`{{cls}}`: {{reason}}.", style: "style.{{prop}}: use classes com tokens do DS em vez de estilo inline." },
  },
  create(context) {
    const report = (node, value) => {
      for (const v of findRawStyleViolations(value)) context.report({ node, messageId: "raw", data: v });
    };
    return {
      JSXAttribute(node) {
        const name = node.name?.name;
        if (name === "className" || name === "class") for (const s of strings(node.value)) report(s.node, s.value);
        if (name === "style" && node.value?.expression?.type === "ObjectExpression") {
          for (const p of node.value.expression.properties) {
            const key = p.key?.name ?? p.key?.value;
            if (STYLE_PROPS.has(key)) context.report({ node: p, messageId: "style", data: { prop: key } });
          }
        }
      },
      CallExpression(node) {
        if (isClassFn(node)) for (const s of argStrings(node)) report(s.node, s.value);
      },
    };
  },
};

const plugin = { meta: { name: "esteira-ds" }, rules: { "no-raw-styles": rule } };

// Bloco de configuração pronto para o eslint.config.mjs.
const esteiraDsConfig = {
  files: ["src/**/*.{ts,tsx}"],
  ignores: ["src/components/ui/**"],
  plugins: { "esteira-ds": plugin },
  rules: { "esteira-ds/no-raw-styles": "error" },
};

export default esteiraDsConfig;
