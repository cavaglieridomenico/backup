// @ts-nocheck
import React, { useState, useEffect } from 'react';
import styles from './styles.css';
import axios from "axios";
import SpinnerIcon from './Icons/SpinnerIcon';
import {
  MessageDescriptor,
  useIntl,
  defineMessages
} from 'react-intl'
import SearchIcon from './Icons/SearchIcon';


const messages = defineMessages({
  search: { id: 'store/countdown.SearchButtonHome' },
  label: { id: 'store/countdown.label' }
})


const AutoCompleteNotFound = ({

}) => {

  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)

  const [resultsOpen, setResultsOpen] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [brand, setBrand] = useState("");
  const spareAndAccessoriesCodes = ["jCode", "winnerCode", "looserCode"];
  const finishedGoodsCodes = ["indesitMaterialCode", "whirlpoolCode", "industrialCode", "commercialCode"];
  const [listCounter, setListCounter] = useState(-1);
  const [jCode, setJCode] = useState("");
  const [arrowSearch, setArrowSearch] = useState(false);
  //const [scrollList, setScrollList] = useState(0);
  const [showCode, setShowCode] = useState(false);

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


                // spare parts codes 
                spareAndAccessoriesCodes
                  .filter(code => product[code] && product[code].toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0)
                  .forEach(code => product.ids.push(product[code]));
                // prodcut codes. Differently from the spare, all the codes of a FG need to be displaid
                finishedGoodsCodes
                  .filter(code => product[code])
                  .forEach(code => product.ids.push(product[code]));

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

      return () => clearTimeout(delayDebounceFn)
    }
  }, [searchTerm])
  useEffect(() => {
    let search = window.location.href;
    let isIndesit = search.includes("indesit");
    let isHotpoint = search.includes("hotpoint");
    setBrand(isIndesit ? "indesit" : isHotpoint ? "hotpoint" : "hotpoint");
  }, [])

  const getPath = (linktext) => {
    return "/" + linktext + "/p";
  }

  const pressArrow = (arrow, r) => {

    if (resultsOpen === true) {
      if (arrow === 40) {
        if (listCounter < r.length - 1) {
          let index = listCounter + 1;
          setJCode(r[index].jCode);
          setArrowSearch(true)
          setListCounter(index);
          /*setScrollList(index * 40);
          if(index*40 > 160) {
            const scroller = document.querySelector("#resultsWrapper");
            scroller.addEventListener("scroll", event => {
              //output.textContent = `scrollTop: ${scroller.scrollTop}`;
              scroller.window.scrollTo({ top: 100,
                behavior: 'smooth'})
            });
            console.log("ciao3")
            //window.scrollBy(0, 40);
          }*/

        }
      } else if (arrow === 38) {
        if (listCounter > 0) {
          let index = listCounter - 1;
          setJCode(r[index].jCode);
          setArrowSearch(true)
          setListCounter(index);
        }
        else if (listCounter === 0) {
          let index = listCounter - 1;
          setListCounter(index);
        }
      } else if (arrow === 13) {
        if (arrowSearch === true && listCounter > -1) {
          window.location.href = `${encodeURI(getPath(r[listCounter]["Link Text"] + "/p?showCode=" + showCode))}`;
        } else {
          window.location.href = encodeURI(`/${searchTerm}?_q=${searchTerm}&map=ft&showCode=` + showCode + "&from=home");
        }
      }
      else {
        setListCounter(-1)
      }
    }
  }



  return (
    <div className={styles.customAutocomplete__container}>
      <div className={styles.customAutocomplete__title}>
        SORRY, THIS PAGE ISN'T AVAILABLE
      </div>
      <div className={styles.customAutocomplete__paragraph}>
        The link you followed seems to be broken, or the page may have been removed.
      </div>
      <div className={styles.customAutocomplete__subtitle}>
        Would you like to try again?
      </div>
      <div className={styles.customAutocomplete}>
        <div className={styles.customAutocomplete__wrapper}>
          {resultsLoading && (
            <SpinnerIcon className={styles.customAutocomplete__spinner} />
          )}
          <input className={styles.customAutocomplete__input}
            placeholder={"Enter your model number, spare part code or keyword here"}
            onBlur={(e) => {
              setTimeout(() => {
                setResultsOpen(false);
                setSearchTerm("")
              }, 500)
            }}
            onFocus={(e) => {
              setSearchTerm("");
            }}
            onKeyUp={(e) => {
              var event = window.event ? window.event : e;
              //console.log(event.keyCode);
              setSearchTerm(e.currentTarget.value);
              if ((e.currentTarget.value.includes("j00")) === true) {
                setShowCode(false)
              } else {
                setShowCode(true)
              }
              pressArrow(event.keyCode, results);
              //setSearchTerm(results[listCounter].jCode)
              //console.log(listCounter)
              //console.log(results[listCounter].jCode)

            }}
            onKeyDown={(e) => {
              setSearchTerm(e.currentTarget.value);
            }}
            onChange={(e) => {
              setSearchTerm(e.currentTarget.value);
            }}
            value={searchTerm}
          />
          {resultsOpen && (

            <div className={styles.customAutocomplete__results}>

              {results.map((product, index) => {
                return <a className={styles.customAutocomplete__results_link} href={`${encodeURI(getPath(product["Link Text"] + "/p?showCode=" + showCode))}`}>
                  <div className={(index === listCounter) ? styles.customAutocomplete__results_row__active : styles.customAutocomplete__results_row}>
                    <img className={styles.customAutocomplete__results_row_image} src="https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg"></img>
                    <p className={styles.customAutocompleteHeader__results_row_product_name}>{(product.ids == product.jCode) ? product.ids.join(" / ") : product.ids.join(" / ") + `${product.jCode ? " [" + product.jCode + "]" : ""}`}</p>
                  </div>
                </a>
              })}
            </div>
          )}
        </div>
        <a className={styles.customAutocomplete__search_btn} href={(searchTerm !== null) ? `${searchTerm}?_q=${searchTerm}&map=ft&showCode=` + showCode + "&from=home" : "#"}><SearchIcon /></a>
      </div>
      <p className={styles.customAutocomplete__paragraph}>
        Looking for something else or require further assistance? Visit our <a href="/contact-us">CONTACT US</a> area and our team will be happy to help you.
      </p>
      <a className={styles.customAutoplete__linkButton} href='/'>
        <div className={styles.customAutocomplete__homeButton}>Go to homepage</div>
      </a>
    </div>
  )
}


export default AutoCompleteNotFound;



