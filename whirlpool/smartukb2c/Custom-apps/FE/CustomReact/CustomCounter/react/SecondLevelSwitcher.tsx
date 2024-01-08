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
  "/spare-parts/laundry/washing-machine": "2/4/14",
  "/spare-parts/laundry/washer-dryer": "2/4/15",
  "/spare-parts/laundry/tumble-dryer": "2/4/16",
  "/spare-parts/dishwashing/dishwasher": "2/5/17",
  "/spare-parts/refrigeration/fridge-freezer": "2/6/18",
  "/spare-parts/refrigeration/freezer": "2/6/19",
  "/spare-parts/refrigeration/fridge": "2/6/20",
  "/spare-parts/cooking/cooker": "2/7/21",
  "/spare-parts/cooking/hob": "2/7/22",
  "/spare-parts/cooking/hood": "2/7/23",
  "/spare-parts/cooking/microwave": "2/7/24",
  "/spare-parts/cooking/oven": "2/7/25",
  "/spare-parts/small-appliances/coffee-machine": "2/8/26",
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
  const [level4Categories, setLevel4Categories] = useState([]);
  useEffect(() => {
    if(document.getElementsByClassName("smartukb2c-countdown-0-x-cleaningAndCareWrap")[0]){
      document.getElementsByClassName("smartukb2c-countdown-0-x-cleaningAndCareWrap")[0].style.display = "none";
    }
    if (apiCategories[pathname.toLowerCase()]) {
      document.getElementsByClassName("vtex-search-result-3-x-searchResultContainer")[0].style.display = "none";
      if( document.getElementsByClassName("smartukb2c-countdown-0-x-customSearch")[0]){

        document.getElementsByClassName("smartukb2c-countdown-0-x-customSearch")[0].style.display = "none";
     
      }
      setTimeout(() => {
        axios.get('/api/catalog_system/pub/category/tree/3')
        .then(function (response) {
          if (response.status === 200) {
            let spareParts = response.data[1];
            let secondLvlCats = [];
            spareParts.children.filter((child, index) => {
              child.children.filter((child2, index2) => {
                secondLvlCats.push({
                  name: child2.name,
                  id: child2.id,
                  children: child2.children
                });
    
              })
              if (index === spareParts.children.length - 1) {
                setTimeout(() => {
                  let currentCategory = pathname.split("/")[3];
                  let level4Cats = [];
                  secondLvlCats.filter((cat) => {
                    if (cat.name.toLowerCase() === currentCategory.toLowerCase().split("-").join(" ")) {
                      cat.children.map((child) => {
                        const labelsContainer = document.getElementsByClassName("vtex-search-result-3-x-filter__container--category-4")[0]
                        let labels = [];
                        if(labelsContainer){
                        labels = labelsContainer.querySelectorAll("label");
    
                        } else {
                         $(".vtex-search-result-3-x-filterAccordionItemBox--category-4").click();
                          labels = $(".vtex-search-result-3-x-accordionFilterOpen label");
                        }
                        for (var i = 0; i < labels.length; i++) {
                          if (labels[i].textContent.includes(child.name) && level4Cats.filter(c => c.id == child.id).length == 0)
                            level4Cats.push({
                              name: child.name,
                              id: child.id,
                              count: labels[i].textContent.match(/\(([^)]+)\)/)[1],
                              url: `${pathname}/${child.name.split(" ").join("-")}`
                            })
                        }
                      })
                    }
                  });
                  setLevel4Categories(level4Cats);
                  document.getElementsByClassName("smartukb2c-countdown-0-x-customSearch")[0].style.display = "flex";

                }, 1000);
              }
            })
          }
        }).catch((error) => {
          console.log(error)
        })
    
      }, 1000)

    } else {
      setLevel4Categories([]);
      if(document.getElementsByClassName("vtex-search-result-3-x-searchResultContainer")[0]){
        document.getElementsByClassName("vtex-search-result-3-x-searchResultContainer")[0].style.display = "block";

      }

    }
 
    setPathnameSplitted(window.location ? window.location.pathname.split("/") : [])
   
  }, [pathname]);



 






  useEffect(() => {

  }, [level4Categories])

  return (
    <div >
   
      {pathnameSplitted && pathnameSplitted.length &&  pathnameSplitted[1].toLowerCase() !== "cleaning-and-care" && (
        <div className={styles.customSearch}>
        {children}
        <div className={styles.customSearchInner}>
          {level4Categories.map((json, index) =>
          <a className={styles.customSearchCard} href={json.url.replace(",", "").toLowerCase() + window.location.search}>
            <img className={styles.customSearchCardImage} src={`/arquivos/${json.id}.jpg`}/>
            <b>{json.name} ({json.count})</b>
          </a>
          )}
        </div>
      </div>
      )}
      
      {isLoading && (
        <div className={styles.categoriesLoader}>
          <SpinnerIcon className={styles.categoriesLoaderSpinner} />
        </div>
      )}

    </div>

  )
}

export default SecondLevelSwitcher
