# Reescrita semântica

O gerador troca nomes, cores e fontes, mas não sabe o que o texto **diz**. Estes pontos descrevem a marca de origem e precisam ser reescritos com base no briefing (`conteudo.*`) e no manual da nova marca. Trabalhe arquivo por arquivo e rode `npm run build` no fim.

Se o briefing não tiver a informação (ex.: área de proteção do logo), **pergunte ao usuário** ou marque visivelmente como "a definir". Não invente regras de marca.

## Prioridade alta: descrevem a identidade

| Arquivo | O que reescrever |
|---|---|
| `src/pages/MarcaPage.tsx` | Downloads de logo (rótulos), área de proteção, tamanhos mínimos (tabela impressão/digital), fundos permitidos, usos incorretos, Pantones, link do manual. Tudo vem de `conteudo.regras_de_marca` e do manual |
| `src/components/ColorSection.tsx` | Paletas com nomes da origem: "Azul Profundo/Marinho/Cobalto/Royal/Céu", escala "Azul céu brasileiro" 50–950, paleta estendida ("Verde Tropical", "Amarelo Sol", "Coral Carnaval", "Roxo Festival"…) com Pantones. Os HEX já foram recoloridos, mas nomes e textos não. Use `conteudo.paleta_estendida`; se não houver, nomeie pelos tons gerados e remova os Pantones |
| `src/pages/FundamentosPage.tsx` | Seção de tipografia (origem de cada fonte, licença, onde é usada); o bloco "paleta de referência Brasil"; a iconografia cita `sebrae.com.br/conta` (virou `__ORG_ROOT_DOMAIN__/conta`), então confirme se faz sentido |
| `src/pages/HomePage.tsx` | Bloco "Brandbook · Março 2026 — Expressões Verbais", princípios, frase do hero |
| `src/pages/ConteudoPage.tsx` | Tom de voz e exemplos de "faça/evite", a partir de `conteudo.tom_de_voz` e `conteudo.publico` |

## Prioridade média: dados de exemplo

O `GERACAO.md` lista em "Conteúdo de exemplo da marca de origem" onde aparecem programas e diretorias da origem (Empretec, ALI, Brasil Mais, DIRAE, DIFIN…). Troque por exemplos plausíveis do universo da nova marca, mantendo tamanho e estrutura (o layout foi desenhado para aqueles comprimentos). Arquivos típicos: `ComponentesPage`, `TelaListagemPage`, `TelaFormularioPage`, `PaginaFiltrosTabelaPage`, `DashboardInstitucionalPage`, `DashboardBIPage`, `SidebarMenuPreview`, `HubPaineisTemplate`, `ChartsSection`, `data/farolEstrategico.ts`.

## Prioridade média: metadados

- `index.html`: `<title>`, description, JSON-LD (`name`, `alternateName`, `url`, `logo`), `og:image`, `twitter:site` (hoje `@Lovable`).
- `public/llms.txt`, `public/sitemap.xml`, `public/robots.txt`: domínio e descrições.
- `README.md`: acrescente contatos e o processo de contribuição da nova marca.

## Imagens

- Miniaturas da página Templates (`src/assets/thumb-*.jpg`) são capturas do DS de origem. Recapture com o DS novo rodando (Playwright, 1440×900) e sobrescreva mantendo o nome.
- Fotos (`brand-empreendedora.jpg`, `exemplo-imagem-login*.jpg`, `hub-thumb-*.jpg`) podem ficar se forem neutras. Confirme com o usuário.
- `marca-gov.png` é a assinatura do governo, herdada de uma marca anterior. Remova se não se aplicar.
- Placeholders em `public/placeholders/` devem virar imagens reais quando o usuário tiver.

## Verificação final

```bash
npm run build && npx vitest run
grep -rniE "<termos da origem>" src public index.html   # deve voltar vazio
```

Depois, revise visualmente `/marca` e `/fundamentos#cores` em light e dark.
