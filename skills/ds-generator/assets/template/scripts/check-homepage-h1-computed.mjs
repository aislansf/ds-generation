#!/usr/bin/env node
/**
 * Valida em tempo de execução, via computed style do navegador (Chromium
 * headless / Playwright), que TODOS os <h1> renderizados na Homepage
 * resolvem para a cor institucional #005EB8 — mesmo na presença de
 * regras CSS mais específicas, herança ou overrides em runtime.
 *
 * Uso:
 *   node scripts/check-homepage-h1-computed.mjs [url]
 *   CHECK_URL=http://localhost:8080 node scripts/check-homepage-h1-computed.mjs
 *
 * Sai com código 1 em divergência — pronto para o pipeline de CI.
 */
/**
 * Valida em runtime, via computed style do navegador, a cor dos
 * títulos da Homepage de acordo com o Design System:
 *
 *   <h1>  → SEMPRE #005EB8  (regra global em src/index.css)
 *   <h2>  → token --foreground (cor base do body) OU primary #005EB8
 *   <h3>  → token --foreground (cor base do body) OU primary #005EB8
 *
 * Qualquer outra cor (text-white, text-muted-foreground, text-[#...],
 * destructive, etc.) é considerada divergência do DS e falha o build.
 */
const DEFAULT_URL = "https://__DS_DOMAIN__/";
const url =
  process.argv.slice(2).find((a) => !a.startsWith("--")) ||
  process.env.CHECK_URL ||
  DEFAULT_URL;
const PRIMARY_HEX = "#005EB8";
const PRIMARY_RGB = "rgb(0, 94, 184)";

function fail(msg) {
  console.error(`✗ Homepage H1 computed-color FAIL: ${msg}`);
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  fail("Playwright não está instalado. Rode `npm i -D playwright`.");
}

