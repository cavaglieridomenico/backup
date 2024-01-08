// @ts-nocheck
import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from './styles.css';
import { ProductContext } from 'vtex.product-context'
import axios from 'axios';
import SearchIconMinus from './Icons/SearchIconMinus';
import SearchIconPlus from './Icons/SearchIconPlus';
import SellingPrice from './components/CustomProductPrice/react/SellingPrice';
import Wrapper from './components/AddToCartButtonCustom/react/Wrapper';
import SpinnerIcon from './Icons/SpinnerIcon';
import ProductAvailabilityWrapper from './components/ProductAvailabilityCustom/react/components/ProductAvailabilityWrapper';
import Warning from './components/WarningsCustom/Warning';
import { useCssHandles, useCustomClasses } from 'vtex.css-handles';
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages
} from 'react-intl'
import { group } from 'console';
import SearchIcon from './Icons/SearchIcon';
import CloseIcon from './Icons/CloseIcon';
import SearchIconModal from './Icons/SearchIconModal';


const messages = defineMessages({
  filterByCategory: { id: 'store/custom-product-page.filter-by-category' },
  resultFor: { id: 'store/custom-product-page.resultFor' },
  findYourPart: { id: 'store/custom-product-page.findYourPart' },
  search: { id: 'store/custom-product-page.search' },
  reference: { id: 'store/custom-product-page.reference' },
  code: { id: 'store/custom-product-page.code' },
  total: { id: 'store/custom-product-page.total' }
})

