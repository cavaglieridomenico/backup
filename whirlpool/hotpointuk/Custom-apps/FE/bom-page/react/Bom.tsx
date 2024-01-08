//@ts-nocheck
import React, { useEffect, useState } from "react";

import { CustomProductsList } from "hotpointuk.custom-products-list";
import GetSparePartsByIndustrialCode from "./components/GetSparePartsByIndustrialCode";
import GetSSRData from "./components/GetSSRData";
import GetFilters from "./components/GetFilters";
import GetBomIDrawings from "./components/GetBomIDrawings";
import GetSparePartsInBom from "./components/GetSparePartsInBom";
import Helmet from "react-helmet";
import { usePixel } from "vtex.pixel-manager";

import { useRuntime } from "vtex.render-runtime"
import styles from "./style";


interface BomProps {
  placeholder: string;
  iconGoBack: string;
  iconSearch: string;
  iconExpandDraw: string;
  goBackText: string;
  spareByDrawingText: string;
  homeLabel: string;
  sparePartsLabel: string;
  sparePartsModel: string;
  filtersTitle: string;
  sparePartsCategoryTitle: string;
  buttonReadMore: string;
  noSparePartsText: string;
  IconLoading: string;
  modalTitle: string;
  modalSubtitle: string;
  modalInstruction: string,
  inStockLabel: string,
  outOfStockLabel: string,
  limitedLabel: string,
  obsoleteLabel: string,
  limitedIcon: string,
  outOfStockIcon: string,
  obsoleteIcon: string,
  inStockIcon: string,
  colorCodeObsolete: string,
  colorCodeLimited: string,
  colorCodeOutOfStock: string,
  bomDrawingInfoImage: string,
  bomDrawingInfoImageMobile: string

}

