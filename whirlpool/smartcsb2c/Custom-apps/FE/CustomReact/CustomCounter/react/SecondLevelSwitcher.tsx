// @ts-nocheck
import React, { useState, useEffect } from 'react'
import MenuReusable from './MenuReusable'
import styles from './styles.css'
import axios from "axios"
import SpinnerIcon from './Icons/SpinnerIcon'
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages
} from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

interface SecondPageSwitcher {
  jsonState: any[]
}


interface SecondLevelSwitcher {
  urlExtension: string;
}

const messages = defineMessages({
  language: { id: "store/countdown.detectLanguage" }
})

let apiCategories = {
  "/de/ersatzteile/waschen-und-trocknen/waschmaschinen": "2/3/8",
	"/it/ricambi/lavaggio-e-asciugatura/lavatrici": "2/3/8",
	"/fr/pieces-detachees/lavage/machines-a-laver": "2/3/8",
	"/de/ersatzteile/waschen-und-trocknen/waschtrockner": "2/3/9",
	"/it/ricambi/lavaggio-e-asciugatura/lavasciuga": "2/3/9",
	"/fr/pieces-detachees/lavage/combinaison-lavage-et-sechage": "2/3/9",
	"/de/ersatzteile/waschen-und-trocknen/trockner": "2/3/10",
	"/it/ricambi/lavaggio-e-asciugatura/asciugatrici": "2/3/10",
	"/fr/pieces-detachees/lavage/sechoirs": "2/3/10",
	"/de/ersatzteile/geschirrspuler/geschirrspulmaschinen": "2/4/12",
	"/it/ricambi/lavastoviglie/lavastoviglie": "2/4/12",
	"/fr/pieces-detachees/lave-vaisselle/lave-vaisselle": "2/4/12",
	"/de/ersatzteile/kuhlen-und-gefrieren/kuhlschranke": "2/5/15",
	"/it/ricambi/refrigerazione-e-congelamento/frigoriferi": "2/5/15",
	"/fr/pieces-detachees/refroidissement/refrigerateurs": "2/5/15",
	"/de/ersatzteile/kuhlen-und-gefrieren/gefrierschranke": "2/5/14",
	"/it/ricambi/refrigerazione-e-congelamento/congelatori": "2/5/14",
	"/fr/pieces-detachees/refroidissement/congelateurs": "2/5/14",
	"/de/ersatzteile/kuhlen-und-gefrieren/kuhl-gefrierkombinationen": "2/5/13",
	"/it/ricambi/refrigerazione-e-congelamento/combinati": "2/5/13",
	"/fr/pieces-detachees/refroidissement/combinaison-refrigerateur-et-congelateur": "2/5/13",
	"/de/ersatzteile/kochen-und-backen/herde": "2/6/17",
	"/it/ricambi/cottura/cucine": "2/6/17",
	"/fr/pieces-detachees/cuisson/cuisiniere": "2/6/17",
	"/de/ersatzteile/kochen-und-backen/kochfelder": "2/6/18",
	"/it/ricambi/cottura/piani-cottura": "2/6/18",
	"/fr/pieces-detachees/cuisson/tables-de-cuisson": "2/6/18",
	"/de/ersatzteile/kochen-und-backen/hauben": "2/6/19",
	"/it/ricambi/cottura/cappe": "2/6/19",
	"/fr/pieces-detachees/cuisson/hottes": "2/6/19",
	"/de/ersatzteile/kochen-und-backen/mikrowellen": "2/6/20",
	"/it/ricambi/cottura/microonde": "2/6/20",
	"/fr/pieces-detachees/cuisson/micro-onde": "2/6/20",
	"/de/ersatzteile/kochen-und-backen/ofen": "2/6/21",
	"/it/ricambi/cottura/forni": "2/6/21",
	"/fr/pieces-detachees/cuisson/fours": "2/6/21",
	"/de/ersatzteile/kleine-gerate/kaffeemaschinen": "2/7/23",
	"/it/ricambi/piccoli-elettrodomestici/macchine-da-caffe": "2/7/23",
	"/fr/pieces-detachees/petits-appareils-electromenagers/machine-a-cafe": "2/7/23",
	"/de/reinigung-und-wartung/kochen-und-backen": "24/22",
	"/it/pulizia-e-manutenzione/cottura": "24/22",
	"/fr/nettoyage-et-entretien/cuisson": "24/22",
	"/de/reinigung-und-wartung/kuhlen-gefrieren": "24/16",
	"/it/pulizia-e-manutenzione/refrigerazione-e-congelamento": "24/16",
	"/fr/nettoyage-et-entretien/refroidissement": "24/16",
	"/de/reinigung-und-wartung/waschen-und-trocknen": "24/11",
	"/it/pulizia-e-manutenzione/lavaggio-e-asciugatura": "24/11",
	"/fr/nettoyage-et-entretien/lavage": "24/11",
	"/de/reinigung-und-wartung/kleine-gerate": "24/25",
	"/it/pulizia-e-manutenzione/piccoli-elettrodomestici": "24/25",
	"/fr/nettoyage-et-entretien/petits-appareils-electromenagers": "24/25",
	"/de/reinigung-und-wartung/reinigunsgmittel": "24/26",
	"/it/pulizia-e-manutenzione/cura-della-casa": "24/26",
	"/fr/nettoyage-et-entretien/soins-a-domicile": "24/26",
	"/de/reinigung-und-wartung/klimagerate": "24/27",
	"/it/pulizia-e-manutenzione/condizionamento": "24/27",
	"/fr/nettoyage-et-entretien/climatisation": "24/27"
}