const CustomProductPage = ({

}) => {


  const context = useContext(ProductContext);
  const [product, setProduct] = useState({});
  const [productIds, setProductIds] = useState([]);
  const [industrialCode, setIndustrialCode] = useState(null);
  const [spareParts, setSpareParts] = useState([]);
  const [familyGroups, setFamilyGroups] = useState([]);
  const [translatedFamilyGroups, setTranslatedFamilyGroups] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState(null);
  const [activeFamilyGroup, setActiveFamilyGroup] = useState(null);
  const [activeFamilyGroupCount, setActiveFamilyGroupCount] = useState(null);
  const [sparePartsFilterValue, setSparePartsFilterValue] = useState(null);
  const [categoryIds, setCategoryIds] = useState({});
  const [brand, setBrand] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [categoryTranslations, setCategoryTranslations] = useState({});
  const [counterGetBomData, setCounterGetData] = useState(0);
  const [selectChanged, setSelectChanged] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [activeFamilyGroupCountBackup, setActiveFamilyGroupCountBackup] = useState(null);

  const myRef = useRef();
  const elementRef = useRef();

  const executeScroll = () => myRef.current.scrollIntoView({ behavior: "smooth"})


  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)

  const classes = useCustomClasses(() => {
    return {
      "customProductPrice": styles.customProductPageSparePartsCardProductPrice
    }
  })
  const onTableClick = (e) => {
    e.preventDefault();
    let id = e.target.closest("div").dataset.id;
    let newTables = [...tables];
    newTables.filter((table) => {
      if (table.imageId === id) {
        table.clicked = !table.clicked;
        if (table.clicked) {
          setActiveTable(table);
          setShowImage(true);
        } else {
          setActiveTable(null);
          console.log("deselect")
          console.log(activeFamilyGroupCountBackup)
          setActiveFamilyGroupCount(activeFamilyGroupCountBackup)
        }
      } else {
        table.clicked = false;
      }

    });
    setTables(newTables);
    setSparePartsFilterValue(null)

    setActiveFamilyGroupCount(activeFamilyGroupCountBackup)
  }

  const getBomData = (industrialCode) => {
    console.log(counterGetBomData)
    if (industrialCode && (counterGetBomData <= 10)) {
      axios.get(`/v1/bom/scroll/${industrialCode}?brand=${brand}&locale=${__RUNTIME__.culture.locale}`)
        .then(function (response) {
          setCategoryIds(response.data.categoryIds);
          let groups = {
            "total": {
              "name": "total",
              "value": 0
            }
          };

          response.data.spareParts.map((part) => {
            if (part.familyGroup && part.familyGroup[0] && part.familyGroup[0] !== "without") {
              if (groups[part.familyGroup[0]]) {
                groups[part.familyGroup[0]].value = groups[part.familyGroup[0]].value + 1;
              } else {
                groups[part.familyGroup[0]] = {
                  "name": part.familyGroup[0],
                  "value": 1
                }
              }
            }

            groups["total"].value++;
            var references = [];
            if (part.bomRelationships && part.bomRelationships.length > 0) {
              part.references = [];
              part.bomRelationships.map((reference) => {
                part.references.push({
                  "productId": reference.finishedgoodId,
                  "tableId": reference.bomId,
                  "sparePartTableId": reference.sparepartInBom,
                  "addToCartAmmount": reference.quantity
                })
              })
            }
          });

          var calculatedGroups = [];
          for (var group in groups) {
            calculatedGroups.push({
              "name": groups[group].name,
              "value": groups[group].value,
              "id": response.data.categoryIds[groups[group].name]
            })
          }

          setActiveFamilyGroup(calculatedGroups[0] ? calculatedGroups[0].name : null);
          setActiveFamilyGroupCount(calculatedGroups[0] ? calculatedGroups[0].value : null)
          setFamilyGroups(calculatedGroups);
          setSpareParts(response.data.spareParts);
          setIsLoading(false)
        }).catch((error) => {
          setIsLoading(false)
          alert("Timeout error. Try to refresh the page.");
        })
    }
  }


  useEffect(() => {
    setProduct(context.product);
    var ids = [];
    context.product.specificationGroups[0].specifications.filter((spec) => {
      if (spec.originalName === "industrialCode") {
        setIndustrialCode(spec.values[0]);
      }
      ids.push(spec.values[0]);
    });
    setProductIds(ids);
    setTables(context.product.items[0].images);
    console.log(context.product)
  }, []);

  useEffect(() => {

    getBomData(industrialCode);
  }, [industrialCode])
  useEffect(() => {
    let search = window.location.href;
    let isIndesit = search.includes("indesit");
    setBrand(isIndesit ? "indesit" : "hotpoint");
  }, [])

  useEffect(() => {

    var promises = [];
    familyGroups.filter((group, index) => {
      promises.push(
        axios.get(`/v1/translation/category/${categoryIds[group.name]}/${__RUNTIME__.culture.locale}`).then(function (response) {
          return response.data.data.category
        })
          .catch(function (error) {
            return { success: false };
          })
      )
    });
    Promise.all(promises)
      .then((results) => {
        var translations = {};
        results.filter((result) => {
          if (result.id) {
            translations[result.id] = result.name;
          }
        })
        setCategoryTranslations(translations);

        handleClickImageBackup()
      })
      .catch((e) => {
        // Handle errors here
      });
  }, [familyGroups])


  const checkIfSparePartInActiveTable = (part) => {
    var checkValid = activeTable ? false : true;
    if (activeTable) {
      part?.references?.map((reference) => {
        if (reference.tableId === activeTable.imageId) {
          checkValid = true;
        }
      })
    }
    return checkValid;
  }
  const checkIfSparePartHasReference = (part) => {
    var checkValid = false;
    part.references.map((reference) => {
      if (reference.tableId === activeTable.imageId) {
        if (reference.sparePartTableId.replace(/\s/g, "").indexOf(sparePartsFilterValue.replace(/\s/g, "")) !== -1) {
          checkValid = true;
        }
      }
    });
    return checkValid;
  }
  const getSelectedQuantity = (part) => {
    var selectedQuantity = 1;
    if (activeTable) {
      part.references.map((reference) => {
        if (reference.tableId === activeTable.imageId) {
          selectedQuantity = parseInt(reference.addToCartAmmount);
        }
      })
    }
    return selectedQuantity;
  }
  const getSparePartReferenceId = (part) => {
    var codes = [];
    part.references.map((reference) => {
      if (reference.tableId === activeTable.imageId) {
        codes.push(reference.sparePartTableId)
      }
    });
    return codes;
  }

  const getCookie = (name) => {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }

  const getPath = (linktext) => {

    return "/" + linktext + "/p?fromBOM=true";
  }

  const pippo = (x) => {
    console.log(x)
  }

  const handleChange = (e) => {
    let index = e.target.selectedIndex;
    let optionElement = e.target.childNodes[index]
    let count = optionElement.getAttribute('data-count');
    let groupName = optionElement.getAttribute('data-name');
    pippo(groupName);
    setActiveFamilyGroup(groupName);
    setActiveFamilyGroupCount(count);
    setActiveFamilyGroupCountBackup(count);
    executeScroll();
    setSelectChanged(true);
  }

  const handleClickImage = () => {
    const divElement = elementRef.current;
    console.log(divElement.childNodes.length);
    setActiveFamilyGroupCount(divElement.childNodes.length);
  }

  const handleClickImageBackup = () => {
    const divElement = elementRef.current;
    console.log(divElement.childNodes.length);
    setActiveFamilyGroupCountBackup(divElement.childNodes.length);
  }

  useEffect(() => {
    setTimeout(() => {
      
    handleClickImage()
    }, 500);
  }, [activeFamilyGroup, sparePartsFilterValue, activeTable])
  
  // (((part.familyGroup && (part.familyGroup.includes(activeFamilyGroup)) || activeFamilyGroup === "total")) && checkIfSparePartInActiveTable(part) && (!sparePartsFilterValue || !activeTable || (activeTable && checkIfSparePartHasReference(part)))) {

  return (

    <div className={styles.customProductPage}>
      <div className={styles.customProductPageHeader} >
        <p className={styles.customProductPageHeaderTitle}>{translateMessage(messages.resultFor)}</p>
        <p>{productIds.join(" / ")}</p>
        <div className={styles.customProductPageLine}></div>
        <div className={styles.customProductPageCategoriesWrapper}>
          <p className={styles.customProductPageFilterBy}>{translateMessage(messages.filterByCategory)}</p>
          <div className={styles.customProductPageCategories}>
            <select className={styles.customProductPageSelectCategories} name="categories" id="categories" onChange={handleChange}>
              <option selected></option>
              {familyGroups.map((group) => {
                return <option
                  data-name={group.name}
                  data-count={group.value}
                  className={[styles.customProductPageCategory, activeFamilyGroup && activeFamilyGroup === group.name ? styles.customProductPageCategoryActive : ""].join(" ")}
                >
                  {categoryTranslations[group.id] ? categoryTranslations[group.id] : group.name === "total" ? translateMessage(messages.total) : group.name}
                  ({group.value})
                </option>
              })}
            </select>
            {!selectChanged && (
              <p className={styles.customProductPageCategoriesSelectLabel}>Click here to view a list of categories</p>

            )}
            {/*
          {familyGroups.map((group) => {
            return <div onClick={(e) => {
              setActiveFamilyGroup(e.target.closest("div").dataset.name);
              setActiveFamilyGroupCount(e.target.closest("div").dataset.count);
              executeScroll();
            }}
              data-name={group.name}
              data-count={group.value}
              className={[styles.customProductPageCategory, activeFamilyGroup && activeFamilyGroup === group.name ? styles.customProductPageCategoryActive : ""].join(" ")}
            >
              <img src={group.name !== "total" ? `/arquivos/${group.id}.jpg` : "https://parts.whirlpool.be/assets/frontend/images/whirlpool/placeholder.svg"} class="card-img-top" alt="..." />
              <b>{categoryTranslations[group.id] ? categoryTranslations[group.id] : group.name === "total" ? translateMessage(messages.total) : group.name}</b>
              <span>({group.value})</span>
            </div>
          })} */}
          </div>
        </div>
      </div>


      <div className={styles.customProductPageTablesWrapper} >
        <div className={styles.customProductPageTables}>
          <p className={styles.customProductPageTablesWrapperTitle}>{translateMessage(messages.findYourPart)}</p>

          <div className={styles.customProductPageTablesContainer}>
            {tables.map((table, index) => {
              return table.clicked ?
                <div className={styles.customProductPageTableSelected} onClick={(e) => onTableClick(e)} data-id={table.imageId}>
                  <img src={table.imageUrl}></img>
                  <div className={styles.customProductPageSearchIconContainer}>
                    <SearchIconMinus />
                  </div>
                </div> :
                <div className={styles.customProductPageTable} onClick={(e) => onTableClick(e)} data-id={table.imageId}>
                  <img src={table.imageUrl}></img>
                  <div className={styles.customProductPageSearchIconContainer}>
                    <SearchIconPlus />
                  </div>
                </div>
              {/*{table.clicked ? (
                
              ) : (
                <SearchIconPlus />
              )}*/}


            })}
          </div>

        </div>
        {showImage && activeTable && (
          <div>
            <div className={styles.customProductPageModalImage}>
              <div className={styles.customProductPageCloseIconContainer}>
                <div className={styles.customProductPageCloseIcon} onClick={(e) => {
                  setShowImage(false)
                }}><CloseIcon /></div>
              </div>
              <div className={styles.customProductPageModalContainer}>
                <div className={styles.customProductPageFilterInput}>
                  <input placeholder={translateMessage(messages.search)} className={styles.customProductPageInputText} type="text" />
                  <div className={styles.customProductPageIcon} onClick={(e) => {
                    setShowImage(false)
                    executeScroll()
                    setSparePartsFilterValue(e.currentTarget.parentNode?.querySelectorAll("input")[0].value)
                    
                  }}>
                    <SearchIconModal />
                  </div>
                </div>
                <img src={activeTable.imageUrl} alt="" />
              </div>
            </div>
            <div className={styles.customProductPageModalImageOverlay}></div>
          </div>
        )}

      </div>



      <div ref={myRef} className={styles.customProductPageProductsFilter}>
        <div className={styles.customProductPageProductsFilterWrapper}>
          <p className={styles.customProductPageProductsFilterParagraph}>{activeFamilyGroup} ({activeFamilyGroupCount})</p>


        </div>

        <div className={styles.customProductPageSpareParts} ref={elementRef}>
          {spareParts && spareParts.map((part) => {

            if (((part.familyGroup && (part.familyGroup.includes(activeFamilyGroup)) || activeFamilyGroup === "total")) && checkIfSparePartInActiveTable(part) && (!sparePartsFilterValue || !activeTable || (activeTable && checkIfSparePartHasReference(part)))) {

              return <div className={styles.customProductPageSparePartsCard}>
                <a href={encodeURI(getPath(part.linkText))}>
                  <div className={styles.customProductPageSparePartsCardImageContainer}>
                    <img src={part.items && part.items[0] && part.items[0].images && part.items[0].images[0] ? part.items[0].images[0].imageUrl : ""} />
                    <div className={styles.customProductPageSparePartsCardInfoRowRightMobile}>

                      <SellingPrice product={part} classes={classes} />
                      <ProductAvailabilityWrapper product={part} />
                      <Warning product={part} />

                    </div>
                  </div>
                </a>
                <a className={styles.customProductPageSparePartsCardInfo} href={encodeURI(getPath(part.linkText))}>

                  {activeTable && (
                    <span className={styles.customProductPageSparePartsCardInfoTableReference}>
                      {translateMessage(messages.reference)}: {getSparePartReferenceId(part).map((code, index) => { return index === 0 ? code : " | " + code })}
                    </span>
                  )}
                  <div className={styles.customProductPageSparePartsCardInfoRow}>
                    <div className={styles.customProductPageSparePartsCardInfoRowLeft}>
                      <b>{part.productName}</b>
                      <p>{translateMessage(messages.code)}: <b>{part["jCode"]}</b></p>
                    </div>
                    <div className={styles.customProductPageSparePartsCardInfoRowRight}>

                      <SellingPrice product={part} classes={classes} />
                      <ProductAvailabilityWrapper product={part} />
                      <Warning product={part} />

                    </div>
                  </div>
                  {(part.status[0] == 'out of stock' ?
                    <div className={styles.customProductPageSparePartsCardFooter}>
                      <Wrapper product={part} selectedQuantity={getSelectedQuantity(part)} />
                    </div> :
                    <div className={styles.customProductPageSparePartsCardFooter}>

                      <Wrapper product={part} selectedQuantity={getSelectedQuantity(part)} />
                    </div>)}
                </a>
              </div>
            }
          })}
        </div>

      </div>

      {isLoading && (
        <div className={styles.customProductPageLoader}>
          <SpinnerIcon className={styles.customProductPageLoaderSpinner} />
        </div>
      )}

    </div>
  )
}

CustomProductPage.Wrapper = Wrapper;
CustomProductPage.ProductAvailabilityWrapper = ProductAvailabilityWrapper;
export default CustomProductPage;
