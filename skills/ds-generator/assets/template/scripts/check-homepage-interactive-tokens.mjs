#!/usr/bin/env node
/**
 * Valida em runtime (Chromium headless via Playwright), em múltiplas
 * larguras de viewport (mobile, tablet, desktop), que os elementos
 * interativos da Homepage — <button>, [role="button"], <a> com texto
 * visível — usam tokens tipográficos e de cor do Design System:
 *
 *   - font-family : Poppins
 *   - font-weight : ≥ 500 (medium/semibold/bold)
 *   - font-size   : ∈ { 12, 14, 16, 18 } px  (escala do DS)
 *   - line-height : explícita (não "normal") e ≥ font-size
 *   - color       : resolve para um dos tokens do tema atual
 *                   (--foreground, --primary, --primary-foreground,
 *                    --secondary-foreground, --muted-foreground,
 *                    --accent-foreground, --destructive,
 *                    --destructive-foreground, --sidebar-foreground)
 *
 * Botões sem texto visível (ícone puro) são ignorados — métricas
 * tipográficas não se aplicam.
 *
 * Uso:
 *   node scripts/check-homepage-interactive-tokens.mjs [url]
 *   CHECK_URL=http://localhost:8080 node scripts/check-homepage-interactive-tokens.mjs
 */
const DEFAULT_URL = "https://__DS_DOMAIN__/";
const url =
  process.argv.slice(2).find((a) => !a.startsWith("--")) ||
  process.env.CHECK_URL ||
  DEFAULT_URL;

const ALLOWED_FONT_SIZES_PX = [12, 14, 16, 18];
const MIN_FONT_WEIGHT = 500;
const COLOR_TOKENS = [
  "--foreground",
  "--primary",
  "--primary-foreground",
  "--secondary-foreground",
  "--muted-foreground",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--sidebar-foreground",
  "--sidebar-primary-foreground",
];

// Tokens permitidos como background em estado :hover (variantes
// shadcn: hover:bg-accent, hover:bg-primary/90, hover:bg-muted, etc.).
const HOVER_BG_TOKENS = [
  "--background",
  "--card",
  "--popover",
  "--primary",
  "--secondary",
  "--muted",
  "--accent",
  "--destructive",
  "--sidebar-accent",
  "--sidebar-primary",
];

