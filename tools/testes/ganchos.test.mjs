// Testes do codemod de ganchos (tools/lib/ganchos.mjs), R1 do plano de estilos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { elementosJsx, classesDe, classificar, ganchosNoArquivo, varianteBotao } from "../lib/ganchos.mjs";

const tags = (src) => elementosJsx(src).map((e) => e.tag);

// ---------- Lexer ----------

test("o lexer acha só JSX de verdade: strings, template literals, comentários e regex ficam de fora", () => {
  const src = `
const exemplo = \`<button className="bg-primary">Código de exemplo</button>\`;
const outro = "<input />";
// <button>comentário</button>
/* <div className="bg-card border rounded-lg" /> */
const re = /<button>/g;
export function A() {
  return <div><button className="bg-primary">Real</button></div>;
}`;
  assert.deepEqual(tags(src), ["div", "button"]);
});

test("texto JSX com apóstrofo e aspas não abre string", () => {
  const src = `const A = () => (<p>Don't "quote" it <button className="border bg-background">ok</button></p>);`;
  assert.deepEqual(tags(src), ["p", "button"]);
});

test("generics do TypeScript não viram JSX; JSX depois de ?, :, && e => sim", () => {
  const src = `
const [t, setT] = useState<Theme>("light");
const x: Array<string> = [];
const A = () => cond ? <span /> : <em />;
const B = () => ok && <b />;
const C = items.map((i) => <li key={i} />);`;
  assert.deepEqual(tags(src), ["span", "em", "b", "li"]);
});

test("atributos: string, expressão com chaves aninhadas e booleano; filhos dentro de {expressão}", () => {
  const [el, ...resto] = elementosJsx(`<button type="button" className={cn("a", { b: true })} disabled>{list.map((x) => <i key={x} />)}</button>`);
  assert.equal(el.attrs.get("type").texto, "button");
  assert.equal(el.attrs.get("className").tipo, "expr");
  assert.equal(el.attrs.get("disabled").tipo, "bool");
  assert.deepEqual(resto.map((e) => e.tag), ["i"]);
});

// ---------- Classes ----------

test("classesDe separa classes fixas e condicionais", () => {
  assert.deepEqual(classesDe({ tipo: "string", texto: "px-4  bg-primary" }).fixas, ["px-4", "bg-primary"]);
  const cn = classesDe({ tipo: "expr", texto: `cn("px-4 border", ativo ? "bg-primary" : "bg-muted")` });
  assert.deepEqual(cn.fixas, ["px-4", "border"]);
  assert.deepEqual(cn.condicionais, ["bg-primary", "bg-muted"]);
  const tpl = classesDe({ tipo: "expr", texto: "`px-4 rounded ${ativo ? \"bg-primary\" : \"\"}`" });
  assert.deepEqual(tpl.fixas, ["px-4", "rounded"]);
  assert.deepEqual(tpl.condicionais, ["bg-primary"]);
});

// ---------- Regras ----------

test("variantes de botão pelo padrão de classes", () => {
  const v = (s) => varianteBotao(s.split(" "));
  assert.equal(v("px-4 py-2 rounded bg-primary text-primary-foreground"), "default");
  assert.equal(v("bg-[#2A4FDA] text-white"), "default");
  assert.equal(v("bg-secondary text-secondary-foreground"), "secondary");
  assert.equal(v("bg-primary/10 text-primary"), "secondary");
  assert.equal(v("bg-destructive text-white"), "destructive");
  assert.equal(v("border border-border bg-background hover:bg-muted"), "outline");
  assert.equal(v("border border-primary bg-transparent text-primary"), "outline");
  assert.equal(v("p-1.5 rounded hover:bg-muted"), "ghost");
  assert.equal(v("text-xs text-primary hover:underline"), "link");
  // Sobre superfície de marca (hover em branco): não é o ghost do DS
  assert.equal(v("p-1.5 rounded hover:bg-white/10"), null);
  assert.equal(v("px-4 py-2 rounded font-bold"), null);
});

const um = (src) => classificar(elementosJsx(src)[0], src);

