// @ts-nocheck
import React, { useState, useEffect } from 'react';
import styles from './styles.css';
import axios from "axios";
import SpinnerIcon from './Icons/SpinnerIcon';
import { 
  MessageDescriptor,
  useIntl,
  defineMessages } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'


const messages = defineMessages({
  search: { id: 'store/countdown.SearchButtonHome' },
  label: { id: 'store/countdown.label' }  
  })


const CustomAutocomplete = ({}) => {
  const { push } = usePixel()
  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)

  const [resultsOpen, setResultsOpen] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [brand, setBrand] = useState(""); 
  
  //GAFUNREQ52
  const setAnalyticsAutocompleteEvent = (resultsList?: any) => {
    let numberOfResults: number;
    resultsList && Array.isArray(resultsList)
      ? (numberOfResults = resultsList.length)
      : (numberOfResults = 0);
    push({
      event: 'autocomplete',
      eventType: 'search',
      search: {
        text: searchTerm.toLowerCase(),
        match: numberOfResults
      },
    })
  }

  
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
              //GAFUNREQ52
              setAnalyticsAutocompleteEvent(response.data);
            } else {
              setResults([]);
              //GAFUNREQ52
              setAnalyticsAutocompleteEvent()
            }
            setResultsLoading(false);
            
          }).catch((error)=>{
            setResults([]);
            console.log(error);
            //GAFUNREQ52
            setAnalyticsAutocompleteEvent()
          })
      }, 700)

      return () => clearTimeout(delayDebounceFn)
    }
  }, [searchTerm])
  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    
    let search = window.location.hostname.includes("smartcsb2c") ? params.__bindingAddress : window.location.hostname;    
    let isIndesit = search.includes("indesit");
    let isWhirlpool = search.includes("whirlpool");
    let isBauknecht = search.includes("bauknecht"); 
    setBrand(isIndesit ? "indesit" : isBauknecht ? "bauknecht" : isWhirlpool ? "whirlpool" : "");
  }, [])

  const getPath = (linktext) => {
    let url = __RUNTIME__.binding.canonicalBaseAddress;
    let href = window.location.href;
    
    return href.includes("myvtex") ? "/" + linktext + "/p"+  window.location.search  : "/" + url.split("/")[url.split("/").length-1] + "/" + linktext + "/p";
  }
  return (
    <div className={styles.customAutocomplete}>
      <div className={styles.customAutocomplete__wrapper}>
      {resultsLoading && (
        <SpinnerIcon className={styles.customAutocomplete__spinner}/>
      )}
      <input className={styles.customAutocomplete__input} 
        placeholder={translateMessage(messages.label)} 
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
          setSearchTerm(e.target.value) 
        }}
        onChange={(e) => {
          setSearchTerm(e.currentTarget.value);
        }}
        value={searchTerm} 
      />
      {resultsOpen && (

        <div className={styles.customAutocomplete__results}>
     
          {results.map((product) => {
            return <a className={styles.customAutocomplete__results_link} href={`${encodeURI(getPath(product["Link Text"]))}`}>
              <div className={styles.customAutocomplete__results_row}>
                <img className={styles.customAutocomplete__results_row_image} src="https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg"></img>
                <p className={styles.customAutocomplete__results_row_product_name}>{product.ids.join(" / ")}</p>
              </div>
            </a>
          })}
        </div>
      )}
      </div>
      <a className={styles.customAutocomplete__search_btn} href={`${searchTerm}?_q=sssa&map=ft`}>{translateMessage(messages.search)}</a>
    </div>
  )
}


export default CustomAutocomplete;
