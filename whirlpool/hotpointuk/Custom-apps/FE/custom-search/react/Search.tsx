//@ts-nocheck
import React, {useEffect, useState} from 'react'
import {useLazyQuery} from 'react-apollo'
import customSearch from './graphql/customSearch.graphql'
import LocalCheck from './LocalCheck'

import styles from './styles.css'


interface checkResultObj {
  localCheckPropValue: string,
  localCheckTerm: string,
  redirectUrl: string
}

interface SearchProps {
  urlStructure: string,
  labelStructureNo12NC: string,
  urlStructureNo12NC: string,
  labelStructure: string,
  placeholder: string,
  iconClear: string,
  iconEmpty: string,
  loadingIcon: string,
  loadingIcon: string,
  iconSearch: string,
  showSearchIcon: boolean,
  isLocalCheck: boolean,
  localCheckOnProperty: string,
  localCheckApi: string,
  localCheckPropValue: string,
  localCheckSuccessMessage: string,
  localCheckNotFoundMessage: string,
  localCheckSuccessIcon: string,
  localCheckNotFoundIcon: string,
  localCheckRedirectLabel: string,
  isPlp: boolean,
  isPdp: boolean
}

//https://api-cms.tps-cloud.com/apicms/apis/aa208b30-257d-11e9-b03f-b5666fec9770/d98b0640-ba5b-11ec-b8e2-dd92ddd7ac9e
const Search: StorefrontFunctionComponent<SearchProps> = ({
 placeholder = "My placeholder",
 iconClear= "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' d='M0 0h24v24H0V0z'/%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'/%3E%3C/svg%3E",
 loadingIcon = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor"%3E%3Canimate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(45 12 12)"%3E%3Canimate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(90 12 12)"%3E%3Canimate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(135 12 12)"%3E%3Canimate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(180 12 12)"%3E%3Canimate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(225 12 12)"%3E%3Canimate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(270 12 12)"%3E%3Canimate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(315 12 12)"%3E%3Canimate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3C%2Fsvg%3E',
 iconSearch = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='20' viewBox='0 0 22 20' fill='none'%3E%3Cpath d='M8.20963 0C4.23361 0 0.988281 3.14585 0.988281 7C0.988281 10.8541 4.23361 14 8.20963 14C10.0129 14 11.6604 13.348 12.9285 12.2812L13.3677 12.707V14L19.5575 20L21.6207 18L15.431 12H14.0971L13.6579 11.5742C14.7584 10.345 15.431 8.748 15.431 7C15.431 3.14585 12.1856 0 8.20963 0ZM8.20963 2C11.0706 2 13.3677 4.22673 13.3677 7C13.3677 9.77327 11.0706 12 8.20963 12C5.34866 12 3.05152 9.77327 3.05152 7C3.05152 4.22673 5.34866 2 8.20963 2Z' fill='white'/%3E%3C/svg%3E",
 loadingIconWhite="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='2' r='0' fill='white'%3E%3Canimate attributeName='r' begin='0' calcMode='spline' dur='1s' keySplines='0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8' repeatCount='indefinite' values='0;2;0;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='2' r='0' fill='white' transform='rotate(45 12 12)'%3E%3Canimate attributeName='r' begin='0.125s' calcMode='spline' dur='1s' keySplines='0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8' repeatCount='indefinite' values='0;2;0;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='2' r='0' fill='white' transform='rotate(90 12 12)'%3E%3Canimate attributeName='r' begin='0.25s' calcMode='spline' dur='1s' keySplines='0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8' repeatCount='indefinite' values='0;2;0;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='2' r='0' fill='white' transform='rotate(135 12 12)'%3E%3Canimate attributeName='r' begin='0.375s' calcMode='spline' dur='1s' keySplines='0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8' repeatCount='indefinite' values='0;2;0;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='2' r='0' fill='white' transform='rotate(180 12 12)'%3E%3Canimate attributeName='r' begin='0.5s' calcMode='spline' dur='1s' keySplines='0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8' repeatCount='indefinite' values='0;2;0;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='2' r='0' fill='white' transform='rotate(225 12 12)'%3E%3Canimate attributeName='r' begin='0.625s' calcMode='spline' dur='1s' keySplines='0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8' repeatCount='indefinite' values='0;2;0;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='2' r='0' fill='white' transform='rotate(270 12 12)'%3E%3Canimate attributeName='r' begin='0.75s' calcMode='spline' dur='1s' keySplines='0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8' repeatCount='indefinite' values='0;2;0;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='2' r='0' fill='white' transform='rotate(315 12 12)'%3E%3Canimate attributeName='r' begin='0.875s' calcMode='spline' dur='1s' keySplines='0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8' repeatCount='indefinite' values='0;2;0;0'/%3E%3C/circle%3E%3C/svg%3E",
 showSearchIcon= false,
 iconEmpty,
 localCheckSuccessMessage,
 localCheckNotFoundMessage,
 localCheckSuccessIcon,
 localCheckNotFoundIcon,
 isLocalCheck,
 localCheckOnProperty,
 localCheckRedirectLabel,
 localCheckPropValue,
 isPlp,
 isPdp
 /*localCheckApi*/
  }) => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState(null);
  const [showLoadingMask, setShowLoadingMask] = useState(false);
  const [localCheckObj, setlocalCheckObj] = useState<checkResultObj | undefined>(undefined)
  const [getBomIds, {loading, data}] = useLazyQuery(customSearch, {
    variables: {
      "searchTerm": inputValue
    },
    fetchPolicy: "no-cache"
  });


  useEffect(() => {
    if (data) {
      setResults(data["getBomCodes"])
      setShowLoadingMask(false)
    }
    console.log(data)
  }, [data])

  useEffect(() => {
    setResults(null)
    setlocalCheckObj(undefined)
    if (inputValue && inputValue.length > 4 && !loading) {
      setShowLoadingMask(true)

      getBomIds({
        variables: {
          "searchTerm": inputValue
        }
      })


    }
  }, [inputValue]);

  const buildUrl = (obj: any) => {
    let url = obj["modelNumber"] ? `/spare-parts/bom/${normalizeModelNumber(obj["modelNumber"]).toLowerCase()}-${obj["industrialCode"].toLowerCase()}` : `/spare-parts/bom/${obj["industrialCode"].toLowerCase()}`;

    return url;
  }

  function normalizeModelNumber(modelNumber:string){
    modelNumber = modelNumber.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    modelNumber = modelNumber.replace(/\+/g,"plus");
    modelNumber = modelNumber.replace(/\[/g,"");
    modelNumber = modelNumber.replace(/\]/g,"");
    modelNumber = modelNumber.replace(/\//g,"");
    modelNumber = modelNumber.replace(/\!/g,"");
    modelNumber = modelNumber.replace(/\"/g,"");
    modelNumber = modelNumber.replace(/\£/g,"");
    modelNumber = modelNumber.replace(/\$/g,"");
    modelNumber = modelNumber.replace(/\%/g,"");
    modelNumber = modelNumber.replace(/\&/g,"");
    modelNumber = modelNumber.replace(/\(/g,"");
    modelNumber = modelNumber.replace(/\)/g,"");
    modelNumber = modelNumber.replace(/\=/g,"");
    modelNumber = modelNumber.replace(/\'/g,"");
    modelNumber = modelNumber.replace(/\?/g,"");
    modelNumber = modelNumber.replace(/\^/g,"");
    modelNumber = modelNumber.replace(/\|/g,"");
    modelNumber = modelNumber.replace(/\{/g,"");
    modelNumber = modelNumber.replace(/\}/g,"");
    modelNumber = modelNumber.replace(/\ç/gi,"");
    modelNumber = modelNumber.replace(/\@/g,"");
    modelNumber = modelNumber.replace(/\°/g,"");
    modelNumber = modelNumber.replace(/\#/g,"");
    modelNumber = modelNumber.replace(/\§/g,"");
    modelNumber = modelNumber.replace(/\,/g,"");
    modelNumber = modelNumber.replace(/\;/g,"");
    modelNumber = modelNumber.replace(/\./g,"");
    modelNumber = modelNumber.replace(/\:/g,"");
    modelNumber = modelNumber.replace(/\-/g,"");
    modelNumber = modelNumber.replace(/\_/g,"");
    modelNumber = modelNumber.replace(/\</g,"");
    modelNumber = modelNumber.replace(/\>/g,"");
    modelNumber = modelNumber.replace(/\•/g,"");
    modelNumber = modelNumber.replace(/\²/g,"");
    modelNumber = modelNumber.replace(/\n/g,"");
    modelNumber = modelNumber.replace(/  /g," ").replace(/ /g,"");
    modelNumber = modelNumber.replace(/\--/g,"-");
    modelNumber = modelNumber.toLowerCase();
    modelNumber = modelNumber.replace(/\u00a0/g, " ");
    //console.log("normalize model Number = " + modelNumber);
    return modelNumber;
}
const buildLabel = (obj: any, property) => {

  return obj[property] || "-";
  }

  return (
    <div className={styles.custom_search}>
        <div className={styles.custom_field_search}>
        <input placeholder={placeholder} className={isPlp ? styles.custom_search_input_plp : styles.custom_search_input}
               value={inputValue}
               onChange={(e) => {
                 setInputValue(e.currentTarget.value)
               }}/>
          {showSearchIcon && (
            <div className={[styles.custom_icon_container, isPlp && !isPdp ? styles.custom_icon_container_plp : ""].join(" ")}>
               <img className={[styles.icon_search, showLoadingMask ? styles.custom_search_loading_icon : ""].join(" ")} src={inputValue && iconClear && !showLoadingMask ? iconClear : !showLoadingMask ? iconSearch : !isPlp ? loadingIcon : loadingIconWhite }  onClick={() => {
                  setInputValue("");
                  setlocalCheckObj(undefined);
                }} />
            </div>
          )}
        </div>



      {!isPlp && inputValue && iconClear && !showLoadingMask && (
        <img className={[styles.custom_search_icon, styles.custom_search_icon_close].join(" ")} src={iconClear}
             onClick={() => {
               setInputValue("");
               setlocalCheckObj(undefined);
             }}/>
      )}
      {!isPlp && !inputValue && iconEmpty && !showLoadingMask && (
        <img className={styles.custom_search_icon} src={iconEmpty}/>
      )}
      {
        !isPlp && showLoadingMask && (
          <img className={[styles.custom_search_icon, styles.custom_search_loading_icon].join(" ")} src={loadingIcon}/>
        )
      }
      {inputValue && results && results.length > 0 && (
        <div className={[styles.custom_search_results, isPlp ? styles.custom_search_results_plp : ""].join(" ")}>
         {results.map((result: any) => {

            if(isLocalCheck){
              return <div className={styles.custom_search_results_item} onClick={(e) => {
                setlocalCheckObj({
                  localCheckPropValue,
                  localCheckTerm: result[localCheckOnProperty],
                  redirectUrl: buildUrl(result)
                });
                setResults(null)
              }}>
              <div className={styles.custom_search_results_item_wrapper}>
               <b>Industrial Code</b>
               <p> {buildLabel(result, "industrialCode")}</p>
              </div>
              <div className={styles.custom_search_results_item_wrapper}>
               <b>Model Number</b>
               <p> {buildLabel(result, "modelNumber")}</p>
              </div>
             </div>
            } else {
              return <a className={styles.custom_search_results_item} href={buildUrl({...result})}>
              <div className={styles.custom_search_results_item_wrapper}>
               <b>Industrial Code</b>
               <p> {buildLabel(result, "industrialCode")}</p>
              </div>
              <div className={styles.custom_search_results_item_wrapper}>
               <b>Model Number</b>
               <p> {buildLabel(result, "modelNumber")}</p>
              </div>
             </a>
            }

          })}
        </div>
      )}
       {inputValue && results && results.length == 0  && !showLoadingMask &&(
        <div className={styles.no_results}>No results found. Please enter a valid code.</div>
      )}

      {isLocalCheck && localCheckObj && (
        <LocalCheck
          localCheckSuccessMessage={localCheckSuccessMessage}
          localCheckNotFoundMessage={localCheckNotFoundMessage}
          localCheckSuccessIcon={localCheckSuccessIcon}
          localCheckNotFoundIcon={localCheckNotFoundIcon}
          localCheckRedirectLabel={localCheckRedirectLabel}
          localCheckPropValue={localCheckObj.localCheckPropValue}
          localCheckTerm={localCheckObj.localCheckTerm}
          redirectUrl={localCheckObj.redirectUrl}
        />
      )}

    </div>
  )
}
Search.schema = {
  title: "Custom Search",
  description: "A custom search configurable",
  type: "object",
  properties: {
    placeholder: {
      title: "Placeholder",
      description: "Placeholder",
      default: undefined,
      type: "string",
    },
    iconEmpty: {
      title: "Icon empty",
      description: "Icon empty",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    iconClear: {
      title: "Icon clear",
      description: "Icon clear",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    loadingIcon: {
      title: "Icon loading",
      description: "Icon loading",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    loadingIconWhite: {
      title: "Icon loading White",
      description: "Icon loading",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    iconSearch: {
      title: "Icon search",
      description: "Icon search",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    localCheckNotFoundIcon: {
      title: "Icon check not found",
      description: "Icon check not found",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    localCheckSuccessIcon: {
      title: "Icon check success",
      description: "Icon check success",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    localCheckSuccessMessage: {
      title: "Check success message",
      description: "Check success message",
      default: undefined,
      type: "string",
    },
    localCheckNotFoundMessage: {
      title: "Check not found message",
      description: "Check not found message",
      default: undefined,
      type: "string",
    },
    localCheckRedirectLabel: {
      title: "Check redirect label",
      description: "Check redirect label",
      default: undefined,
      type: "string",
    }
  }
};
export default Search