//https://api-cms.tps-cloud.com/apicms/apis/aa208b30-257d-11e9-b03f-b5666fec9770/d98b0640-ba5b-11ec-b8e2-dd92ddd7ac9e
const Bom: StorefrontFunctionComponent<BomProps> = ({
  placeholder = "Eg: 13",
  goBackText = "Start a new search",
  spareByDrawingText = "Use the Appliance's Line Drawing to find the part you need",
  iconGoBack = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23a1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2Z"%2F%3E%3C%2Fsvg%3E',
  iconSearch = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="white" d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392l.604.646l2.121-2.121l-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5s5 2.243 5 5s-2.243 5-5 5z"%2F%3E%3C%2Fsvg%3E',
  iconExpandDraw = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"%3E%3Cpath fill="currentColor" d="m855 160.1l-189.2 23.5c-6.6.8-9.3 8.8-4.7 13.5l54.7 54.7l-153.5 153.5a8.03 8.03 0 0 0 0 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l153.6-153.6l54.7 54.7a7.94 7.94 0 0 0 13.5-4.7L863.9 169a7.9 7.9 0 0 0-8.9-8.9zM416.6 562.3a8.03 8.03 0 0 0-11.3 0L251.8 715.9l-54.7-54.7a7.94 7.94 0 0 0-13.5 4.7L160.1 855c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7l153.6-153.6c3.1-3.1 3.1-8.2 0-11.3l-45.2-45z"%2F%3E%3C%2Fsvg%3E',
  inStockLabel = "",
  outOfStockLabel = "",
  limitedLabel = "",
  obsoleteLabel = "",
  limitedIcon = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23a1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2Z"%2F%3E%3C%2Fsvg%3E',
  outOfStockIcon = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23a1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2Z"%2F%3E%3C%2Fsvg%3E',
  obsoleteIcon = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23a1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2Z"%2F%3E%3C%2Fsvg%3E',
  inStockIcon = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23a1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2Z"%2F%3E%3C%2Fsvg%3E',
  colorCodeObsolete = "#000",
  colorCodeLimited = "#000",
  colorCodeOutOfStock = "#000",
  homeLabel = "home",
  sparePartsLabel = "Spare Parts",
  sparePartsModel = "Model",
  filtersTitle = "Filters",
  sparePartsCategoryTitle = "Spare parts category",
  buttonReadMore = "Show more",
  noSparePartsText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  IconLoading = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor"%3E%3Canimate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(45 12 12)"%3E%3Canimate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(90 12 12)"%3E%3Canimate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(135 12 12)"%3E%3Canimate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(180 12 12)"%3E%3Canimate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(225 12 12)"%3E%3Canimate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(270 12 12)"%3E%3Canimate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3Ccircle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(315 12 12)"%3E%3Canimate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8%3B0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0%3B2%3B0%3B0"%2F%3E%3C%2Fcircle%3E%3C%2Fsvg%3E',
  modalTitle = "Find a spare part by part number",
  modalSubtitle = "Identify the spare part you require on this diagram, and input the corresponding part (EG: 13) to view the relevant part",
  modalInstruction = "Type in a part number",
  bomDrawingInfoImage = "",
  bomDrawingInfoImageMobile = ""

}) => {
  const runtime = __RUNTIME__;
  const params = Object.keys(runtime.route.params).length > 0 ? runtime.route.params.ids.split("-") : [runtime.route.queryString.modelNumber, runtime.route.queryString.industrialCode];
  const industrialCode = params.length === 2 ? params[1] : params[0];
  const modelNumber = params.length === 2 ? params[0].toUpperCase() : null;
  const { push } = usePixel();
  const [spareCodes, setSpareCodes] = useState([]);
  const [end, setEnd] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [lastPageSpareCodes, setLastPageSpareCodes] = useState({});
  const [finishedGoodImage, setFinishedGoodImage] = useState("");
  const [bomDrawings, setBomDrawings] = useState([]);
  const [filters, setFilters] = useState([]);
  const [partReference, setPartReference] = useState(null);
  const [bomId, setBomId] = useState(null);
  const [sparesInBom, setSparesInBom] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [inputValueSparesInBom, setInputValueSparesInBom] = useState("");
  const [imageInBom, setImageInBom] = useState("");
  const [showResultsSearch, setShowResultsSearch] = useState(false);
  const [finishedGoodCategory, setFinishedGoodCategory] = useState("");
  const [categoryFiltersOpen, setCategoryFiltersOpen] = useState(true);
  const [finishedGoodBrandName, setFinishedGoodBrandName] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [newSpareCodes, setNewSpareCodes] = useState([]);
  const [notFound, setNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [spareInBomNotFound, setSpareInBomNotFound] = useState(false);
  const [resetList, setResetList] = useState(false);
  const [activeFilterList, setActiveFilterList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  //@ts-ignore
  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;

  const [filter, setFilter] = useState([
    {
      "name": "industrialCode",
      "value": industrialCode
    }
  ])

  useEffect(() => {
    setFilter([
      {
        "name": "industrialCode",
        "value": industrialCode
      }
    ].concat(activeFilterList.map((fl) => { return { name: "familyGroup", value: fl } })))
  }, [activeFilterList])
  useEffect(() => {
    let categoryFromQuery = __RUNTIME__.query.category
    if(categoryFromQuery){
      setActiveFilterList([categoryFromQuery])
    }
  }, [])
  let href = window && window.location ? window.location.href : "";
  const { deviceInfo } = useRuntime()

  const [currentPage, setCurrentPage] = useState(
    runtime.query.page ? runtime.query.page : 1
  );
  const [familyGroup, setFamilyGroup] = useState("");
  const onSpareCodesQueryDone = (data) => {
    if (data && data["getSpareByIndustrialWithFilterPAG"]) {
      let lastSpareHistory = { ...lastPageSpareCodes };
      lastSpareHistory[currentPage] = data[
        "getSpareByIndustrialWithFilterPAG"
      ].map((spare) => spare.sparePartId);
      setLastPageSpareCodes(lastSpareHistory);
      setSpareCodes(
        spareCodes.concat(
          data["getSpareByIndustrialWithFilterPAG"].map(
            (spare) => spare.sparePartId
          )
        )
      );
      setNewSpareCodes(data["getSpareByIndustrialWithFilterPAG"].map(
        (spare) => spare.sparePartId
      ))
    }
  };

  const onFiltersDone = (data) => {
    setFilters(data["familyGroup"].length > 0 ? data["familyGroup"] : ["Other"]);
  };

  const onFinishedGoodImageDone = (data) => {
    setFinishedGoodImage(data["urlImage"]);
    setFinishedGoodCategory(data["categoryName"]);
    setFinishedGoodBrandName(data["brandName"]);
  };

  const onBomDrawingsDone = (data) => {
    setBomDrawings(data);
  };
  const onProductsChange = (data) => {
    if (data.end) {
      setEnd(true);
    }
    if (data.products && data.products.length < 10) {
      setEnd(true)
    }
    if (data.products && data.products.length > 0) {
      setProductsLoaded(true);
    }

    setIsLoading(false)
    setResetList(false)
  };
  const onNotFound = () => {
    setNotFound(true)
  }
  const onSpareInBomDone = (data) => {
    if (data.length === 0) {
      setSpareInBomNotFound(true)
    } else {

      setSparesInBom(data);
    }
  };

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
  const updateQueryStringParameter = (uri, key, value) => {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf("?") !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, "$1" + key + "=" + value + "$2");
    } else {
      return uri + separator + key + "=" + value;
    }
  };

  const pageChanged = (search) => {
  };

  const handleClickImage = (id, image) => {
    setImageInBom(image);
    setBomId(id);
    setModalShow(true);
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    push({
      'event': 'drawingZoomUkSpare',
      'eventCategory': 'Technical Drawing',
      'eventAction': 'Zoom',
      'eventLabel': id
    });
  };
  const handleSearchModal = () => {
    setShowResultsSearch(true);
    setPartReference(inputValueSparesInBom);
  };
  const handleSearchModalAnalytics = () => {
    setShowResultsSearch(true);
    setPartReference(inputValueSparesInBom);
    push({
      'event': 'searchZoomUkSpare',
      'eventCategory': 'Technical Drawing',
      'eventAction': 'Search - ' + inputValueSparesInBom,
      'eventLabel': bomId
    });
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setSparesInBom([]);
    setShowResultsSearch(false);
    setInputValueSparesInBom("");
    setPartReference("");
    setSpareInBomNotFound(false)

    document.getElementsByTagName("body")[0].style.overflow = "auto";
  };
  const resetModal = () => {
    setSparesInBom([]);
    setShowResultsSearch(false);
    setInputValueSparesInBom("");
    setPartReference("");
    setSpareInBomNotFound(false)
  };
  /*useEffect(() => {
    const urlSearchParams = new URLSearchParams(href.split("?")[0]);
    const params = Object.fromEntries(urlSearchParams.entries());
    const page = params["page"];
    if (page) {
      if (parseInt(page) < currentPage) {
        alert();
      }
    }
  }, [href]);*/
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleClickFilter = (clickedFilter) => {

    if (activeFilterList.indexOf(clickedFilter) !== -1) {
      setActiveFilterList(activeFilterList.filter(
        function (checkFilter) {
          return checkFilter !== clickedFilter;
        }))
      setShowFilter(activeFilterList.length != 1)
    } else {
      setActiveFilterList(activeFilterList.concat([clickedFilter]))
      setShowFilter(true)
    }
  }

  const randomWord = (words) => {
    let length = words.length
    let randomIndex = Math.floor(Math.random() * length)
    let word = words[randomIndex]
    return (word)
  }

  return (
    <div className={styles.bom}>


      <Helmet>
        <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Spare parts",
                  "item": "${baseUrl}/spare-parts"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Model ${modelNumber}",
                  "item": "${baseUrl}/spare-parts/bom/${normalizeModelNumber(modelNumber.toLowerCase())}-${industrialCode.toLowerCase()}"
                }
                ]
              }
            `}</script>

      </Helmet>


      {industrialCode && (
        <>
          <GetFilters
            industrialCode={industrialCode}
            onQueryDone={onFiltersDone}
          />

          <GetSparePartsByIndustrialCode
            filter={filter}
            page={currentPage}
            pageSize={
              runtime.query.pageSize ? parseInt(runtime.query.pageSize) : 9
            }
            onSpareCodesQueryDone={onSpareCodesQueryDone}
          />
          <GetBomIDrawings
            industrialCode={industrialCode}
            onQueryDone={onBomDrawingsDone}
          />
          <GetSSRData
            ssrFor="meta"
            industrialCode={industrialCode}
            modelNumber={modelNumber}
          />
        </>
      )}
      {partReference && bomId && (
        <GetSparePartsInBom
          referenceNumber={partReference}
          bomId={bomId}
          onQueryDone={onSpareInBomDone}
          industrialCode={industrialCode}
        />
      )}
      <div className={styles.breadcrumbContainer}>
        {/*<a className={styles.breadcrumbLink} href="/">*/}
        {/*  {" "}*/}
        {/*  {homeLabel}{" "}*/}
        {/*</a>*/}
        <a className={styles.breadcrumbLink} href="/spare-parts">
          {" "}
          {sparePartsLabel}{" "}
        </a>
        <a className={styles.breadcrumbLink}>
          <img className={styles.imgBreadCrumb} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} />
          {sparePartsModel} {modelNumber}
        </a>
        <div className={styles.breadcrumbLink}>
          <GetSSRData
            industrialCode={industrialCode}
            modelNumber={modelNumber}
            onQueryDone={onFinishedGoodImageDone}
          />
        </div>
      </div>

      <div className={styles.bom_header}>
        <div className={styles.bom_header_title}>

          <GetSSRData
            industrialCode={industrialCode}
            modelNumber={modelNumber}
            isH1={true}
            className={styles.bom_title}
          />
        </div>
        <GetSSRData
          industrialCode={industrialCode}
          modelNumber={modelNumber}
          onQueryDone={onFinishedGoodImageDone}
          isDesc={true}
        />
      </div>
      {deviceInfo.isMobile && (
        <div className={styles.bom_drawing_info_image_mobile}>
          <div className={styles.drawings_info_image_mobile} style={{ backgroundImage: `url(${bomDrawingInfoImageMobile})` }} ></div>
        </div>
      )}
      <div className={styles.technical_drawings_wrapper}>

        <div className={styles.technical_drawings_drawings_wrapper}>

          {!deviceInfo.isMobile && (
            <div className={styles.bom_drawing_info_image}>
              <div className={styles.drawings_info_image} style={{ backgroundImage: `url(${bomDrawingInfoImage})` }} ></div>
            </div>
          )}


          <div className={styles.technical_drawings_drawings}>

            <div className={styles.technical_draw_image_card}>
              {bomDrawings && bomDrawings.length < 1 && (
                <div className={styles.lazy_draw_wrap}>
                  <div className={styles.lazy_draw}></div>
                  <div className={styles.lazy_draw}></div>
                  <div className={styles.lazy_draw}></div>
                  <div className={styles.lazy_draw}></div>
                </div>
              )}
              {bomDrawings && bomDrawings.map((draw) => {
                let divStyle = {
                  "backgroundImage": 'url(' + draw.bomImage + ')',
                  "width": "230px",
                  "height": "270px",
                  "background-size": "contain",
                  "background-repeat": "no-repeat",
                  "background-position": "center",
                  "cursor": "pointer",
                  "max-width": "unset"

                }
                return (

                  <div className={styles.technical_draw_image_wrapper}>
                    {/*<img
                      className={styles.technical_draw_image}
                      src={draw.bomImage}
                      onClick={() => handleClickImage(draw.id, draw.bomImage)}
                /> */}
                    <div
                      style={divStyle}
                      onClick={() => handleClickImage(draw.id, draw.bomImage)}>

                    </div>
                    <img
                      src={iconExpandDraw}
                      className={styles.technical_draw_image_icon}
                      onClick={() => handleClickImage(draw.id, draw.bomImage)}
                    />
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      <div className={styles.results_wrapper}>
        <div className={styles.filters_wrapper}>
          {showFilter &&
            <div className={styles.wrapper_selected_category}>
              <b className={styles.title_filters}>{filtersTitle}</b>
              {activeFilterList.map((activeFilter) => {
                return (<div className={styles.wrapper_label_filter} onClick={() => handleClickFilter(activeFilter)}>{activeFilter}
                  <div className={styles.close_filter}>x</div>
                </div>);
              })}
            </div>
          }
          <div className={styles.filters_group}>
            <b
              className={styles.filters_group_title}
              onClick={(e) => {
                setCategoryFiltersOpen(!categoryFiltersOpen);
              }}
            >
              <b className={styles.title_filters}>{sparePartsCategoryTitle}</b>
            </b>

            <div
              className={[
                styles.filters_group_content,
                categoryFiltersOpen ? styles.filters_group_content_open : "",
              ].join(" ")}
            >
              {filters && filters.length == 0 && (
                <>
                  <div className={styles.lazy_category}></div>
                  <div className={styles.lazy_category}></div>
                </>
              )}
              {filters &&
                filters.length > 0 &&
                filters.map((filter) => {
                  return (
                    <p
                      className={[
                        activeFilterList.indexOf(filter) !== -1 || filter === "Other" ? styles.active : styles.filter,

                      ].join(" ")}
                      onClick={(e) => {
                        if (filter !== "Other") {
                          setResetList(true)
                          setProductsLoaded(false);
                          setSpareCodes([]);
                          setCurrentPage(1);
                          setFamilyGroup(familyGroup === filter ? "" : filter)
                          setNewSpareCodes([])
                          setEnd(false)
                          setActiveFilterList([filter]);
                          handleClickFilter(filter)
                          setNotFound(false)
                        }

                      }}
                    >
                      {filter}
                    </p>
                  );
                })}
            </div>
          </div>
        </div>
        <div
          className={styles.filters_wrapper_mobile}
          onClick={() => setShowFilterModal(true)}
        >
          <p className={styles.filtersTitle}>Filter </p>
          <svg
            className={styles.filtersIcon}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="20"
            height="20"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 32 32"
          >
            <g transform="rotate(90 16 16) translate(0 32) scale(1 -1)">
              <path
                fill="black"
                d="M30 8h-4.1c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2h14.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30V8zm-9 4c-1.7 0-3-1.3-3-3s1.3-3 3-3s3 1.3 3 3s-1.3 3-3 3zM2 24h4.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30v-2H15.9c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2zm9-4c1.7 0 3 1.3 3 3s-1.3 3-3 3s-3-1.3-3-3s1.3-3 3-3z"
              />
            </g>
          </svg>
        </div>
        <div className={styles.results}>
          <h1 className={styles.title_bom_page}>Spare Parts for Hotpoint Model: {modelNumber} - {industrialCode} </h1>
          <div className={styles.seo_text_bom_page}>
            At Hotpoint we want to make your shopping experience {randomWord(['easier', 'as easier as possible'])}, here you will find the {randomWord(['spare parts', 'parts'])} for the model {modelNumber}. Simply use the drawing to identify the right part to fit your {randomWord(['appliance', 'product', 'model'])} {modelNumber} to replace your existing one and get your appliance {randomWord(['to top shape', 'running like new'])}. {randomWord(['Buy', 'Shop'])} with confidence, and buy genuine parts directly from the manufacturer. Our {randomWord(['parts', 'spare parts'])} are covered by our 1 year parts guarantee giving you the {randomWord(['piece of mind', 'satisfaction'])} needed to {randomWord(['bring', 'get'])} your appliance back to life. Please {randomWord(['verify', 'check'])} the {randomWord(['model number', 'model'])} fit to {randomWord(['make sure', 'ensure'])} that this {randomWord(['spare part', 'part'])} is {randomWord(['ideal', 'correct'])} for your {randomWord(['appliance model', 'model'])}.
          </div>


          {!productsLoaded && !notFound && (
            <div className={styles.lazy_product_card_wrapper}>
              <div className={styles.lazy_product_card}></div>
              <div className={styles.lazy_product_card}></div>
              <div className={styles.lazy_product_card}></div>
              <div className={styles.lazy_product_card}></div>
              <div className={styles.lazy_product_card}></div>
              <div className={styles.lazy_product_card}></div>
              <div className={styles.lazy_product_card}></div>
              <div className={styles.lazy_product_card}></div>
            </div>
          )}
          <div>


          </div>
          <CustomProductsList
            inStockLabel={inStockLabel}
            outOfStockLabel={outOfStockLabel}
            limitedLabel={limitedLabel}
            obsoleteLabel={obsoleteLabel}
            limitedIcon={limitedIcon}
            outOfStockIcon={outOfStockIcon}
            obsoleteIcon={obsoleteIcon}
            inStockIcon={inStockIcon}
            colorCodeObsolete={colorCodeObsolete}
            colorCodeLimited={colorCodeLimited}
            colorCodeOutOfStock={colorCodeOutOfStock}
            ids={newSpareCodes}
            queryField={"reference"}
            onProductsChange={onProductsChange}
            noResultsText={noSparePartsText}
            onNotFound={onNotFound}
            reset={resetList}
          />
          {productsLoaded && newSpareCodes.length >= 9 && (
            <div className={styles.position_button}>
              <button
                className={styles.show_more}
                onClick={(e) => {
                  setIsLoading(true)
                  setCurrentPage(currentPage + 1);
                }}
              >
                <div>
                  {isLoading ? <img className={styles.custom_search_icon} src={IconLoading} /> : buttonReadMore}
                </div>
              </button>
            </div>
          )}

          {notFound && (
            <div>{noSparePartsText}</div>
          )}
        </div>
      </div>

      <div className={styles.containerModal}>
        {modalShow && (
          <div className={styles.modalContainer}>
            <div className={styles.modalOverlay}
              onClick={() => handleCloseModal()}></div>
            <div className={styles.modalWrapper}>
              <div className={styles.modal}>
                <div
                  className={styles.closeModal}
                  onClick={() => handleCloseModal()}
                >
                  &times;
                </div>
                {!showResultsSearch ? (
                  <div className={styles.modalContainerImage}>
                    <div className={styles.modalTitle}>{modalTitle}</div>
                    <div className={styles.modalSubtitle}>{modalSubtitle}</div>
                    <div className={styles.modalInstruction}>{modalInstruction}</div>
                    <div className={styles.searchbarContainerModal}>
                      <input
                        className={styles.searchbarInputModal}
                        placeholder={placeholder}
                        value={inputValueSparesInBom}
                        onChange={(e) => {
                          setInputValueSparesInBom(e.currentTarget.value);
                        }}
                        onKeyDown={(e) => {
                          if (event.keyCode === 13) {
                            handleSearchModalAnalytics()
                          }
                        }}
                      />
                      <img
                        className={styles.searchbarIconModal}
                        src={iconSearch}
                        onClick={() => {
                          handleSearchModalAnalytics();
                        }}
                      />
                    </div>
                    <div className={styles.imageModalContainer}>
                      <img className={styles.imageModal} src={imageInBom} />
                    </div>
                  </div>
                ) : (
                  <div
                    className={styles.goBackWrapper}
                    onClick={() => {
                      resetModal();
                    }}
                    className={styles.searchbarContainerModalBack}
                  >
                    <img
                      className={styles.goBackIconModal}
                      src={iconGoBack}
                      onClick={() => {
                        handleSearchModal();
                      }}
                    />
                    <div onClick={() => {
                      handleSearchModal();
                    }} className={styles.goBackText}>{goBackText}</div>
                  </div>
                )}


                <div>
                  {sparesInBom && sparesInBom.length === 0 && showResultsSearch && !spareInBomNotFound && (
                    <div className={styles.lazy_product_card_wrapper}>
                      <div className={styles.lazy_product_card}></div>
                      <div className={styles.lazy_product_card}></div>
                      <div className={styles.lazy_product_card}></div>
                      <div className={styles.lazy_product_card}></div>
                      <div className={styles.lazy_product_card}></div>
                      <div className={styles.lazy_product_card}></div>
                      <div className={styles.lazy_product_card}></div>
                      <div className={styles.lazy_product_card}></div>
                      <div className={styles.lazy_product_card}></div>
                      <div className={styles.lazy_product_card}></div>
                    </div>
                  )}
                  {sparesInBom && sparesInBom.length > 0 && (
                    <CustomProductsList
                      ids={sparesInBom.map((spare) => spare.id)}
                      references={sparesInBom}
                      queryField={"reference"}
                      fromDraw={true}
                    />
                  )}
                  {spareInBomNotFound && (
                    noSparePartsText
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showFilterModal && (
        <div>
          <div
            className={styles.modalOverlay}
            onClick={() => setShowFilterModal(false)}
          ></div>
          <div
            className={[
              styles.filters_wrapper_mobile_modal,
              showFilterModal ? styles.slideIn : styles.slideOut,
            ].join(" ")}
          >
            <div className={styles.filters_group}>
              <b className={styles.filters_group_title}>
                {sparePartsCategoryTitle}
              </b>

              <div
                className={[
                  styles.filters_group_content,
                  categoryFiltersOpen ? styles.filters_group_content_open : "",
                ].join(" ")}
              >
                {filters && filters.length == 0 && (
                  <>
                    <div className={styles.lazy_category}></div>
                    <div className={styles.lazy_category}></div>
                  </>
                )}
                {filters &&
                  filters.length > 0 &&
                  filters.map((filter) => {
                    return (
                      <p
                        className={[

                          activeFilterList.indexOf(filter) !== -1 ? styles.active : styles.filter,
                        ].join(" ")}
                        onClick={(e) => {

                          setResetList(true)
                          setProductsLoaded(false);
                          setSpareCodes([]);
                          setCurrentPage(1);
                          setFamilyGroup(familyGroup === filter ? "" : filter);
                          setShowFilterModal(false);
                          setNewSpareCodes([]);
                          setActiveFilterList([filter]);
                          handleClickFilter(filter)

                        }}
                      >
                        {filter}
                      </p>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
Bom.schema = {
  title: "Bom",
  description: "Bom page",
  type: "object",
  properties: {
    placeholder: {
      title: "Placeholder",
      description: "Placeholder",
      default: undefined,
      type: "string",
    },
    iconSearch: {
      title: "Icon search",
      description: "Icon search",
      type: "string",
      widget: {
        //here you can choose a file in your computer
        "ui:widget": "image-uploader",
      },
    },
    iconGoBack: {
      title: "Icon go back",
      description: "Icon go back",
      type: "string",
      widget: {
        //here you can choose a file in your computer
        "ui:widget": "image-uploader",
      },
    },
    iconExpandDraw: {
      title: "Icon zoom in",
      description: "Icon zoom in",
      type: "string",
      widget: {
        //here you can choose a file in your computer
        "ui:widget": "image-uploader",
      },
    },
    goBackText: {
      title: "Start new search",
      description: "Start new search text",
      default: undefined,
      type: "string",
    },
    spareByDrawingText: {
      title: "Spare by drawing text",
      description: "Spare by drawing text",
      default: undefined,
      type: "string",
    },
    filtersTitle: {
      title: "Filter title",
      description: "Filter title",
      default: undefined,
      type: "string",
    },
    sparePartsCategoryTitle: {
      title: "Spare parts category title",
      description: "Spare parts category title",
      default: undefined,
      type: "string",
    },
    buttonReadMore: {
      title: "Button read more",
      description: "Button read more",
      default: undefined,
      type: "string",
    },
    homeLabel: {
      title: "homeLabel",
      description: "homeLabel",
      default: undefined,
      type: "string",
    },
    sparePartsLabel: {
      title: "sparePartsLabel",
      description: "sparePartsLabel",
      default: undefined,
      type: "string",
    },
    noSparePartsText: {
      title: "noSparePartsText",
      description: "noSparePartsText",
      default: undefined,
      type: "string",
    },
    modalTitle: {
      title: "modalTitle",
      description: "modalTitle",
      default: undefined,
      type: "string",
    },
    modalSubtitle: {
      title: "modalSubtitle",
      description: "modalSubtitle",
      default: undefined,
      type: "string",
    },
    modalInstruction: {
      title: "modalInstruction",
      description: "modalInstruction",
      default: undefined,
      type: "string",
    },
    inStockLabel: {
      title: 'In Stock label',
      description: 'This is the label visible for in stock products',
      type: 'string',
      default: 'In Stock',
    },
    outOfStockLabel: {
      title: 'Out of  Stock label',
      description: 'This is the label visible for in out of stock products',
      type: 'string',
      default: 'Out of stock',
    },
    limitedLabel: {
      title: 'Limited label',
      description: 'This is the label visible for in limited stock products',
      type: 'string',
      default: 'Limited availability',
    },
    obsoleteLabel: {
      title: 'Obsolete label',
      description: 'This is the label visible for in obsolete products',
      type: 'string',
      default: 'Obsolete',
    },
    limitedIcon: {
      title: "Icon limited",
      description: "Icon limited",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    obsoleteIcon: {
      title: "Icon obsolete",
      description: "Icon obsolete",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    outOfStockIcon: {
      title: "Icon out of stock",
      description: "Icon out of stock",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    inStockIcon: {
      title: "Icon in stock",
      description: "Icon in stock",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    colorCodeLimited: {
      title: 'Color code limited',
      description: 'Color code limited',
      type: 'string',
      default: '#000',
    },
    colorCodeOutOfStock: {
      title: 'Color code out of stock',
      description: 'Color code out of stock',
      type: 'string',
      default: '#000',
    },
    colorCodeObsolete: {
      title: 'Color code obsolete',
      description: 'Color code obsolete',
      type: 'string',
      default: '#000',
    },
    bomDrawingInfoImage: {
      title: "Bom Drawing Info Image",
      description: "Bom Drawing Info Image",
      type: "string",
      widget: {
        //here you can choose a file in your computer
        "ui:widget": "image-uploader",
      },
    },
    bomDrawingInfoImageMobile: {
      title: "Bom Drawing Info Image Mobile",
      description: "Bom Drawing Info Image Mobile",
      type: "string",
      widget: {
        //here you can choose a file in your computer
        "ui:widget": "image-uploader",
      },
    }
  },
};
export default Bom;
