# Reescrita semântica

O gerador troca nomes, cores e fontes, mas não sabe o que o texto **diz**. Estes pontos têm texto genérico do template e precisam ser reescritos com base no briefing (`conteudo.*`) e no manual da nova marca. Trabalhe arquivo por arquivo e rode `npm run build` no fim.

Os trechos genéricos mais importantes estão marcados no código com o comentário `MODELO:` e listados no `GERACAO.md` (seção 6). Reescreva cada um e apague o comentário: o DS só está pronto quando `grep -rn "MODELO:" src` voltar vazio.

Se o briefing não tiver a informação (ex.: área de proteção do logo), **pergunte ao usuário**. Não invente regras de marca.

## Prioridade alta: descrevem a identidade

| Arquivo | O que reescrever |
|---|---|
| `src/pages/MarcaPage.tsx` | Página-modelo com valores de referência de mercado e um aviso "Valores de referência" no topo. Troque área de proteção, tamanhos mínimos, aplicação sobre fundos e regras de coassinatura pelo que está em `conteudo.regras_de_marca` e no manual, acrescente elementos próprios da marca (grafismos, assinaturas compostas, Pantone) e remova o aviso |
| `src/components/ColorSection.tsx` | A família primária tem nomes neutros ("Primária Profunda/Escura/Intensa/Vibrante/Clara") e já sai correta. A paleta estendida tem nomes descritivos de referência ("Verde Menta", "Amarelo Claro", "Coral", "Roxo Lavanda"…) com Pantones aproximados, e a escala ainda usa tokens `blue-50…950`. Os HEX já foram recoloridos (a "cor primária" e o 400 da escala saem exatamente com `cores.primaria`), mas nomes e textos não. Use `conteudo.paleta_estendida`; se não houver, nomeie pelos tons gerados e remova os Pantones |
| `src/pages/FundamentosPage.tsx` | Seção de tipografia: origem, licença, links e carregamento de cada fonte já seguem o briefing; reescreva resumo, "use para/evite" e a orientação de Power BI de cada fonte; o bloco "paleta de referência" (imagem placeholder até a marca ter a sua); a iconografia cita `<domínio do portal>/conta`, então confirme se faz sentido |
| `src/pages/HomePage.tsx` | Seção-modelo "Voz da marca": personalidade, 4 pilares de tom de voz (somos/não somos) e diretrizes gerais genéricas. Reescreva com `conteudo.tom_de_voz`, `conteudo.publico` e o manual; revise também princípios e frase do hero |
| `src/pages/ConteudoPage.tsx` | Tom de voz e exemplos de "faça/evite", a partir de `conteudo.tom_de_voz` e `conteudo.publico` |

## Prioridade média: dados de exemplo

O `GERACAO.md` lista em "Conteúdo de exemplo genérico" onde aparecem os programas e unidades fictícios do template (Empreender, AGI, Programa Inova, DIROP, DIAFI…). Troque por exemplos plausíveis do universo da nova marca, mantendo tamanho e estrutura (o layout foi desenhado para aqueles comprimentos). Arquivos típicos: `ComponentesPage`, `TelaListagemPage`, `TelaFormularioPage`, `PaginaFiltrosTabelaPage`, `DashboardInstitucionalPage`, `DashboardBIPage`, `SidebarMenuPreview`, `HubPaineisTemplate`, `ChartsSection`, `data/radarEstrategico.ts`.

## Prioridade média: metadados

- `index.html`: `<title>`, description, JSON-LD (`name`, `alternateName`, `url`, `logo`), `og:image`, `twitter:site` (hoje `@Lovable`).
- `public/llms.txt`, `public/sitemap.xml`, `public/robots.txt`: domínio e descrições.
- `README.md`: acrescente contatos e o processo de contribuição da nova marca.

## Imagens

- Miniaturas da página Templates (`src/assets/thumb-*.jpg`) são capturas do template com a marca neutra "Sua Marca". Recapture com o DS novo rodando (Playwright, 1280×800) e sobrescreva mantendo o nome.
- Fotos e ilustrações (`brand-empreendedora.jpg`, `empreendedora-brand.jpg`, `exemplo-imagem-login*.jpg`, `hub-thumb-*.jpg`) são genéricas, sem marca. Pergunte ao usuário se a marca tem fotos próprias para o login e o cadastro.
- `marca-parceiro.png` é um selo genérico de "marca parceira" (headers com assinatura de parceiro). Troque pela marca parceira real ou remova se não se aplicar.
- Placeholders em `public/placeholders/` devem virar imagens reais quando o usuário tiver.

## Verificação final

```bash
npm run build && npx vitest run
grep -rniE "<termos_proibidos do briefing>" src public index.html   # deve voltar vazio
```

Depois, revise visualmente `/marca` e `/fundamentos#cores` em light e dark.