let sixthCategory = ["/Reinigung-und-Wartung/Kochen", "/reinigung-und-wartung/kochen",
  "/pulizia-e-manutenzione/cottura", "/nettoyage-et-entretien/cuisson",
  "/Reinigung-und-Wartung/Kalt", "/reinigung-und-wartung/kalt", "/pulizia-e-manutenzione/freddo",
  "/nettoyage-et-entretien/refroidissement",
  "/Reinigung-und-Wartung/Waschen", "/reinigung-und-wartung/waschen",
  "/pulizia-e-manutenzione/lavaggio", "/fr/nettoyage-et-entretien/lavage",
  "/Reinigung-und-Wartung/Kleine-Gerate", "/reinigung-und-wartung/kleine-gerate",
  "/pulizia-e-manutenzione/piccoli-elettrodomestici", "/nettoyage-et-entretien/petits-appareils-electromenagers",
  "/Reinigung-und-Wartung/Hausliche-Pflege", "/reinigung-und-wartung/hausliche-pflege",
  "/pulizia-e-manutenzione/cura-della-casa", "/nettoyage-et-entretien/soins-a-domicile",
  "/Reinigung-und-Wartung/Konditionierung", "/reinigung-und-wartung/konditionierung",
  "/pulizia-e-manutenzione/condizionamento", "/nettoyage-et-entretien/climatisation"
]


const SecondLevelSwitcher: StorefrontFunctionComponent<SecondPageSwitcher> = ({ children }) => {


  const [jsonState, setJsonState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [switchState, setSwitchState] = useState<SecondLevelSwitcher>({
    urlExtension: "",
    brand: "",
    bindingAddress: ""
  })
  const [urlSix, setUrlSix] = useState(false);

  const [testSt, setTestSt] = useState(0)
  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)
  const [pathnameSplitted, setPathnameSplitted] = useState([]);
  let pathname = window.location ? window.location.pathname : "";
  useEffect(() => {

    if (pathname != "") {
      setTestSt((pathname.match(new RegExp("/", "g")) || []).length)
    }

    let cancelProduct = Array.from(document.getElementsByClassName('vtex-search-result-3-x-searchResultContainer') as HTMLCollectionOf<HTMLElement>)[0]

    if ((((pathname.match(new RegExp("/", "g")) || []).length) == 4) &&
      !pathname.includes("/Reinigung-und-Wartung") &&
      !pathname.includes("/reinigung-und-wartung") &&
      !pathname.includes("/pulizia-e-manutenzione") &&
      !pathname.includes("/nettoyage-et-entretien")) {
      cancelProduct.style.display = 'none'
      setUrlSix(false)
    }
    else if ((((pathname.match(new RegExp("/", "g")) || []).length) == 4) &&
      (pathname.includes("/Reinigung-und-Wartung") ||
        pathname.includes("/reinigung-und-wartung") ||
        pathname.includes("/pulizia-e-manutenzione") ||
        pathname.includes("/nettoyage-et-entretien"))) {
      setUrlSix(true)
    }
    else {
      setUrlSix(false)
      setTimeout(() => {
        cancelProduct.style.display = 'block'
      }, 800);
    }

    let search = window.location.search;
    let search2 = window.location.href;
    let isIndesit = (search.includes("indesit") || search2.includes("indesit"));
    let isWhirlpool = (search.includes("whirlpool") || search2.includes("whirlpool"));
    let isBauknecht = (search.includes("bauknecht") || search2.includes("bauknecht"));
    let params = new URLSearchParams(window.location.search);
    setSwitchState((prevState) => ({
      ...prevState,
      brand: (isIndesit ? "indesit" : isBauknecht ? "bauknecht" : isWhirlpool ? "whirlpool" : ""),
      bindingAddress: `${(params.get("__bindingAddress"))}`
    }))
    setJsonState([])
    if (apiCategories[pathname.toLowerCase()]) {
      setIsLoading(true)
      axios.get(`/v1/family-group?categoryIds=${apiCategories[pathname.toLowerCase()]}&language=${translateMessage(messages.language)}`)
        .then(function (response) {
          setJsonState(response.data);
          setIsLoading(false)
        }).catch((error) => {
          console.log(error)
        })
    }
    if (document.getElementsByClassName('vtex-overlay-layout-0-x-dropdown').length) {
      document.getElementsByClassName('vtex-overlay-layout-0-x-dropdown')[0].style.display = "none";
    }
    setPathnameSplitted(window.location ? window.location.pathname.split("/") : [])
  }, [pathname]);


  return (
    <div >
      {pathnameSplitted && pathnameSplitted.length === 5 && (
        <div className={styles.plpTitle}>{pathnameSplitted[pathnameSplitted.length - 1]}</div>
      )}
      {pathnameSplitted && pathnameSplitted.length === 6 && (
        <div className={styles.plpTitle}>{pathnameSplitted[pathnameSplitted.length - 2]} - {pathnameSplitted[pathnameSplitted.length - 1]} </div>
      )}
      <div className={((testSt == 4 && !urlSix) || (testSt == 3)) ? styles.customSearch : styles.customSearchHide}>
        {children}
        <div className={styles.customSearchInner}>
          {jsonState.map((json, index) =>
            <MenuReusable
              image={`/arquivos/${json.Id}.jpg`}
              title={json.Name} quantity={json.Counter}
              href={`${json.Url}`} />
          )}
        </div>
      </div>
      {isLoading && (
        <div className={styles.categoriesLoader}>
          <SpinnerIcon className={styles.categoriesLoaderSpinner} />
        </div>
      )}

    </div>

  )
}

export default SecondLevelSwitcher
