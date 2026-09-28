# origem/

Material de manutenção: **não faz parte da skill instalada**.

| Arquivo | Para quê |
|---|---|
| `ds-sebrae.json` | Briefing do DS de referência. O bloco `origem` diz ao `tools/extract-template.mjs` o que neutralizar e o que não pode sobrar; o resto do arquivo alimenta o teste de ida e volta |
| `logos/` | Logos do DS de referência, usados só no teste de ida e volta |
| `overrides/` | Arquivos copiados por cima do template extraído: README do DS gerado, `check-legacy-brand.mjs`, logos "Sua Marca", favicon, selo "marca parceira", imagem de login e miniaturas (gerados por `tools/imagens-neutras.mjs`) |

Veja [docs/HANDOFF.md](../docs/HANDOFF.md).