const VIEWPORTS = [
  { name: "mobile",  width: 375,  height: 800 },
  { name: "tablet",  width: 768,  height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

function fail(msg) {
  console.error(`✗ Interactive tokens FAIL: ${msg}`);
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  fail("Playwright não está instalado. Rode `npm i -D playwright`.");
}

const browser = await chromium.launch({ headless: true });

async function checkViewport(vp) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  console.log(`\n▶ Viewport ${vp.name} (${vp.width}×${vp.height}) — ${url}`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForSelector("button, a", { timeout: 10_000 });

  // Resolve cada token de cor do :root em RGB renderizado.
  const tokenColorRgb = await page.evaluate((tokens) => {
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden";
    document.body.appendChild(probe);
    const result = {};
    for (const t of tokens) {
      // Tokens shadcn são triplas HSL sem hsl() — envolvemos.
      probe.style.color = `hsl(var(${t}))`;
      result[t] = getComputedStyle(probe).color;
    }
    document.body.removeChild(probe);
    return result;
  }, COLOR_TOKENS);

  const allowedColorSet = new Set(Object.values(tokenColorRgb));

  const report = await page.$$eval(
    'button, a, [role="button"], [role="link"]',
    (els, { allowedSizes, minWeight, allowedColors }) => {
      const out = [];
      for (const el of els) {
        const text = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!text) continue; // ignora ícone puro
        if (el.closest("svg")) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue; // invisível
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        const fontPx = parseFloat(cs.fontSize);
        const lhPx = cs.lineHeight === "normal" ? NaN : parseFloat(cs.lineHeight);
        const weight = parseInt(cs.fontWeight, 10) || 400;
        const issues = [];
        if (!/poppins/i.test(cs.fontFamily))
          issues.push(`font-family=${cs.fontFamily}`);
        if (!allowedSizes.some((s) => Math.abs(s - fontPx) < 0.5))
          issues.push(`font-size=${fontPx}px (permitido: ${allowedSizes.join("/")}px)`);
        if (weight < minWeight)
          issues.push(`font-weight=${weight} (mín ${minWeight})`);
        if (Number.isNaN(lhPx))
          issues.push(`line-height=normal (esperado valor explícito)`);
        else if (lhPx + 0.5 < fontPx)
          issues.push(`line-height=${lhPx}px < font-size=${fontPx}px`);
        if (!allowedColors.includes(cs.color))
          issues.push(`color=${cs.color} (fora dos tokens do DS)`);
        out.push({
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute("role") || "",
          text: text.slice(0, 60),
          issues,
        });
      }
      return out;
    },
    {
      allowedSizes: ALLOWED_FONT_SIZES_PX,
      minWeight: MIN_FONT_WEIGHT,
      allowedColors: [...allowedColorSet],
    },
  );

  const errors = report.filter((r) => r.issues.length);
  console.log(`  · ${report.length} elemento(s) com texto verificado(s).`);
  if (errors.length) {
    fail(
      `[${vp.name}] ${errors.length}/${report.length} elemento(s) divergem dos tokens do DS:\n  - ` +
        errors
          .map((r) => `<${r.tag}${r.role ? ` role="${r.role}"` : ""}> "${r.text}" → ${r.issues.join("; ")}`)
          .join("\n  - "),
    );
  }
  console.log(`✓ ${report.length} botões/links respeitam tokens do DS em ${vp.name}.`);

  // ===========================================================
  // Validação WCAG AA: contraste de botões, links, badges e cards
  // contra o background real (composição alpha pelos ancestrais).
  // Limiares: 4.5:1 normal, 3:1 large (≥24px ou ≥18.66px bold).
  // ===========================================================
  const contrastReport = await page.$$eval(
    [
      "button",
      "a",
      '[role="button"]',
      '[role="link"]',
      '[class*="badge" i]',
      '[data-slot="badge"]',
      '[class*="card" i]',
      '[data-slot="card"]',
    ].join(", "),
    (els) => {
      const parseColor = (c) => {
        const m = c && c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(",").map((x) => parseFloat(x.trim()));
        return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
      };
      const blend = (fg, bg) => {
        const a = fg.a + bg.a * (1 - fg.a);
        return {
          r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
          g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
          b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
          a,
        };
      };
      const effectiveBg = (el, skipSelf = false) => {
        let acc = { r: 0, g: 0, b: 0, a: 0 };
        let node = skipSelf ? el.parentElement : el;
        while (node && node.nodeType === 1) {
          const c = parseColor(getComputedStyle(node).backgroundColor);
          if (c && c.a > 0) {
            acc = acc.a === 0 ? c : blend(acc, c);
            if (acc.a >= 0.999) break;
          }
          node = node.parentElement;
        }
        if (acc.a < 0.999) acc = blend(acc, { r: 255, g: 255, b: 255, a: 1 });
        return acc;
      };
      const lum = ({ r, g, b }) => {
        const ch = [r, g, b].map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
      };
      const ratio = (a, b) => {
        const la = lum(a), lb = lum(b);
        const [hi, lo] = la > lb ? [la, lb] : [lb, la];
        return (hi + 0.05) / (lo + 0.05);
      };
      const seen = new Set();
      const out = [];
      for (const el of els) {
        if (seen.has(el)) continue;
        seen.add(el);
        if (el.closest("svg")) continue;
        const text = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!text) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const fg = parseColor(cs.color);
        if (!fg) continue;
        // Para o cálculo, o background do próprio elemento conta
        // (botão preenchido, badge etc.).
        const bg = effectiveBg(el);
        const fontPx = parseFloat(cs.fontSize);
        const weight = parseInt(cs.fontWeight, 10) || 400;
        const isLarge = fontPx >= 24 || (fontPx >= 18.66 && weight >= 700);
        const cls = (el.getAttribute("class") || "").toLowerCase();
        const kind =
          el.tagName === "BUTTON" || el.getAttribute("role") === "button"
            ? "button"
            : el.tagName === "A" || el.getAttribute("role") === "link"
            ? "link"
            : /badge/.test(cls) || el.getAttribute("data-slot") === "badge"
            ? "badge"
            : "card";
        out.push({
          kind,
          tag: el.tagName.toLowerCase(),
          text: text.slice(0, 60),
          fg: `rgb(${Math.round(fg.r)}, ${Math.round(fg.g)}, ${Math.round(fg.b)})`,
          bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
          ratio: ratio(fg, bg),
          threshold: isLarge ? 3 : 4.5,
          scale: isLarge ? "large" : "normal",
        });
      }
      return out;
    },
  );

  const contrastErrors = contrastReport.filter((r) => r.ratio + 0.01 < r.threshold);
  console.log(`  · ${contrastReport.length} elemento(s) avaliado(s) para contraste WCAG.`);
  if (contrastErrors.length) {
    fail(
      `[${vp.name}] ${contrastErrors.length}/${contrastReport.length} elemento(s) reprovam no WCAG AA:\n  - ` +
        contrastErrors
          .map(
            (r) =>
              `${r.kind} <${r.tag}> "${r.text}" → ${r.ratio.toFixed(2)}:1 (mín ${r.threshold}:1, ${r.scale}) fg=${r.fg} bg=${r.bg}`,
          )
          .join("\n  - "),
    );
  }
  console.log(`✓ ${contrastReport.length} botões/links/badges/cards passam no WCAG AA em ${vp.name}.`);

  // ===========================================================
  // Validação de estados :hover de botões e links.
  // Para cada elemento com texto, simula hover via Playwright e
  // confere que color/background-color/text-decoration ainda usam
  // tokens do DS (ou variantes alpha desses tokens).
  // ===========================================================
  const hoverBgRgb = await page.evaluate((tokens) => {
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden";
    document.body.appendChild(probe);
    const r = {};
    for (const t of tokens) {
      probe.style.backgroundColor = `hsl(var(${t}))`;
      r[t] = getComputedStyle(probe).backgroundColor;
    }
    document.body.removeChild(probe);
    return r;
  }, HOVER_BG_TOKENS);

  // Componentes RGB permitidos (ignora alpha — hover:bg-primary/90 etc.).
  const allowedHoverBgRgbTriples = new Set(
    Object.values(hoverBgRgb).map((c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return c;
      const [r, g, b] = m[1].split(",").map((x) => Math.round(parseFloat(x.trim())));
      return `${r},${g},${b}`;
    }),
  );

  const targets = await page.$$('button, a, [role="button"], [role="link"]');
  const hoverErrors = [];
  let hoverChecked = 0;
  // Limita custo: até 40 alvos por viewport, em ordem do DOM.
  for (const handle of targets.slice(0, 40)) {
    const meta = await handle.evaluate((el) => {
      const text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return null;
      if (el.closest("svg")) return null;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return null;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return null;
      return { tag: el.tagName.toLowerCase(), text: text.slice(0, 60) };
    });
    if (!meta) continue;
    try {
      await handle.scrollIntoViewIfNeeded({ timeout: 1000 });
      await handle.hover({ timeout: 1500, force: true });
    } catch {
      continue; // alvo coberto/fora do viewport → pula
    }
    // pequena espera para transições assíncronas
    await page.waitForTimeout(50);
    const after = await handle.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        color: cs.color,
        bg: cs.backgroundColor,
        textDecorationLine: cs.textDecorationLine,
        textDecorationColor: cs.textDecorationColor,
      };
    });
    hoverChecked += 1;
    const issues = [];

    if (!allowedColorSet.has(after.color))
      issues.push(`hover color=${after.color} fora dos tokens do DS`);

    // Background: transparent permitido; caso contrário a tripla RGB
    // (ignorando alpha) precisa bater com algum token.
    const m = after.bg.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(",").map((x) => parseFloat(x.trim()));
      const alpha = parts[3] ?? 1;
      if (alpha > 0) {
        const triple = parts.slice(0, 3).map((n) => Math.round(n)).join(",");
        if (!allowedHoverBgRgbTriples.has(triple))
          issues.push(`hover background-color=${after.bg} fora dos tokens do DS`);
      }
    }

    // text-decoration: apenas "none" ou "underline" (com cor do próprio texto).
    const td = after.textDecorationLine;
    if (td && td !== "none" && td !== "underline")
      issues.push(`hover text-decoration=${td} (permitido: none|underline)`);
    if (td === "underline" && after.textDecorationColor !== after.color)
      issues.push(
        `hover text-decoration-color=${after.textDecorationColor} ≠ color=${after.color}`,
      );

    if (issues.length) {
      hoverErrors.push(`<${meta.tag}> "${meta.text}" → ${issues.join("; ")}`);
    }
  }
  // Move o cursor para fora para não contaminar o próximo viewport.
  await page.mouse.move(0, 0);

  console.log(`  · ${hoverChecked} hover state(s) avaliado(s) em ${vp.name}.`);
  if (hoverErrors.length) {
    fail(
      `[${vp.name}] ${hoverErrors.length}/${hoverChecked} elemento(s) com :hover fora dos tokens:\n  - ` +
        hoverErrors.join("\n  - "),
    );
  }
  console.log(`✓ ${hoverChecked} estados :hover respeitam tokens do DS em ${vp.name}.`);

  // ===========================================================
  // Validação WCAG AA: contraste de inputs, selects e textareas
  // (texto, placeholder e label associado) contra o background
  // efetivo renderizado. Limiares: 4.5:1 normal, 3:1 large.
  // ===========================================================
  const formContrastReport = await page.$$eval(
    "input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=reset]):not([type=image]):not([type=color]):not([type=file]):not([type=range]), select, textarea",
    (els) => {
      const parseColor = (c) => {
        const m = c && c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(",").map((x) => parseFloat(x.trim()));
        return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
      };
      const blend = (fg, bg) => {
        const a = fg.a + bg.a * (1 - fg.a);
        return {
          r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
          g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
          b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
          a,
        };
      };
      const effectiveBg = (el, skipSelf = false) => {
        let acc = { r: 0, g: 0, b: 0, a: 0 };
        let node = skipSelf ? el.parentElement : el;
        while (node && node.nodeType === 1) {
          const c = parseColor(getComputedStyle(node).backgroundColor);
          if (c && c.a > 0) {
            acc = acc.a === 0 ? c : blend(acc, c);
            if (acc.a >= 0.999) break;
          }
          node = node.parentElement;
        }
        if (acc.a < 0.999) acc = blend(acc, { r: 255, g: 255, b: 255, a: 1 });
        return acc;
      };
      const lum = ({ r, g, b }) => {
        const ch = [r, g, b].map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
      };
      const ratio = (a, b) => {
        const la = lum(a), lb = lum(b);
        const [hi, lo] = la > lb ? [la, lb] : [lb, la];
        return (hi + 0.05) / (lo + 0.05);
      };
      const findLabel = (el) => {
        if (el.id) {
          const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
          if (l) return l;
        }
        const wrap = el.closest("label");
        if (wrap) return wrap;
        const aria = el.getAttribute("aria-labelledby");
        if (aria) {
          const l = document.getElementById(aria.split(/\s+/)[0]);
          if (l) return l;
        }
        return null;
      };
      const out = [];
      for (const el of els) {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const bg = effectiveBg(el);
        const fontPx = parseFloat(cs.fontSize);
        const weight = parseInt(cs.fontWeight, 10) || 400;
        const isLarge = fontPx >= 24 || (fontPx >= 18.66 && weight >= 700);
        const threshold = isLarge ? 3 : 4.5;
        const tag = el.tagName.toLowerCase();
        const name =
          el.getAttribute("name") || el.getAttribute("id") || el.getAttribute("aria-label") || "";

        // 1) Cor do texto digitado
        const fg = parseColor(cs.color);
        if (fg) {
          out.push({
            kind: "text",
            tag,
            name,
            ratio: ratio(fg, bg),
            threshold,
            fg: `rgb(${Math.round(fg.r)}, ${Math.round(fg.g)}, ${Math.round(fg.b)})`,
            bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
          });
        }

        // 2) Placeholder (quando aplicável)
        const phAttr = el.getAttribute("placeholder");
        if (phAttr && tag !== "select") {
          const phCs = getComputedStyle(el, "::placeholder");
          const phc = parseColor(phCs.color) || fg;
          if (phc) {
            // WCAG não exige contraste forte para placeholder, mas como
            // muitos DS usam placeholder também como label visível,
            // aplicamos 3:1 como piso mínimo de legibilidade.
            out.push({
              kind: "placeholder",
              tag,
              name,
              ratio: ratio(phc, bg),
              threshold: 3,
              fg: `rgb(${Math.round(phc.r)}, ${Math.round(phc.g)}, ${Math.round(phc.b)})`,
              bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
            });
          }
        }

        // 3) Label associada
        const label = findLabel(el);
        if (label) {
          const lcs = getComputedStyle(label);
          const lfg = parseColor(lcs.color);
          const lbg = effectiveBg(label);
          const lfontPx = parseFloat(lcs.fontSize);
          const lweight = parseInt(lcs.fontWeight, 10) || 400;
          const lLarge = lfontPx >= 24 || (lfontPx >= 18.66 && lweight >= 700);
          if (lfg) {
            out.push({
              kind: "label",
              tag,
              name,
              ratio: ratio(lfg, lbg),
              threshold: lLarge ? 3 : 4.5,
              fg: `rgb(${Math.round(lfg.r)}, ${Math.round(lfg.g)}, ${Math.round(lfg.b)})`,
              bg: `rgb(${Math.round(lbg.r)}, ${Math.round(lbg.g)}, ${Math.round(lbg.b)})`,
            });
          }
        }
      }
      return out;
    },
  );

  const formErrors = formContrastReport.filter((r) => r.ratio + 0.01 < r.threshold);
  console.log(
    `  · ${formContrastReport.length} amostra(s) de campo de formulário (texto/placeholder/label) avaliada(s).`,
  );
  if (formErrors.length) {
    fail(
      `[${vp.name}] ${formErrors.length}/${formContrastReport.length} amostra(s) de inputs/selects/textareas reprovam no WCAG AA:\n  - ` +
        formErrors
          .map(
            (r) =>
              `${r.kind} <${r.tag}${r.name ? ` name="${r.name}"` : ""}> → ${r.ratio.toFixed(2)}:1 (mín ${r.threshold}:1) fg=${r.fg} bg=${r.bg}`,
          )
          .join("\n  - "),
    );
  }
  console.log(
    `✓ ${formContrastReport.length} amostra(s) de inputs/selects/textareas passam no WCAG AA em ${vp.name}.`,
  );

  // ===========================================================
  // Validação WCAG AA de contraste nos estados :hover, :active e
  // :focus-visible de botões, links, badges e cards.
  // Usamos CDP (CSS.forcePseudoState) para forçar cada pseudo-
  // classe, depois lemos getComputedStyle e calculamos a razão
  // de contraste contra o background efetivo (composição alpha).
  // ===========================================================
  const PSEUDO_SELECTOR = [
    "button",
    "a",
    '[role="button"]',
    '[role="link"]',
    '[class*="badge" i]',
    '[data-slot="badge"]',
    '[class*="card" i]',
    '[data-slot="card"]',
  ].join(", ");

  // 1) Marca cada alvo com um índice estável para resolver via CDP.
  const targetCount = await page.$$eval(PSEUDO_SELECTOR, (els) => {
    els.forEach((e, i) => e.setAttribute("data-ci-pseudo", String(i)));
    return els.length;
  });

  const cdp = await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root: cdpRoot } = await cdp.send("DOM.getDocument", { depth: -1 });

  const STATES = [
    { key: "hover", forced: ["hover"] },
    { key: "focus-visible", forced: ["focus", "focus-visible"] },
    { key: "active", forced: ["active", "hover"] },
  ];

  const measureFn = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const parseColor = (c) => {
      const m = c && c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(",").map((x) => parseFloat(x.trim()));
      return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
    };
    const blend = (fg, bg) => {
      const a = fg.a + bg.a * (1 - fg.a);
      return {
        r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
        g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
        b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
        a,
      };
    };
    const effectiveBg = (n, skipSelf = false) => {
      let acc = { r: 0, g: 0, b: 0, a: 0 };
      let node = skipSelf ? n.parentElement : n;
      while (node && node.nodeType === 1) {
        const c = parseColor(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) {
          acc = acc.a === 0 ? c : blend(acc, c);
          if (acc.a >= 0.999) break;
        }
        node = node.parentElement;
      }
      if (acc.a < 0.999) acc = blend(acc, { r: 255, g: 255, b: 255, a: 1 });
      return acc;
    };
    const lum = ({ r, g, b }) => {
      const ch = [r, g, b].map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
    };
    const ratio = (a, b) => {
      const la = lum(a), lb = lum(b);
      const [hi, lo] = la > lb ? [la, lb] : [lb, la];
      return (hi + 0.05) / (lo + 0.05);
    };
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") return null;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    const hasIconOnly = !text && !!el.querySelector("svg");
    const fg = parseColor(cs.color);
    if (!fg) return null;
    const bg = effectiveBg(el);
    const fontPx = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const isLarge = fontPx >= 24 || (fontPx >= 18.66 && weight >= 700);
    // Ícones (SVG) seguem o limiar de componentes gráficos: 3:1.
    const threshold = hasIconOnly ? 3 : isLarge ? 3 : 4.5;
    return {
      tag: el.tagName.toLowerCase(),
      label: (text || el.getAttribute("aria-label") || "(ícone)").slice(0, 60),
      ratio: ratio(fg, bg),
      threshold,
      fg: `rgb(${Math.round(fg.r)}, ${Math.round(fg.g)}, ${Math.round(fg.b)})`,
      bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
    };
  };

  const pseudoErrors = [];
  let pseudoChecked = 0;
  // Limita custo: até 30 alvos × 3 estados por viewport.
  const LIMIT = Math.min(targetCount, 30);
  for (let i = 0; i < LIMIT; i++) {
    const selector = `[data-ci-pseudo="${i}"]`;
    let nodeId;
    try {
      ({ nodeId } = await cdp.send("DOM.querySelector", {
        nodeId: cdpRoot.nodeId,
        selector,
      }));
    } catch {
      continue;
    }
    if (!nodeId) continue;
    for (const st of STATES) {
      try {
        await cdp.send("CSS.forcePseudoState", {
          nodeId,
          forcedPseudoClasses: st.forced,
        });
      } catch {
        continue;
      }
      const m = await page.evaluate(measureFn, selector).catch(() => null);
      // Limpa estado para não vazar para próxima medição.
      await cdp
        .send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] })
        .catch(() => {});
      if (!m) continue;
      pseudoChecked += 1;
      if (m.ratio + 0.01 < m.threshold) {
        pseudoErrors.push(
          `[${st.key}] <${m.tag}> "${m.label}" → ${m.ratio.toFixed(2)}:1 (mín ${m.threshold}:1) fg=${m.fg} bg=${m.bg}`,
        );
      }
    }
  }

  // Limpa marcadores
  await page.$$eval(PSEUDO_SELECTOR, (els) =>
    els.forEach((e) => e.removeAttribute("data-ci-pseudo")),
  );
  await cdp.detach().catch(() => {});

  console.log(
    `  · ${pseudoChecked} medição(ões) de :hover/:focus-visible/:active avaliada(s) em ${vp.name}.`,
  );
  if (pseudoErrors.length) {
    fail(
      `[${vp.name}] ${pseudoErrors.length}/${pseudoChecked} estado(s) pseudo reprovam no WCAG AA:\n  - ` +
        pseudoErrors.join("\n  - "),
    );
  }
  console.log(
    `✓ ${pseudoChecked} estados :hover/:focus-visible/:active passam no WCAG AA em ${vp.name}.`,
  );

  // ===========================================================
  // Validação WCAG AA do estado :disabled (texto e ícones) de
  // botões, links, badges e cards. Apesar da WCAG 2.x isentar
  // controles inativos, mantemos o piso para garantir leitura
  // do rótulo "desabilitado" pelo usuário.
  // Considera disabled real: [disabled], aria-disabled="true",
  // [data-disabled] e [data-state="disabled"].
  // ===========================================================
  const disabledReport = await page.$$eval(
    [
      "button[disabled]",
      "a[aria-disabled='true']",
      "[role='button'][aria-disabled='true']",
      "[role='link'][aria-disabled='true']",
      "[data-disabled]",
      "[data-state='disabled']",
      "button[aria-disabled='true']",
    ].join(", "),
    (els) => {
      const parseColor = (c) => {
        const m = c && c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(",").map((x) => parseFloat(x.trim()));
        return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
      };
      const blend = (fg, bg) => {
        const a = fg.a + bg.a * (1 - fg.a);
        return {
          r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
          g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
          b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
          a,
        };
      };
      const effectiveBg = (n) => {
        let acc = { r: 0, g: 0, b: 0, a: 0 };
        let node = n;
        while (node && node.nodeType === 1) {
          const c = parseColor(getComputedStyle(node).backgroundColor);
          if (c && c.a > 0) {
            acc = acc.a === 0 ? c : blend(acc, c);
            if (acc.a >= 0.999) break;
          }
          node = node.parentElement;
        }
        if (acc.a < 0.999) acc = blend(acc, { r: 255, g: 255, b: 255, a: 1 });
        return acc;
      };
      const lum = ({ r, g, b }) => {
        const ch = [r, g, b].map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
      };
      const ratio = (a, b) => {
        const la = lum(a), lb = lum(b);
        const [hi, lo] = la > lb ? [la, lb] : [lb, la];
        return (hi + 0.05) / (lo + 0.05);
      };
      const seen = new Set();
      const out = [];
      for (const el of els) {
        if (seen.has(el)) continue;
        seen.add(el);
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const text = (el.textContent || "").replace(/\s+/g, " ").trim();
        const iconOnly = !text && !!el.querySelector("svg");
        const fg = parseColor(cs.color);
        if (!fg) continue;
        // disabled normalmente reduz opacity → aplica ao fg.
        const opacity = parseFloat(cs.opacity || "1");
        const fgEff = { ...fg, a: fg.a * opacity };
        const bg = effectiveBg(el);
        const composed = blend(fgEff, bg);
        const fontPx = parseFloat(cs.fontSize);
        const weight = parseInt(cs.fontWeight, 10) || 400;
        const isLarge = fontPx >= 24 || (fontPx >= 18.66 && weight >= 700);
        const threshold = iconOnly ? 3 : isLarge ? 3 : 4.5;
        out.push({
          tag: el.tagName.toLowerCase(),
          label: (text || el.getAttribute("aria-label") || "(ícone)").slice(0, 60),
          ratio: ratio(composed, bg),
          threshold,
          fg: `rgb(${Math.round(composed.r)}, ${Math.round(composed.g)}, ${Math.round(composed.b)})`,
          bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
          opacity,
        });
      }
      return out;
    },
  );

  const disabledErrors = disabledReport.filter((r) => r.ratio + 0.01 < r.threshold);
  console.log(
    `  · ${disabledReport.length} elemento(s) :disabled avaliado(s) em ${vp.name}.`,
  );
  if (disabledErrors.length) {
    fail(
      `[${vp.name}] ${disabledErrors.length}/${disabledReport.length} elemento(s) :disabled reprovam no WCAG AA:\n  - ` +
        disabledErrors
          .map(
            (r) =>
              `<${r.tag}> "${r.label}" → ${r.ratio.toFixed(2)}:1 (mín ${r.threshold}:1, opacity ${r.opacity}) fg=${r.fg} bg=${r.bg}`,
          )
          .join("\n  - "),
    );
  }
  console.log(
    `✓ ${disabledReport.length} elemento(s) :disabled passam no WCAG AA em ${vp.name}.`,
  );

  await ctx.close();
}

try {
  for (const vp of VIEWPORTS) {
    await checkViewport(vp);
  }
  console.log(
    `\n✓ Todas as ${VIEWPORTS.length} larguras passaram nas validações de tokens de botões/links.`,
  );
} finally {
  await browser.close();
}