// Viewports cobertos — refletem os breakpoints do Tailwind/DS:
// mobile (<sm), tablet (md) e desktop (xl). Garante consistência
// responsiva das métricas tipográficas em todas as larguras.
const VIEWPORTS = [
  { name: "mobile",  width: 375,  height: 800 },
  { name: "tablet",  width: 768,  height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

const browser = await chromium.launch({ headless: true });

async function checkViewport(vp) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  console.log(`\n▶ Viewport ${vp.name} (${vp.width}×${vp.height})`);
  console.log(`→ Verificando computed color de h1/h2/h3 em ${url}`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForSelector("h1", { timeout: 10_000 });

  // Cor base do body = token --foreground resolvido pelo tema atual.
  const FOREGROUND_RGB = await page.evaluate(
    () => getComputedStyle(document.body).color,
  );

  const allowedByTag = {
    h1: new Set([PRIMARY_RGB]),
    h2: new Set([FOREGROUND_RGB, PRIMARY_RGB]),
    h3: new Set([FOREGROUND_RGB, PRIMARY_RGB]),
  };

  const errors = [];
  let total = 0;

  for (const tag of ["h1", "h2", "h3"]) {
    const items = await page.$$eval(tag, (els) =>
      els.map((el) => ({
        text: (el.textContent || "").trim().slice(0, 80),
        color: getComputedStyle(el).color,
      })),
    );
    if (tag === "h1" && items.length === 0) {
      fail("nenhum <h1> encontrado na Homepage.");
    }
    total += items.length;
    const allowed = allowedByTag[tag];
    for (const it of items) {
      if (!allowed.has(it.color)) {
        errors.push(
          `<${tag}> "${it.text}" → ${it.color} (permitido: ${[...allowed].join(" ou ")})`,
        );
      }
    }
    console.log(
      `  · ${items.length} <${tag}> verificado(s) — permitido: ${[...allowed].join(" | ")}`,
    );
  }

  if (errors.length) {
    fail(
      `[${vp.name}] ${errors.length}/${total} título(s) divergem do DS:\n  - ` +
        errors.join("\n  - "),
    );
  }

  console.log(
    `✓ ${total} título(s) (h1+h2+h3) renderizam com tokens do DS (primary=${PRIMARY_HEX}, foreground=${FOREGROUND_RGB}).`,
  );

  // ===========================================================
  // Validação adicional: métricas tipográficas (font-size,
  // font-weight, line-height, letter-spacing) versus tokens do DS.
  // Os valores esperados são lidos diretamente do :root via
  // getComputedStyle — fonte única da verdade definida em
  // src/index.css. Assim, qualquer alteração nos tokens é refletida
  // automaticamente nesta validação.
  // ===========================================================
  const tokens = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;letter-spacing:normal";
    document.body.appendChild(probe);
    const normalLS = getComputedStyle(probe).letterSpacing;
    document.body.removeChild(probe);
    const root = getComputedStyle(document.documentElement);
    const num = (v) => parseFloat(v);
    // Converte rem → px usando o font-size do <html>.
    const rootFs = num(getComputedStyle(document.documentElement).fontSize);
    const remToPx = (v) => {
      const s = v.trim();
      if (s.endsWith("rem")) return num(s) * rootFs;
      if (s.endsWith("px")) return num(s);
      return num(s);
    };
    return {
      section: {
        fontSize: remToPx(root.getPropertyValue("--ds-heading-section-font-size")),
        lineHeight: remToPx(root.getPropertyValue("--ds-heading-section-line-height")),
        fontWeight: root.getPropertyValue("--ds-heading-section-font-weight").trim(),
      },
      normalLetterSpacing: normalLS,
    };
  });

  // Tolerância de 0.5px para arredondamento de sub-pixels.
  const approx = (a, b, tol = 0.5) => Math.abs(parseFloat(a) - parseFloat(b)) <= tol;

  const metricsErrors = [];
  let metricsTotal = 0;

  // h2 / h3 → devem casar com os tokens de seção (regras globais em @layer base).
  for (const tag of ["h2", "h3"]) {
    const items = await page.$$eval(tag, (els) =>
      els.map((el) => {
        const cs = getComputedStyle(el);
        return {
          text: (el.textContent || "").trim().slice(0, 80),
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          fontWeight: cs.fontWeight,
          letterSpacing: cs.letterSpacing,
          fontFamily: cs.fontFamily,
        };
      }),
    );
    metricsTotal += items.length;
    for (const it of items) {
      const issues = [];
      if (!approx(it.fontSize, tokens.section.fontSize))
        issues.push(`font-size=${it.fontSize} (esperado ${tokens.section.fontSize}px)`);
      if (!approx(it.lineHeight, tokens.section.lineHeight))
        issues.push(`line-height=${it.lineHeight} (esperado ${tokens.section.lineHeight}px)`);
      if (String(it.fontWeight) !== String(tokens.section.fontWeight))
        issues.push(`font-weight=${it.fontWeight} (esperado ${tokens.section.fontWeight})`);
      if (it.letterSpacing !== tokens.normalLetterSpacing)
        issues.push(`letter-spacing=${it.letterSpacing} (esperado ${tokens.normalLetterSpacing})`);
      if (!/poppins/i.test(it.fontFamily))
        issues.push(`font-family=${it.fontFamily} (esperado Poppins)`);
      if (issues.length) {
        metricsErrors.push(`<${tag}> "${it.text}" → ${issues.join("; ")}`);
      }
    }
    console.log(
      `  · ${items.length} <${tag}> métricas vs tokens DS (${tokens.section.fontSize}px / ${tokens.section.lineHeight}px / ${tokens.section.fontWeight}).`,
    );
  }

  // h1 → não há token global de tamanho (PageHeader define escala
  // responsiva). Validamos invariantes do DS: Poppins, peso ≥ 600,
  // letter-spacing normal e fonte estritamente maior que h2.
  const h1Items = await page.$$eval("h1", (els) =>
    els.map((el) => {
      const cs = getComputedStyle(el);
      return {
        text: (el.textContent || "").trim().slice(0, 80),
        fontSize: parseFloat(cs.fontSize),
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        fontFamily: cs.fontFamily,
      };
    }),
  );
  metricsTotal += h1Items.length;
  for (const it of h1Items) {
    const issues = [];
    if (!/poppins/i.test(it.fontFamily))
      issues.push(`font-family=${it.fontFamily} (esperado Poppins)`);
    if (parseInt(it.fontWeight, 10) < 600)
      issues.push(`font-weight=${it.fontWeight} (esperado ≥ 600)`);
    if (it.fontSize <= tokens.section.fontSize)
      issues.push(`font-size=${it.fontSize}px (esperado > h2 = ${tokens.section.fontSize}px)`);
    if (it.lineHeight === "normal")
      issues.push(`line-height=normal (esperado valor explícito do DS)`);
    if (it.letterSpacing !== tokens.normalLetterSpacing)
      issues.push(`letter-spacing=${it.letterSpacing} (esperado ${tokens.normalLetterSpacing})`);
    if (issues.length) {
      metricsErrors.push(`<h1> "${it.text}" → ${issues.join("; ")}`);
    }
  }
  console.log(`  · ${h1Items.length} <h1> métricas vs invariantes do DS.`);

  if (metricsErrors.length) {
    fail(
      `[${vp.name}] ${metricsErrors.length}/${metricsTotal} título(s) divergem das métricas do DS:\n  - ` +
        metricsErrors.join("\n  - "),
    );
  }

  console.log(
    `✓ ${metricsTotal} título(s) (h1+h2+h3) também respeitam font-size, font-weight, line-height e letter-spacing dos tokens do DS.`,
  );

  // ===========================================================
  // Validação WCAG: contraste do texto dos headings vs. o
  // background real renderizado (caminhando pelos ancestrais até
  // encontrar uma cor opaca). Limiares oficiais WCAG 2.1:
  //   - AA Normal: ≥ 4.5 : 1
  //   - AA Large : ≥ 3.0 : 1  (≥ 24px, ou ≥ 18.66px se bold)
  // ===========================================================
  const contrastReport = await page.$$eval("h1, h2, h3", (els) => {
    const parseColor = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
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
    const effectiveBg = (el) => {
      let acc = { r: 0, g: 0, b: 0, a: 0 };
      let node = el;
      while (node && node.nodeType === 1) {
        const c = parseColor(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) {
          acc = acc.a === 0 ? c : blend(acc, c);
          if (acc.a >= 0.999) break;
        }
        node = node.parentElement;
      }
      if (acc.a < 0.999) {
        // Fallback: branco (default do canvas do navegador).
        acc = blend(acc, { r: 255, g: 255, b: 255, a: 1 });
      }
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
    return els.map((el) => {
      const cs = getComputedStyle(el);
      const fg = parseColor(cs.color);
      const bg = effectiveBg(el);
      const fontPx = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const isLarge = fontPx >= 24 || (fontPx >= 18.66 && weight >= 700);
      return {
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || "").trim().slice(0, 80),
        fg: `rgb(${Math.round(fg.r)}, ${Math.round(fg.g)}, ${Math.round(fg.b)})`,
        bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        ratio: ratio(fg, bg),
        threshold: isLarge ? 3 : 4.5,
        scale: isLarge ? "large" : "normal",
      };
    });
  });

  const contrastErrors = contrastReport.filter((r) => r.ratio + 0.01 < r.threshold);
  for (const r of contrastReport) {
    console.log(
      `  · <${r.tag}> "${r.text}" — ${r.ratio.toFixed(2)}:1 (${r.scale}, mín ${r.threshold}:1) fg=${r.fg} bg=${r.bg}`,
    );
  }
  if (contrastErrors.length) {
    fail(
      `[${vp.name}] ${contrastErrors.length}/${contrastReport.length} título(s) reprovam no WCAG AA:\n  - ` +
        contrastErrors
          .map(
            (r) =>
              `<${r.tag}> "${r.text}" → ${r.ratio.toFixed(2)}:1 (mín ${r.threshold}:1, ${r.scale}) fg=${r.fg} bg=${r.bg}`,
          )
          .join("\n  - "),
    );
  }
  console.log(
    `✓ ${contrastReport.length} título(s) (h1+h2+h3) passam no contraste WCAG AA contra o background real.`,
  );
  await ctx.close();
}

try {
  for (const vp of VIEWPORTS) {
    await checkViewport(vp);
  }
  console.log(
    `\n✓ Todas as ${VIEWPORTS.length} larguras (${VIEWPORTS.map((v) => v.name).join(", ")}) passaram nas validações tipográficas do DS.`,
  );
} finally {
  await browser.close();
}