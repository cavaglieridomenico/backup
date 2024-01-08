import React, { useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function ConditionLayoutBanner() {

  const CSS_HANDLES = [
    "ConditionLayoutBanner_container",
    "ConditionLayoutBanner_textContainer"
  ]

  const { handles } = useCssHandles(CSS_HANDLES);

  const [result, setResult] = useState(false);
  const [bannerHTML, setBannerHTML] = useState("");

  const checkHistory = window.history ? window.history.state.key : "";

  useEffect(() => {
    checkPath();
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {
      checkPath();
    };
    window.addEventListener("popstate", onLocationChange);
    // clean up event listener
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, [result, checkHistory]);

  useEffect(() => {
    checkPath();
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {
      checkPath();
    };
    window.addEventListener("popstate", onLocationChange);
    // clean up event listener
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);
  
  let pathName;

  const checkPath = () => {
    if (
      window.location.href &&
      window.location.href !== undefined &&
      window.location.href !== null
    ) {
      window.location.pathname.split("/")[3] === undefined ? pathName = "" : pathName = window.location.pathname.split("/")[3]
      setBannerHTML(pathName)
      setResult(true)
    }
}

  if(result) {
    return(
      <>
        <div className={handles.ConditionLayoutBanner_container}>
            {
                bannerHTML==="lavastoviglie" ? 
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Risultati sempre al top con le lavastoviglie Indesit, elettrodomestici moderni e dotati di programmi di lavaggio innovativi per piatti e posate. Scopri l’efficacia di un lavaggio perfetto, con i modelli del catalogo online.<br/>
                    La proposta Indesit è ricca di modelli a incasso, ideali per l’installazione all’interno del mobile della tua cucina, e a libera installazione, pensate per un agevole posizionamento in qualsiasi area domestica fornita di collegamento idrico e elettrico. Le lavastoviglie a incasso presentano uno stile semplice e pulito, con comandi per la scelta del programma di lavaggio situati nella parte superiore dello sportello, in modo da poterli utilizzare senza problemi una volta inserita nel vano dedicato della cucina.<br/>
                    Le lavastoviglie freestanding presentano un design semplice e moderno, perfetto per arricchire i tuoi spazi con un elettrodomestico dallo stile contemporaneo, capace di integrarsi visivamente con l’arredo della casa. In particolare, i modelli a libera installazione si sposano perfettamente agli altri elettrodomestici della linea Indesit, e possono così essere affiancate al forno o a un
                    <a href="https://www.indesit.it/prodotti/conservare/frigoriferi">frigorifero</a>
                    in modo da disporre di un’area moderna e completamente fornita per tutte le attività in cucina.<br/>
                    Le lavastoviglie Indesit vantano sistemi e tecnologie innovative per il lavaggio, tra cui la tecnologia Fast & Clean: con un semplice tocco potrai ottenere una pulizia accurata per le tue stoviglie in meno di mezz’ora. Alla fine del ciclo la porta si aprirà automaticamente di 10 gradi, una funzione legata a un algoritmo di controllo della temperatura. Facendo fuoriuscire il vapore, il sistema aumenta la velocità dell’asciugatura del 25%. Immancabile nelle lavastoviglie modello Extra il nuovo ciclo progettato per stoviglie di grandi dimensioni, che permette di rimuovere il cestello superiore per ottenere un volume fino a 53 cm. Potrai godere della massima pulizia e dell'igiene ottimizzato con il ciclo Extra Hygiene che risciacqua a 72°C e rimuove fino al 99% dei batteri (testato da Swissatest). Gli elettrodomestici con il programma Push&Go, inoltre, possono avviare il ciclo senza bisogno di prelavaggio. Una serie di funzionalità complete per ogni esigenza, in un elettrodomestico che viene incontro a tutte le tue necessità quotidiane in cucina.
                </div> : 
                bannerHTML==="congelatori" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Scopri la linea dei congelatori Indesit, prodotti dal design lineare e pulito con cui conservare al meglio i tuoi alimenti. Grazie alle loro forme compatte, si adattano facilmente a qualsiasi tipologia di ambiente: una soluzione moderna, funzionale e di facile installazione, perfetta per ogni esigenza.<br/>
                    Sul nostro catalogo online puoi trovare diversi modelli, con caratteristiche e colori pensati per soddisfare le esigenze di stile, arredo e funzionalità della tua cucina: l'ampia gamma di colori disponibili e il design ricercato permettono di inserirli perfettamente in qualsiasi stile di arredo domestico. Puoi scegliere tra i congelatori verticali, con forme simili a quelle di un
                    <a href="https://www.indesit.it/prodotti/conservare/frigoriferi">frigorifero</a>
                    e orizzontali. I primi sono l'opzione giusta per chi necessita di ulteriore spazio. Il loro design li rende la soluzione più adatta per creare uno spazio dedicato al congelamento e alla conservazione di ingredienti e piatti pronti. Questi modelli sono disponibili in una versione indipendente con fino a 7 cassetti e piedini regolabili. I congelatori orizzontali, invece, sono proposti in due diverse dimensioni: uno stretto e uno lungo con cestello molto ampio, ideale per chi ha poco spazio, e uno più grande fino a 4 cesti, adatto per cantine e scantinati. Le cerniere bilanciate, inoltre, semplificano e facilitano le operazioni di apertura della porta superiore, addolcendo il movimento della porta ed evitando brusche chiusure.<br/>
                    Il freezer è dotato di un'interfaccia per la regolazione della temperatura e di programmi di congelamento di facile lettura e utilizzo, in modo da poter conservare sempre nel modo giusto il cibo e godere a lungo delle sue proprietà organolettiche. I congelatori più efficienti dal punto di vista energetico consentono inoltre di risparmiare e ridurre al minimo il loro impatto ambientale. Consulta il catalogo online e scegli il congelatore più adatto alle tue esigenze.
                </div> :
                bannerHTML==="forni" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Scopri la linea di forni Indesit del catalogo. Le nostre tecnologie per cuocere, grigliare e arrostire comprendono una serie di modelli progettati per migliorare la tua esperienza di cucina. Facili da installare e dal design moderno e accattivante, i forni Indesit sono la soluzione ideale per avere un elettrodomestico efficiente nella tua casa.<br/>
                    Sul nostro catalogo trovi forni elettrici e a gas, un’offerta che ti permette di selezionare quello più adatto alle tue esigenze: diversi programmi, per ogni tipo di cottura, ti aiuteranno a preparare con successo qualsiasi piatto. I modelli più recenti e avanzati riducono notevolmente i consumi dell'apparecchio. Tra le caratteristiche più apprezzate spiccano l'autopulizia, idrolitica o pirolitica, un aiuto di grande qualità per velocizzare la pulizia dopo luso, e potersi così concentrare sulla preparazione di squisite pietanze.<br/>
                    Inoltre, la funzione Turn & Go di Forni Aria ti permette di scoprire ricette sempre nuove. Installa l'app Turn & Go sul tuo dispositivo e utilizza la fotocamera del telefono per scattare una foto del tuo ingrediente principale. L'app suggerirà una ricetta facile da preparare, scegliendo da un database con oltre 100 deliziosi piatti.<br/>
                    I forni Indesit sono disponibili in diversi colori e design. Scopri il catalogo online e scegli quello che più si adatta al tuo stile, per comporre una cucina funzionale e dall'aspetto accattivante. Combinalo con un pratico forno a microonde, o selezionane uno abbinato ai piani cottura Indesit, per completare la tua cucina con elettrodomestici dalle grandi prestazioni.
                </div> :
                bannerHTML==="piani-cottura" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Indesit ti propone una vasta gamma di piani cottura dal design moderno e semplice, perfetto per donare un tocco di originalità alla tua cucina e facilitare le tue operazioni ai fornelli. Si tratta di un prodotto di semplice ed intuitivo utilizzo, disponibile nella classica versione a gas e con innovativi modelli a induzione.<br/>
                    I piani cottura a gas presentano fornelli di differenti dimensioni, con manopole e controlli dedicati e posizionati frontalmente o a lato. L’erogatore gestisce con precisione la dimensione della fiamma, fornendo il giusto calore e la potenza necessaria per la tua preparazione. I modelli a induzione possono facilmente essere installati, e necessitano unicamente di un collegamento alla presa elettrica. Caratterizzati da un sistema di riscaldamento che agisce direttamente sulle pentole compatibili, garantiscono una preparazione rapida e un risparmio di energia ottimale. La superficie dei piani a induzione è perfettamente liscia, e presenta dunque due vantaggi: da un lato ne facilita la pulizia, dall’altro dona un aspetto moderno e accattivante alla cucina. Molto utile anche la presenza di controlli intuitivi, che facilitano l’utilizzo e permettono di controllare con semplicità l’erogazione per la preparazione di ricette di ogni tipo. Disponibili sul catalogo anche i piani cottura con fornello elettrico, proposti in modelli dal differente numero di bruciatori, facili da installare in combinazione con una cucina<br/>
                    <a href="https://nikocbprod1--indesitit.myvtex.com/prodotti/cucina/cucine">Indesit</a>
                    per disporre di fornelli aggiuntivi.<br/>
                    Indesit ha rivolto grande attenzione anche alla sicurezza dei piani cottura: i modelli più avanzati del catalogo sono completi di un dispositivo che, se necessario, interrompe l’erogazione di gas o elettrica. Design, sicurezza, facilità di utilizzo: le caratteristiche dei fornelli Indesit ne fanno la soluzione più adatta per qualsiasi necessità. Elettrodomestici di qualità studiati per facilitare le tue operazioni in cucina, che ti permettono di dare sempre il meglio ai fornelli.
                </div> :
                bannerHTML==="cappe" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Le cappe da cucina Indesit sono studiate per offrire efficienza e design moderno allo stesso tempo e adattarsi alla tua cucina fornendo un’ampia gamma di modelli e dimensioni. Puoi scegliere tra cappe da incasso e
                    <a href="https://nikocbprod1--indesitit.myvtex.com/prodotti/cucina/cappe">cappe a parete</a>
                    e tra diversi modelli, tradizionali o a camino. Le cappe da cucina sono disponibili in dimensioni da 60cm a 90cm, per adattarsi agli spazi della tua cucina. Consulta il nostro catalogo, leggi le opinioni online e scopri il punto vendita più vicino a te dove acquistare la tua cappa da cucina Indesit.
                </div> :
                bannerHTML==="forni-a-microonde" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Indesit ti offre un’ampia selezione di forni a microonde da incasso, per preparazioni e scongelamenti rapidi, con il massimo della qualità: sfoglia il catalogo online, confronta i prodotti e scegli l’elettrodomestico perfetto per avere il massimo in cucina.<br/>
                    Design compatto e pratico, funzionalità avanzate, controlli intuitivi e programmi adatti a ogni esigenza: il forno a microonde Indesit è un piccolo grande alleato per la tua quotidianità in cucina. Studiato per offrirti un supporto versatile e affidabile ai fornelli, si adatta a preparazioni veloci come a ricette impegnative: un vero must have per tutte le occasioni. <br/>
                    Le linee eleganti racchiudono la migliore tecnologia per le tue ricette: i microonde Indesit Aria mettono a tua disposizione la tecnologia Double Power Wave che, utilizzando il doppio delle onde, migliora le performance di riscaldamento e scongelamento dei cibi. Una vera garanzia per ottenere piatti cotti uniformemente, gustosi e deliziosi. Il sistema di cottura automatica diventerà il tuo alleato per ogni preparazione: selezioni la categoria di cibo che desideri cucinare e il forno a microonde penserà al resto. Questa tecnologia imposta autonomamente il tempo di cottura per assicurarti sempre il risultato ideale, sia quando devi cucinare che nella modalità di scongelamento, adattandosi al peso e alla tipologia del cibo. Potrai inoltre ottenere risultati di doratura e croccantezza eccezionali con il Quartz Grill, un sistema perfetto per ottenere una rapida doratura.<br/>
                    Caratterizzati da un design contemporaneo e ben curato, i forni a microonde da incasso sono facili da installare all’interno di un mobile da cucina: compatti e pratici possono essere accostati a un forno Indesit, o posizionati accanto al ripiano dei fornelli, per completare l’angolo cottura con un elettrodomestico funzionale e versatile. Scoprili nelle versioni in colore acciaio, o nei modelli dalle forme più compatte, adatti anche a spazi meno generosi. Lasciati stupire dalla tecnologia Indesit e scopri i migliori forni a microonde del catalogo.
                </div> :
                bannerHTML==="cucine" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Scopri le cucine elettriche e a gas di Indesit, elettrodomestici completi per gestire al meglio ogni tipo di preparazione. Composte da un piano cottura da 4 fuochi, e da un pratico forno posto nella parte inferiore della struttura, sono fornite di tutto il necessario per aiutarti a cucinare ricette di ogni tipo.<br/>
                    Forme compatte e funzionali, un design semplice e colori classici ti permettono di inserire le cucine a gas ed elettriche armoniosamente in ogni contesto d’arredo. Le linee minimali che caratterizzano il telaio sono pensate per facilitare le operazioni di pulizia, grazie all’assenza di scanalature tra i fornelli del piano cottura. Inserendo una piccola quantità di acqua nella cavità del forno della cucina, potrai inoltre attivare il programma automatico per eliminare ogni traccia di grasso residuo in soli 35 minuti, senza utilizzare nessun detergente. La porta interamente in vetro ti consente di avere una completa visibilità, in modo da avere costantemente sotto controllo ogni tua preparazione.<br/>
                    Il piano cottura è caratterizzato dalla disponibilità di quattro fuochi dalle dimensioni differenti, adatti a preparazioni di ogni tipo, da piccoli tegami a pentole più capienti. Il pannello con le manopole frontali è pensato per aiutarti a gestire al meglio l’erogazione della fiamma, in modo da ottenere con precisione la tipologia di cottura della quale hai bisogno. Completo di tutte le funzioni più utili il forno, che dona alla cucina Indesit una serie di opzioni di cottura e programmi innovativi: la modalità doppia cottura, per esempio, raccomandata per chi necessita di una preparazione veloce di piatti già pronti, senza dover preriscaldare il forno. Per le pietanze più delicate che richiedono una lievitazione uniforme Indesit ha pensato per queste cucine un sistema di riscaldamento inferiore che ti permette di ottenere preparazioni perfette grazie alla resistenza posteriore migliorata dalla ventilazione ottimale. Potrai, inoltre, evitare la formazione di vapore e odori posizionando in corrispondenza del piano cottura una pratica cappa a parete dalla struttura compatta ed in linea con il design della cucina. Consulta il catalogo online e scegli tra modelli a gas o elettrici i più adatti per soddisfare le tue esigenze.
                </div> :
                bannerHTML==="frigoriferi" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Un frigorifero moderno e affidabile è il tuo principale alleato in cucina. Il catalogo Indesit ti propone un’ampia selezione di modelli innovativi e funzionali, studiati per preservare la qualità di ingredienti e alimenti di ogni tipo, grazie alle più recenti tecnologie per la conservazione dei cibi. Scopri i differenti modelli e confronta le caratteristiche per trovare la soluzione più adatta alle tue esigenze in cucina.<br/>
                    L’offerta dei frigoriferi va dagli elettrodomestici a libera installazione, facili da posizionare in qualsiasi spazio della stanza, fino a quelli da incasso, studiati per aiutarti a ottimizzare gli spazi e capaci di integrarsi alla perfezione in ogni contesto di arredo. Ampia scelta anche per quanto riguarda le dimensioni e la capacità del frigorifero, con modelli più capienti o compatti, per rispondere alle necessità di chi dispone di uno spazio ridotto in cucina. Comune a tutti i migliori frigoriferi il comparto tecnologico dedicato al raffreddamento e alla gestione del clima interno: la funzione NoFrost impedisce la formazione della brina mantenendo asciutti gli alimenti, mentre la ventola distribuisce in maniera ottimale l’aria fresca in tutto lo spazio interno.<br/>
                    Silenzioso ed efficace anche il motore del frigorifero che, grazie alle ottime prestazioni e alla buona efficienza energetica, consente un risparmio duraturo e un impatto ambientale minimo. Completano le caratteristiche dei frigoriferi Indesit le scelte di design, che uniscono alle linee moderne e pratiche la massima attenzione alle performance. Gli interni sono infatti studiati per facilitare l’organizzazione di cibi e ingredienti di diverso tipo, aiutandoti a posizionare razionalmente gli alimenti con una serie di scomparti e mensole dedicati a bottiglie, uova, carni e verdure.<br/>
                    Immancabile, nei modelli combinati e doppia porta, lo spazio dedicato al congelatore, che unisce alle classiche funzionalità del frigorifero quelle dei freezer Indesit. Scopri i frigoriferi proposti sul catalogo, e scegli la tecnologia Indesit per la tua cucina: conserva e preserva al meglio i tuoi alimenti con un elettrodomestico moderno e facile da utilizzare.
                </div> :
                bannerHTML==="congelatori" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Scopri la linea dei congelatori Indesit, prodotti dal design lineare e pulito con cui conservare al meglio i tuoi alimenti. Grazie alle loro forme compatte, si adattano facilmente a qualsiasi tipologia di ambiente: una soluzione moderna, funzionale e di facile installazione, perfetta per ogni esigenza.<br/>
                    Sul nostro catalogo online puoi trovare diversi modelli, con caratteristiche e colori pensati per soddisfare le esigenze di stile, arredo e funzionalità della tua cucina: l'ampia gamma di colori disponibili e il design ricercato permettono di inserirli perfettamente in qualsiasi stile di arredo domestico. Puoi scegliere tra i congelatori verticali, con forme simili a quelle di un
                    <a href="https://www.indesit.it/prodotti/conservare/frigoriferi">frigorifero</a>
                    , e orizzontali. I primi sono l'opzione giusta per chi necessita di ulteriore spazio. Il loro design li rende la soluzione più adatta per creare uno spazio dedicato al congelamento e alla conservazione di ingredienti e piatti pronti. Questi modelli sono disponibili in una versione indipendente con fino a 7 cassetti e piedini regolabili. I congelatori orizzontali, invece, sono proposti in due diverse dimensioni: uno stretto e uno lungo con cestello molto ampio, ideale per chi ha poco spazio, e uno più grande fino a 4 cesti, adatto per cantine e scantinati. Le cerniere bilanciate, inoltre, semplificano e facilitano le operazioni di apertura della porta superiore, addolcendo il movimento della porta ed evitando brusche chiusure.<br/>
                    Il freezer è dotato di un'interfaccia per la regolazione della temperatura e di programmi di congelamento di facile lettura e utilizzo, in modo da poter conservare sempre nel modo giusto il cibo e godere a lungo delle sue proprietà organolettiche. I congelatori più efficienti dal punto di vista energetico consentono inoltre di risparmiare e ridurre al minimo il loro impatto ambientale. Consulta il catalogo online e scegli il congelatore più adatto alle tue esigenze.
                </div> :
                bannerHTML==="lavatrici" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Design moderno e tanta tecnologia nell’assortimento di lavatrici proposte da Indesit, con una linea di modelli studiati per permetterti di avere un bucato perfetto ogni giorno. Capi sempre puliti e profumati dopo ogni ciclo, con risultati ottimali anche per i più delicati e impegnativi. Sono molte le tipologie del catalogo, ognuna con caratteristiche innovative per una proposta completa che possa soddisfare qualsiasi tipo di esigenza.<br/>
                    I modelli Innex sono dotati di tecnologia Push&Go, studiata per permetterti di avviare l’elettrodomestico e selezionare il programma con la semplice pressione di un tasto. Il motore inverter inoltre permette di rimuovere efficacemente più di 20 tipi di macchia tramite uno speciale movimento del cestello, aumentando anche il potere pulente del tuo detersivo. L’inversione di rotazione viene calibrata in modo tale da ridurre le vibrazioni in tutte le fasi, garantendo la massima silenziosità, coccolando i tuoi capi in ogni lavaggio.<br/>
                    Tramite un innovativo sensore, le lavatrici Indesit ottimizzano automaticamente il consumo dell’acqua, utilizzandola solo nella quantità giusta e necessaria per il bucato caricato all’interno del cestello. Una caratteristica che trovi anche nella linea MyTime, con modelli che regolano il flusso permettendo di avere, con i piccoli carichi, un risparmio di acqua, energia e tempo impiegato. La lavatrice Indesit ti offre praticità e semplicità di utilizzo, grazie ai programmi che consentono di selezionare le impostazioni migliori in base alla tipologia di bucato: i modelli MyTime, per esempio, sono dotati di tre cicli rapidi dalla durata inferiore a un’ora, con impostazioni dedicate ai diversi tipi di tessuti.<br/>
                    La compattezza e le linee moderne delle lavatrici sono pensate per adattarsi perfettamente ad ogni tipo di arredamento, consentendo di affiancarle ad un’asciugatrice Indesit in modo da completare al meglio il tuo angolo per il bucato. Confronta le proposte presenti nel catalogo e seleziona il modello più adatto alle tue necessità, con le lavatrici Indesit.
                </div> :
                bannerHTML==="asciugatrici" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Le asciugatrici Indesit sono dotate di innovative tecnologie per donare a ogni capo un’asciugatura perfetta senza rovinare i tessuti. Abbiamo una vasta gamma di asciugatrici di diverso tipo e dimensione: asciugatrici a pompa di calore, a libera installazione, con carica dall’alto. Le nostre asciugatrici hanno una capacità di carico dai 7kg agli 8kg. Puoi scegliere tra una ampia varietà di colori, come nero, bianco, color acciaio e molti altri.<br/>
                    Consulta il nostro catalogo, leggi le opinioni online e scopri il punto vendita più vicino a te dove acquistare la tua asciugatrice Indesit.
                </div> :
                bannerHTML==="lavasciuga" ?
                <div className={handles.ConditionLayoutBanner_textContainer}>
                    Compatte ed efficienti, le lavasciuga Indesit ti garantiscono un bucato perfettamente pulito, grazie alla combinazione delle migliori tecnologie per il trattamento di ogni capo e tessuto. Il design elegante e funzionale ne facilita l’installazione in qualsiasi zona della casa fornita di allaccio idrico ed elettrico: la soluzione perfetta per chi vuole risparmiare spazio disponendo di un unico elettrodomestico combinato.<br/>
                    Scegli con facilità il modello giusto, con un’offerta ricca di elettrodomestici di ogni tipo: le lavasciuga da incasso possono essere installate comodamente all’interno del mobile della tua lavanderia, mentre quelle freestanding si adattano perfettamente a qualsiasi contesto d’arredo, grazie a un design elegante che riprende le linee moderne delle lavatrici e delle asciugatrici del catalogo.<br/>
                    Vero fulcro delle lavasciuga è il comparto tecnologico, caratterizzato dalla perfetta combinazione di efficienza e versatilità. Il pannello frontale è studiato per facilitare al massimo l’uso del prodotto, con i modelli della linea Innex che presentano funzioni per programmare con il massimo della velocità il ciclo più adatto al tuo bucato. La tecnologia Push & Go + Dry, per esempio, permette di attivare con un solo gesto un programma che ti garantisce capi puliti e pronti in soli 45 minuti. Numerose le funzionalità più avanzate delle lavasciuga proposte da Indesit, con cicli appositi per il trattamento di tessuti delicati o particolari, che ti offrono diverse opzioni per lavare al meglio il tuo bucato. Il programma per lo sport, ad esempio, è dedicato in maniera particolare all’abbigliamento per l’attività fisica, dalle tute per palestra fino alle sneakers da runner.<br/>
                    Immancabili le funzioni di lavaggio extra, per rimuovere le macchie più ostinate, e la possibilità di programmare il ciclo per avviare la lavasciuga nel momento più consono della giornata. Sfoglia il catalogo, scopri i prodotti e confronta le lavasciuga online. Scegli l’efficacia della tecnologia Indesit per il tuo bucato.
                </div> :
                ""}
                </div>
      </>
    )
  }
  return null
}