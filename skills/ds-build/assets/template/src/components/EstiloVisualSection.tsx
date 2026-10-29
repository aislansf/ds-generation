import { useEffect, useState } from "react";
import { ESTILO } from "@/config/estilo";
import { SectionHeader } from "@/components/DSComponents";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * Seção "Estilo visual" de /fundamentos (gerada pelo ds-build).
 *
 * Mostra o estilo escolhido na geração: o que ele muda, os valores dos tokens de pele em vigor, o que o gerador
 * ajustou para manter o contraste e os outros estilos do catálogo. O resumo vem de public/design-system/estilo.json,
 * gravado pelo gerador. Só existe nos estilos diferentes do corporativo, que é o visual de referência do DS.
 */

type ItemCatalogo = { id: string; nome: string; grupo: string; nivel: number; descricao: string };

type ResumoEstilo = {
  id: string;
  nome: string;
  nivel: number;
  grupo?: string;
  descricao?: string;
  tema_padrao: string;
  layout: string;
  tokens_alterados: Record<string, number>;
  camada_css: boolean;
  decoracao: { arquivos: string[]; bytes: number } | null;
  degrade: boolean;
  ajustes_contraste: string[];
  avisos: string[];
  faca?: string[];
  evite?: string[];
  fontes_sugeridas?: Record<string, string[]>;
  catalogo?: ItemCatalogo[];
};

const GRUPOS: Record<string, string> = {
  limpos: "Limpos e funcionais",
  ousados: "Ousados",
  epocas: "Inspirados em épocas",
  digitais: "Digitais e de interface",
  organicos: "Orgânicos e artesanais",
};

const NIVEIS: Record<number, string> = {
  0: "padrão",
  1: "tokens de pele",
  2: "tokens e camada CSS",
  3: "tokens, camada CSS e decoração",
  4: "tokens, camada CSS e layout bento",
};

/** Tokens de pele mostrados com o valor que valem agora (no tema ativo). */
const TOKENS_AO_VIVO = [
  "--radius-card",
  "--radius-control",
  "--border-width",
  "--card-border-width",
  "--shadow-ui-md",
  "--font-semibold",
  "--font-bold",
  "--icon-stroke",
  "--duration-normal",
  "--heading-transform",
  "--card-alpha",
  "--surface-blur",
];

function lerTokens(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const cs = getComputedStyle(document.documentElement);
  return Object.fromEntries(TOKENS_AO_VIVO.map((t) => [t, cs.getPropertyValue(t).trim()]));
}

