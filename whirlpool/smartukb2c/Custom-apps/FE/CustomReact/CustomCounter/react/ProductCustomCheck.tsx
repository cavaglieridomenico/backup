// @ts-nocheck
import React, { useContext, useState, useEffect } from 'react';
import styles from './styles.css';
import axios from "axios";
import SpinnerIcon from './Icons/SpinnerIcon';
import { ProductContext } from 'vtex.product-context'
import { isEmpty, path } from 'ramda'
import UnavailableIcon from './Icons/UnavailableIcon';
import TickIcon from './Icons/TickIcon';
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages
} from 'react-intl'
import { func } from 'prop-types';
import SearchIcon from './Icons/SearchIcon';
import FitApplianceCheck from './Icons/FitApplianceCheck';


const messages = defineMessages({
  PartFits: { id: 'store/countdown.PartFits' },
  PartDoesNotFit: { id: 'store/countdown.PartNotFit' },
  NoResultFound: { id: 'store/countdown.NoResultFound' },
  Search: { id: 'store/countdown.SearchButton' },
  Label: { id: 'store/countdown.labelPdp' }
})



const ProductCustomCheck = ({ }) => {
  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)

  const [resultsOpen, setResultsOpen] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchCheck, setCheckTerm] = useState(null);
  const [matchValue, setmatchValue] = useState("");
  const [showCheck, setShowCheck] = useState(false);
  const [brand, setBrand] = useState("");
  const [bindingAddress, setBindingAddress] = useState("");
  const valuesFromContext = useContext(ProductContext)

  if (!valuesFromContext || isEmpty(valuesFromContext)) {
    return null
  }
  const { product }: { product: product } = valuesFromContext
  const availabilityObject = path(['properties'], product)
  const [fromBomCheck, setFromBomCheck] = useState(false);
  const jCode = (availabilityObject?.filter(x => { return x.name == "jCode" })[0]?.values[0])
  const [bomUrl, setBomUrl] = useState(null);

  useEffect(() => {
    let search = window.location.search;
    let search2 = window.location.href;
    let isIndesit = (search.includes("indesit") || search2.includes("indesit"));
    let isHotpoint = (search.includes("hotpoint") || search2.includes("hotpoint"));
    let isBauknecht = (search.includes("bauknecht") || search2.includes("bauknecht"));
    let params = new URLSearchParams(window.location.search);
    setBindingAddress(params.get("__bindingAddress"))
    setBrand(isIndesit ? "indesit" : "hotpoint");
  }, [])

  useEffect(() => {
    /*if(!matchValue){
      document.getElementById("fits-appliance").innerHTML = "Check if this part fits your appliance";
      document.getElementById("fits-appliance-img").innerHTML = <FitApplianceCheck />
     } else if(matchValue == "not found"){
      document.getElementById("fits-appliance").innerHTML = "This part does not fit your appliance";
      document.getElementById("fits-appliance-img").innerHTML = <FitApplianceNoFit />
      window.scroll({
       top: 400,
       left: 0,
       behavior: 'smooth'
     });
 
     } else {
       document.getElementById("fits-appliance").innerHTML = "This part fits your appliance";
       document.getElementById("fits-appliance-img").innerHTML = <FitApplianceOk />
       window.scroll({
         top: 400,
         left: 0,
         behavior: 'smooth'
       });
     }
   }, [matchValue])*/
   if(!matchValue){
     if( document.getElementsByClassName("smartukb2c-countdown-0-x-wrongFg").length > 0){
      document.getElementsByClassName("smartukb2c-countdown-0-x-wrongFg")[0].remove()
     }
    let url = window && window.location ? window.location.href : "";
    if(url.includes("fromBOM=true") && !fromBomCheck) {
      document.getElementById("fits-appliance").innerHTML = "This part fits your appliance";
      document.getElementById("fits-appliance-img").src= "/arquivos/checkProductFit.png"
      setFromBomCheck(true);
     } else {
    document.getElementById("fits-appliance").innerHTML = "Check if this part fits your appliance";
    document.getElementById("fits-appliance-img").src= "/arquivos/checkProduct.png"}
   } else if(matchValue == "not found"){
    document.getElementById("fits-appliance").innerHTML = "This part does not fit your appliance";
    document.getElementById("fits-appliance-img").src= "/arquivos/checkProductNoFit.png"
    window.scroll({
     top: 400,
     left: 0,
     behavior: 'smooth'
   });

   } else {
     document.getElementById("fits-appliance").innerHTML = "This part fits your appliance";
     document.getElementById("fits-appliance-img").src= "/arquivos/checkProductFit.png"
     window.scroll({
       top: 400,
       left: 0,
       behavior: 'smooth'
     });
   }
 }, [matchValue])

  useEffect(() => {
    if (searchTerm !== null && searchTerm.length >= 3) {
      setResultsOpen(false);
      setResultsLoading(true);
      const delayDebounceFn = setTimeout(() => {
        axios.get(`/v1/search/autocomplete?term=${searchTerm}&brand=${brand}`)
          .then(function (response) {
            if (response.data && !response.data.error && typeof response.data !== "string") {
              response.data.filter((product) => {
                product.ids = [];
                if (product["jCode"]) {
                  product.ids.push(product["jCode"]);
                }
                if (product["indesitMaterialCode"]) {
                  product.ids.push(product["indesitMaterialCode"]);
                }
                if (product["whirlpoolCode"]) {
                  product.ids.push(product["whirlpoolCode"]);
                }
                if (product["industrialCode"]) {
                  product.ids.push(product["industrialCode"]);
                }
                if (product["commercialCode"]) {
                  product.ids.push(product["commercialCode"]);
                }
              })
              setResults(response.data);
              setResultsOpen(true);
            } else {
              setResults([]);
            }
            setResultsLoading(false);

          }).catch((error) => {
            setResults([]);
            console.error(error);
          })
      }, 700)


      return () => { clearTimeout(delayDebounceFn) }
    }
  }, [searchTerm])

  const checkSpare = (e) => {
    var id = e.target.closest("a").dataset.id;
    var linkText = e.target.closest("a").dataset.linktext;
    var name = e.target.closest("a").dataset.name;

    axios.get(`/v1/check/spare/${jCode}/product/${id}?brand=${brand}`)
      .then( (response) => {

        if (response && response.data) {
          setmatchValue(response.data.outcome)
          if(response.data.outcome === "not found"){
            let fitsTag =  document.getElementById("fits-appliance");
            var a = document.createElement('a');              
            var link = document.createTextNode(name);
            a.href = "/" + linkText + "/p";
            a.classList.add(styles.wrongFg);
            a.appendChild(link); 
            setTimeout(() => {
              fitsTag.parentNode.parentNode.insertBefore(a, fitsTag?.nextSibling)
            },500)
          }
        }
      }).catch((error) => {
        console.error(error);
      })
  }

  return (
    <div className={styles.customAutoCompleteWrapper}>
      <div className={styles.customAutocomplete}>
        <div className={styles.customAutocomplete__wrapper}>
          {resultsLoading && (
            <SpinnerIcon className={styles.customAutocomplete__spinner} />
          )}
          <input className={styles.customAutocomplete__input}
            placeholder={translateMessage(messages.Label)}
            onBlur={(e) => {
              setTimeout(() => {
                setResultsOpen(false);
                setSearchTerm("")
              }, 500)
            }}
            onFocus={(e) => {
              setSearchTerm("");
              setmatchValue(null)
            }}
            onKeyUp={(e) => {
              setSearchTerm(e.target.value)
            }}
            onChange={(e) => {
              setSearchTerm(e.currentTarget.value);
              setCheckTerm(null);
            }}
            value={searchTerm}
          />
          {resultsOpen && (

            <div className={styles.customAutocomplete__results}>

              {results.map((product) => {
                return <a className={styles.customAutocomplete__results_link} data-id={product.industrialCode} data-name={product.commercialCode} data-linkText={product["Link Text"]} onClick={(e) => { checkSpare(e) }} >
                  <div className={styles.customAutocomplete__results_row}>
                    <img className={styles.customAutocomplete__results_row_image} src="https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg"></img>
                    <p className={styles.customAutocomplete__results_row_product_name}>{product.ids.join(" / ")}</p>
                  </div>
                </a>
              })}
            </div>
          )}
        </div>
        <a className={styles.customAutocomplete__search_btn} onClick={() => (matchValue != "true") && (`${translateMessage(messages.NoResultFound)}`)} ><SearchIcon /></a>
      </div>
     
    </div>
  )
}


export default ProductCustomCheck;
