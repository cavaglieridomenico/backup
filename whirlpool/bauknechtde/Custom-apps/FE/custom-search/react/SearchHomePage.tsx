//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from 'react-apollo'
import customSearch from './graphql/customSearch.graphql'
import GetCategories from './GetCategories'
import styles from './styles.css'
import { url } from 'inspector'

import { usePixel } from "vtex.pixel-manager";

interface SearchProps {
  urlStructure: string,
  labelStructureNo12NC: string,
  urlStructureNo12NC: string,
  labelStructure: string,
  placeholder: string,
  selectCategoryLabel: string,
  iconClear: string,
  iconEmpty: string,
  IconLoading: string,
  inputLabel: string,
  IconRight: string,
  heroImage: string,
  heroText: string,
  pageH1: string
}
//https://api-cms.tps-cloud.com/apicms/apis/aa208b30-257d-11e9-b03f-b5666fec9770/d98b0640-ba5b-11ec-b8e2-dd92ddd7ac9e
const SearchHomePage: StorefrontFunctionComponent<SearchProps> = ({
  placeholder = "Type the Industrial Code or Model number",
  iconClear = "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' d='M0 0h24v24H0V0z'/%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'/%3E%3C/svg%3E",
  IconLoading = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor"%3E%3Canimate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(45 12 12)"%3E%3Canimate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(90 12 12)"%3E%3Canimate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(135 12 12)"%3E%3Canimate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(180 12 12)"%3E%3Canimate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(225 12 12)"%3E%3Canimate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(270 12 12)"%3E%3Canimate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(315 12 12)"%3E%3Canimate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3C%2Fsvg%3E',
  iconEmpty,
  inputLabel = "Industrial Code or Model Number",
  textButtonLandingPage = "Search",
  selectCategoryLabel = "Kategorie/Art des Teils",
  children,
  heroImage = "https://image.coolblue.nl/840x473/content/378537595384eaec76410c7f9018d5e0",
  IconRight = 'data:image/svg+xml,%0A%3Csvg xmlns="http://www.w3.org/2000/svg" xmlns:svgjs="http://svgjs.com/svgjs" xmlns:xlink="http://www.w3.org/1999/xlink" width="288" height="288"%3E%3Csvg xmlns="http://www.w3.org/2000/svg" width="288" height="288" enable-background="new 0 0 1000 1000" viewBox="0 0 1000 1000"%3E%3Cpath fill="%23fff" d="M983.3,484.4L760.6,261.7c-4.5-4.5-8.9-6.7-15.6-6.7c-13.4,0-22.3,8.9-22.3,22.3c0,6.7,2.2,11.1,6.7,15.6l184.9,184.9h-882c-13.4,0-22.3,8.9-22.3,22.3c0,13.4,8.9,22.3,22.3,22.3h882L729.4,707.1c-4.5,4.5-6.7,8.9-6.7,15.6c0,13.4,8.9,22.3,22.3,22.3c6.7,0,11.1-2.2,15.6-6.7l222.7-222.7c4.5-4.5,6.7-8.9,6.7-15.6S987.8,488.9,983.3,484.4z" class="color000 svgShape"/%3E%3C/svg%3E%3C/svg%3E',
  heroText,
  pageH1
}) => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showLoadingMask, setShowLoadingMask] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndustrial, setSelectedIndustrial] = useState("");
  const [showResults, setShowResults] = useState(true);
  const [performSearchDisabled, setPerformSearchDisabled] = useState(true);
  const { push } = usePixel();
  const [getBomIds, { loading, data }] = useLazyQuery(customSearch, {
    variables: {
      "searchTerm": inputValue
    },
    fetchPolicy: "no-cache"
  });

  const onCategoriesQueryDone = (data) => {
    setCategories(["Alle", ...data,])
    setSelectedItem("Alle")
    setPerformSearchDisabled(false)
  }

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (id) => {
    setSelectedItem(id);
    setOpen(false)

    push({
      'event': "funnelStepSpareUK",
      'eventCategory': 'Spare Parts LP Funnel', // Fixed value
      'eventAction': "Spare Category", // Dynamic value
      'eventLabel': id // Dynamic value
    });
  }

  useEffect(() => {
    if (data) {
      setResults(data["getBomCodes"])
      setShowLoadingMask(false)
    }
    //console.log(data)
  }, [data])
  useEffect(() => {
    setResults(null)
    if (inputValue && inputValue.length > 4 && !loading) {
      setShowLoadingMask(true)

      getBomIds({
        variables: {
          "searchTerm": inputValue
        }
      })


    }
  }, [inputValue]);

  const buildUrl = () => {
    let url = "";
    if (selectedIndustrial) {
      url = selectedIndustrial["modelNumber"] ? `/ersatzteile/bom/${normalizeModelNumber(selectedIndustrial["modelNumber"]).toLowerCase()}-${selectedIndustrial["industrialCode"].toLowerCase()}` : `/ersatzteile/bom/${selectedIndustrial["industrialCode"].toLowerCase()}`;
      url = `${url}${selectedItem && selectedItem !== "Alle" ? "?category=" + selectedItem : ""}`
    }
    return encodeURI(url);
  }


  const buildLabel = (obj: any, property) => {

    return obj[property] || "-";
  }
  function normalizeModelNumber(modelNumber: string) {
    modelNumber = modelNumber.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    modelNumber = modelNumber.replace(/\+/g, "plus");
    modelNumber = modelNumber.replace(/\[/g, "");
    modelNumber = modelNumber.replace(/\]/g, "");
    modelNumber = modelNumber.replace(/\//g, "");
    modelNumber = modelNumber.replace(/\!/g, "");
    modelNumber = modelNumber.replace(/\"/g, "");
    modelNumber = modelNumber.replace(/\£/g, "");
    modelNumber = modelNumber.replace(/\$/g, "");
    modelNumber = modelNumber.replace(/\%/g, "");
    modelNumber = modelNumber.replace(/\&/g, "");
    modelNumber = modelNumber.replace(/\(/g, "");
    modelNumber = modelNumber.replace(/\)/g, "");
    modelNumber = modelNumber.replace(/\=/g, "");
    modelNumber = modelNumber.replace(/\'/g, "");
    modelNumber = modelNumber.replace(/\?/g, "");
    modelNumber = modelNumber.replace(/\^/g, "");
    modelNumber = modelNumber.replace(/\|/g, "");
    modelNumber = modelNumber.replace(/\{/g, "");
    modelNumber = modelNumber.replace(/\}/g, "");
    modelNumber = modelNumber.replace(/\ç/gi, "");
    modelNumber = modelNumber.replace(/\@/g, "");
    modelNumber = modelNumber.replace(/\°/g, "");
    modelNumber = modelNumber.replace(/\#/g, "");
    modelNumber = modelNumber.replace(/\§/g, "");
    modelNumber = modelNumber.replace(/\,/g, "");
    modelNumber = modelNumber.replace(/\;/g, "");
    modelNumber = modelNumber.replace(/\./g, "");
    modelNumber = modelNumber.replace(/\:/g, "");
    modelNumber = modelNumber.replace(/\-/g, "");
    modelNumber = modelNumber.replace(/\_/g, "");
    modelNumber = modelNumber.replace(/\</g, "");
    modelNumber = modelNumber.replace(/\>/g, "");
    modelNumber = modelNumber.replace(/\•/g, "");
    modelNumber = modelNumber.replace(/\²/g, "");
    modelNumber = modelNumber.replace(/\n/g, "");
    modelNumber = modelNumber.replace(/  /g, " ").replace(/ /g, "");
    modelNumber = modelNumber.replace(/\--/g, "-");
    modelNumber = modelNumber.toLowerCase();
    modelNumber = modelNumber.replace(/\u00a0/g, "");
    //console.log("normalize model Number = " + modelNumber);
    return modelNumber;
  }
  return (
    <>
      {selectedIndustrial && selectedIndustrial["industrialCode"] && (
        <GetCategories industrialCode={selectedIndustrial["industrialCode"]} onQueryDone={onCategoriesQueryDone} />

      )}
      <div className={styles.custom_search_wrapper}>
        <div className={styles.custom_search_hero} style={{ backgroundImage: `url(${heroImage})` }}>
          <span className={styles.custom_search_h1}>{heroText}</span>
        </div>
        <div className={styles.custom_search_actions}>
          <h1 className={styles.custom_search_h2}>{pageH1}</h1>
          <div className={styles.custom_search}>
            <div className={styles.custom_search_input_wrapper}>
              {selectedIndustrial && (
                <div className={[styles.custom_search_results_item, styles.custom_search_results_item_standalone].join(" ")} >
                  <div className={styles.custom_search_results_item_wrapper}>
                    <b>Industrial Code</b>
                    <p> {buildLabel(selectedIndustrial, "industrialCode")}</p>
                  </div>
                  <div className={styles.custom_search_results_item_wrapper}>
                    <b>Model Number</b>
                    <p> {buildLabel(selectedIndustrial, "modelNumber")}</p>
                  </div>
                </div>
                )}
              <input id="custom-search-input" placeholder={placeholder} className={[styles.custom_search_input, selectedIndustrial ? styles.custom_search_input_selected : ""].join(" ")}
                value={inputValue}
                onFocus={() => {
                  if (!selectedIndustrial) {
                    setShowResults(true)
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowResults(false)
                  }, 300);
                }}
                onChange={(e) => {
                  setInputValue(e.currentTarget.value)
                  setCategories([]);
                  setSelectedItem("")
                  setResults(null);
                  setSelectedIndustrial(null);
                  setPerformSearchDisabled(true);
                }} />
              <label className={styles.custom_search_input_label}>{inputLabel}</label>

              {selectedIndustrial && (
                <img className={[styles.custom_search_icon, styles.custom_search_icon_close].join(" ")} src={iconClear} onClick={() => {
                  setCategories([])
                  setSelectedItem("")
                  setOpen(false)
                  setPerformSearchDisabled(true)
                  setSelectedIndustrial(null); setTimeout(() => {
                    document.getElementById("custom-search-input").focus()
                  }, 300);
                }} />
              )}
              {children}
            </div>
            {!inputValue && iconEmpty && !showLoadingMask && (
              <img className={styles.custom_search_icon} src={iconEmpty} />
            )}
            {
              showLoadingMask && (
                <img className={styles.custom_search_icon} src={IconLoading} />
              )
            }

            {showResults && inputValue && results && results.length > 0 && (
              <div className={styles.custom_search_results}>
                <div className={styles.custom_search_results_count}>{results.length} Ergebnisse</div>
                <div className={styles.custom_search_results_wrapper}>
                  {results.map((result: any) => {
                    return <div className={styles.custom_search_results_item} onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedIndustrial(result);
                      setPerformSearchDisabled(true)
                      setShowResults(false);

                      push({
                        'event': "funnelStepSpareUK",
                        'eventCategory': 'Spare Parts LP Funnel', // Fixed value
                        'eventAction': "Search Bar IC/MN", // Dynamic value
                        'eventLabel': result.modelNumber + "-" + result.industrialCode // Dynamic value
                      });

                    }}>
                      <div className={styles.custom_search_results_item_wrapper}>
                        <b>Industriecode</b>
                        <p> {buildLabel(result, "industrialCode")}</p>
                      </div>
                      <div className={styles.custom_search_results_item_wrapper}>
                        <b>Modellbezeichnung</b>
                        <p> {buildLabel(result, "modelNumber")}</p>
                      </div>
                    </div>
                  })}
                </div>

              </div>
             )}
            {showResults && inputValue && results && results.length === 0 && !showLoadingMask && (
              <div className={styles.no_results}>Keine Ergebnisse gefunden. Bitte geben Sie einen gültigen Code ein</div>
            )}

            {selectedIndustrial &&
              <div className={[styles.dropdown, isOpen ? styles.dropdown_open : "", selectedItem ? styles.dropdown_selected : "", categories.length === 0 ? styles.dropdown_disabled : ""].join(" ")}>
                <div className={styles["dropdown-header"]} onClick={toggleDropdown}>
                  {selectedItem ? selectedItem : "Select"}
                </div>
                <label className={styles.custom_search_input_label}>{selectCategoryLabel}</label>

                <div className={[styles["dropdown-body"], isOpen ? styles.open : ""].join(" ")}>
                  {categories.map((item, index) => (
                    <div className={styles["dropdown-item"]} onClick={e => handleItemClick(item)} id={item}>
                      <span className={[styles["dropdown-item-dot"], `${item == selectedItem && styles.selected}`].join(" ")}>• </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            }
            <div>
            </div>
            <div onClick={(e) =>{
                push({
                  'event': "funnelStepSpareUK",
                  'eventCategory': 'Spare Parts LP Funnel', // Fixed value
                  'eventAction': "Search by IC/MN", // Dynamic value
                  'eventLabel': buildUrl() // Dynamic value
                });
               setTimeout(() => {
                window.location.href = buildUrl();
               }, 400)

             } } className={[styles.perform_search_link, performSearchDisabled ? styles.perform_search_link_disabled : ""].join(" ")} href={buildUrl()}>
              <div className={[styles.perform_search, performSearchDisabled ? styles.perform_search_disabled : ""].join(" ")}>
                {textButtonLandingPage}
              </div>
              <img className={styles.perform_search_icon} src={IconRight} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
SearchHomePage.schema = {
  title: "Custom Search",
  description: "A custom search configurable",
  type: "object",
  properties: {
    pageH1: {
      title: "Page h1",
      description: "Page h1",
      default: "Find genuine spare parts for any Hotpoint appliance.",
      type: "string",
    },
    heroText: {
      title: "Hero text",
      description: "Hero text",
      default: "Some random text.",
      type: "string",
    },
    inputLabel: {
      title: "Input label",
      description: "Input label",
      default: "Industrial Code or Model Number",
      type: "string",
    },
    textButtonLandingPage: {
      title: "Text Button Landing Page",
      description: "Text Button Landing Page",
      default: "Search",
      type: "string",
    },
    placeholder: {
      title: "Placeholder",
      description: "Placeholder",
      default: undefined,
      type: "string",
    },
    selectCategoryLabel: {
      title: "Select Category Label",
      description: "Select Category Label",
      default: "Kategorie/Art des Teils",
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
    IconLoading: {
      title: "Icon loading",
      description: "Icon loading",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    IconRight: {
      title: "Icon Right",
      description: "Icon Right",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    heroImage: {
      title: "Hero",
      description: "Hero",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    }
  }
};
export default SearchHomePage
