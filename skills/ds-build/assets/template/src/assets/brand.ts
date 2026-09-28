// Marca oficial __BRAND_NAME__ — fonte única para uso em toda a aplicação.
// Usa pointers .asset.json (CDN) das versões oficiais (cor, branco, preto).
import cor from "./marca/brand-cor.svg.asset.json";
import white from "./marca/brand-white.svg.asset.json";
import black from "./marca/brand-black.svg.asset.json";

export const brandCor: string = cor.url;
export const brandWhite: string = white.url;
export const brandBlack: string = black.url;