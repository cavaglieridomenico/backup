import { Service, ServiceContext } from '@vtex/api'

// Storia: https://whirlpoolgtm.atlassian.net/browse/IT-1150

const mapRedirects = new Map();
mapRedirects.set("//innovation/supreme-no-frost.content.html", "/");
mapRedirects.set("/contact-us/", "/supporto/contattaci");
mapRedirects.set("/faq/che-cos-e-il-lavaggio-a-dondolo", "/faq/che-cose-il-lavaggio-a-dondolo");
mapRedirects.set("/faq/che-cos-e-il-sistema-no-frost", "/faq/che-cose-il-sistema-no-frost");
mapRedirects.set("/faq/che-cos-e-la-classe-di-litraggio", "/faq/che-cose-la-classe-di-litraggio");
mapRedirects.set("/faq/che-cos-e-la-funzione-eco", "/faq/che-cose-la-funzione-eco");
mapRedirects.set("/faq/che-cos-e-la-tecnologia-sesto-senso-applicata-al-microonde", "/faq/che-cose-la-tecnologia-sesto-senso-applicata-al-microonde");
mapRedirects.set("/faq/che-cos-e-lo-space-4", "/faq/che-cose-lo-space-4");
mapRedirects.set("/faq/che-cos-e-powerclean", "/faq/che-cose-powerclean");
mapRedirects.set("/faq/che-cos-e-powerdry", "/faq/che-cose-powerdry");
mapRedirects.set("/faq/che-differenza-c-e-tra-il-sistema-di-asciugatura-a-condensa-e-quello-a-ventilazione", "/faq/che-differenza-ce-tra-il-sistema-di-asciugatura-a-condensa-e-quello-a-ventilazione");
mapRedirects.set("/faq/che-differenza-c-e-tra-la-funzione-my-chef-e-la-funzione-jet-menu", "/faq/che-differenza-ce-tra-la-funzione-my-chef-e-la-funzione-jet-menu");
mapRedirects.set("/faq/che-differenza-c-e-tra-la-potenza-sonora-e-la-silenziosita", "/faq/che-differenza-ce-tra-la-potenza-sonora-e-la-silenziosita");
mapRedirects.set("/faq/che-differenza-c-e-tra-un-piano-a-filo-top-e-un-piano-semifilo-top", "/faq/che-differenza-ce-tra-un-piano-a-filo-top-e-un-piano-semifilo-top");
mapRedirects.set("/faq/che-differenza-c-e-tra-una-cappa-aspirante-e-una-cappa-filtrante", "/faq/che-differenza-ce-tra-una-cappa-aspirante-e-una-cappa-filtrante");
mapRedirects.set("/faq/che-differenza-c-e-tra-una-piastra-radiante-e-una-piastra-alogena", "/faq/che-differenza-ce-tra-una-piastra-radiante-e-una-piastra-alogena");
mapRedirects.set("/faq/com-e-applicata-la-tecnologia-sesto-senso-alle-lavatrici-whirlpool", "/faq/come-applicata-la-tecnologia-sesto-senso-alle-lavatrici-whirlpool");
mapRedirects.set("/faq/come-devo-suddividere-la-biancheria-nell-inserirla-in-lavatrice", "/faq/come-devo-suddividere-la-biancheria-nellinserirla-in-lavatrice");
mapRedirects.set("/faq/come-e-applicata-la-funzione-6o-senso-ai-nostri-forni", "/faq/come-e-applicata-la-funzione-6%C2%BA-senso-ai-nostri-forni");
mapRedirects.set("/faq/come-funziona-la-pirolisi-e-che-cos-e", "/faq/come-funziona-la-pirolisi-e-che-cose");
mapRedirects.set("/faq/come-posso-conservare-gli-alimenti-durante-un-black-out", "/faq/come-posso-conservare-gli-alimenti-durante-un-blackout");
mapRedirects.set("/faq/come-si-puo-pulire-l-esterno-della-cappa-inox", "/faq/come-si-puo-pulire-lesterno-della-cappa-inox");
mapRedirects.set("/faq/cos-e-hygienic", "/faq/cose-hygienic-plus");
mapRedirects.set("/faq/cos-e-il-piatto-crisp", "/faq/cose-il-piatto-crisp-");
mapRedirects.set("/faq/cos-e-il-programma-vapore-refresh", "/faq/cose-il-programma-vapore-refresh");
mapRedirects.set("/faq/cos-e-il-trattamento-microban", "/faq/cose-il-trattamento-microban");
mapRedirects.set("/faq/cos-e-l-aqua-stop", "/faq/cose-laquastop");
mapRedirects.set("/faq/cos-e-l-etichetta-energetica", "/faq/cose-letichetta-energetica");
mapRedirects.set("/faq/cos-e-un-frigorifero-o-un-congelatore-total-no-frost", "/faq/cose-un-frigorifero-o-un-congelatore-total-no-frost");
mapRedirects.set("/faq/devo-sbrinare-il-congelatore-piu-spesso-di-quanto-indicato-nel-manuale.-quale-potrebbe-essere-la-causa", "/faq/devo-sbrinare-il-congelatore-piu-spesso-di-quanto-indicato-nel-manuale-quale-potrebbe-essere-la-causa");
mapRedirects.set("/faq/di-quale-materiale-e-composto-il-plateaux-di-un-piano-in-vetroceramica", "/faq/di-quale-materiale-e-composto-il-plateaux-di-un-piano-in-vetroceramica-");
mapRedirects.set("/faq/e-necessario-avere-un-foro-d-aria-per-un-afflusso-d-aria", "/faq/e-necessario-avere-un-foro-daria-per-un-afflusso-daria");
mapRedirects.set("/faq/e-possibile-installare-una-lavatrice-sopra-ad-un-asciugatrice-o-viceversa", "/faq/e-possibile-installare-una-lavatrice-sopra-ad-unasciugatrice-o-viceversa");
mapRedirects.set("/faq/esistono-diverse-classi-di-consumo-energetico.-qual-e-la-scelta-migliore", "/faq/esistono-diverse-classi-di-consumo-energetico-qual-e-la-scelta-migliore");
mapRedirects.set("/faq/ho-preparato-un-piatto-di-pesce-nel-mio-microonde.-come-faccio-ad-eliminare-l-odore-sgradevole", "/faq/ho-preparato-un-piatto-di-pesce-nel-mio-microonde-come-faccio-ad-eliminare-lodore-sgradevole");
mapRedirects.set("/faq/ho-sentito-dire-che-se-un-telefonino-posto-all-interno-del-forno-riesce-a-suonare-vuol-dire-che-il-forno-non-e-sicuro.-e-vero", "/faq/ho-sentito-dire-che-se-un-telefonino-posto-allinterno-del-forno-riesce-a-suonare-vuol-dire-che-il-forno-non-e-sicuro-e-vero");
mapRedirects.set("/faq/ho-sentito-dire-che-sui-piani-cottura-a-induzione-si-devono-usare-padelle-particolari.-e-vero", "/faq/ho-sentito-dire-che-sui-piani-cottura-a-induzione-si-devono-usare-padelle-particolari-e-vero");
mapRedirects.set("/faq/in-cosa-sono-migliori-i-forni-6o-senso", "/faq/in-cosa-sono-migliori-i-forni-6%C2%BA-senso");
mapRedirects.set("/faq/non-mi-e-consentito-creare-una-conduttura-per-l-aria-per-la-mia-cappa.-la-cappa-a-ricircolo-e-una-buona-alternativa", "/faq/non-mi-e-consentito-creare-una-conduttura-per-laria-per-la-mia-cappa-la-cappa-a-ricircolo-e-una-buona-alternativa");
mapRedirects.set("/faq/non-posso-installare-delle-condutture-esterne-per-la-cappa.-il-ricircolo-e-una-buona-idea", "/faq/non-posso-installare-delle-condutture-esterne-per-la-cappa-il-ricircolo-e-una-buona-idea");
mapRedirects.set("/faq/perche-acquistare-un-asciugatrice", "/faq/perche-acquistare-unasciugatrice");
mapRedirects.set("/faq/perche-e-sconsigliato-l-uso-del-sale-grosso-da-cucina", "/faq/perche-e-sconsigliato-luso-del-sale-grosso-da-cucina");
mapRedirects.set("/faq/perche-non-vedo-piu-il-livello-dell-acqua-dall-oblo-della-mia-lavatrice", "/faq/perche-non-vedo-piu-il-livello-dellacqua-dalloblo-della-mia-lavatrice");
mapRedirects.set("/faq/posso-collegare-la-lavatrice-direttamente-all-acqua-calda", "/faq/posso-collegare-la-lavatrice-direttamente-allacqua-calda");
mapRedirects.set("/faq/posso-collegare-la-mia-asciugatrice-a-condensa-a-uno-scarico-dell-acqua-in-modo-da-non-dover-piu-svuotare-il-serbatoio", "/faq/posso-collegare-la-mia-asciugatrice-a-condensa-a-uno-scarico-dellacqua-in-modo-da-non-dover-piu-svuotare-il-serbatoio");
mapRedirects.set("/faq/posso-installare-la-cappa-senza-lasciare-alcuno-sfogo-all-aria-aspirata", "/faq/posso-installare-la-cappa-senza-lasciare-alcuno-sfogo-allaria-aspirata");
mapRedirects.set("/faq/posso-installare-un-asciugatrice-sopra-ad-una-lavatrice", "/faq/posso-installare-unasciugatrice-sopra-ad-una-lavatrice");
mapRedirects.set("/faq/posso-installare-un-frigorifero-sotto-il-piano-di-lavoro-della-mia-cucina2", "/faq/posso-installare-un-frigorifero-sotto-il-piano-di-lavoro-della-mia-cucina");
mapRedirects.set("/faq/posso-lavare-l-intimo-e-la-lana-senza-danneggiare-i-miei-capi", "/faq/posso-lavare-lintimo-e-la-lana-senza-danneggiare-i-miei-capi");
mapRedirects.set("/faq/qual-e-il-modo-migliore-per-pulire-il-mio-frigorifero2", "/faq/qual-e-il-modo-migliore-per-pulire-il-mio-frigorifero");
mapRedirects.set("/faq/qual-e-il-modo-piu-semplice-e-veloce-per-pulire-un-forno", "/faq");
mapRedirects.set("/faq/quali-dovrebbero-essere-le-temperature-all-interno-del-frigorifero-e-del-congelatore", "/faq/quali-dovrebbero-essere-le-temperature-allinterno-del-frigorifero-e-del-congelatore");
mapRedirects.set("/faq/quali-sono-i-materiali-utilizzabili-con-il-piano-ad-induzione2", "/faq/quali-sono-i-materiali-utilizzabili-con-il-piano-ad-induzione");
mapRedirects.set("/faq/quanti-sono-i-giri-di-centrifuga-minimi-necessari-di-una-lavatrice-per-poter-utilizzare-un-asciugatrice", "/faq/quanti-sono-i-giri-di-centrifuga-minimi-necessari-di-una-lavatrice-per-poter-utilizzare-unasciugatrice");
mapRedirects.set("/faq/quanto-consuma-in-media-un-asciugatrice", "/faq/quanto-consuma-in-media-unasciugatrice");
mapRedirects.set("/faq/quanto-spazio-libero-devo-lasciare-intorno-a-un-frigorifero2", "/faq/quanto-spazio-libero-devo-lasciare-intorno-a-un-frigorifero");
mapRedirects.set("/faq/un-asciugatrice-come-migliora-la-cura-dei-capi", "/faq/unasciugatrice-come-migliora-la-cura-dei-capi");
mapRedirects.set("/faq/un-congelatore-funzionera-bene-se-nel-mio-garage-e-molto-freddo-o-molto-caldo2", "/faq/un-congelatore-funzionera-bene-se-nel-mio-garage-e-molto-freddo-o-molto-caldo");
mapRedirects.set("/prodotti-1/forni-3/forno-elettronico,-15-funzioni,-linea-funsion-akzm-8350_ixl/852583538110/", "/prodotti/cottura/forni");
mapRedirects.set("/prodotti-1/lavastoviglie-3/lavastoviglie-da-incasso,-13-coperti,-8-programmi-adg-8900/851189001000/", "/prodotti/lavastoviglie/lavastoviglie");

