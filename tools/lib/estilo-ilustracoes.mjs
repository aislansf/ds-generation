// Ilustrações das páginas de erro do estilo `ilustrativo` (docs/PLANO-ESTILOS.md, seção 6.20 e decisão 9).
//
// O estilo gera placeholders de ilustração (public/estilo/ilustracoes/: login, vazio, erro-404, erro-500). Login e vazio
// já eram ligados pela camada CSS; os de erro não tinham onde entrar. Os ícones das páginas de erro ganham um atributo
// (data-erro-icone="404|500|generic") para a camada CSS do estilo trocar o ícone pela ilustração. Sem regra de CSS que use
// o atributo (todos os estilos, menos o ilustrativo), nada muda na página. Patch idempotente no fim da extração.

/** [arquivo, antes, depois, marca?] (mesmo formato de TROCAS em tokenizar.mjs). */
export const ILUSTRACOES_TROCAS = [
  ["src/pages/ErrorPageTemplate.tsx", '<div className="mb-6 p-4 bg-muted/30 rounded-full">\n            {content.icon}',
    '<div data-erro-icone={errorType} className="mb-6 p-4 bg-muted/30 rounded-full">\n            {content.icon}'],
  ["src/pages/NotFound.tsx", '<div className="mb-6 p-4 bg-muted rounded-full">\n            <Search',
    '<div data-erro-icone="404" className="mb-6 p-4 bg-muted rounded-full">\n            <Search'],
];