function Lista({ itens, vazio }: { itens: string[]; vazio: string }) {
  if (!itens.length) return <p className="text-sm text-muted-foreground">{vazio}</p>;
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm">
      {itens.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export default function EstiloVisualSection() {
  const [resumo, setResumo] = useState<ResumoEstilo | null>(null);
  const [tokens, setTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    let vivo = true;
    fetch(`${import.meta.env.BASE_URL}design-system/estilo.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => vivo && setResumo(j))
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  // Os valores dos tokens podem mudar com o tema (--border e sombras têm versão escura): relê quando a classe muda
  useEffect(() => {
    setTokens(lerTokens());
    if (typeof MutationObserver === "undefined") return;
    const obs = new MutationObserver(() => setTokens(lerTokens()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  if ((ESTILO.id as string) === "corporativo") return null;

  const camadas = [
    "tokens de pele",
    resumo?.camada_css && "camada CSS",
    resumo?.decoracao && "decoração gerada",
    (ESTILO.layout as string) === "bento" && "layout bento",
  ].filter(Boolean);
  const catalogo = resumo?.catalogo ?? [];

  return (
    <div data-estilo-visual>
      <SectionHeader
        id="estilo"
        title="Estilo visual"
        description={`Este Design System segue o estilo ${ESTILO.nome}. A marca define cor, fonte, logo e voz; o estilo define forma, profundidade, peso e ritmo.`}
      />

      {resumo?.descricao && <p className="mb-6 max-w-3xl text-sm text-muted-foreground">{resumo.descricao}</p>}

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Estilo</dt>
              <dd>
                {ESTILO.nome} <code className="text-xs text-muted-foreground">{ESTILO.id}</code>
              </dd>
              {resumo?.grupo && (
                <>
                  <dt className="text-muted-foreground">Grupo</dt>
                  <dd>{GRUPOS[resumo.grupo] ?? resumo.grupo}</dd>
                </>
              )}
              <dt className="text-muted-foreground">Camadas</dt>
              <dd>{camadas.join(" · ")}</dd>
              <dt className="text-muted-foreground">Abre em</dt>
              <dd>{(ESTILO.temaPadrao as string) === "dark" ? "tema escuro" : "tema claro"}</dd>
              {resumo && (
                <>
                  <dt className="text-muted-foreground">Tokens alterados</dt>
                  <dd>
                    {resumo.tokens_alterados[":root"] ?? 0} no tema claro, {resumo.tokens_alterados[".dark"] ?? 0} no escuro
                  </dd>
                  <dt className="text-muted-foreground">Header</dt>
                  <dd>{resumo.degrade ? "com degradê" : "cor sólida"}</dd>
                  {resumo.decoracao && (
                    <>
                      <dt className="text-muted-foreground">Decoração</dt>
                      <dd>
                        {resumo.decoracao.arquivos.length} arquivo(s), {(resumo.decoracao.bytes / 1024).toFixed(1)} KB, só em superfícies de marca
                      </dd>
                    </>
                  )}
                </>
              )}
              {resumo?.fontes_sugeridas?.primaria && (
                <>
                  <dt className="text-muted-foreground">Fontes sugeridas</dt>
                  <dd>{resumo.fontes_sugeridas.primaria.join(", ")}</dd>
                </>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Neste estilo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primário</Button>
              <Button variant="outline">Contorno</Button>
              <Button variant="ghost">Fantasma</Button>
              <Badge>Badge</Badge>
              <Badge variant="secondary">Secundário</Badge>
            </div>
            <Input placeholder="Campo de texto" aria-label="Exemplo de campo de texto" />
            <div className="grid grid-cols-3 gap-3">
              {["--shadow-ui-sm", "--shadow-ui-md", "--shadow-ui-lg"].map((s) => (
                <div
                  key={s}
                  data-ds="card"
                  className="rounded-[var(--radius-card)] border-[length:var(--card-border-width)] bg-card p-4 text-center text-xs text-muted-foreground"
                  style={{ boxShadow: `var(${s})` }}
                >
                  {s.replace("--shadow-ui-", "")}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Faça</CardTitle>
          </CardHeader>
          <CardContent>
            <Lista itens={resumo?.faca ?? []} vazio="O resumo do estilo não está disponível." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evite</CardTitle>
          </CardHeader>
          <CardContent>
            <Lista itens={resumo?.evite ?? []} vazio="O resumo do estilo não está disponível." />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Tokens de pele em vigor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Token</th>
                  <th className="py-2 font-medium">Valor agora</th>
                </tr>
              </thead>
              <tbody>
                {TOKENS_AO_VIVO.map((t) => (
                  <tr key={t} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs">{t}</td>
                    <td className="py-2 font-mono text-xs text-muted-foreground">{tokens[t] || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Lista completa no grupo “Estilo visual” da página de tokens. Os valores mudam com o tema claro e escuro.
          </p>
        </CardContent>
      </Card>

      {resumo && (resumo.ajustes_contraste.length > 0 || resumo.avisos.length > 0) && (
        <div className="mb-6 space-y-4">
          {resumo.ajustes_contraste.length > 0 && (
            <Alert>
              <AlertTitle>Ajustes de contraste do estilo</AlertTitle>
              <AlertDescription>
                <p className="mb-2">O gerador ajustou estes tokens do estilo para manter o contraste mínimo (4.5:1 em texto, 3:1 em bordas de campo e foco).</p>
                <Lista itens={resumo.ajustes_contraste} vazio="" />
              </AlertDescription>
            </Alert>
          )}
          {resumo.avisos.length > 0 && (
            <Alert variant="destructive">
              <AlertTitle>Avisos do estilo</AlertTitle>
              <AlertDescription>
                <Lista itens={resumo.avisos} vazio="" />
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {catalogo.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Outros estilos do catálogo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              O DS leva só o estilo escolhido na geração. Para outro estilo, gere o DS de novo com o ds-build (
              <code className="text-xs">--estilo &lt;id&gt;</code>); o resto do DS (cores, fontes, textos) continua o da marca.
            </p>
            <div className="space-y-5">
              {Object.entries(GRUPOS).map(([grupo, titulo]) => {
                const itens = catalogo.filter((c) => c.grupo === grupo);
                if (!itens.length) return null;
                return (
                  <div key={grupo}>
                    <h4 className="mb-2 text-sm font-semibold">{titulo}</h4>
                    <ul className="divide-y divide-border rounded-md border border-border">
                      {itens.map((c) => (
                        <li key={c.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 py-2 text-sm" aria-current={c.id === ESTILO.id ? "true" : undefined}>
                          <span className="min-w-[10rem] font-medium">{c.nome}</span>
                          <code className="text-xs text-muted-foreground">{c.id}</code>
                          {c.id === ESTILO.id && <Badge>em uso</Badge>}
                          <span className="basis-full text-muted-foreground sm:basis-auto sm:flex-1">{c.descricao}</span>
                          <span className="text-xs text-muted-foreground">{NIVEIS[c.nivel] ?? ""}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
