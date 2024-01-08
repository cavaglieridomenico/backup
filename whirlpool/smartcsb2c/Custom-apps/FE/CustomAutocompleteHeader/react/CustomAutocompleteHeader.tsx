// @ts-nocheck
import React, { useState, useEffect } from 'react';
import styles from './styles.css';
import axios from "axios";
import SpinnerIcon from './Icons/SpinnerIcon';
import SearchIcon from './Icons/SearchIcon';
import { FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages } from 'react-intl';


const messages = defineMessages({
  Search: { id: 'store/custom-autocomplete-header.Search' },
 
})
const CustomAutocompleteHeader = ({

}) => {

  const [resultsOpen, setResultsOpen] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);
  const [brand, setBrand] = useState("");
  const [bindingAddress, setBindingAddress] = useState("");
  const [locale, setLocale] = useState("");
  const intl = useIntl()

    const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)
  useEffect(() => {
    if (searchTerm !== null && searchTerm.length >= 3) {
      setResultsOpen(false);
      setResultsLoading(true);
      const delayDebounceFn = setTimeout(() => {
        axios.get(`/v1/search/autocomplete?term=${searchTerm}&brand=${brand}`)
          .then(function (response) {
            if (response.data && !response.data.error && typeof response.data!=="string" ) {
              response.data.filter((product) => {
                product.ids = [];
                if(product["jCode"]){
                  product.ids.push(product["jCode"]);
                }
                if(product["indesitMaterialCode"]){
                  product.ids.push(product["indesitMaterialCode"]);
                }
                if(product["whirlpoolCode"]){
                  product.ids.push(product["whirlpoolCode"]);
                }
                if(product["industrialCode"]){
                  product.ids.push(product["industrialCode"]);
                }
                if(product["commercialCode"]){
                  product.ids.push(product["commercialCode"]);
                }
              })
              setResults(response.data);
              setResultsOpen(true);
            } else {
              setResults([]);
            }
            setResultsLoading(false);
            
          }).catch((error)=>{
            setResults([]);
            console.log(error);
          })
      }, 700)

      return () => clearTimeout(delayDebounceFn)
    }
  }, [searchTerm])
  useEffect(() => {
    let search = window.location.search;
    let isIndesit = search.includes("indesit");
    let isWhirlpool = search.includes("whirlpool");
    let isBauknecht = search.includes("bauknecht");
    let params = new URLSearchParams(window.location.search);
    setBindingAddress(params.get("__bindingAddress"))
    setBrand(isIndesit ? "indesit" : isBauknecht ? "bauknecht" : isWhirlpool ? "whirlpool" : "");
    setLocale(__RUNTIME__.culture.locale);
  }, [])

  const getPath = (linktext) => {
    let url = __RUNTIME__.binding.canonicalBaseAddress;
    let href = window.location.href;
    
    return href.includes("myvtex") ? "/" + linktext + "/p"+  window.location.search  : "/" + url.split("/")[url.split("/").length-1] + "/" + linktext + "/p";
  }
  return (
    <div className={styles.customAutocompleteHeader}>
      <SearchIcon 
        
        role="button" 
        onClick={(e) => {
          setSearchClicked(true);
          setTimeout(() => {
            document.getElementById("custom-search-header-trigger").focus();
          }, 500);
        }} 
        className={styles.customAutocompleteHeader__search_icon}
      />

      {searchClicked && (
        <div className={styles.customAutocompleteHeader__wrapper}>
   
        <input id="custom-search-header-trigger"  className={styles.customAutocompleteHeader__input} 
          placeholder={locale === "de-CH" ? "Suche" : "Search"} 
          onBlur={(e) => {
            setTimeout(() => {
              setResultsOpen(false);
              setSearchClicked(false);
              setSearchTerm(null) 
            }, 500)
          }} 
          onFocus={(e) => {
            setSearchTerm("");
          }} 
          onKeyUp={(e) => { 
            setSearchTerm(e.target.value) 
          }}
          onChange={(e) => {
            setSearchTerm(e.currentTarget.value);
          }}
          value={searchTerm} 
        />
        <SearchIcon onClick={() => window.location.href = encodeURI(`/${searchTerm}?_q=${searchTerm}&map=ft&showCode=false&from=menu`)} className={[styles.customAutocompleteHeader__search_icon_label]}/>
        {resultsOpen && (
  
          <div className={styles.customAutocompleteHeader__results}>
       
            {results.map((product) => {
              return <a className={styles.customAutocompleteHeader__results_link} href={encodeURI(`${getPath(product["Link Text"])}`)}>
                <div className={styles.customAutocompleteHeader__results_row}>
                  <img className={styles.customAutocompleteHeader__results_row_image} src="https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg"></img>
                  <p className={styles.customAutocompleteHeader__results_row_product_name}>{product.ids.join(" / ")}</p>
                </div>
              </a>
            })}
          </div>
        )}
        </div>
      )}
    </div>
  )
}


export default CustomAutocompleteHeader;
