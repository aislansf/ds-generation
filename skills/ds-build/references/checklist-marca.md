# Checklist de entrega do DS

Marque cada item antes de dizer ao usuário que o DS está pronto. Os que não puderem ser cumpridos vão na mensagem final como pendência.

## Build e testes
- [ ] `npm run build` passa (typecheck, marcas proibidas, tipografia legada, H1, vite)
- [ ] `npx vitest run` passa (validador de tokens, sidebar, headers, FontFamilyCard)
- [ ] `GERACAO.md` sem marcas proibidas nem placeholders não resolvidos

## Cor e contraste
- [ ] `validar-contraste.mjs src/index.css`: nenhum par piorou em relação ao template (os pares que já ficam abaixo de AA no template aparecem em qualquer marca)
- [ ] Texto sobre a primária legível: botão primário, botão institucional (`variant="brand"`), sidebar, header
- [ ] Dark mode revisado em `/`, `/componentes` e `/templates`
- [ ] Nenhum tom "fora da família" visível (ilustrações, gráficos, badges)

## Marca
- [ ] Logos oficiais (não o provisório tipográfico) em cor, branco e preto
- [ ] Favicon oficial
- [ ] Página `/marca` reescrita com as regras do manual (área de proteção, tamanhos mínimos, usos incorretos) e sem o aviso "Valores de referência"
- [ ] Nenhum comentário `MODELO:` restante (`grep -rn "MODELO:" src`)
- [ ] Paleta estendida com nomes e usos da nova marca
- [ ] Fontes carregando (confira no DevTools → Network → Font); fonte proprietária com `url_woff2` acessível e CORS liberado

## Conteúdo
- [ ] Concordância de gênero ("da Agência", não "do Agência")
- [ ] Dados de exemplo genéricos do template (Empreender, Programa Inova, DIROP…) trocados pelo universo da marca
- [ ] Tom de voz da página Webwriting coerente com a marca
- [ ] Metadados (`index.html`, `llms.txt`, `sitemap.xml`) com o domínio correto

## Publicação (só quando o usuário pedir)
- [ ] Pipeline de CI criado para o novo destino (o DS gerado não traz workflow). Veja o modelo em `arquitetura.md`
- [ ] `check-homepage-h1-computed` / `check-homepage-interactive-tokens` apontando para a URL nova