test("campos: input, textarea e select casam; checkbox, hidden e campo interno sem borda não", () => {
  assert.deepEqual(um(`<input className="h-10 border border-input rounded-md px-3" />`), { ds: "input" });
  assert.deepEqual(um(`<textarea className="border rounded" />`), { ds: "textarea" });
  assert.deepEqual(um(`<select className="border rounded" />`), { ds: "select-trigger" });
  assert.equal(um(`<input type="checkbox" className="w-4 h-4" />`), null);
  assert.equal(um(`<input className="sr-only" />`), null);
  assert.equal(um(`<input className="flex-1 bg-transparent px-3 focus:outline-none" />`).revisar, "campo sem borda própria (dentro de um contêiner)");
  assert.equal(um(`<input type={show ? "text" : "password"} className="border rounded" />`).revisar, "type dinâmico");
});

test("cards: bg-card com borda e raio; botão-card com padding; superfície sem borda fica de fora", () => {
  assert.deepEqual(um(`<div className="bg-card rounded-lg border border-border p-4" />`), { ds: "card" });
  assert.deepEqual(um(`<Link to="/x" className="rounded-xl border bg-card p-6 hover:shadow-md" />`), { ds: "card" });
  assert.deepEqual(um(`<button className="rounded-xl border bg-card p-6 text-left" />`), { ds: "card" });
  assert.equal(um(`<div className="bg-card p-4" />`), null);
  assert.equal(um(`<div className={cn("p-4", ativo && "bg-card border rounded")} />`).revisar, "bg-card com borda ou raio condicional");
});

test("botão com fundo ou borda condicional vai para a revisão, não para um chute", () => {
  assert.equal(um(`<button className={cn("px-3 py-1 rounded", ativo ? "bg-primary text-white" : "bg-muted")} />`).revisar, "fundo ou borda condicional");
  assert.deepEqual(um(`<button className={cn("px-3 py-1 rounded bg-primary", ativo && "font-bold")} />`), { ds: "button", variante: "default" });
});

test("elemento que já tem data-ds fica como está", () => {
  assert.equal(um(`<button data-ds="button" className="bg-primary" />`), null);
});

// ---------- Tabela de variantes ----------

const VITRINE = `
export function Vitrine() {
  return (
    <div>
      {[
        { name: "Padrão", base: "bg-primary text-primary-foreground" },
        { name: "Contorno", base: "border border-primary bg-transparent text-primary" },
      ].map((v) => (
        <button key={v.name} className={\`px-4 py-2 rounded \${v.base}\`}>{v.name}</button>
      ))}
      {[
        { name: "Azul", base: "bg-[#2A4FDA] text-white" },
        { name: "Verde", base: "bg-[#1F8A4C] text-white" },
      ].map((v) => (
        <button key={v.name} className={\`px-4 py-2 rounded \${v.base}\`}>{v.name}</button>
      ))}
    </div>
  );
}`;

test("vitrine montada por tabela: variante fixa quando as linhas concordam, por valor quando diferem", () => {
  const { texto, casou } = ganchosNoArquivo(VITRINE);
  assert.equal(casou.length, 2);
  assert.match(texto, /<button data-ds="button" data-variant=\{\(\{ "bg-primary text-primary-foreground": "default", "border border-primary bg-transparent text-primary": "outline" \} as Record<string, string>\)\[v\.base\]\} key=\{v\.name\}/);
  assert.match(texto, /<button data-ds="button" data-variant="default" key=\{v\.name\}/);
});

// ---------- Arquivo ----------

test("ganchosNoArquivo é idempotente e não toca em código de exemplo", () => {
  const src = `
const codigo = \`<button className="bg-primary">x</button>\`;
export const A = () => (
  <section>
    <button className="bg-primary text-primary-foreground px-4">Salvar</button>
    <button className="border border-border bg-background px-4">Cancelar</button>
    <input className="border border-input rounded px-3" />
    <div className="bg-card border border-border rounded-lg p-4">card</div>
    <button className="px-2">?</button>
  </section>
);`;
  const a = ganchosNoArquivo(src);
  assert.deepEqual(a.casou.map((c) => `${c.ds}/${c.variante}`), ["button/default", "button/outline", "input/null", "card/null"]);
  assert.equal(a.revisar.length, 1);
  assert.match(a.texto, /const codigo = `<button className="bg-primary">x<\/button>`;/);
  assert.match(a.texto, /<button data-ds="button" data-variant="default" className="bg-primary/);
  const b = ganchosNoArquivo(a.texto);
  assert.equal(b.texto, a.texto);
  assert.equal(b.casou.length, 0);
});
