# Design System __BRAND_NAME__

Site de documentação e biblioteca de UI do Design System __BRAND_SHORT__, gerado pelo `ds-build` a partir do DS de referência.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS com tokens em CSS custom properties (`src/index.css`)
- shadcn/ui (Radix) em `src/components/ui/`
- Vitest (tokens e regressões) e Playwright (smoke da URL pública)

## Rodando

```bash
npm install --legacy-peer-deps
npm run dev          # http://localhost:8080
npm run build        # typecheck + validadores de marca + build
npm run test         # validador de tokens e regressões
```

## Onde mexer

| O quê | Arquivo |
|---|---|
| Cores, espaçamento, tipografia, sombras, raios | `src/index.css` (`:root` e `.dark`) |
| Mapeamento dos tokens para utilitários Tailwind | `tailwind.config.ts` |
| Catálogo exibido em `/tokens` (validado contra o CSS) | `src/data/tokenGroups.ts` |
| Logos | `public/marca/` + `src/assets/marca/*.asset.json` |
| Menu lateral do site | `src/components/DSLayout.tsx` |
| Páginas de documentação | `src/pages/` |
| Marcas proibidas (quebra o build se aparecerem) | `scripts/legacy-brand.config.json` |

## Regras

- Nunca use cor fixa (`#hex`) em componente novo: use os tokens (`bg-primary`, `text-foreground`, `bg-brand-primary-50`…).
- Ao mudar um valor em `src/index.css`, atualize o espelho em `src/data/tokenGroups.ts` — `npm run test:tokens` acusa divergências.
- Parágrafos usam `.ds-body`, `.ds-body-lead` ou `.ds-body-small` (verificado por `npm run check:legacy-typography`).
