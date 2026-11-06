// Componentes do catálogo do Neumorfismo que mudam de estrutura (não só de pele), ligados ao estilo escolhido.
//
// A camada CSS (assets/estilos/neumorfismo/estilo.css) cuida de cor, relevo e brilho. O que o catálogo
// "Neumorphic UI Studio" tem a mais (valor do KPI num leito afundado, link em pílula, selo de destaque) vem de
// componentes próprios, usados só quando ESTILO.id === "neumorfismo". Em qualquer outro estilo a vitrine é a de
// sempre, então o corporativo continua idêntico (tools/verificar-identidade.mjs). Segue o formato de
// SECAO_NOVOS/SECAO_TROCAS (patch idempotente aplicado por tokenizar.mjs).
import fs from "node:fs";

const lerPatch = (nome) => fs.readFileSync(new URL(`./patch/${nome}`, import.meta.url), "utf8");

export const NEUMORFISMO_NOVOS = [
  ["src/components/estilo/NeumorfismoCards.tsx", lerPatch("NeumorfismoCards.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoCards.test.tsx", lerPatch("NeumorfismoCards.test.tsx")],
  ["src/components/estilo/NeumorfismoNavegacao.tsx", lerPatch("NeumorfismoNavegacao.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoNavegacao.test.tsx", lerPatch("NeumorfismoNavegacao.test.tsx")],
  ["src/components/estilo/neumorfismo-icones-dados.ts", lerPatch("neumorfismo-icones-dados.ts")],
  ["src/components/estilo/NeumorfismoIcones.tsx", lerPatch("NeumorfismoIcones.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoIcones.test.tsx", lerPatch("NeumorfismoIcones.test.tsx")],
  ["src/components/estilo/NeumorfismoBotoes.tsx", lerPatch("NeumorfismoBotoes.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoBotoes.test.tsx", lerPatch("NeumorfismoBotoes.test.tsx")],
  ["src/components/estilo/NeumorfismoGrupoBotoes.tsx", lerPatch("NeumorfismoGrupoBotoes.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGrupoBotoes.test.tsx", lerPatch("NeumorfismoGrupoBotoes.test.tsx")],
  ["src/components/estilo/NeumorfismoBotaoIcone.tsx", lerPatch("NeumorfismoBotaoIcone.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoBotaoIcone.test.tsx", lerPatch("NeumorfismoBotaoIcone.test.tsx")],
  ["src/components/estilo/NeumorfismoCampos.tsx", lerPatch("NeumorfismoCampos.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoCampos.test.tsx", lerPatch("NeumorfismoCampos.test.tsx")],
  ["src/components/estilo/NeumorfismoOTP.tsx", lerPatch("NeumorfismoOTP.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoOTP.test.tsx", lerPatch("NeumorfismoOTP.test.tsx")],
  ["src/components/estilo/NeumorfismoCheckbox.tsx", lerPatch("NeumorfismoCheckbox.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoCheckbox.test.tsx", lerPatch("NeumorfismoCheckbox.test.tsx")],
  ["src/components/estilo/NeumorfismoRadio.tsx", lerPatch("NeumorfismoRadio.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoRadio.test.tsx", lerPatch("NeumorfismoRadio.test.tsx")],
  ["src/components/estilo/NeumorfismoSwitch.tsx", lerPatch("NeumorfismoSwitch.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoSwitch.test.tsx", lerPatch("NeumorfismoSwitch.test.tsx")],
  ["src/components/estilo/NeumorfismoSelect.tsx", lerPatch("NeumorfismoSelect.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoSelect.test.tsx", lerPatch("NeumorfismoSelect.test.tsx")],
  ["src/components/estilo/NeumorfismoDatePicker.tsx", lerPatch("NeumorfismoDatePicker.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoDatePicker.test.tsx", lerPatch("NeumorfismoDatePicker.test.tsx")],
  ["src/components/estilo/NeumorfismoSlider.tsx", lerPatch("NeumorfismoSlider.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoSlider.test.tsx", lerPatch("NeumorfismoSlider.test.tsx")],
  ["src/components/estilo/NeumorfismoSegmentado.tsx", lerPatch("NeumorfismoSegmentado.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoSegmentado.test.tsx", lerPatch("NeumorfismoSegmentado.test.tsx")],
  ["src/components/estilo/NeumorfismoQuestionario.tsx", lerPatch("NeumorfismoQuestionario.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoQuestionario.test.tsx", lerPatch("NeumorfismoQuestionario.test.tsx")],
  ["src/components/estilo/NeumorfismoBadges.tsx", lerPatch("NeumorfismoBadges.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoBadges.test.tsx", lerPatch("NeumorfismoBadges.test.tsx")],
  ["src/components/estilo/NeumorfismoAlertas.tsx", lerPatch("NeumorfismoAlertas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoAlertas.test.tsx", lerPatch("NeumorfismoAlertas.test.tsx")],
  ["src/components/estilo/NeumorfismoToasts.tsx", lerPatch("NeumorfismoToasts.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoToasts.test.tsx", lerPatch("NeumorfismoToasts.test.tsx")],
  ["src/components/estilo/NeumorfismoTooltips.tsx", lerPatch("NeumorfismoTooltips.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoTooltips.test.tsx", lerPatch("NeumorfismoTooltips.test.tsx")],
  ["src/components/estilo/NeumorfismoSpinners.tsx", lerPatch("NeumorfismoSpinners.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoSpinners.test.tsx", lerPatch("NeumorfismoSpinners.test.tsx")],
  ["src/components/estilo/NeumorfismoSkeletons.tsx", lerPatch("NeumorfismoSkeletons.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoSkeletons.test.tsx", lerPatch("NeumorfismoSkeletons.test.tsx")],
  ["src/components/estilo/NeumorfismoProgresso.tsx", lerPatch("NeumorfismoProgresso.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoProgresso.test.tsx", lerPatch("NeumorfismoProgresso.test.tsx")],
  ["src/components/estilo/NeumorfismoVazios.tsx", lerPatch("NeumorfismoVazios.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoVazios.test.tsx", lerPatch("NeumorfismoVazios.test.tsx")],
  ["src/components/estilo/NeumorfismoModais.tsx", lerPatch("NeumorfismoModais.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoModais.test.tsx", lerPatch("NeumorfismoModais.test.tsx")],
  ["src/components/estilo/NeumorfismoDialogoAlerta.tsx", lerPatch("NeumorfismoDialogoAlerta.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoDialogoAlerta.test.tsx", lerPatch("NeumorfismoDialogoAlerta.test.tsx")],
  ["src/components/estilo/NeumorfismoDialogo.tsx", lerPatch("NeumorfismoDialogo.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoDialogo.test.tsx", lerPatch("NeumorfismoDialogo.test.tsx")],
  ["src/components/estilo/NeumorfismoFolha.tsx", lerPatch("NeumorfismoFolha.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoFolha.test.tsx", lerPatch("NeumorfismoFolha.test.tsx")],
  ["src/components/estilo/NeumorfismoGaveta.tsx", lerPatch("NeumorfismoGaveta.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGaveta.test.tsx", lerPatch("NeumorfismoGaveta.test.tsx")],
  ["src/components/estilo/NeumorfismoPopovers.tsx", lerPatch("NeumorfismoPopovers.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoPopovers.test.tsx", lerPatch("NeumorfismoPopovers.test.tsx")],
  ["src/components/estilo/NeumorfismoHoverCards.tsx", lerPatch("NeumorfismoHoverCards.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoHoverCards.test.tsx", lerPatch("NeumorfismoHoverCards.test.tsx")],
  ["src/components/estilo/NeumorfismoAbas.tsx", lerPatch("NeumorfismoAbas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoAbas.test.tsx", lerPatch("NeumorfismoAbas.test.tsx")],
  ["src/components/estilo/NeumorfismoCarrossel.tsx", lerPatch("NeumorfismoCarrossel.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoCarrossel.test.tsx", lerPatch("NeumorfismoCarrossel.test.tsx")],
  ["src/components/estilo/NeumorfismoRecolhivel.tsx", lerPatch("NeumorfismoRecolhivel.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoRecolhivel.test.tsx", lerPatch("NeumorfismoRecolhivel.test.tsx")],
  ["src/components/estilo/NeumorfismoComandos.tsx", lerPatch("NeumorfismoComandos.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoComandos.test.tsx", lerPatch("NeumorfismoComandos.test.tsx")],
  ["src/components/estilo/NeumorfismoMenubar.tsx", lerPatch("NeumorfismoMenubar.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoMenubar.test.tsx", lerPatch("NeumorfismoMenubar.test.tsx")],
  ["src/components/estilo/NeumorfismoNavegacaoSite.tsx", lerPatch("NeumorfismoNavegacaoSite.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoNavegacaoSite.test.tsx", lerPatch("NeumorfismoNavegacaoSite.test.tsx")],
  ["src/components/estilo/NeumorfismoAcordeao.tsx", lerPatch("NeumorfismoAcordeao.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoAcordeao.test.tsx", lerPatch("NeumorfismoAcordeao.test.tsx")],
  ["src/components/estilo/NeumorfismoBreadcrumb.tsx", lerPatch("NeumorfismoBreadcrumb.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoBreadcrumb.test.tsx", lerPatch("NeumorfismoBreadcrumb.test.tsx")],
  ["src/components/estilo/NeumorfismoPaginacao.tsx", lerPatch("NeumorfismoPaginacao.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoPaginacao.test.tsx", lerPatch("NeumorfismoPaginacao.test.tsx")],
  ["src/components/estilo/NeumorfismoMenuSuspenso.tsx", lerPatch("NeumorfismoMenuSuspenso.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoMenuSuspenso.test.tsx", lerPatch("NeumorfismoMenuSuspenso.test.tsx")],
  ["src/components/estilo/NeumorfismoKebab.tsx", lerPatch("NeumorfismoKebab.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoKebab.test.tsx", lerPatch("NeumorfismoKebab.test.tsx")],
  ["src/components/estilo/NeumorfismoEtapas.tsx", lerPatch("NeumorfismoEtapas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoEtapas.test.tsx", lerPatch("NeumorfismoEtapas.test.tsx")],
  ["src/components/estilo/NeumorfismoCabecalhos.tsx", lerPatch("NeumorfismoCabecalhos.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoCabecalhos.test.tsx", lerPatch("NeumorfismoCabecalhos.test.tsx")],
  ["src/components/estilo/NeumorfismoRodapes.tsx", lerPatch("NeumorfismoRodapes.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoRodapes.test.tsx", lerPatch("NeumorfismoRodapes.test.tsx")],
  ["src/components/estilo/NeumorfismoMenuLateral.tsx", lerPatch("NeumorfismoMenuLateral.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoMenuLateral.test.tsx", lerPatch("NeumorfismoMenuLateral.test.tsx")],
  ["src/components/estilo/NeumorfismoGavetaLateral.tsx", lerPatch("NeumorfismoGavetaLateral.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGavetaLateral.test.tsx", lerPatch("NeumorfismoGavetaLateral.test.tsx")],
  ["src/components/estilo/NeumorfismoPainelLateral.tsx", lerPatch("NeumorfismoPainelLateral.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoPainelLateral.test.tsx", lerPatch("NeumorfismoPainelLateral.test.tsx")],
  ["src/components/estilo/NeumorfismoWorkspaceLateral.tsx", lerPatch("NeumorfismoWorkspaceLateral.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoWorkspaceLateral.test.tsx", lerPatch("NeumorfismoWorkspaceLateral.test.tsx")],
  ["src/components/estilo/NeumorfismoAvatares.tsx", lerPatch("NeumorfismoAvatares.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoAvatares.test.tsx", lerPatch("NeumorfismoAvatares.test.tsx")],
  ["src/components/estilo/NeumorfismoBaloes.tsx", lerPatch("NeumorfismoBaloes.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoBaloes.test.tsx", lerPatch("NeumorfismoBaloes.test.tsx")],
  ["src/components/estilo/NeumorfismoMarcadores.tsx", lerPatch("NeumorfismoMarcadores.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoMarcadores.test.tsx", lerPatch("NeumorfismoMarcadores.test.tsx")],
  ["src/components/estilo/NeumorfismoItens.tsx", lerPatch("NeumorfismoItens.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoItens.test.tsx", lerPatch("NeumorfismoItens.test.tsx")],
  ["src/components/estilo/NeumorfismoTeclas.tsx", lerPatch("NeumorfismoTeclas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoTeclas.test.tsx", lerPatch("NeumorfismoTeclas.test.tsx")],
  ["src/components/estilo/NeumorfismoMensagens.tsx", lerPatch("NeumorfismoMensagens.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoMensagens.test.tsx", lerPatch("NeumorfismoMensagens.test.tsx")],
  ["src/components/estilo/NeumorfismoRolagemMensagens.tsx", lerPatch("NeumorfismoRolagemMensagens.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoRolagemMensagens.test.tsx", lerPatch("NeumorfismoRolagemMensagens.test.tsx")],
  ["src/components/estilo/NeumorfismoKpis.tsx", lerPatch("NeumorfismoKpis.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoKpis.test.tsx", lerPatch("NeumorfismoKpis.test.tsx")],
  ["src/components/estilo/NeumorfismoIndicadores.tsx", lerPatch("NeumorfismoIndicadores.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoIndicadores.test.tsx", lerPatch("NeumorfismoIndicadores.test.tsx")],
  ["src/components/estilo/NeumorfismoMetas.tsx", lerPatch("NeumorfismoMetas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoMetas.test.tsx", lerPatch("NeumorfismoMetas.test.tsx")],
  ["src/components/estilo/NeumorfismoEstatisticas.tsx", lerPatch("NeumorfismoEstatisticas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoEstatisticas.test.tsx", lerPatch("NeumorfismoEstatisticas.test.tsx")],
  ["src/components/estilo/NeumorfismoMetricas.tsx", lerPatch("NeumorfismoMetricas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoMetricas.test.tsx", lerPatch("NeumorfismoMetricas.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoBarras.tsx", lerPatch("NeumorfismoGraficoBarras.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoBarras.test.tsx", lerPatch("NeumorfismoGraficoBarras.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoArea.tsx", lerPatch("NeumorfismoGraficoArea.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoArea.test.tsx", lerPatch("NeumorfismoGraficoArea.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoAreaMultipla.tsx", lerPatch("NeumorfismoGraficoAreaMultipla.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoAreaMultipla.test.tsx", lerPatch("NeumorfismoGraficoAreaMultipla.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoAreaTemporal.tsx", lerPatch("NeumorfismoGraficoAreaTemporal.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoAreaTemporal.test.tsx", lerPatch("NeumorfismoGraficoAreaTemporal.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoAreaComSinal.tsx", lerPatch("NeumorfismoGraficoAreaComSinal.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoAreaComSinal.test.tsx", lerPatch("NeumorfismoGraficoAreaComSinal.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoAreaEmpilhada.tsx", lerPatch("NeumorfismoGraficoAreaEmpilhada.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoAreaEmpilhada.test.tsx", lerPatch("NeumorfismoGraficoAreaEmpilhada.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoBarrasAgrupadas.tsx", lerPatch("NeumorfismoGraficoBarrasAgrupadas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoBarrasAgrupadas.test.tsx", lerPatch("NeumorfismoGraficoBarrasAgrupadas.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoColunas.tsx", lerPatch("NeumorfismoGraficoColunas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoColunas.test.tsx", lerPatch("NeumorfismoGraficoColunas.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoColunasRotulos.tsx", lerPatch("NeumorfismoGraficoColunasRotulos.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoColunasRotulos.test.tsx", lerPatch("NeumorfismoGraficoColunasRotulos.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoColunasPercentuais.tsx", lerPatch("NeumorfismoGraficoColunasPercentuais.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoColunasPercentuais.test.tsx", lerPatch("NeumorfismoGraficoColunasPercentuais.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoColunasAgrupadasEmpilhadas.tsx", lerPatch("NeumorfismoGraficoColunasAgrupadasEmpilhadas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoColunasAgrupadasEmpilhadas.test.tsx", lerPatch("NeumorfismoGraficoColunasAgrupadasEmpilhadas.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoBarrasHorizontais.tsx", lerPatch("NeumorfismoGraficoBarrasHorizontais.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoBarrasHorizontais.test.tsx", lerPatch("NeumorfismoGraficoBarrasHorizontais.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoLinhas.tsx", lerPatch("NeumorfismoGraficoLinhas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoLinhas.test.tsx", lerPatch("NeumorfismoGraficoLinhas.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoRosca.tsx", lerPatch("NeumorfismoGraficoRosca.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoRosca.test.tsx", lerPatch("NeumorfismoGraficoRosca.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoComposto.tsx", lerPatch("NeumorfismoGraficoComposto.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoComposto.test.tsx", lerPatch("NeumorfismoGraficoComposto.test.tsx")],
  ["src/components/estilo/NeumorfismoGraficoMedidor.tsx", lerPatch("NeumorfismoGraficoMedidor.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoGraficoMedidor.test.tsx", lerPatch("NeumorfismoGraficoMedidor.test.tsx")],
  ["src/components/estilo/NeumorfismoTabelas.tsx", lerPatch("NeumorfismoTabelas.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoTabelas.test.tsx", lerPatch("NeumorfismoTabelas.test.tsx")],
  ["src/components/estilo/NeumorfismoListaDescritiva.tsx", lerPatch("NeumorfismoListaDescritiva.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoListaDescritiva.test.tsx", lerPatch("NeumorfismoListaDescritiva.test.tsx")],
  ["src/components/estilo/NeumorfismoFiltros.tsx", lerPatch("NeumorfismoFiltros.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoFiltros.test.tsx", lerPatch("NeumorfismoFiltros.test.tsx")],
  ["src/components/estilo/NeumorfismoUpload.tsx", lerPatch("NeumorfismoUpload.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoUpload.test.tsx", lerPatch("NeumorfismoUpload.test.tsx")],
  ["src/components/estilo/NeumorfismoUploadEmMassa.tsx", lerPatch("NeumorfismoUploadEmMassa.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoUploadEmMassa.test.tsx", lerPatch("NeumorfismoUploadEmMassa.test.tsx")],
  ["src/components/estilo/NeumorfismoAnexos.tsx", lerPatch("NeumorfismoAnexos.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoAnexos.test.tsx", lerPatch("NeumorfismoAnexos.test.tsx")],
  ["src/components/estilo/NeumorfismoSignIn.tsx", lerPatch("NeumorfismoSignIn.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoSignIn.test.tsx", lerPatch("NeumorfismoSignIn.test.tsx")],
  ["src/components/estilo/NeumorfismoSignUp.tsx", lerPatch("NeumorfismoSignUp.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoSignUp.test.tsx", lerPatch("NeumorfismoSignUp.test.tsx")],
  ["src/components/estilo/NeumorfismoTwoFactor.tsx", lerPatch("NeumorfismoTwoFactor.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoTwoFactor.test.tsx", lerPatch("NeumorfismoTwoFactor.test.tsx")],
  ["src/components/estilo/NeumorfismoDashboard.tsx", lerPatch("NeumorfismoDashboard.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoDashboard.test.tsx", lerPatch("NeumorfismoDashboard.test.tsx")],
  ["src/components/estilo/NeumorfismoCasca.tsx", lerPatch("NeumorfismoCasca.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoCasca.test.tsx", lerPatch("NeumorfismoCasca.test.tsx")],
  ["src/components/estilo/NeumorfismoBotaoDS.tsx", lerPatch("NeumorfismoBotaoDS.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoBotaoDS.test.tsx", lerPatch("NeumorfismoBotaoDS.test.tsx")],
  ["src/components/estilo/NeumorfismoSuperficies.tsx", lerPatch("NeumorfismoSuperficies.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoSuperficies.test.tsx", lerPatch("NeumorfismoSuperficies.test.tsx")],
  ["src/components/estilo/NeumorfismoValidador.tsx", lerPatch("NeumorfismoValidador.tsx")],
  ["src/components/estilo/__tests__/NeumorfismoValidador.test.tsx", lerPatch("NeumorfismoValidador.test.tsx")],
];

export const NEUMORFISMO_TROCAS = [
  ["src/pages/ComponentesPage.tsx", 'import { SEO } from "@/components/SEO";\n',
    'import { SEO } from "@/components/SEO";\nimport { ESTILO } from "@/config/estilo";\nimport NeumorfismoCards from "@/components/estilo/NeumorfismoCards";\n'],
  // Card: no neumorfismo, a vitrine é a do catálogo; nos demais estilos, a de sempre
  ["src/pages/ComponentesPage.tsx",
    '    >\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">\n        <div data-ds="card" className="bg-card rounded-lg border border-border overflow-hidden">\n',
    '    >\n      {(ESTILO.id as string) === "neumorfismo" ? <NeumorfismoCards /> : (\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">\n        <div data-ds="card" className="bg-card rounded-lg border border-border overflow-hidden">\n'],
  ["src/pages/ComponentesPage.tsx",
    '          <p className="text-xs opacity-80">Para informações de destaque institucional.</p>\n        </div>\n      </div>\n    </ComponentPreview>\n',
    '          <p className="text-xs opacity-80">Para informações de destaque institucional.</p>\n        </div>\n      </div>\n      )}\n    </ComponentPreview>\n'],
  // Abas, acordeão e etapas: no neumorfismo, a vitrine é a do pacote (quatro variantes de abas, acordeão em
  // cartões ou agrupado, etapas horizontais e verticais); nos demais estilos, a de sempre
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoCards from "@/components/estilo/NeumorfismoCards";\n',
    'import NeumorfismoCards from "@/components/estilo/NeumorfismoCards";\nimport { NeumorfismoTabs, NeumorfismoAccordion, NeumorfismoSteps } from "@/components/estilo/NeumorfismoNavegacao";\n'],
  ["src/pages/ComponentesPage.tsx",
    '    >\n      <div className="border border-border rounded-lg divide-y divide-border">\n        {items.map((item, i) => (\n          <div key={i}>\n            <button data-ds="button" data-variant="ghost"',
    '    >\n      {(ESTILO.id as string) === "neumorfismo" ? <NeumorfismoAccordion /> : (\n      <div className="border border-border rounded-lg divide-y divide-border">\n        {items.map((item, i) => (\n          <div key={i}>\n            <button data-ds="button" data-variant="ghost"'],
  ["src/pages/ComponentesPage.tsx",
    '        ))}\n      </div>\n    </ComponentPreview>\n  );\n}\n\n/* ==================== TABS ==================== */',
    '        ))}\n      </div>\n      )}\n    </ComponentPreview>\n  );\n}\n\n/* ==================== TABS ==================== */'],
  ["src/pages/ComponentesPage.tsx",
    '    >\n      <div>\n        <div role="tablist" className="flex border-b border-border mb-4">\n          {tabs.map((t, i) => (\n            <button data-ds="tabs-trigger"',
    '    >\n      {(ESTILO.id as string) === "neumorfismo" ? <NeumorfismoTabs /> : (\n      <div>\n        <div role="tablist" className="flex border-b border-border mb-4">\n          {tabs.map((t, i) => (\n            <button data-ds="tabs-trigger"'],
  ["src/pages/ComponentesPage.tsx",
    '        </div>\n      </div>\n    </ComponentPreview>\n  );\n}\n\n/* ==================== MODAL ==================== */',
    '        </div>\n      </div>\n      )}\n    </ComponentPreview>\n  );\n}\n\n/* ==================== MODAL ==================== */'],
  ["src/pages/ComponentesPage.tsx",
    '    >\n      <div className="space-y-6">\n        {/* Horizontal stepper */}',
    '    >\n      {(ESTILO.id as string) === "neumorfismo" ? <NeumorfismoSteps /> : (\n      <div className="space-y-6">\n        {/* Horizontal stepper */}'],
  ["src/pages/ComponentesPage.tsx",
    '        </div>\n      </div>\n    </ComponentPreview>\n  );\n}\n\n/* ==================== LISTA DESCRITIVA ==================== */',
    '        </div>\n      </div>\n      )}\n    </ComponentPreview>\n  );\n}\n\n/* ==================== LISTA DESCRITIVA ==================== */'],
  // Ícones: o pacote tem o componente Icon (96 ícones de linha) e o DS não tinha a seção em /componentes
  ["src/pages/ComponentesPage.tsx", 'import { NeumorfismoTabs, NeumorfismoAccordion, NeumorfismoSteps } from "@/components/estilo/NeumorfismoNavegacao";\n',
    'import { NeumorfismoTabs, NeumorfismoAccordion, NeumorfismoSteps } from "@/components/estilo/NeumorfismoNavegacao";\nimport NeumorfismoIcones from "@/components/estilo/NeumorfismoIcones";\n'],
  ["src/pages/ComponentesPage.tsx", '      {/* BUTTON */}\n      <SectionHeader id="botao"',
    '      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="icones" title="Ícones" description="Ícones de linha do sistema (geometria Lucide), desenhados na cor do texto." />\n          <ComponentPreview\n            title="Ícone"\n            description="Traço de 2px em grade de 24px, pontas redondas, na cor do texto (currentColor). Ficam em quadrados de cantos suaves ou na linha, junto do texto."\n            whenToUse={["Reforçar o rótulo de botões, campos, menus e estados", "Botões só de ícone, sempre com nome acessível"]}\n            whenNotToUse={["Como único indicador de estado (acompanhe de palavra)", "Cor da marca em ícone parado: só no ativo ou na ação principal"]}\n            accessibility={["Decorativo: aria-hidden; sozinho e com significado: role=img e aria-label", "Tamanho 18px por padrão, 16px em linhas densas, 14px em breadcrumbs"]}\n            code={\'<Icone name="search" size={16} label="Buscar" />\'}\n          >\n            <NeumorfismoIcones />\n          </ComponentPreview>\n        </>\n      )}\n\n      {/* BUTTON */}\n      <SectionHeader id="botao"'],
  ["src/components/DSLayout.tsx", '      { label: "Botão Templates", path: "/componentes#botao" },\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Ícones", path: "/componentes#icones" }] : []),\n      { label: "Botão Templates", path: "/componentes#botao" },\n'],
  // Botão: o exemplo do pacote tem doze peças (primário, royal, secundário, contorno, suave, destrutivo com ícone,
  // carregando, ícone dos dois lados, pílula com LED e selo, citron e desabilitado); a vitrine do DS não as reunia
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoIcones from "@/components/estilo/NeumorfismoIcones";\n',
    'import NeumorfismoIcones from "@/components/estilo/NeumorfismoIcones";\nimport NeumorfismoBotoes from "@/components/estilo/NeumorfismoBotoes";\n'],
  ["src/pages/ComponentesPage.tsx", '      <ButtonSection />\n',
    '      {(ESTILO.id as string) === "neumorfismo" && <NeumorfismoBotoes />}\n      <ButtonSection />\n'],
  // Grupo de botões: o pacote tem o componente ButtonGroup e o DS não tinha a seção em /componentes
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoBotoes from "@/components/estilo/NeumorfismoBotoes";\n',
    'import NeumorfismoBotoes from "@/components/estilo/NeumorfismoBotoes";\nimport NeumorfismoGrupoBotoes from "@/components/estilo/NeumorfismoGrupoBotoes";\n'],
  ["src/pages/ComponentesPage.tsx", '      <ButtonSection />\n\n      {/* INPUT */}\n',
    '      <ButtonSection />\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="grupo-botoes" title="Grupo de botões" description="Botões relacionados numa só casca, lidos como um único controle." />\n          <NeumorfismoGrupoBotoes />\n          <SectionHeader id="botao-icone" title="Botão somente ícone" description="Tecla de 44px só com o ícone, sempre com nome acessível." />\n          <NeumorfismoBotaoIcone />\n        </>\n      )}\n\n      {/* INPUT */}\n'],
  ["src/components/DSLayout.tsx", '      { label: "Botão Templates", path: "/componentes#botao" },\n',
    '      { label: "Botão Templates", path: "/componentes#botao" },\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Grupo de botões", path: "/componentes#grupo-botoes" }, { label: "Botão somente ícone", path: "/componentes#botao-icone" }] : []),\n'],
  // Botão só de ícone: o pacote tem o componente IconButton e o DS só mostrava um botão pequeno com p-2
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoGrupoBotoes from "@/components/estilo/NeumorfismoGrupoBotoes";\n',
    'import NeumorfismoGrupoBotoes from "@/components/estilo/NeumorfismoGrupoBotoes";\nimport NeumorfismoBotaoIcone from "@/components/estilo/NeumorfismoBotaoIcone";\n'],
  // Campo de texto: o pacote tem o TextField com erro, plain e soft (ação no rótulo, mostrar senha); o DS só mostrava o campo comum
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoBotaoIcone from "@/components/estilo/NeumorfismoBotaoIcone";\n',
    'import NeumorfismoBotaoIcone from "@/components/estilo/NeumorfismoBotaoIcone";\nimport NeumorfismoCampos from "@/components/estilo/NeumorfismoCampos";\n'],
  ["src/pages/ComponentesPage.tsx", '      <InputSection />\n',
    '      {(ESTILO.id as string) === "neumorfismo" && <NeumorfismoCampos />}\n      <InputSection />\n'],
  // Checkbox: o pacote tem o Checkbox com título, descrição, tom secundário e desabilitado; o DS só mostrava a caixa nativa
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoCampos from "@/components/estilo/NeumorfismoCampos";\n',
    'import NeumorfismoCampos from "@/components/estilo/NeumorfismoCampos";\nimport NeumorfismoCheckbox from "@/components/estilo/NeumorfismoCheckbox";\n'],
  ["src/pages/ComponentesPage.tsx", '      <CheckboxSection />\n',
    '      {(ESTILO.id as string) === "neumorfismo" && <NeumorfismoCheckbox />}\n      <CheckboxSection />\n'],
  // Switch: no neumorfismo, o exemplo do cartão "Switch" vira os três cartões de estado do code.html do anexo; o código,
  // o "Quando usar" e a acessibilidade do cartão continuam
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoCheckbox from "@/components/estilo/NeumorfismoCheckbox";\n',
    'import NeumorfismoCheckbox from "@/components/estilo/NeumorfismoCheckbox";\nimport NeumorfismoSwitch from "@/components/estilo/NeumorfismoSwitch";\n'],
  ["src/pages/ComponentesPage.tsx",
    '    >\n      <label className="flex items-center gap-3 cursor-pointer">\n        <button data-ds="switch"',
    '    >\n      {(ESTILO.id as string) === "neumorfismo" ? <NeumorfismoSwitch /> : (\n      <label className="flex items-center gap-3 cursor-pointer">\n        <button data-ds="switch"'],
  ["src/pages/ComponentesPage.tsx",
    '        <span className="text-sm">Notificações por e-mail</span>\n      </label>\n    </ComponentPreview>\n  );\n}\n\n/* ==================== BADGE ==================== */',
    '        <span className="text-sm">Notificações por e-mail</span>\n      </label>\n      )}\n    </ComponentPreview>\n  );\n}\n\n/* ==================== BADGE ==================== */'],
  // Select: no neumorfismo, o cartão "Select" mostra o gatilho convexo e o menu flutuante do pacote no lugar da lista nativa
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoSwitch from "@/components/estilo/NeumorfismoSwitch";\n',
    'import NeumorfismoSwitch from "@/components/estilo/NeumorfismoSwitch";\nimport NeumorfismoSelect from "@/components/estilo/NeumorfismoSelect";\n'],
  ["src/pages/ComponentesPage.tsx",
    '    >\n      <div className="space-y-6">\n        <div className="max-w-md">\n          <label className="block text-sm font-medium mb-1.5">Estado</label>\n          <div className="relative">\n            <select data-ds="select-trigger"',
    '    >\n      {(ESTILO.id as string) === "neumorfismo" ? <NeumorfismoSelect /> : (\n      <div className="space-y-6">\n        <div className="max-w-md">\n          <label className="block text-sm font-medium mb-1.5">Estado</label>\n          <div className="relative">\n            <select data-ds="select-trigger"'],
  ["src/pages/ComponentesPage.tsx",
    '        </div>\n      </div>\n    </ComponentPreview>\n  );\n}\n\n/* ==================== CHECKBOX / RADIO ==================== */',
    '        </div>\n      </div>\n      )}\n    </ComponentPreview>\n  );\n}\n\n/* ==================== CHECKBOX / RADIO ==================== */'],
  // DatePicker: no neumorfismo, o cartão "DatePicker" mostra o painel de período e a data única do pacote
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoSelect from "@/components/estilo/NeumorfismoSelect";\n',
    'import NeumorfismoSelect from "@/components/estilo/NeumorfismoSelect";\nimport NeumorfismoDatePicker from "@/components/estilo/NeumorfismoDatePicker";\n'],
  ["src/pages/ComponentesPage.tsx",
    '    >\n      <div className="space-y-6">\n        {/* DatePicker simples */}',
    '    >\n      {(ESTILO.id as string) === "neumorfismo" ? <NeumorfismoDatePicker /> : (\n      <div className="space-y-6">\n        {/* DatePicker simples */}'],
  ["src/pages/ComponentesPage.tsx",
    '        </div>\n      </div>\n    </ComponentPreview>\n  );\n}\n\n/* ==================== FILTROS DINÂMICOS ==================== */',
    '        </div>\n      </div>\n      )}\n    </ComponentPreview>\n  );\n}\n\n/* ==================== FILTROS DINÂMICOS ==================== */'],
  // Slider: o pacote tem o componente Slider e o DS tem o ui/slider, mas nenhuma vitrine o mostrava
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoDatePicker from "@/components/estilo/NeumorfismoDatePicker";\n',
    'import NeumorfismoDatePicker from "@/components/estilo/NeumorfismoDatePicker";\nimport NeumorfismoSlider from "@/components/estilo/NeumorfismoSlider";\n'],
  ["src/pages/ComponentesPage.tsx", '      <DatePickerSection />\n',
    '      <DatePickerSection />\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="slider" title="Slider" description="Seleção de um valor numa faixa contínua." />\n          <NeumorfismoSlider />\n        </>\n      )}\n'],
  ["src/components/DSLayout.tsx", '      { label: "DatePicker", path: "/componentes#datepicker" },\n',
    '      { label: "DatePicker", path: "/componentes#datepicker" },\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Slider", path: "/componentes#slider" }] : []),\n'],
  // Controle segmentado: vem depois do Slider (as trocas abaixo só acrescentam; não mexem no texto das do Slider)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoSlider from "@/components/estilo/NeumorfismoSlider";\n',
    'import NeumorfismoSlider from "@/components/estilo/NeumorfismoSlider";\nimport NeumorfismoSegmentado from "@/components/estilo/NeumorfismoSegmentado";\n'],
  ["src/pages/ComponentesPage.tsx", '      {/* FILTROS DINÂMICOS */}\n',
    '      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="segmentado" title="Controle segmentado" description="Alternância entre poucas opções lado a lado, uma escolhida por vez." />\n          <NeumorfismoSegmentado />\n        </>\n      )}\n\n      {/* FILTROS DINÂMICOS */}\n',
    // a marca evita reaplicar quando uma seção posterior (Questionário) entra depois deste bloco
    'id="segmentado"'],
  ["src/components/DSLayout.tsx",
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Slider", path: "/componentes#slider" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Slider", path: "/componentes#slider" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Controle segmentado", path: "/componentes#segmentado" }] : []),\n'],
  // Questionário: depois do Controle segmentado (cada troca só acrescenta ao fim do texto da anterior)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoSegmentado from "@/components/estilo/NeumorfismoSegmentado";\n',
    'import NeumorfismoSegmentado from "@/components/estilo/NeumorfismoSegmentado";\nimport NeumorfismoQuestionario from "@/components/estilo/NeumorfismoQuestionario";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoSegmentado />\n        </>\n      )}\n',
    '          <NeumorfismoSegmentado />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="questionario" title="Questionário" description="Perguntas respondidas uma por vez, com progresso, validação e atalhos de teclado." />\n          <NeumorfismoQuestionario />\n        </>\n      )}\n'],
  ["src/components/DSLayout.tsx",
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Controle segmentado", path: "/componentes#segmentado" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Controle segmentado", path: "/componentes#segmentado" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Questionário", path: "/componentes#questionario" }] : []),\n'],
  // Badge: no neumorfismo, o cartão "Badge / Tag" mostra os selos do pacote (convexo, afundado, sólido e chip)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoQuestionario from "@/components/estilo/NeumorfismoQuestionario";\n',
    'import NeumorfismoQuestionario from "@/components/estilo/NeumorfismoQuestionario";\nimport NeumorfismoBadges from "@/components/estilo/NeumorfismoBadges";\n'],
  ["src/pages/ComponentesPage.tsx", 'function BadgeSection() {\n  return (\n    <ComponentPreview\n      title="Badge / Tag"',
    'function BadgeSection() {\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoBadges />;\n  return (\n    <ComponentPreview\n      title="Badge / Tag"'],
  // Alert: no neumorfismo, o cartão "Alert" mostra os quatro avisos do pacote
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoBadges from "@/components/estilo/NeumorfismoBadges";\n',
    'import NeumorfismoBadges from "@/components/estilo/NeumorfismoBadges";\nimport NeumorfismoAlertas from "@/components/estilo/NeumorfismoAlertas";\n'],
  ["src/pages/ComponentesPage.tsx", 'function AlertSection() {\n  return (\n    <ComponentPreview\n      title="Alert"',
    'function AlertSection() {\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoAlertas />;\n  return (\n    <ComponentPreview\n      title="Alert"'],
  // Toast: no neumorfismo, o cartão "Toast" mostra os formatos simples e detalhado e o toast flutuante do pacote
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoAlertas from "@/components/estilo/NeumorfismoAlertas";\n',
    'import NeumorfismoAlertas from "@/components/estilo/NeumorfismoAlertas";\nimport NeumorfismoToasts from "@/components/estilo/NeumorfismoToasts";\n'],
  ["src/pages/ComponentesPage.tsx", 'function ToastSection() {\n  const [showToast, setShowToast] = useState(false);\n\n  return (',
    'function ToastSection() {\n  const [showToast, setShowToast] = useState(false);\n\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoToasts />;\n\n  return ('],
  // Tooltip: no neumorfismo, o cartão "Tooltip" mostra os três botões de ícone do pacote com a bolha rasa
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoToasts from "@/components/estilo/NeumorfismoToasts";\n',
    'import NeumorfismoToasts from "@/components/estilo/NeumorfismoToasts";\nimport NeumorfismoTooltips from "@/components/estilo/NeumorfismoTooltips";\n'],
  ["src/pages/ComponentesPage.tsx", 'function TooltipSection() {\n  return (\n    <ComponentPreview\n      title="Tooltip"',
    'function TooltipSection() {\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoTooltips />;\n  return (\n    <ComponentPreview\n      title="Tooltip"'],
  // Spinner: no neumorfismo, o cartão "Spinner" mostra os discos e o painel de cartões de especificação do pacote
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoTooltips from "@/components/estilo/NeumorfismoTooltips";\n',
    'import NeumorfismoTooltips from "@/components/estilo/NeumorfismoTooltips";\nimport NeumorfismoSpinners from "@/components/estilo/NeumorfismoSpinners";\n'],
  ["src/pages/ComponentesPage.tsx", 'function SpinnerSection() {\n  return (\n    <ComponentPreview\n      title="Spinner"',
    'function SpinnerSection() {\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoSpinners />;\n  return (\n    <ComponentPreview\n      title="Spinner"'],
  // Skeleton: no neumorfismo, o cartão "Skeleton" mostra o cartão convexo de formas escavadas do pacote
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoSpinners from "@/components/estilo/NeumorfismoSpinners";\n',
    'import NeumorfismoSpinners from "@/components/estilo/NeumorfismoSpinners";\nimport NeumorfismoSkeletons from "@/components/estilo/NeumorfismoSkeletons";\n'],
  ["src/pages/ComponentesPage.tsx", 'function SkeletonSection() {\n  return (\n    <ComponentPreview\n      title="Skeleton"',
    'function SkeletonSection() {\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoSkeletons />;\n  return (\n    <ComponentPreview\n      title="Skeleton"'],
  // Progress: o DS não tinha a seção; no neumorfismo ela entra depois do Spinner, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoSkeletons from "@/components/estilo/NeumorfismoSkeletons";\n',
    'import NeumorfismoSkeletons from "@/components/estilo/NeumorfismoSkeletons";\nimport NeumorfismoProgresso from "@/components/estilo/NeumorfismoProgresso";\n'],
  ["src/pages/ComponentesPage.tsx", '      {/* EMPTY STATE */}\n',
    '      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="progress" title="Progress" description="Barra de progresso para tarefas, envios e etapas." />\n          <NeumorfismoProgresso />\n        </>\n      )}\n\n      {/* EMPTY STATE */}\n',
    'id="progress"'],
  ["src/components/DSLayout.tsx", '      { label: "Spinner", path: "/componentes#spinner" },\n',
    '      { label: "Spinner", path: "/componentes#spinner" },\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Progress", path: "/componentes#progress" }] : []),\n'],
  // Empty State: no neumorfismo, o cartão "Empty State" mostra o poço e o tracejado do pacote
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoProgresso from "@/components/estilo/NeumorfismoProgresso";\n',
    'import NeumorfismoProgresso from "@/components/estilo/NeumorfismoProgresso";\nimport NeumorfismoVazios from "@/components/estilo/NeumorfismoVazios";\n'],
  ["src/pages/ComponentesPage.tsx", 'function EmptyStateSection() {\n  return (\n    <ComponentPreview\n      title="Empty State"',
    'function EmptyStateSection() {\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoVazios />;\n  return (\n    <ComponentPreview\n      title="Empty State"'],
  // Modal: no neumorfismo, o cartão "Modal" mostra o diálogo plano e o convexo do pacote (o retorno antecipado vem depois dos hooks da seção)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoVazios from "@/components/estilo/NeumorfismoVazios";\n',
    'import NeumorfismoVazios from "@/components/estilo/NeumorfismoVazios";\nimport NeumorfismoModais from "@/components/estilo/NeumorfismoModais";\n'],
  ["src/pages/ComponentesPage.tsx", '  }, [open]);\n\n  return (\n    <ComponentPreview\n      title="Modal"',
    '  }, [open]);\n\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoModais />;\n\n  return (\n    <ComponentPreview\n      title="Modal"'],
  // Alert Dialog: o DS não tinha a seção; no neumorfismo ela entra depois do Modal, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoModais from "@/components/estilo/NeumorfismoModais";\n',
    'import NeumorfismoModais from "@/components/estilo/NeumorfismoModais";\nimport NeumorfismoDialogoAlerta from "@/components/estilo/NeumorfismoDialogoAlerta";\n'],
  ["src/pages/ComponentesPage.tsx", '      <ModalSection />\n',
    '      <ModalSection />\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="alert-dialog" title="Alert Dialog" description="Confirmação modal que interrompe o fluxo e espera uma resposta." />\n          <NeumorfismoDialogoAlerta />\n        </>\n      )}\n',
    'id="alert-dialog"'],
  ["src/components/DSLayout.tsx", '      { label: "Modal", path: "/componentes#modal" },\n',
    '      { label: "Modal", path: "/componentes#modal" },\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Alert Dialog", path: "/componentes#alert-dialog" }] : []),\n'],
  // Dialog: o DS não tinha a seção; no neumorfismo ela entra depois do Alert Dialog, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoDialogoAlerta from "@/components/estilo/NeumorfismoDialogoAlerta";\n',
    'import NeumorfismoDialogoAlerta from "@/components/estilo/NeumorfismoDialogoAlerta";\nimport NeumorfismoDialogo from "@/components/estilo/NeumorfismoDialogo";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoDialogoAlerta />\n        </>\n      )}\n',
    '          <NeumorfismoDialogoAlerta />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="dialog" title="Dialog" description="Janela modal geral para formulários e conteúdo livre." />\n          <NeumorfismoDialogo />\n        </>\n      )}\n',
    'id="dialog"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Alert Dialog", path: "/componentes#alert-dialog" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Alert Dialog", path: "/componentes#alert-dialog" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Dialog", path: "/componentes#dialog" }] : []),\n'],
  // Sheet: o DS não tinha a seção; no neumorfismo ela entra depois do Dialog, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoDialogo from "@/components/estilo/NeumorfismoDialogo";\n',
    'import NeumorfismoDialogo from "@/components/estilo/NeumorfismoDialogo";\nimport NeumorfismoFolha from "@/components/estilo/NeumorfismoFolha";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoDialogo />\n        </>\n      )}\n',
    '          <NeumorfismoDialogo />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="sheet" title="Sheet" description="Painel que desliza de uma borda da tela, para editar sem sair da página." />\n          <NeumorfismoFolha />\n        </>\n      )}\n',
    'id="sheet"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Dialog", path: "/componentes#dialog" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Dialog", path: "/componentes#dialog" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Sheet", path: "/componentes#sheet" }] : []),\n'],
  // Drawer: o DS não tinha a seção; no neumorfismo ela entra depois do Sheet, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoFolha from "@/components/estilo/NeumorfismoFolha";\n',
    'import NeumorfismoFolha from "@/components/estilo/NeumorfismoFolha";\nimport NeumorfismoGaveta from "@/components/estilo/NeumorfismoGaveta";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoFolha />\n        </>\n      )}\n',
    '          <NeumorfismoFolha />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="drawer" title="Drawer" description="Painel com alça de arrastar, que vem da direita no desktop e de baixo no celular." />\n          <NeumorfismoGaveta />\n        </>\n      )}\n',
    'id="drawer"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Sheet", path: "/componentes#sheet" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Sheet", path: "/componentes#sheet" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Drawer", path: "/componentes#drawer" }] : []),\n'],
  // Popover: o DS não tinha a seção; no neumorfismo ela entra depois do Drawer, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoGaveta from "@/components/estilo/NeumorfismoGaveta";\n',
    'import NeumorfismoGaveta from "@/components/estilo/NeumorfismoGaveta";\nimport NeumorfismoPopovers from "@/components/estilo/NeumorfismoPopovers";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoGaveta />\n        </>\n      )}\n',
    '          <NeumorfismoGaveta />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="popover" title="Popover" description="Painel flutuante não modal, preso a um gatilho." />\n          <NeumorfismoPopovers />\n        </>\n      )}\n',
    'id="popover"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Drawer", path: "/componentes#drawer" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Drawer", path: "/componentes#drawer" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Popover", path: "/componentes#popover" }] : []),\n'],
  // HoverCard: o DS não tinha a seção; no neumorfismo ela entra depois do Popover, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoPopovers from "@/components/estilo/NeumorfismoPopovers";\n',
    'import NeumorfismoPopovers from "@/components/estilo/NeumorfismoPopovers";\nimport NeumorfismoHoverCards from "@/components/estilo/NeumorfismoHoverCards";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoPopovers />\n        </>\n      )}\n',
    '          <NeumorfismoPopovers />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="hovercard" title="HoverCard" description="Cartão de pré-visualização que abre ao passar o mouse ou focar um link." />\n          <NeumorfismoHoverCards />\n        </>\n      )}\n',
    'id="hovercard"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Popover", path: "/componentes#popover" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Popover", path: "/componentes#popover" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "HoverCard", path: "/componentes#hovercard" }] : []),\n'],

  // Tabs: o cartão passa a ser do próprio componente (código, "quando usar" e acessibilidade da API do pacote)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoHoverCards from "@/components/estilo/NeumorfismoHoverCards";\n',
    'import NeumorfismoHoverCards from "@/components/estilo/NeumorfismoHoverCards";\nimport NeumorfismoAbas from "@/components/estilo/NeumorfismoAbas";\n'],
  ["src/pages/ComponentesPage.tsx", '  const tabs = ["Visão geral", "Detalhes", "Histórico"];\n\n  return (\n    <ComponentPreview\n      title="Tabs"',
    '  const tabs = ["Visão geral", "Detalhes", "Histórico"];\n\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoAbas />;\n  return (\n    <ComponentPreview\n      title="Tabs"'],

  // Carousel: o DS não tinha a seção; no neumorfismo ela entra depois do HoverCard, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoAbas from "@/components/estilo/NeumorfismoAbas";\n',
    'import NeumorfismoAbas from "@/components/estilo/NeumorfismoAbas";\nimport NeumorfismoCarrossel from "@/components/estilo/NeumorfismoCarrossel";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoHoverCards />\n        </>\n      )}\n',
    '          <NeumorfismoHoverCards />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="carousel" title="Carousel" description="Fileira de slides que se move um passo por vez, por teclas, arrasto ou teclado." />\n          <NeumorfismoCarrossel />\n        </>\n      )}\n',
    'id="carousel"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "HoverCard", path: "/componentes#hovercard" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "HoverCard", path: "/componentes#hovercard" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Carousel", path: "/componentes#carousel" }] : []),\n'],

  // Collapsible: o DS não tinha a seção; no neumorfismo ela entra depois do Carousel, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoCarrossel from "@/components/estilo/NeumorfismoCarrossel";\n',
    'import NeumorfismoCarrossel from "@/components/estilo/NeumorfismoCarrossel";\nimport NeumorfismoRecolhiveis from "@/components/estilo/NeumorfismoRecolhivel";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoCarrossel />\n        </>\n      )}\n',
    '          <NeumorfismoCarrossel />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="collapsible" title="Collapsible" description="Cartão com cabeçalho sempre visível e uma região que abre e fecha." />\n          <NeumorfismoRecolhiveis />\n        </>\n      )}\n',
    'id="collapsible"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Carousel", path: "/componentes#carousel" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Carousel", path: "/componentes#carousel" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Collapsible", path: "/componentes#collapsible" }] : []),\n'],

  // Command: o DS não tinha a seção; no neumorfismo ela entra depois do Collapsible, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoRecolhiveis from "@/components/estilo/NeumorfismoRecolhivel";\n',
    'import NeumorfismoRecolhiveis from "@/components/estilo/NeumorfismoRecolhivel";\nimport NeumorfismoComandos from "@/components/estilo/NeumorfismoComandos";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoRecolhiveis />\n        </>\n      )}\n',
    '          <NeumorfismoRecolhiveis />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="command" title="Command" description="Lista de ações pesquisável, em página ou em paleta aberta com Ctrl/⌘ + K." />\n          <NeumorfismoComandos />\n        </>\n      )}\n',
    'id="command"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Collapsible", path: "/componentes#collapsible" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Collapsible", path: "/componentes#collapsible" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Command", path: "/componentes#command" }] : []),\n'],

  // Menubar: o DS não tinha a seção; no neumorfismo ela entra depois do Command, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoComandos from "@/components/estilo/NeumorfismoComandos";\n',
    'import NeumorfismoComandos from "@/components/estilo/NeumorfismoComandos";\nimport NeumorfismoMenubar from "@/components/estilo/NeumorfismoMenubar";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoComandos />\n        </>\n      )}\n',
    '          <NeumorfismoComandos />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="menubar" title="Menubar" description="Barra de menu de aplicativo, com painéis de comandos, submenus e itens marcáveis." />\n          <NeumorfismoMenubar />\n        </>\n      )}\n',
    'id="menubar"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Command", path: "/componentes#command" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Command", path: "/componentes#command" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Menubar", path: "/componentes#menubar" }] : []),\n'],

  // NavigationMenu: o DS não tinha a seção; no neumorfismo ela entra depois do Menubar, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoMenubar from "@/components/estilo/NeumorfismoMenubar";\n',
    'import NeumorfismoMenubar from "@/components/estilo/NeumorfismoMenubar";\nimport NeumorfismoNavegacaoSite from "@/components/estilo/NeumorfismoNavegacaoSite";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoMenubar />\n        </>\n      )}\n',
    '          <NeumorfismoMenubar />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="navigationmenu" title="NavigationMenu" description="Navegação de site com painéis de links, destaque e grade." />\n          <NeumorfismoNavegacaoSite />\n        </>\n      )}\n',
    'id="navigationmenu"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Menubar", path: "/componentes#menubar" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Menubar", path: "/componentes#menubar" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "NavigationMenu", path: "/componentes#navigationmenu" }] : []),\n'],

  // Accordion: o cartão passa a ser do próprio componente (código, "quando usar" e acessibilidade da API do pacote)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoNavegacaoSite from "@/components/estilo/NeumorfismoNavegacaoSite";\n',
    'import NeumorfismoNavegacaoSite from "@/components/estilo/NeumorfismoNavegacaoSite";\nimport NeumorfismoAcordeao from "@/components/estilo/NeumorfismoAcordeao";\n'],
  ["src/pages/ComponentesPage.tsx", '  ];\n\n  return (\n    <ComponentPreview\n      title="Accordion"',
    '  ];\n\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoAcordeao />;\n  return (\n    <ComponentPreview\n      title="Accordion"'],

  // Breadcrumb: o cartão passa a ser do próprio componente (duas variantes, código e acessibilidade da API do pacote)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoAcordeao from "@/components/estilo/NeumorfismoAcordeao";\n',
    'import NeumorfismoAcordeao from "@/components/estilo/NeumorfismoAcordeao";\nimport NeumorfismoBreadcrumb from "@/components/estilo/NeumorfismoBreadcrumb";\n'],
  ["src/pages/ComponentesPage.tsx", 'function BreadcrumbSection() {\n  return (\n    <ComponentPreview\n      title="Breadcrumb"',
    'function BreadcrumbSection() {\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoBreadcrumb />;\n  return (\n    <ComponentPreview\n      title="Breadcrumb"'],

  // Paginação e contador de página: os dois cartões passam a ser do próprio componente
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoBreadcrumb from "@/components/estilo/NeumorfismoBreadcrumb";\n',
    'import NeumorfismoBreadcrumb from "@/components/estilo/NeumorfismoBreadcrumb";\nimport NeumorfismoPaginacao from "@/components/estilo/NeumorfismoPaginacao";\n'],
  ["src/pages/ComponentesPage.tsx", 'function PaginationSection() {\n  const [page, setPage] = useState(1);\n  return (\n    <div className="space-y-8">',
    'function PaginationSection() {\n  const [page, setPage] = useState(1);\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoPaginacao />;\n  return (\n    <div className="space-y-8">'],

  // Dropdown Menu: o cartão passa a ser do próprio componente (padrão, lista e gatilho de ícone)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoPaginacao from "@/components/estilo/NeumorfismoPaginacao";\n',
    'import NeumorfismoPaginacao from "@/components/estilo/NeumorfismoPaginacao";\nimport NeumorfismoMenuSuspenso from "@/components/estilo/NeumorfismoMenuSuspenso";\n'],
  ["src/pages/ComponentesPage.tsx", '  const [selectedAction, setSelectedAction] = useState<string | null>(null);\n\n  return (\n    <ComponentPreview\n      title="Dropdown Menu"',
    '  const [selectedAction, setSelectedAction] = useState<string | null>(null);\n\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoMenuSuspenso />;\n  return (\n    <ComponentPreview\n      title="Dropdown Menu"'],

  // Menu Kebab: o cartão passa a ser do próprio componente (tecla convexa e tecla discreta)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoMenuSuspenso from "@/components/estilo/NeumorfismoMenuSuspenso";\n',
    'import NeumorfismoMenuSuspenso from "@/components/estilo/NeumorfismoMenuSuspenso";\nimport NeumorfismoKebab from "@/components/estilo/NeumorfismoKebab";\n'],
  ["src/pages/ComponentesPage.tsx", 'function MenuKebabSection() {\n  const [lastAction, setLastAction] = useState<string | null>(null);\n\n  return (\n    <ComponentPreview\n      title="Menu Kebab"',
    'function MenuKebabSection() {\n  const [lastAction, setLastAction] = useState<string | null>(null);\n\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoKebab />;\n  return (\n    <ComponentPreview\n      title="Menu Kebab"'],

  // Stepper: o cartão passa a ser do próprio componente (código, "quando usar" e acessibilidade da API do pacote)
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoKebab from "@/components/estilo/NeumorfismoKebab";\n',
    'import NeumorfismoKebab from "@/components/estilo/NeumorfismoKebab";\nimport NeumorfismoEtapas from "@/components/estilo/NeumorfismoEtapas";\n'],
  ["src/pages/ComponentesPage.tsx", '    { label: "Confirmação", description: "Envio e protocolo" },\n  ];\n\n  return (\n    <ComponentPreview\n      title="Barra de Etapas (Stepper)"',
    '    { label: "Confirmação", description: "Envio e protocolo" },\n  ];\n\n  if ((ESTILO.id as string) === "neumorfismo") return <NeumorfismoEtapas />;\n  return (\n    <ComponentPreview\n      title="Barra de Etapas (Stepper)"'],

  // Header: o DS não tinha a seção; no neumorfismo ela entra depois do NavigationMenu, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoEtapas from "@/components/estilo/NeumorfismoEtapas";\n',
    'import NeumorfismoEtapas from "@/components/estilo/NeumorfismoEtapas";\nimport NeumorfismoCabecalhos from "@/components/estilo/NeumorfismoCabecalhos";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoNavegacaoSite />\n        </>\n      )}\n',
    '          <NeumorfismoNavegacaoSite />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="header-topo" title="Header" description="Barra institucional do topo, em cinco variantes." />\n          <NeumorfismoCabecalhos />\n        </>\n      )}\n',
    'id="header-topo"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "NavigationMenu", path: "/componentes#navigationmenu" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "NavigationMenu", path: "/componentes#navigationmenu" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Header", path: "/componentes#header-topo" }] : []),\n'],

  // Footer: o DS não tinha a seção; no neumorfismo ela entra depois do Header, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoCabecalhos from "@/components/estilo/NeumorfismoCabecalhos";\n',
    'import NeumorfismoCabecalhos from "@/components/estilo/NeumorfismoCabecalhos";\nimport NeumorfismoRodapes from "@/components/estilo/NeumorfismoRodapes";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoCabecalhos />\n        </>\n      )}\n',
    '          <NeumorfismoCabecalhos />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="rodape" title="Footer" description="Rodapé padrão (slim) e rodapé completo, com links e ambiente." />\n          <NeumorfismoRodapes />\n        </>\n      )}\n',
    'id="rodape"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Header", path: "/componentes#header-topo" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Header", path: "/componentes#header-topo" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Footer", path: "/componentes#rodape" }] : []),\n'],

  // Sidebar (fixa): o DS não tinha a seção; no neumorfismo ela entra depois do Footer, com item no menu
  ["src/pages/ComponentesPage.tsx", 'import NeumorfismoRodapes from "@/components/estilo/NeumorfismoRodapes";\n',
    'import NeumorfismoRodapes from "@/components/estilo/NeumorfismoRodapes";\nimport NeumorfismoMenuLateral from "@/components/estilo/NeumorfismoMenuLateral";\n'],
  ["src/pages/ComponentesPage.tsx", '          <NeumorfismoRodapes />\n        </>\n      )}\n',
    '          <NeumorfismoRodapes />\n        </>\n      )}\n\n      {(ESTILO.id as string) === "neumorfismo" && (\n        <>\n          <SectionHeader id="sidebar" title="Sidebar" description="Navegação lateral fixa, que recolhe numa trilha de 84px." />\n          <NeumorfismoMenuLateral />\n        </>\n      )}\n',
    'id="sidebar"'],
  ["src/components/DSLayout.tsx", '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Footer", path: "/componentes#rodape" }] : []),\n',
    '      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Footer", path: "/componentes#rodape" }] : []),\n      ...((ESTILO.id as string) === "neumorfismo" ? [{ label: "Sidebar", path: "/componentes#sidebar" }] : []),\n'],

  // Sidebar (gaveta, painel e workspace): seções à parte, encadeadas depois da Sidebar fixa
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoMenuLateral from \"@/components/estilo/NeumorfismoMenuLateral\";\n",
    "import NeumorfismoMenuLateral from \"@/components/estilo/NeumorfismoMenuLateral\";\nimport NeumorfismoGavetaLateral from \"@/components/estilo/NeumorfismoGavetaLateral\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoMenuLateral />\n        </>\n      )}\n",
    "          <NeumorfismoMenuLateral />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"sidebar-gaveta\" title=\"Sidebar · Gaveta\" description=\"Navegação lateral em gaveta, que desliza da esquerda sobre um véu desfocado.\" />\n          <NeumorfismoGavetaLateral />\n        </>\n      )}\n",
    "id=\"sidebar-gaveta\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar\", path: \"/componentes#sidebar\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar\", path: \"/componentes#sidebar\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar · Gaveta\", path: \"/componentes#sidebar-gaveta\" }] : []),\n"],
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoGavetaLateral from \"@/components/estilo/NeumorfismoGavetaLateral\";\n",
    "import NeumorfismoGavetaLateral from \"@/components/estilo/NeumorfismoGavetaLateral\";\nimport NeumorfismoPainelLateral from \"@/components/estilo/NeumorfismoPainelLateral\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoGavetaLateral />\n        </>\n      )}\n",
    "          <NeumorfismoGavetaLateral />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"sidebar-painel\" title=\"Sidebar · Painel\" description=\"Painel de navegação embutido no layout, que recolhe de 260px para 68px.\" />\n          <NeumorfismoPainelLateral />\n        </>\n      )}\n",
    "id=\"sidebar-painel\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar · Gaveta\", path: \"/componentes#sidebar-gaveta\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar · Gaveta\", path: \"/componentes#sidebar-gaveta\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar · Painel\", path: \"/componentes#sidebar-painel\" }] : []),\n"],
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoPainelLateral from \"@/components/estilo/NeumorfismoPainelLateral\";\n",
    "import NeumorfismoPainelLateral from \"@/components/estilo/NeumorfismoPainelLateral\";\nimport NeumorfismoWorkspaceLateral from \"@/components/estilo/NeumorfismoWorkspaceLateral\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoPainelLateral />\n        </>\n      )}\n",
    "          <NeumorfismoPainelLateral />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"sidebar-workspace\" title=\"Sidebar · Workspace\" description=\"Navegação de aplicativo com troca de espaço, seções, aviso e menu do usuário.\" />\n          <NeumorfismoWorkspaceLateral />\n        </>\n      )}\n",
    "id=\"sidebar-workspace\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar · Painel\", path: \"/componentes#sidebar-painel\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar · Painel\", path: \"/componentes#sidebar-painel\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar · Workspace\", path: \"/componentes#sidebar-workspace\" }] : []),\n"],

  // Avatar (Data display): o DS não tinha a seção; no neumorfismo ela entra depois das variantes da Sidebar
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoWorkspaceLateral from \"@/components/estilo/NeumorfismoWorkspaceLateral\";\n",
    "import NeumorfismoWorkspaceLateral from \"@/components/estilo/NeumorfismoWorkspaceLateral\";\nimport NeumorfismoAvatares from \"@/components/estilo/NeumorfismoAvatares\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoWorkspaceLateral />\n        </>\n      )}\n",
    "          <NeumorfismoWorkspaceLateral />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"avatar\" title=\"Avatar\" description=\"Foto ou iniciais de uma pessoa num disco convexo, com status e grupo sobreposto.\" />\n          <NeumorfismoAvatares />\n        </>\n      )}\n",
    "id=\"avatar\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar · Workspace\", path: \"/componentes#sidebar-workspace\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Sidebar · Workspace\", path: \"/componentes#sidebar-workspace\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Avatar\", path: \"/componentes#avatar\" }] : []),\n"],

  // Bubble (Data display): seção nova, depois do Avatar
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoAvatares from \"@/components/estilo/NeumorfismoAvatares\";\n",
    "import NeumorfismoAvatares from \"@/components/estilo/NeumorfismoAvatares\";\nimport NeumorfismoBaloes from \"@/components/estilo/NeumorfismoBaloes\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoAvatares />\n        </>\n      )}\n",
    "          <NeumorfismoAvatares />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"bubble\" title=\"Bubble\" description=\"Balão de mensagem de conversa, com grupo, reações, hora e status de envio.\" />\n          <NeumorfismoBaloes />\n        </>\n      )}\n",
    "id=\"bubble\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Avatar\", path: \"/componentes#avatar\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Avatar\", path: \"/componentes#avatar\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Bubble\", path: \"/componentes#bubble\" }] : []),\n"],

  // Message (Data display): seção nova, depois do Bubble
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoBaloes from \"@/components/estilo/NeumorfismoBaloes\";\n",
    "import NeumorfismoBaloes from \"@/components/estilo/NeumorfismoBaloes\";\nimport NeumorfismoMensagens from \"@/components/estilo/NeumorfismoMensagens\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoBaloes />\n        </>\n      )}\n",
    "          <NeumorfismoBaloes />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"message\" title=\"Message\" description=\"Uma vez da conversa: avatar, balões, nome e rodapé, alinhada ao outro ou a você.\" />\n          <NeumorfismoMensagens />\n        </>\n      )}\n",
    "id=\"message\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Bubble\", path: \"/componentes#bubble\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Bubble\", path: \"/componentes#bubble\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Message\", path: \"/componentes#message\" }] : []),\n"],

  // MessageScroller (Data display): seção nova, depois do Message
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoMensagens from \"@/components/estilo/NeumorfismoMensagens\";\n",
    "import NeumorfismoMensagens from \"@/components/estilo/NeumorfismoMensagens\";\nimport NeumorfismoRolagemMensagens from \"@/components/estilo/NeumorfismoRolagemMensagens\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoMensagens />\n        </>\n      )}\n",
    "          <NeumorfismoMensagens />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"message-scroller\" title=\"MessageScroller\" description=\"Registro de conversa preso à mensagem mais nova, com âncora de turno e tecla para ir à mais recente.\" />\n          <NeumorfismoRolagemMensagens />\n        </>\n      )}\n",
    "id=\"message-scroller\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Message\", path: \"/componentes#message\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Message\", path: \"/componentes#message\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"MessageScroller\", path: \"/componentes#message-scroller\" }] : []),\n"],

  // Marker (Data display): seção nova, depois do MessageScroller (o componente nasceu com o Message)
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoRolagemMensagens from \"@/components/estilo/NeumorfismoRolagemMensagens\";\n",
    "import NeumorfismoRolagemMensagens from \"@/components/estilo/NeumorfismoRolagemMensagens\";\nimport NeumorfismoMarcadores from \"@/components/estilo/NeumorfismoMarcadores\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoRolagemMensagens />\n        </>\n      )}\n",
    "          <NeumorfismoRolagemMensagens />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"marker\" title=\"Marker\" description=\"Nota de sistema na linha de um feed: evento, estado ao vivo ou separador.\" />\n          <NeumorfismoMarcadores />\n        </>\n      )}\n",
    "id=\"marker\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"MessageScroller\", path: \"/componentes#message-scroller\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"MessageScroller\", path: \"/componentes#message-scroller\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Marker\", path: \"/componentes#marker\" }] : []),\n"],

  // Item (Data display): seção nova, depois do Marker
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoMarcadores from \"@/components/estilo/NeumorfismoMarcadores\";\n",
    "import NeumorfismoMarcadores from \"@/components/estilo/NeumorfismoMarcadores\";\nimport NeumorfismoItens from \"@/components/estilo/NeumorfismoItens\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoMarcadores />\n        </>\n      )}\n",
    "          <NeumorfismoMarcadores />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"item\" title=\"Item\" description=\"Linha flexível com mídia, título, descrição e ações; link, botão ou estática, e em grupo.\" />\n          <NeumorfismoItens />\n        </>\n      )}\n",
    "id=\"item\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Marker\", path: \"/componentes#marker\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Marker\", path: \"/componentes#marker\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Item\", path: \"/componentes#item\" }] : []),\n"],

  // Kbd (Data display): seção nova, depois do Item
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoItens from \"@/components/estilo/NeumorfismoItens\";\n",
    "import NeumorfismoItens from \"@/components/estilo/NeumorfismoItens\";\nimport NeumorfismoTeclas from \"@/components/estilo/NeumorfismoTeclas\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoItens />\n        </>\n      )}\n",
    "          <NeumorfismoItens />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"kbd\" title=\"Kbd\" description=\"Teclas convexas para atalhos: uma tecla ou um grupo, no texto, em botões e em tooltips.\" />\n          <NeumorfismoTeclas />\n        </>\n      )}\n",
    "id=\"kbd\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Item\", path: \"/componentes#item\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Item\", path: \"/componentes#item\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Kbd\", path: \"/componentes#kbd\" }] : []),\n"],

  // KpiCard (Data display): integra o cartão "Big Numbers / KPIs" que o DS já tem; no neumorfismo a vitrine é a do
  // pacote (três grandes, quatro tingidos e três em linha); nos demais estilos, a de sempre
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoTeclas from \"@/components/estilo/NeumorfismoTeclas\";\n",
    "import NeumorfismoTeclas from \"@/components/estilo/NeumorfismoTeclas\";\nimport NeumorfismoKpis from \"@/components/estilo/NeumorfismoKpis\";\n"],
  ["src/pages/ComponentesPage.tsx",
    "    >\n      <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4\">\n        {[\n",
    "    >\n      {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoKpis /> : (\n      <>\n      <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4\">\n        {[\n"],
  ["src/pages/ComponentesPage.tsx",
    "        </div>\n      </div>\n    </ComponentPreview>\n  );\n}\n\n/* ==================== UPLOAD EM MASSA ==================== */\n",
    "        </div>\n      </div>\n      </>\n      )}\n    </ComponentPreview>\n  );\n}\n\n/* ==================== UPLOAD EM MASSA ==================== */\n"],

  // IndicatorCard (Data display): seção nova, depois do Big Numbers / KPIs
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoKpis from \"@/components/estilo/NeumorfismoKpis\";\n",
    "import NeumorfismoKpis from \"@/components/estilo/NeumorfismoKpis\";\nimport NeumorfismoIndicadores from \"@/components/estilo/NeumorfismoIndicadores\";\n"],
  ["src/pages/ComponentesPage.tsx", "      <BigNumbersSection />\n",
    "      <BigNumbersSection />\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"indicator-card\" title=\"IndicatorCard\" description=\"Um número de destaque num leito afundado, com legenda, variação e hora da última atualização.\" />\n          <NeumorfismoIndicadores />\n        </>\n      )}\n",
    "id=\"indicator-card\""],
  ["src/components/DSLayout.tsx", "      { label: \"Big Numbers / KPIs\", path: \"/componentes#big-numbers\" },\n",
    "      { label: \"Big Numbers / KPIs\", path: \"/componentes#big-numbers\" },\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"IndicatorCard\", path: \"/componentes#indicator-card\" }] : []),\n"],

  // StatCard (Data display): seção nova, depois do IndicatorCard
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoIndicadores from \"@/components/estilo/NeumorfismoIndicadores\";\n",
    "import NeumorfismoIndicadores from \"@/components/estilo/NeumorfismoIndicadores\";\nimport NeumorfismoMetas from \"@/components/estilo/NeumorfismoMetas\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoIndicadores />\n        </>\n      )}\n",
    "          <NeumorfismoIndicadores />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"stat-card\" title=\"StatCard\" description=\"Uma estatística contra a meta: valor, calha de progresso e a escala 0% · Meta · 100%.\" />\n          <NeumorfismoMetas />\n        </>\n      )}\n",
    "id=\"stat-card\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"IndicatorCard\", path: \"/componentes#indicator-card\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"IndicatorCard\", path: \"/componentes#indicator-card\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"StatCard\", path: \"/componentes#stat-card\" }] : []),\n"],

  // StatisticCard (Data display): seção nova, depois do StatCard
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoMetas from \"@/components/estilo/NeumorfismoMetas\";\n",
    "import NeumorfismoMetas from \"@/components/estilo/NeumorfismoMetas\";\nimport NeumorfismoEstatisticas from \"@/components/estilo/NeumorfismoEstatisticas\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoMetas />\n        </>\n      )}\n",
    "          <NeumorfismoMetas />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"statistic-card\" title=\"StatisticCard\" description=\"Sete cartões de estatística para painéis: meta, comparação, destaque, rosca, barras, área e relatório.\" />\n          <NeumorfismoEstatisticas />\n        </>\n      )}\n",
    "id=\"statistic-card\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"StatCard\", path: \"/componentes#stat-card\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"StatCard\", path: \"/componentes#stat-card\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"StatisticCard\", path: \"/componentes#statistic-card\" }] : []),\n"],

  // MetricCard (Data display): seção nova, depois do StatisticCard
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoEstatisticas from \"@/components/estilo/NeumorfismoEstatisticas\";\n",
    "import NeumorfismoEstatisticas from \"@/components/estilo/NeumorfismoEstatisticas\";\nimport NeumorfismoMetricas from \"@/components/estilo/NeumorfismoMetricas\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoEstatisticas />\n        </>\n      )}\n",
    "          <NeumorfismoEstatisticas />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"metric-card\" title=\"MetricCard\" description=\"Uma métrica com um mini gráfico ao lado: um anel de percentual ou uma série de barras.\" />\n          <NeumorfismoMetricas />\n        </>\n      )}\n",
    "id=\"metric-card\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"StatisticCard\", path: \"/componentes#statistic-card\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"StatisticCard\", path: \"/componentes#statistic-card\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"MetricCard\", path: \"/componentes#metric-card\" }] : []),\n"],

  // BarChart (Data display): seção nova, depois do MetricCard
  ["src/pages/ComponentesPage.tsx", "import NeumorfismoMetricas from \"@/components/estilo/NeumorfismoMetricas\";\n",
    "import NeumorfismoMetricas from \"@/components/estilo/NeumorfismoMetricas\";\nimport NeumorfismoGraficoBarras from \"@/components/estilo/NeumorfismoGraficoBarras\";\n"],
  ["src/pages/ComponentesPage.tsx", "          <NeumorfismoMetricas />\n        </>\n      )}\n",
    "          <NeumorfismoMetricas />\n        </>\n      )}\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"bar-chart\" title=\"BarChart\" description=\"Barras verticais em forma de pílula, esculpidas num leito, com a barra destacada em relevo.\" />\n          <NeumorfismoGraficoBarras />\n        </>\n      )}\n",
    "id=\"bar-chart\""],
  ["src/components/DSLayout.tsx", "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"MetricCard\", path: \"/componentes#metric-card\" }] : []),\n",
    "      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"MetricCard\", path: \"/componentes#metric-card\" }] : []),\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"BarChart\", path: \"/componentes#bar-chart\" }] : []),\n"],

  // AreaChart (Data display): integra o cartão "Gráfico de Área Básico" da seção Gráficos; no neumorfismo a vitrine é a
  // do pacote (SVG próprio, com balão e teclado); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import { ComponentPreview, SectionHeader } from \"@/components/DSComponents\";\n",
    "import { ComponentPreview, SectionHeader } from \"@/components/DSComponents\";\nimport { ESTILO } from \"@/config/estilo\";\nimport NeumorfismoAreaBasico from \"@/components/estilo/NeumorfismoGraficoArea\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Basic Area Chart\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoAreaBasico /> : (\n        <ChartCard title=\"Basic Area Chart\">\n"],
  ["src/components/ChartsSection.tsx", "          </ResponsiveContainer>\n        </ChartCard>\n      </ComponentPreview>\n\n      {/* 2. Spline Area */}\n",
    "          </ResponsiveContainer>\n        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 2. Spline Area */}\n"],

  // MultiAreaChart (Data display): integra o cartão "Spline Area (Múltiplas séries)"; no neumorfismo a vitrine é a do
  // pacote (o mesmo motor do AreaChart, com legenda); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoAreaBasico from \"@/components/estilo/NeumorfismoGraficoArea\";\n",
    "import NeumorfismoAreaBasico from \"@/components/estilo/NeumorfismoGraficoArea\";\nimport NeumorfismoAreaMultipla from \"@/components/estilo/NeumorfismoGraficoAreaMultipla\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Spline Area\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoAreaMultipla /> : (\n        <ChartCard title=\"Spline Area\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 3. Time Series with filter */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 3. Time Series with filter */}\n"],

  // TimeAreaChart (Data display): integra o cartão "Área com Eixo Temporal e Filtro"; no neumorfismo a vitrine é a do
  // pacote (eixo de datas, seletor de período e destaque do último valor); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoAreaMultipla from \"@/components/estilo/NeumorfismoGraficoAreaMultipla\";\n",
    "import NeumorfismoAreaMultipla from \"@/components/estilo/NeumorfismoGraficoAreaMultipla\";\nimport NeumorfismoAreaTemporal from \"@/components/estilo/NeumorfismoGraficoAreaTemporal\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Area Chart — Datetime X-axis\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoAreaTemporal /> : (\n        <ChartCard title=\"Area Chart — Datetime X-axis\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 4. Negative Values */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 4. Negative Values */}\n"],

  // SignedAreaChart (Data display): integra o cartão "Área com Valores Negativos"; no neumorfismo a vitrine é a do
  // pacote (o mesmo motor do AreaChart, com o zero como referência); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoAreaTemporal from \"@/components/estilo/NeumorfismoGraficoAreaTemporal\";\n",
    "import NeumorfismoAreaTemporal from \"@/components/estilo/NeumorfismoGraficoAreaTemporal\";\nimport NeumorfismoAreaComSinal from \"@/components/estilo/NeumorfismoGraficoAreaComSinal\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Area with Negative Values\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoAreaComSinal /> : (\n        <ChartCard title=\"Area with Negative Values\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 5. Stacked Area */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 5. Stacked Area */}\n"],

  // StackedAreaChart (Data display): integra o cartão "Área Empilhada (Stacked)"; no neumorfismo a vitrine é a do
  // pacote (o mesmo motor do AreaChart, com as séries empilhadas); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoAreaComSinal from \"@/components/estilo/NeumorfismoGraficoAreaComSinal\";\n",
    "import NeumorfismoAreaComSinal from \"@/components/estilo/NeumorfismoGraficoAreaComSinal\";\nimport NeumorfismoAreaEmpilhada from \"@/components/estilo/NeumorfismoGraficoAreaEmpilhada\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Stacked Area\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoAreaEmpilhada /> : (\n        <ChartCard title=\"Stacked Area\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 6. Bar Chart */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 6. Bar Chart */}\n"],

  // GroupedBarChart (Data display): integra o cartão "Gráfico de Barras"; no neumorfismo a vitrine é a do pacote (barras
  // lado a lado e empilhadas, em SVG, com balão e teclado); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoAreaEmpilhada from \"@/components/estilo/NeumorfismoGraficoAreaEmpilhada\";\n",
    "import NeumorfismoAreaEmpilhada from \"@/components/estilo/NeumorfismoGraficoAreaEmpilhada\";\nimport NeumorfismoBarrasAgrupadas from \"@/components/estilo/NeumorfismoGraficoBarrasAgrupadas\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Bar Chart\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoBarrasAgrupadas /> : (\n        <ChartCard title=\"Bar Chart\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 7. Multi-Line */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 7. Multi-Line */}\n"],

  // ColumnChart (Data display): integra o cartão "Colunas Básicas (Múltiplas séries)"; no neumorfismo a vitrine é a do
  // pacote (colunas agrupadas, cada uma no seu vão afundado); nos demais estilos, o Recharts de sempre. A âncora do
  // início para antes da marca do título (que muda de projeto para projeto)
  ["src/components/ChartsSection.tsx", "import NeumorfismoBarrasAgrupadas from \"@/components/estilo/NeumorfismoGraficoBarrasAgrupadas\";\n",
    "import NeumorfismoBarrasAgrupadas from \"@/components/estilo/NeumorfismoGraficoBarrasAgrupadas\";\nimport NeumorfismoColunas from \"@/components/estilo/NeumorfismoGraficoColunas\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Colunas Básicas — Programas ",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoColunas /> : (\n        <ChartCard title=\"Colunas Básicas — Programas "],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 12. Column with Data Labels */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 12. Column with Data Labels */}\n"],

  // DataLabelChart (Data display): integra o cartão "Colunas com Data Labels"; no neumorfismo a vitrine é a do pacote
  // (colunas com o valor numa pílula acima de cada uma); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoColunas from \"@/components/estilo/NeumorfismoGraficoColunas\";\n",
    "import NeumorfismoColunas from \"@/components/estilo/NeumorfismoGraficoColunas\";\nimport NeumorfismoColunasRotulos from \"@/components/estilo/NeumorfismoGraficoColunasRotulos\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Gráfico de Colunas com Rótulos de Dados\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoColunasRotulos /> : (\n        <ChartCard title=\"Gráfico de Colunas com Rótulos de Dados\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 13. Stacked Column */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 13. Stacked Column */}\n"],

  // PercentColumnChart (Data display): integra o cartão "Colunas 100% Empilhadas"; no neumorfismo a vitrine é a do pacote
  // (colunas em 100%, com a fatia numa pílula dentro de cada segmento); nos demais estilos, o Recharts de sempre. A âncora
  // do início para antes da marca do título (que muda de projeto para projeto)
  ["src/components/ChartsSection.tsx", "import NeumorfismoColunasRotulos from \"@/components/estilo/NeumorfismoGraficoColunasRotulos\";\n",
    "import NeumorfismoColunasRotulos from \"@/components/estilo/NeumorfismoGraficoColunasRotulos\";\nimport NeumorfismoColunasPercentuais from \"@/components/estilo/NeumorfismoGraficoColunasPercentuais\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"100% Empilhadas — Programas ",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoColunasPercentuais /> : (\n        <ChartCard title=\"100% Empilhadas — Programas "],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 15. Grouped + Stacked */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 15. Grouped + Stacked */}\n"],

  // GroupedStackedChart (Data display): integra o cartão "Colunas Agrupadas + Empilhadas"; no neumorfismo a vitrine é a do
  // pacote (uma coluna por pilha, cada uma empilhada por série, com subtotais no balão); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoColunasPercentuais from \"@/components/estilo/NeumorfismoGraficoColunasPercentuais\";\n",
    "import NeumorfismoColunasPercentuais from \"@/components/estilo/NeumorfismoGraficoColunasPercentuais\";\nimport NeumorfismoColunasAgrupadasEmpilhadas from \"@/components/estilo/NeumorfismoGraficoColunasAgrupadasEmpilhadas\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Grouped Stacked Column Chart\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoColunasAgrupadasEmpilhadas /> : (\n        <ChartCard title=\"Grouped Stacked Column Chart\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 16. Horizontal Bar */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 16. Horizontal Bar */}\n"],

  // HorizontalBarChart (Data display): integra o cartão "Barras Horizontais"; no neumorfismo a vitrine é a do pacote
  // (ranking com discos de posição, vãos em pílula e barras em degradê); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoColunasAgrupadasEmpilhadas from \"@/components/estilo/NeumorfismoGraficoColunasAgrupadasEmpilhadas\";\n",
    "import NeumorfismoColunasAgrupadasEmpilhadas from \"@/components/estilo/NeumorfismoGraficoColunasAgrupadasEmpilhadas\";\nimport NeumorfismoBarrasHorizontais from \"@/components/estilo/NeumorfismoGraficoBarrasHorizontais\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Horizontal Bar Chart\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoBarrasHorizontais /> : (\n        <ChartCard title=\"Horizontal Bar Chart\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n    </>\n  );\n}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n    </>\n  );\n}\n"],

  // MultiLineChart (Data display): integra o cartão "Gráfico de Linhas Múltiplas"; no neumorfismo a vitrine é a do pacote
  // (o mesmo motor do AreaChart, só linhas, com sulco sob cada uma); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoBarrasHorizontais from \"@/components/estilo/NeumorfismoGraficoBarrasHorizontais\";\n",
    "import NeumorfismoBarrasHorizontais from \"@/components/estilo/NeumorfismoGraficoBarrasHorizontais\";\nimport NeumorfismoLinhas from \"@/components/estilo/NeumorfismoGraficoLinhas\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Multi-Line Chart\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoLinhas /> : (\n        <ChartCard title=\"Multi-Line Chart\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 8. Donut / Pie */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 8. Donut / Pie */}\n"],

  // DonutChart (Data display): integra o cartão "Gráfico de Rosca (Donut)"; no neumorfismo a vitrine é a do pacote (anel
  // sobre uma base neumórfica, com o total num botão convexo no centro); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoLinhas from \"@/components/estilo/NeumorfismoGraficoLinhas\";\n",
    "import NeumorfismoLinhas from \"@/components/estilo/NeumorfismoGraficoLinhas\";\nimport NeumorfismoRosca from \"@/components/estilo/NeumorfismoGraficoRosca\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Donut Chart\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoRosca /> : (\n        <ChartCard title=\"Donut Chart\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 9. Composed Chart */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 9. Composed Chart */}\n"],

  // ComposedChart (Data display): integra o cartão "Gráfico Composto (Área + Barra + Linha)"; no neumorfismo a vitrine é a do
  // pacote (área, barras e linhas num eixo só, e um segundo eixo à direita); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoRosca from \"@/components/estilo/NeumorfismoGraficoRosca\";\n",
    "import NeumorfismoRosca from \"@/components/estilo/NeumorfismoGraficoRosca\";\nimport NeumorfismoComposto from \"@/components/estilo/NeumorfismoGraficoComposto\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Composed Chart\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoComposto /> : (\n        <ChartCard title=\"Composed Chart\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* 10. Radial Bar */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* 10. Radial Bar */}\n"],

  // GaugeChart (Data display): integra o cartão "Gráfico Radial (Gauge)"; no neumorfismo a vitrine é a do pacote (meio disco
  // em relevo com os anéis em canais afundados e a legenda à direita); nos demais estilos, o Recharts de sempre
  ["src/components/ChartsSection.tsx", "import NeumorfismoComposto from \"@/components/estilo/NeumorfismoGraficoComposto\";\n",
    "import NeumorfismoComposto from \"@/components/estilo/NeumorfismoGraficoComposto\";\nimport NeumorfismoMedidor from \"@/components/estilo/NeumorfismoGraficoMedidor\";\n"],
  ["src/components/ChartsSection.tsx", "        <ChartCard title=\"Radial Bar Chart\">\n",
    "        {(ESTILO.id as string) === \"neumorfismo\" ? <NeumorfismoMedidor /> : (\n        <ChartCard title=\"Radial Bar Chart\">\n"],
  ["src/components/ChartsSection.tsx", "        </ChartCard>\n      </ComponentPreview>\n\n      {/* ===== COLUMN / BAR CHARTS ===== */}\n",
    "        </ChartCard>\n        )}\n      </ComponentPreview>\n\n      {/* ===== COLUMN / BAR CHARTS ===== */}\n"],

  // Table (Data display): a seção "Tabela" passa a ser do próprio componente (onze cartões: básica, moldurada, listrada, com
  // bordas, sem bordas, compacta, com hover, cabeçalho destacado, aninhada, com legenda e com seleção); nos demais estilos, a
  // vitrine de sempre
  ["src/pages/ComponentesPage.tsx", 'import { Link } from "react-router-dom";\n',
    'import { Link } from "react-router-dom";\nimport NeumorfismoTabelas from "@/components/estilo/NeumorfismoTabelas";\n'],
  ["src/pages/ComponentesPage.tsx","function TableSection() {\n  const [expandedRow, setExpandedRow] = useState<number | null>(null);\n\n  const thClass","function TableSection() {\n  const [expandedRow, setExpandedRow] = useState<number | null>(null);\n\n  if ((ESTILO.id as string) === \"neumorfismo\") return <NeumorfismoTabelas />;\n\n  const thClass"],

  // DescriptionList (Data display): o cartão "Lista Descritiva" passa a ser do próprio componente (painel, grade afundada e
  // elevada, linhas divididas e empilhada); nos demais estilos, a vitrine de sempre
  ["src/pages/ComponentesPage.tsx","import NeumorfismoTabelas from \"@/components/estilo/NeumorfismoTabelas\";\n","import NeumorfismoTabelas from \"@/components/estilo/NeumorfismoTabelas\";\nimport NeumorfismoListaDescritiva from \"@/components/estilo/NeumorfismoListaDescritiva\";\n"],
  ["src/pages/ComponentesPage.tsx","function DescriptionListSection() {\n  return (\n    <ComponentPreview\n      title=\"Lista Descritiva\"","function DescriptionListSection() {\n  if ((ESTILO.id as string) === \"neumorfismo\") return <NeumorfismoListaDescritiva />;\n  return (\n    <ComponentPreview\n      title=\"Lista Descritiva\""],

  // FilterBar (Data display): o cartão "Filtros Dinâmicos" passa a ser do próprio componente (barra em linha, com e sem
  // moldura, e o painel); nos demais estilos, a vitrine de sempre
  ["src/pages/ComponentesPage.tsx","import NeumorfismoListaDescritiva from \"@/components/estilo/NeumorfismoListaDescritiva\";\n","import NeumorfismoListaDescritiva from \"@/components/estilo/NeumorfismoListaDescritiva\";\nimport NeumorfismoFiltros from \"@/components/estilo/NeumorfismoFiltros\";\n"],
  ["src/pages/ComponentesPage.tsx","  return (\n    <ComponentPreview\n      title=\"Filtros Dinâmicos\"","  if ((ESTILO.id as string) === \"neumorfismo\") return <NeumorfismoFiltros />;\n  return (\n    <ComponentPreview\n      title=\"Filtros Dinâmicos\""],

  // Upload e BulkUpload (Data display): a seção "Upload em Massa" passa a mostrar o cartão "Upload" do pacote (área de soltar e
  // linhas por arquivo) e o cartão do upload em massa (envio simulado, limites e resumo). Nos demais estilos, a vitrine de sempre
  ["src/pages/ComponentesPage.tsx","import NeumorfismoFiltros from \"@/components/estilo/NeumorfismoFiltros\";\n","import NeumorfismoFiltros from \"@/components/estilo/NeumorfismoFiltros\";\nimport NeumorfismoUpload from \"@/components/estilo/NeumorfismoUpload\";\nimport NeumorfismoUploadEmMassa from \"@/components/estilo/NeumorfismoUploadEmMassa\";\n"],
  ["src/pages/ComponentesPage.tsx","  return (\n    <ComponentPreview\n      title=\"Upload em Massa com Progresso\"","  if ((ESTILO.id as string) === \"neumorfismo\") return (\n    <>\n      <NeumorfismoUpload />\n      <NeumorfismoUploadEmMassa />\n    </>\n  );\n  return (\n    <ComponentPreview\n      title=\"Upload em Massa com Progresso\""],

  // Attachment (Data display): seção nova, depois do Upload em Massa
  ["src/pages/ComponentesPage.tsx","import NeumorfismoUploadEmMassa from \"@/components/estilo/NeumorfismoUploadEmMassa\";\n","import NeumorfismoUploadEmMassa from \"@/components/estilo/NeumorfismoUploadEmMassa\";\nimport NeumorfismoAnexos from \"@/components/estilo/NeumorfismoAnexos\";\n"],
  ["src/pages/ComponentesPage.tsx","      <BulkUploadSection />\n","      <BulkUploadSection />\n\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <>\n          <SectionHeader id=\"anexos\" title=\"Anexos\" description=\"Chip compacto para um arquivo ou imagem anexada, com estado de envio, erro e ações, avulso ou em grupo.\" />\n          <NeumorfismoAnexos />\n        </>\n      )}\n","id=\"anexos\""],
  ["src/components/DSLayout.tsx","      { label: \"Upload em Massa\", path: \"/componentes#upload\" },\n","      { label: \"Upload em Massa\", path: \"/componentes#upload\" },\n      ...((ESTILO.id as string) === \"neumorfismo\" ? [{ label: \"Anexos\", path: \"/componentes#anexos\" }] : []),\n"],

  // SignIn (Templates): as duas vitrines de login (aba "Sign In" dos modelos de login e o modelo em cartão) passam a ser do
  // próprio template; nos demais estilos, a vitrine de sempre
  ["src/components/templates/AuthTemplates.tsx","import { brandCor as brandLogoCompleta } from \"@/assets/brand\";\n","import { brandCor as brandLogoCompleta } from \"@/assets/brand\";\nimport { ESTILO } from \"@/config/estilo\";\nimport { ExemploEntrar } from \"@/components/estilo/NeumorfismoSignIn\";\n"],
  ["src/components/templates/AuthTemplates.tsx","        {activeTab === \"signin\" && <SignInPreview />}\n","        {activeTab === \"signin\" && ((ESTILO.id as string) === \"neumorfismo\" ? <ExemploEntrar /> : <SignInPreview />)}\n"],
  ["src/components/templates/CardSignIn.tsx","import { brandCor as brandLogo } from \"@/assets/brand\";\n","import { brandCor as brandLogo } from \"@/assets/brand\";\nimport { ESTILO } from \"@/config/estilo\";\nimport { ExemploEntrarCartao } from \"@/components/estilo/NeumorfismoSignIn\";\n"],
  ["src/components/templates/CardSignIn.tsx","      <CardSignInPreview />\n    </ComponentPreview>","      {(ESTILO.id as string) === \"neumorfismo\" ? <ExemploEntrarCartao /> : <CardSignInPreview />}\n    </ComponentPreview>"],

  // SignUp (Templates): a aba "Sign Up" dos modelos de login passa a ser do próprio template; nos demais estilos, a vitrine de sempre
  ["src/components/templates/AuthTemplates.tsx","import { ExemploEntrar } from \"@/components/estilo/NeumorfismoSignIn\";\n","import { ExemploEntrar } from \"@/components/estilo/NeumorfismoSignIn\";\nimport { ExemploCadastro } from \"@/components/estilo/NeumorfismoSignUp\";\n"],
  ["src/components/templates/AuthTemplates.tsx","        {activeTab === \"signup\" && <SignUpPreview />}\n","        {activeTab === \"signup\" && ((ESTILO.id as string) === \"neumorfismo\" ? <ExemploCadastro /> : <SignUpPreview />)}\n"],

  // TwoFactor (Templates): a aba "Two-Factor" dos modelos de login passa a ser do próprio template; nos demais estilos, a vitrine de sempre
  ["src/components/templates/AuthTemplates.tsx","import { ExemploCadastro } from \"@/components/estilo/NeumorfismoSignUp\";\n","import { ExemploCadastro } from \"@/components/estilo/NeumorfismoSignUp\";\nimport { ExemploVerificacao } from \"@/components/estilo/NeumorfismoTwoFactor\";\n"],
  ["src/components/templates/AuthTemplates.tsx","        {activeTab === \"2fa\" && <TwoFactorPreview />}\n","        {activeTab === \"2fa\" && ((ESTILO.id as string) === \"neumorfismo\" ? <ExemploVerificacao /> : <TwoFactorPreview />)}\n"],

  // Dashboard (Templates): o "Painel de atendimentos" do pacote entra como primeiro modelo da seção; nos demais estilos, só os modelos de sempre
  ["src/components/templates/DashboardTemplates.tsx","} from \"recharts\";\n","} from \"recharts\";\nimport { ESTILO } from \"@/config/estilo\";\nimport { ExemploPainel } from \"@/components/estilo/NeumorfismoDashboard\";\n"],
  ["src/components/templates/DashboardTemplates.tsx","    <div className=\"space-y-8\">\n      <ComponentPreview\n        title=\"Dashboard — Layout Completa\"","    <div className=\"space-y-8\">\n      {(ESTILO.id as string) === \"neumorfismo\" && (\n        <ComponentPreview\n          title=\"Dashboard — Painel de atendimentos\"\n          description=\"Tela de gestão completa montada só com os componentes do estilo: menu lateral e cabeçalho, filtros, KPIs, gráficos, metas por programa, detalhamento em abas, modal e toast. A grade segue o espaço da própria tela: até 1180px os gráficos ocupam a largura toda e, até 720px, tudo vira uma coluna.\"\n        >\n          <ExemploPainel />\n        </ComponentPreview>\n      )}\n      <ComponentPreview\n        title=\"Dashboard — Layout Completa\""],

  // Casca do DS: o cabeçalho e o menu lateral passam a ser o Header "barra" e a Sidebar em gaveta do estilo
  ["src/components/DSLayout.tsx","import { prefetchRoute, cancelPendingPrefetch } from \"@/utils/prefetchRoutes\";\n","import { prefetchRoute, cancelPendingPrefetch } from \"@/utils/prefetchRoutes\";\nimport CascaNeumorfismo from \"@/components/estilo/NeumorfismoCasca\";\n"],
  ["src/components/DSLayout.tsx","export default function DSLayout({ children }: { children: React.ReactNode }) {\n","// Neumorfismo: a casca usa o Header e a Sidebar validados em Componentes; nos demais estilos, a casca de sempre\nexport default function DSLayout({ children }: { children: React.ReactNode }) {\n  return (ESTILO.id as string) === \"neumorfismo\" ? <CascaNeumorfismo itens={navItems}>{children}</CascaNeumorfismo> : <DSLayoutOriginal>{children}</DSLayoutOriginal>;\n}\n\nfunction DSLayoutOriginal({ children }: { children: React.ReactNode }) {\n"],

  // Botões das páginas do DS: os <button> escritos à mão passam pelo BotaoDS, que no Neumorfismo renderiza o Button validado
  ["src/components/DSComponents.tsx","import { useState, useCallback } from \"react\";\n","import { useState, useCallback } from \"react\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/components/DSComponents.tsx","<button data-ds=\"button\" data-variant=\"toggle\"\n          onClick={handleCopy}\n          className={`absolute top-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm border ${\n            copied\n              ? \"bg-success/10 text-success border-success/30\"\n              : \"bg-primary text-primary-foreground border-primary hover:bg-primary/90\"\n          }`}\n          aria-label={copied ? \"Código copiado\" : \"Copiar código\"}\n          title={copied ? \"Copiado!\" : \"Copiar código\"}\n        >\n          {copied ? <Check size={14} /> : <Copy size={14} />}\n          <span>{copied ? \"Copiado\" : \"Copiar\"}</span>\n        </button>","<BotaoDS data-ds=\"button\" data-variant=\"toggle\"\n          onClick={handleCopy}\n          className={`absolute top-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm border ${\n            copied\n              ? \"bg-success/10 text-success border-success/30\"\n              : \"bg-primary text-primary-foreground border-primary hover:bg-primary/90\"\n          }`}\n          aria-label={copied ? \"Código copiado\" : \"Copiar código\"}\n          title={copied ? \"Copiado!\" : \"Copiar código\"}\n        >\n          {copied ? <Check size={14} /> : <Copy size={14} />}\n          <span>{copied ? \"Copiado\" : \"Copiar\"}</span>\n        </BotaoDS>"],
  ["src/components/ColorSection.tsx","import { useState, useCallback } from \"react\";\n","import { useState, useCallback } from \"react\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/components/ColorSection.tsx","<button data-ds=\"button\" data-variant=\"secondary\"\n      onClick={copy}\n      className=\"inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-1.5 py-0.5 rounded transition-colors\"\n      title={`Copiar ${value}`}\n      aria-label={`Copiar código hexadecimal ${value}`}\n    >\n      {copied ? <Check size={10} className=\"text-success\" /> : <Copy size={10} />}\n      {value}\n    </button>","<BotaoDS data-ds=\"button\" data-variant=\"secondary\"\n      onClick={copy}\n      className=\"inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-1.5 py-0.5 rounded transition-colors\"\n      title={`Copiar ${value}`}\n      aria-label={`Copiar código hexadecimal ${value}`}\n    >\n      {copied ? <Check size={10} className=\"text-success\" /> : <Copy size={10} />}\n      {value}\n    </BotaoDS>"],
  ["src/components/ColorSection.tsx","<button data-ds=\"button\" data-variant=\"secondary\"\n          onClick={copy}\n          className=\"inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-1.5 py-0.5 rounded transition-colors\"\n          title=\"Copiar CSS do gradiente\"\n          aria-label={`Copiar CSS do gradiente ${name}`}\n        >\n          {copied ? <Check size={10} className=\"text-success\" /> : <Copy size={10} />}\n          Copiar CSS\n        </button>","<BotaoDS data-ds=\"button\" data-variant=\"secondary\"\n          onClick={copy}\n          className=\"inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-1.5 py-0.5 rounded transition-colors\"\n          title=\"Copiar CSS do gradiente\"\n          aria-label={`Copiar CSS do gradiente ${name}`}\n        >\n          {copied ? <Check size={10} className=\"text-success\" /> : <Copy size={10} />}\n          Copiar CSS\n        </BotaoDS>"],
  ["src/components/TokenExplorer.tsx","import { useState } from \"react\";\n","import { useState } from \"react\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/components/TokenExplorer.tsx","<button data-ds=\"button\" data-variant=\"secondary\"\n      onClick={() => {\n        navigator.clipboard.writeText(value);\n        setCopied(true);\n        setTimeout(() => setCopied(false), 1500);\n      }}\n      className=\"inline-flex items-center gap-1.5 text-[10px] font-mono bg-muted hover:bg-muted/70 text-foreground px-2 py-1 rounded border border-border transition-colors\"\n      title=\"Copiar\"\n    >\n      <code>{value}</code>\n      {copied ? <Check size={10} className=\"text-success\" /> : <Copy size={10} className=\"opacity-60\" />}\n    </button>","<BotaoDS data-ds=\"button\" data-variant=\"secondary\"\n      onClick={() => {\n        navigator.clipboard.writeText(value);\n        setCopied(true);\n        setTimeout(() => setCopied(false), 1500);\n      }}\n      className=\"inline-flex items-center gap-1.5 text-[10px] font-mono bg-muted hover:bg-muted/70 text-foreground px-2 py-1 rounded border border-border transition-colors\"\n      title=\"Copiar\"\n    >\n      <code>{value}</code>\n      {copied ? <Check size={10} className=\"text-success\" /> : <Copy size={10} className=\"opacity-60\" />}\n    </BotaoDS>"],
  ["src/components/TokenExplorer.tsx","<button data-ds=\"button\" data-variant=\"toggle\"\n            key={t.id}\n            onClick={() => setTab(t.id)}\n            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${\n              tab === t.id\n                ? \"bg-primary text-primary-foreground shadow-sm\"\n                : \"text-muted-foreground hover:bg-background hover:text-foreground\"\n            }`}\n          >\n            {t.icon}\n            {t.label}\n          </button>","<BotaoDS data-ds=\"button\" data-variant=\"toggle\"\n            key={t.id}\n            onClick={() => setTab(t.id)}\n            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${\n              tab === t.id\n                ? \"bg-primary text-primary-foreground shadow-sm\"\n                : \"text-muted-foreground hover:bg-background hover:text-foreground\"\n            }`}\n          >\n            {t.icon}\n            {t.label}\n          </BotaoDS>"],
  ["src/pages/HomePage.tsx","import { useNavigate } from \"react-router-dom\";\n","import { useNavigate } from \"react-router-dom\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/pages/HomePage.tsx","<button data-ds=\"button\" data-variant=\"secondary\" onClick={() => navigate(\"/fundamentos\")}\n            className=\"inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded font-medium text-sm hover:opacity-90 transition-opacity\">\n            Começar <ArrowRight size={16} />\n          </button>","<BotaoDS data-ds=\"button\" data-variant=\"secondary\" onClick={() => navigate(\"/fundamentos\")}\n            className=\"inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded font-medium text-sm hover:opacity-90 transition-opacity\">\n            Começar <ArrowRight size={16} />\n          </BotaoDS>"],
  ["src/pages/HomePage.tsx","<button data-ds=\"button\" data-variant=\"marca\" onClick={() => navigate(\"/componentes\")}\n            className=\"inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground px-4 py-2 rounded font-medium text-sm hover:bg-primary-foreground/20 transition-colors\">\n            Ver componentes\n          </button>","<BotaoDS data-ds=\"button\" data-variant=\"marca\" onClick={() => navigate(\"/componentes\")}\n            className=\"inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground px-4 py-2 rounded font-medium text-sm hover:bg-primary-foreground/20 transition-colors\">\n            Ver componentes\n          </BotaoDS>"],
  ["src/pages/FundamentosPage.tsx","import { useState, useRef, useEffect } from \"react\";\n","import { useState, useRef, useEffect } from \"react\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/pages/FundamentosPage.tsx","<button\n        type=\"button\"\n        onClick={handleCopy}\n        aria-label={`Copiar SVG do ícone ${name}`}\n        aria-live=\"polite\"\n        title=\"Copiar código SVG\"\n        className={`mt-1 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${feedback.cls}`}\n      >\n        <feedback.Icon size={11} aria-hidden=\"true\" />\n        {feedback.text}\n      </button>","<BotaoDS\n        type=\"button\"\n        onClick={handleCopy}\n        aria-label={`Copiar SVG do ícone ${name}`}\n        aria-live=\"polite\"\n        title=\"Copiar código SVG\"\n        className={`mt-1 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${feedback.cls}`}\n      >\n        <feedback.Icon size={11} aria-hidden=\"true\" />\n        {feedback.text}\n      </BotaoDS>"],
  ["src/pages/FundamentosPage.tsx","<button data-ds=\"button\" data-variant=\"ghost\"\n              onClick={() => setFontSizeOffset(prev => Math.max(prev - 0.125, -0.125))}\n              disabled={fontSizeOffset <= -0.125}\n              className=\"p-1.5 hover:bg-background rounded shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed\"\n              title=\"Diminuir tamanho (mínimo legível: 12px no menor corpo)\"\n            >\n              <Minus size={16} />\n            </button>","<BotaoDS data-ds=\"button\" data-variant=\"ghost\"\n              onClick={() => setFontSizeOffset(prev => Math.max(prev - 0.125, -0.125))}\n              disabled={fontSizeOffset <= -0.125}\n              className=\"p-1.5 hover:bg-background rounded shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed\"\n              title=\"Diminuir tamanho (mínimo legível: 12px no menor corpo)\"\n            >\n              <Minus size={16} />\n            </BotaoDS>"],
  ["src/pages/FundamentosPage.tsx","<button data-ds=\"button\" data-variant=\"ghost\" \n              onClick={() => setFontSizeOffset(prev => Math.min(prev + 0.125, 1))}\n              className=\"p-1.5 hover:bg-background rounded shadow-sm transition-all\"\n              title=\"Aumentar tamanho\"\n            >\n              <Plus size={16} />\n            </button>","<BotaoDS data-ds=\"button\" data-variant=\"ghost\" \n              onClick={() => setFontSizeOffset(prev => Math.min(prev + 0.125, 1))}\n              className=\"p-1.5 hover:bg-background rounded shadow-sm transition-all\"\n              title=\"Aumentar tamanho\"\n            >\n              <Plus size={16} />\n            </BotaoDS>"],
  ["src/pages/FundamentosPage.tsx","<button data-ds=\"button\" data-variant=\"ghost\" \n              onClick={() => setFontSizeOffset(0)}\n              className=\"p-1.5 hover:bg-background rounded shadow-sm transition-all text-muted-foreground hover:text-foreground\"\n              title=\"Resetar para o padrão\"\n            >\n              <RotateCcw size={16} />\n            </button>","<BotaoDS data-ds=\"button\" data-variant=\"ghost\" \n              onClick={() => setFontSizeOffset(0)}\n              className=\"p-1.5 hover:bg-background rounded shadow-sm transition-all text-muted-foreground hover:text-foreground\"\n              title=\"Resetar para o padrão\"\n            >\n              <RotateCcw size={16} />\n            </BotaoDS>"],
  ["src/pages/FundamentosPage.tsx","<button data-ds=\"button\" data-variant=\"toggle\" key={o.v} onClick={() => setIconCollection(o.v)}\n                className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors ${iconCollection === o.v ? \"bg-primary text-primary-foreground\" : \"text-muted-foreground hover:text-foreground\"}`}>\n                {o.label}\n              </button>","<BotaoDS data-ds=\"button\" data-variant=\"toggle\" key={o.v} onClick={() => setIconCollection(o.v)}\n                className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors ${iconCollection === o.v ? \"bg-primary text-primary-foreground\" : \"text-muted-foreground hover:text-foreground\"}`}>\n                {o.label}\n              </BotaoDS>"],
  ["src/pages/FundamentosPage.tsx","<button data-ds=\"button\" data-variant=\"toggle\" key={sz} onClick={() => setIconSize(sz)}\n                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-md transition-colors ${iconSize === sz ? \"bg-primary text-primary-foreground\" : \"text-muted-foreground hover:text-foreground\"}`}>\n                {sz}px\n              </button>","<BotaoDS data-ds=\"button\" data-variant=\"toggle\" key={sz} onClick={() => setIconSize(sz)}\n                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-md transition-colors ${iconSize === sz ? \"bg-primary text-primary-foreground\" : \"text-muted-foreground hover:text-foreground\"}`}>\n                {sz}px\n              </BotaoDS>"],
  ["src/pages/FundamentosPage.tsx","<button data-ds=\"button\" data-variant=\"secondary\" \n                onClick={() => setKey1(prev => prev + 1)}\n                className=\"text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold hover:bg-primary/20 transition-colors\"\n              >\n                Reiniciar\n              </button>","<BotaoDS data-ds=\"button\" data-variant=\"secondary\" \n                onClick={() => setKey1(prev => prev + 1)}\n                className=\"text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold hover:bg-primary/20 transition-colors\"\n              >\n                Reiniciar\n              </BotaoDS>"],
  ["src/pages/FundamentosPage.tsx","<button data-ds=\"button\" data-variant=\"secondary\" \n                onClick={() => setKey3(prev => prev + 1)}\n                className=\"text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold hover:bg-primary/20 transition-colors\"\n              >\n                Reiniciar\n              </button>","<BotaoDS data-ds=\"button\" data-variant=\"secondary\" \n                onClick={() => setKey3(prev => prev + 1)}\n                className=\"text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold hover:bg-primary/20 transition-colors\"\n              >\n                Reiniciar\n              </BotaoDS>"],
  ["src/pages/AcessibilidadePage.tsx","import { PageHeader, SectionHeader, CodeBlock } from \"@/components/DSComponents\";\n","import { PageHeader, SectionHeader, CodeBlock } from \"@/components/DSComponents\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/pages/AcessibilidadePage.tsx","<button data-ds=\"button\" data-variant=\"default\" className=\"px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background\">\n            Clique ou use Tab\n          </button>","<BotaoDS data-ds=\"button\" data-variant=\"default\" className=\"px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background\">\n            Clique ou use Tab\n          </BotaoDS>"],
  ["src/pages/graficos/GraficosDownloadsPage.tsx","import { useState } from \"react\";\n","import { useState } from \"react\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/pages/graficos/GraficosDownloadsPage.tsx","<button data-ds=\"button\" data-variant=\"default\"\n            type=\"button\"\n            disabled={carregando === \"full\"}\n            onClick={() => executar(\"full\", downloadFullLibraryZip)}\n            className=\"inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors shrink-0\"\n          >\n            {carregando === \"full\" ? <Loader2 size={16} className=\"animate-spin\" /> : <Download size={16} />}\n            {carregando === \"full\" ? \"Gerando…\" : \"Baixar .zip\"}\n          </button>","<BotaoDS data-ds=\"button\" data-variant=\"default\"\n            type=\"button\"\n            disabled={carregando === \"full\"}\n            onClick={() => executar(\"full\", downloadFullLibraryZip)}\n            className=\"inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors shrink-0\"\n          >\n            {carregando === \"full\" ? <Loader2 size={16} className=\"animate-spin\" /> : <Download size={16} />}\n            {carregando === \"full\" ? \"Gerando…\" : \"Baixar .zip\"}\n          </BotaoDS>"],
  ["src/pages/graficos/GraficosDownloadsPage.tsx","<button data-ds=\"button\" data-variant=\"outline\"\n                type=\"button\"\n                disabled={carregando === chave}\n                onClick={() => executar(chave, () => downloadCategoriaZip(cat.slug as ChartCategoria, cat.nome))}\n                className=\"mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-60 transition-colors\"\n              >\n                {carregando === chave ? <Loader2 size={14} className=\"animate-spin\" /> : <Download size={14} />}\n                {carregando === chave ? \"Gerando…\" : `Baixar ${cat.slug}.zip`}\n              </button>","<BotaoDS data-ds=\"button\" data-variant=\"outline\"\n                type=\"button\"\n                disabled={carregando === chave}\n                onClick={() => executar(chave, () => downloadCategoriaZip(cat.slug as ChartCategoria, cat.nome))}\n                className=\"mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-60 transition-colors\"\n              >\n                {carregando === chave ? <Loader2 size={14} className=\"animate-spin\" /> : <Download size={14} />}\n                {carregando === chave ? \"Gerando…\" : `Baixar ${cat.slug}.zip`}\n              </BotaoDS>"],
  ["src/pages/graficos/GraficosDownloadsPage.tsx","<button data-ds=\"button\" data-variant=\"default\"\n            type=\"button\"\n            onClick={downloadThemeJs}\n            className=\"inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors\"\n          >\n            <FileCode2 size={14} /> brand-theme.js\n          </button>","<BotaoDS data-ds=\"button\" data-variant=\"default\"\n            type=\"button\"\n            onClick={downloadThemeJs}\n            className=\"inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors\"\n          >\n            <FileCode2 size={14} /> brand-theme.js\n          </BotaoDS>"],
  ["src/pages/graficos/GraficosDownloadsPage.tsx","<button data-ds=\"button\" data-variant=\"outline\"\n            type=\"button\"\n            onClick={() => downloadThemeJson(\"light\")}\n            className=\"inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors\"\n          >\n            <FileJson size={14} /> brand-light.json\n          </button>","<BotaoDS data-ds=\"button\" data-variant=\"outline\"\n            type=\"button\"\n            onClick={() => downloadThemeJson(\"light\")}\n            className=\"inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors\"\n          >\n            <FileJson size={14} /> brand-light.json\n          </BotaoDS>"],
  ["src/pages/graficos/GraficosDownloadsPage.tsx","<button data-ds=\"button\" data-variant=\"outline\"\n            type=\"button\"\n            onClick={() => downloadThemeJson(\"dark\")}\n            className=\"inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors\"\n          >\n            <FileJson size={14} /> brand-dark.json\n          </button>","<BotaoDS data-ds=\"button\" data-variant=\"outline\"\n            type=\"button\"\n            onClick={() => downloadThemeJson(\"dark\")}\n            className=\"inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors\"\n          >\n            <FileJson size={14} /> brand-dark.json\n          </BotaoDS>"],
  ["src/pages/graficos/GraficosDownloadsPage.tsx","<button data-ds=\"button\" data-variant=\"default\"\n          type=\"button\"\n          onClick={downloadManifest}\n          className=\"inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors\"\n        >\n          <FileJson size={14} /> Baixar index.json\n        </button>","<BotaoDS data-ds=\"button\" data-variant=\"default\"\n          type=\"button\"\n          onClick={downloadManifest}\n          className=\"inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors\"\n        >\n          <FileJson size={14} /> Baixar index.json\n        </BotaoDS>"],
  ["src/components/charts/ChartShowcase.tsx","import { useMemo, useState } from \"react\";\n","import { useMemo, useState } from \"react\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/components/charts/ChartShowcase.tsx","<button data-ds=\"button\" data-variant=\"toggle\"\n      type=\"button\"\n      onClick={() => {\n        navigator.clipboard.writeText(text);\n        setCopied(true);\n        setTimeout(() => setCopied(false), 2000);\n      }}\n      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm border ${\n        copied\n          ? \"bg-success/10 text-success border-success/30\"\n          : \"bg-primary text-primary-foreground border-primary hover:bg-primary/90\"\n      }`}\n      aria-label={copied ? \"Conteúdo copiado\" : label}\n    >\n      {copied ? <Check size={14} /> : <Copy size={14} />}\n      <span>{copied ? \"Copiado\" : label}</span>\n    </button>","<BotaoDS data-ds=\"button\" data-variant=\"toggle\"\n      type=\"button\"\n      onClick={() => {\n        navigator.clipboard.writeText(text);\n        setCopied(true);\n        setTimeout(() => setCopied(false), 2000);\n      }}\n      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm border ${\n        copied\n          ? \"bg-success/10 text-success border-success/30\"\n          : \"bg-primary text-primary-foreground border-primary hover:bg-primary/90\"\n      }`}\n      aria-label={copied ? \"Conteúdo copiado\" : label}\n    >\n      {copied ? <Check size={14} /> : <Copy size={14} />}\n      <span>{copied ? \"Copiado\" : label}</span>\n    </BotaoDS>"],
  ["src/components/charts/ChartShowcase.tsx","<button data-ds=\"button\" data-variant=\"outline\"\n      type=\"button\"\n      onClick={onClick}\n      className=\"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors\"\n    >\n      {icon}\n      {children}\n    </button>","<BotaoDS data-ds=\"button\" data-variant=\"outline\"\n      type=\"button\"\n      onClick={onClick}\n      className=\"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors\"\n    >\n      {icon}\n      {children}\n    </BotaoDS>"],
  ["src/pages/graficos/GraficosPlaygroundPage.tsx","import { useEffect, useMemo, useRef, useState } from \"react\";\n","import { useEffect, useMemo, useRef, useState } from \"react\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/pages/graficos/GraficosPlaygroundPage.tsx","<button data-ds=\"button\" data-variant=\"toggle\"\n      type=\"button\"\n      onClick={onClick}\n      className={\n        variante === \"primario\"\n          ? \"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors\"\n          : \"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors\"\n      }\n    >\n      {icon}\n      {children}\n    </button>","<BotaoDS data-ds=\"button\" data-variant=\"toggle\"\n      type=\"button\"\n      onClick={onClick}\n      className={\n        variante === \"primario\"\n          ? \"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors\"\n          : \"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors\"\n      }\n    >\n      {icon}\n      {children}\n    </BotaoDS>"],
  ["src/pages/graficos/GraficosPlaygroundPage.tsx","<button data-ds=\"button\" data-variant=\"toggle\"\n                  key={h}\n                  type=\"button\"\n                  aria-pressed={altura === h}\n                  onClick={() => setAltura(h)}\n                  className={`px-3 h-10 rounded-md text-xs font-medium border transition-colors ${\n                    altura === h\n                      ? \"border-primary bg-primary text-primary-foreground\"\n                      : \"border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground\"\n                  }`}\n                >\n                  {h} px\n                </button>","<BotaoDS data-ds=\"button\" data-variant=\"toggle\"\n                  key={h}\n                  type=\"button\"\n                  aria-pressed={altura === h}\n                  onClick={() => setAltura(h)}\n                  className={`px-3 h-10 rounded-md text-xs font-medium border transition-colors ${\n                    altura === h\n                      ? \"border-primary bg-primary text-primary-foreground\"\n                      : \"border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground\"\n                  }`}\n                >\n                  {h} px\n                </BotaoDS>"],
  ["src/pages/ValidatorPage.tsx","import { useMemo, useState } from \"react\";\n","import { useMemo, useState } from \"react\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/pages/ValidatorPage.tsx","<button data-ds=\"button\" data-variant=\"outline\"\n                key={k}\n                type=\"button\"\n                onClick={() => loadExample(k)}\n                className=\"inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted\"\n              >\n                <FileJson size={14} />\n                Exemplo {SCHEMAS[k].label}\n              </button>","<BotaoDS data-ds=\"button\" data-variant=\"outline\"\n                key={k}\n                type=\"button\"\n                onClick={() => loadExample(k)}\n                className=\"inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted\"\n              >\n                <FileJson size={14} />\n                Exemplo {SCHEMAS[k].label}\n              </BotaoDS>"],
  ["src/pages/ValidatorPage.tsx","<button data-ds=\"button\" data-variant=\"outline\"\n              type=\"button\"\n              onClick={() => {\n                setInput(\"\");\n                setResult(null);\n              }}\n              className=\"rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted\"\n            >\n              Limpar\n            </button>","<BotaoDS data-ds=\"button\" data-variant=\"outline\"\n              type=\"button\"\n              onClick={() => {\n                setInput(\"\");\n                setResult(null);\n              }}\n              className=\"rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted\"\n            >\n              Limpar\n            </BotaoDS>"],
  ["src/pages/FigmaBridgePage.tsx","import { useEffect, useState } from \"react\";\n","import { useEffect, useState } from \"react\";\nimport { BotaoDS } from \"@/components/estilo/NeumorfismoBotaoDS\";\n"],
  ["src/pages/FigmaBridgePage.tsx","<button data-ds=\"button\" data-variant=\"secondary\"\n              onClick={copyToClipboard}\n              disabled={copying}\n              className=\"inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition shadow-sm font-medium border border-border\"\n              title=\"Copiar JSON consolidado para a área de transferência\"\n            >\n              {copying ? <Check size={18} /> : <Copy size={18} />}\n              {copying ? \"Copiado!\" : \"Copiar JSON\"}\n            </button>","<BotaoDS data-ds=\"button\" data-variant=\"secondary\"\n              onClick={copyToClipboard}\n              disabled={copying}\n              className=\"inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition shadow-sm font-medium border border-border\"\n              title=\"Copiar JSON consolidado para a área de transferência\"\n            >\n              {copying ? <Check size={18} /> : <Copy size={18} />}\n              {copying ? \"Copiado!\" : \"Copiar JSON\"}\n            </BotaoDS>"],
  ["src/pages/FigmaBridgePage.tsx","<button data-ds=\"button\" data-variant=\"default\"\n              onClick={downloadBundle}\n              className=\"inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition shadow-sm font-medium\"\n              title=\"Baixar pacote JSON consolidado com nome versionado\"\n            >\n              <Download size={18} />\n              Exportar Pacote Único (JSON)\n            </button>","<BotaoDS data-ds=\"button\" data-variant=\"default\"\n              onClick={downloadBundle}\n              className=\"inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition shadow-sm font-medium\"\n              title=\"Baixar pacote JSON consolidado com nome versionado\"\n            >\n              <Download size={18} />\n              Exportar Pacote Único (JSON)\n            </BotaoDS>"],

  // Superfícies e fundos (Fundamentos): a Lista descritiva validada, com o hex claro e escuro para copiar lado a lado
  ["src/components/ColorSection.tsx","import { CodeBlock } from \"@/components/DSComponents\";\n","import { CodeBlock } from \"@/components/DSComponents\";\nimport { renderSuperficies } from \"@/components/estilo/NeumorfismoSuperficies\";\n"],
  ["src/components/ColorSection.tsx","        <div className=\"grid grid-cols-2 sm:grid-cols-4 gap-3\">\n          {[\n            { label: \"Background\"","        <div className=\"grid grid-cols-2 sm:grid-cols-4 gap-3\">\n          {renderSuperficies([\n            { label: \"Background\""],
  ["src/components/ColorSection.tsx","          ].map(s => (\n            <div key={s.label} className=\"text-center\">","          ], s => (\n            <div key={s.label} className=\"text-center\">"],

  // Validador de artefatos: o seletor de schema e o diagnóstico passam a ser o Select, o Alert, o Empty State e a Lista descritiva validados
  ["src/pages/ValidatorPage.tsx","import tailwindSchema from \"@/data/tailwind.schema.json\";\n","import tailwindSchema from \"@/data/tailwind.schema.json\";\nimport { ESTILO } from \"@/config/estilo\";\nimport { SelecaoNeu } from \"@/components/estilo/NeumorfismoSelect\";\nimport { ResultadoValidacao } from \"@/components/estilo/NeumorfismoValidador\";\n"],
  ["src/pages/ValidatorPage.tsx","          <label className=\"text-sm font-medium text-foreground\">Schema:</label>\n          <select data-ds=\"select-trigger\"\n            value={choice}\n            onChange={(e) => {\n              const next = e.target.value as SchemaKey;\n              setChoice(next);\n              runValidation(input, next);\n            }}\n            className=\"h-10 rounded-md border border-input bg-background px-3 text-sm\"\n          >\n            <option value=\"auto\">Detectar automaticamente</option>\n            <option value=\"tokens\">tokens.json</option>\n            <option value=\"components\">components.json</option>\n            <option value=\"tailwind\">tailwind.config.json</option>\n          </select>\n","          {(ESTILO.id as string) === \"neumorfismo\" ? (\n            <SelecaoNeu\n              rotulo=\"Schema\"\n              valor={choice}\n              aoMudar={(valor) => {\n                const next = valor as SchemaKey;\n                setChoice(next);\n                runValidation(input, next);\n              }}\n              opcoes={[\n                { value: \"auto\", label: \"Detectar automaticamente\" },\n                { value: \"tokens\", label: \"tokens.json\" },\n                { value: \"components\", label: \"components.json\" },\n                { value: \"tailwind\", label: \"tailwind.config.json\" },\n              ]}\n            />\n          ) : (\n            <>\n          <label className=\"text-sm font-medium text-foreground\">Schema:</label>\n          <select data-ds=\"select-trigger\"\n            value={choice}\n            onChange={(e) => {\n              const next = e.target.value as SchemaKey;\n              setChoice(next);\n              runValidation(input, next);\n            }}\n            className=\"h-10 rounded-md border border-input bg-background px-3 text-sm\"\n          >\n            <option value=\"auto\">Detectar automaticamente</option>\n            <option value=\"tokens\">tokens.json</option>\n            <option value=\"components\">components.json</option>\n            <option value=\"tailwind\">tailwind.config.json</option>\n          </select>\n            </>\n          )}\n"],
  ["src/pages/ValidatorPage.tsx","      {!result && (\n        <div className=\"brand-card text-sm text-muted-foreground\">\n          Nenhum JSON validado ainda. Cole conteúdo acima ou carregue um exemplo.\n        </div>\n      )}\n\n      {result?.parseError && (\n        <div className=\"brand-card border-error/40 bg-error/5 space-y-2\">\n          <div className=\"flex items-center gap-2 text-error font-semibold\">\n            <AlertCircle size={18} />\n            JSON inválido\n          </div>\n          <pre className=\"text-xs whitespace-pre-wrap text-foreground\">{result.parseError}</pre>\n        </div>\n      )}\n\n      {result && !result.parseError && result.ok && (\n        <div className=\"brand-card border-success/40 bg-success/5 space-y-2\">\n          <div className=\"flex items-center gap-2 text-success font-semibold\">\n            <CheckCircle2 size={18} />\n            {SCHEMAS[result.schemaKey].label} OK contra {SCHEMAS[result.schemaKey].file.replace(\".json\", \".schema.json\")}\n          </div>\n          <p className=\"ds-body-small text-foreground\">\n            Nenhum erro de schema encontrado. O artefato está pronto para publicação.\n          </p>\n        </div>\n      )}\n\n      {result && !result.parseError && !result.ok && result.errors.length > 0 && (\n        <div className=\"brand-card border-error/40 bg-error/5 space-y-3\">\n          <div className=\"flex items-center gap-2 text-error font-semibold\">\n            <AlertCircle size={18} />\n            {result.errors.length} erro(s) contra {SCHEMAS[result.schemaKey].label}\n          </div>\n          <ul className=\"space-y-2\">\n            {result.errors.map((err, i) => (\n              <li key={i} className=\"rounded-md border border-border bg-background p-3 text-sm\">\n                <div className=\"flex flex-wrap items-center gap-2 font-mono text-xs\">\n                  <span className=\"rounded bg-muted px-2 py-0.5 text-foreground\">\n                    {err.instancePath || \"(root)\"}\n                  </span>\n                  {err.line && (\n                    <span className=\"rounded bg-primary/10 px-2 py-0.5 text-primary\">linha ~{err.line}</span>\n                  )}\n                  <span className=\"rounded bg-muted px-2 py-0.5 text-muted-foreground\">{err.keyword}</span>\n                </div>\n                <p className=\"mt-1 text-foreground\">{err.message}</p>\n                {err.params && Object.keys(err.params).length > 0 && (\n                  <pre className=\"mt-1 text-xs text-muted-foreground\">\n                    {JSON.stringify(err.params)}\n                  </pre>\n                )}\n              </li>\n            ))}\n          </ul>\n        </div>\n      )}\n","      {(ESTILO.id as string) === \"neumorfismo\" ? (\n        <ResultadoValidacao\n          vazio={!result}\n          erroJson={result?.parseError}\n          sucesso={\n            result && !result.parseError && result.ok\n              ? {\n                  titulo: `${SCHEMAS[result.schemaKey].label} OK contra ${SCHEMAS[result.schemaKey].file.replace(\".json\", \".schema.json\")}`,\n                  texto: \"Nenhum erro de schema encontrado. O artefato está pronto para publicação.\",\n                }\n              : null\n          }\n          erros={\n            result && !result.parseError && !result.ok && result.errors.length > 0\n              ? {\n                  titulo: `${result.errors.length} erro(s) contra ${SCHEMAS[result.schemaKey].label}`,\n                  itens: result.errors.map((err) => ({\n                    caminho: err.instancePath || \"(root)\",\n                    linha: err.line,\n                    palavra: err.keyword,\n                    mensagem: err.message ?? \"\",\n                    parametros: err.params && Object.keys(err.params).length > 0 ? JSON.stringify(err.params) : undefined,\n                  })),\n                }\n              : null\n          }\n        />\n      ) : (\n        <>\n      {!result && (\n        <div className=\"brand-card text-sm text-muted-foreground\">\n          Nenhum JSON validado ainda. Cole conteúdo acima ou carregue um exemplo.\n        </div>\n      )}\n\n      {result?.parseError && (\n        <div className=\"brand-card border-error/40 bg-error/5 space-y-2\">\n          <div className=\"flex items-center gap-2 text-error font-semibold\">\n            <AlertCircle size={18} />\n            JSON inválido\n          </div>\n          <pre className=\"text-xs whitespace-pre-wrap text-foreground\">{result.parseError}</pre>\n        </div>\n      )}\n\n      {result && !result.parseError && result.ok && (\n        <div className=\"brand-card border-success/40 bg-success/5 space-y-2\">\n          <div className=\"flex items-center gap-2 text-success font-semibold\">\n            <CheckCircle2 size={18} />\n            {SCHEMAS[result.schemaKey].label} OK contra {SCHEMAS[result.schemaKey].file.replace(\".json\", \".schema.json\")}\n          </div>\n          <p className=\"ds-body-small text-foreground\">\n            Nenhum erro de schema encontrado. O artefato está pronto para publicação.\n          </p>\n        </div>\n      )}\n\n      {result && !result.parseError && !result.ok && result.errors.length > 0 && (\n        <div className=\"brand-card border-error/40 bg-error/5 space-y-3\">\n          <div className=\"flex items-center gap-2 text-error font-semibold\">\n            <AlertCircle size={18} />\n            {result.errors.length} erro(s) contra {SCHEMAS[result.schemaKey].label}\n          </div>\n          <ul className=\"space-y-2\">\n            {result.errors.map((err, i) => (\n              <li key={i} className=\"rounded-md border border-border bg-background p-3 text-sm\">\n                <div className=\"flex flex-wrap items-center gap-2 font-mono text-xs\">\n                  <span className=\"rounded bg-muted px-2 py-0.5 text-foreground\">\n                    {err.instancePath || \"(root)\"}\n                  </span>\n                  {err.line && (\n                    <span className=\"rounded bg-primary/10 px-2 py-0.5 text-primary\">linha ~{err.line}</span>\n                  )}\n                  <span className=\"rounded bg-muted px-2 py-0.5 text-muted-foreground\">{err.keyword}</span>\n                </div>\n                <p className=\"mt-1 text-foreground\">{err.message}</p>\n                {err.params && Object.keys(err.params).length > 0 && (\n                  <pre className=\"mt-1 text-xs text-muted-foreground\">\n                    {JSON.stringify(err.params)}\n                  </pre>\n                )}\n              </li>\n            ))}\n          </ul>\n        </div>\n      )}\n        </>\n      )}\n"],
];