const doRedirect = async (ctx: ServiceContext) => {
  ctx.status = 301;

  //CUSTOM REDIRECT LOGIC
  let redirectURL = mapRedirects.get(ctx.request.url)
  if (redirectURL != undefined) {
    ctx.redirect(redirectURL);
  }
  else {
    ctx.redirect("/");
  }
}

export default new Service({
  routes: {
    redirect1: doRedirect,
    redirect2: doRedirect,
    redirect3: doRedirect,
    redirect4: doRedirect,
    redirect5: doRedirect,
    redirect6: doRedirect,
    redirect7: doRedirect,
    redirect8: doRedirect,
    redirect9: doRedirect,
    redirect10: doRedirect,
    redirect11: doRedirect,
    redirect12: doRedirect,
    redirect13: doRedirect,
    redirect14: doRedirect,
    redirect15: doRedirect,
    redirect16: doRedirect,
    redirect17: doRedirect,
    redirect18: doRedirect,
    redirect19: doRedirect,
    redirect20: doRedirect,
    redirect21: doRedirect,
    redirect22: doRedirect,
    redirect23: doRedirect,
    redirect24: doRedirect,
    redirect25: doRedirect,
    redirect26: doRedirect,
    redirect27: doRedirect,
    redirect28: doRedirect,
    redirect29: doRedirect,
    redirect30: doRedirect,
    redirect31: doRedirect,
    redirect32: doRedirect,
    redirect33: doRedirect,
    redirect34: doRedirect,
    redirect35: doRedirect,
    redirect36: doRedirect,
    redirect37: doRedirect,
    redirect38: doRedirect,
    redirect39: doRedirect,
    redirect40: doRedirect,
    redirect41: doRedirect,
    redirect42: doRedirect,
    redirect43: doRedirect,
    redirect44: doRedirect,
    redirect45: doRedirect,
    redirect46: doRedirect,
    redirect47: doRedirect,
    redirect48: doRedirect,
    redirect49: doRedirect,
    redirect50: doRedirect,
    redirect51: doRedirect,
    redirect52: doRedirect,
    redirect53: doRedirect,
    redirect54: doRedirect,
    redirect55: doRedirect,
    redirect56: doRedirect,
    redirect57: doRedirect,
    redirect58: doRedirect,
    redirect59: doRedirect,
    redirect60: doRedirect,
  },
})
