// @ts-nocheck
import React, { useState, useEffect, useContext } from 'react'
import styles from './styles.css'
import { ProductContext } from 'vtex.product-context'
import axios from 'axios'
import SearchIconMinus from './Icons/SearchIconMinus'
import SearchIconPlus from './Icons/SearchIconPlus'
import SellingPrice from './components/CustomProductPrice/react/SellingPrice'
import Wrapper from './components/AddToCartButtonCustom/react/Wrapper'
import SpinnerIcon from './Icons/SpinnerIcon'
import ProductAvailabilityWrapper from './components/ProductAvailabilityCustom/react/components/ProductAvailabilityWrapper'
import Warning from './components/WarningsCustom/Warning'
import { useCssHandles, useCustomClasses } from 'vtex.css-handles'
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages,
} from 'react-intl'

const messages = defineMessages({
  filterByCategory: { id: 'store/custom-product-page.filter-by-category' },
  resultFor: { id: 'store/custom-product-page.resultFor' },
  findYourPart: { id: 'store/custom-product-page.findYourPart' },
  search: { id: 'store/custom-product-page.search' },
  reference: { id: 'store/custom-product-page.reference' },
  code: { id: 'store/custom-product-page.code' },
  total: { id: 'store/custom-product-page.total' },
})

const CustomProductPage = ({}) => {
  const context = useContext(ProductContext)
  const [product, setProduct] = useState({})
  const [productIds, setProductIds] = useState([])
  const [industrialCode, setIndustrialCode] = useState(null)
  const [spareParts, setSpareParts] = useState([])
  const [familyGroups, setFamilyGroups] = useState([])
  const [translatedFamilyGroups, setTranslatedFamilyGroups] = useState([])
  const [tables, setTables] = useState([])
  const [activeTable, setActiveTable] = useState(null)
  const [activeFamilyGroup, setActiveFamilyGroup] = useState(null)
  const [activeFamilyGroupCount, setActiveFamilyGroupCount] = useState(null)
  const [sparePartsFilterValue, setSparePartsFilterValue] = useState(null)
  const [categoryIds, setCategoryIds] = useState({})
  const [brand, setBrand] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [categoryTranslations, setCategoryTranslations] = useState({})

  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const classes = useCustomClasses(() => {
    return {
      customProductPrice: styles.customProductPageSparePartsCardProductPrice,
    }
  })
  const onTableClick = e => {
    e.preventDefault()
    let id = e.target.closest('div').dataset.id
    let newTables = [...tables]
    newTables.filter(table => {
      if (table.imageId === id) {
        table.clicked = !table.clicked
        if (table.clicked) {
          setActiveTable(table)
        } else {
          setActiveTable(null)
        }
      } else {
        table.clicked = false
      }
    })
    setTables(newTables)
  }

  const getBomData = industrialCode => {
    if (industrialCode) {
      axios
        .get(
          `/v1/bom/scroll/${industrialCode}?brand=${brand}&locale=${__RUNTIME__.culture.locale}`
        )
        .then(function(response) {
          setCategoryIds(response.data.categoryIds)
          let groups = {
            total: {
              name: 'total',
              value: 0,
            },
          }

          response.data.spareParts.map(part => {
            if (
              part.familyGroup &&
              part.familyGroup[0] &&
              part.familyGroup[0] !== 'without'
            ) {
              if (groups[part.familyGroup[0]]) {
                groups[part.familyGroup[0]].value =
                  groups[part.familyGroup[0]].value + 1
              } else {
                groups[part.familyGroup[0]] = {
                  name: part.familyGroup[0],
                  value: 1,
                }
              }
            }

            groups['total'].value++
            var references = []
            if (part.bomRelationships && part.bomRelationships.length > 0) {
              part.references = []
              part.bomRelationships.map(reference => {
                part.references.push({
                  productId: reference.finishedgoodId,
                  tableId: reference.bomId,
                  sparePartTableId: reference.sparepartInBom,
                  addToCartAmmount: reference.quantity,
                })
              })
            }
          })

          var calculatedGroups = []
          for (var group in groups) {
            calculatedGroups.push({
              name: groups[group].name,
              value: groups[group].value,
              id: response.data.categoryIds[groups[group].name],
            })
          }

          setActiveFamilyGroup(
            calculatedGroups[0] ? calculatedGroups[0].name : null
          )
          setActiveFamilyGroupCount(
            calculatedGroups[0] ? calculatedGroups[0].value : null
          )
          setFamilyGroups(calculatedGroups)
          setSpareParts(response.data.spareParts)
          setIsLoading(false)
        })
        .catch(error => {
          getBomData(industrialCode)
          setIsError(true)
        })
    }
  }

  useEffect(() => {
    setProduct(context.product)
    var ids = []
    context.product.specificationGroups[0].specifications.filter(spec => {
      if (spec.originalName === 'industrialCode') {
        setIndustrialCode(spec.values[0])
      }
      ids.push(spec.values[0])
    })
    setProductIds(ids)
    setTables(context.product.items[0].images)
    // console.log(context.product)
  }, [])

  useEffect(() => {
    getBomData(industrialCode)
  }, [industrialCode])
  useEffect(() => {
    let search = window.location.search
    let isIndesit = search.includes('indesit')
    let isWhirlpool = search.includes('whirlpool')
    let isBauknecht = search.includes('bauknecht')
    setBrand(
      isIndesit
        ? 'indesit'
        : isBauknecht
        ? 'bauknecht'
        : isWhirlpool
        ? 'whirlpool'
        : ''
    )
  }, [])

  useEffect(() => {
    var promises = []
    familyGroups.filter((group, index) => {
      promises.push(
        axios
          .get(
            `/v1/translation/category/${categoryIds[group.name]}/${
              __RUNTIME__.culture.locale
            }`
          )
          .then(function(response) {
            return response.data.data.category
          })
          .catch(function(error) {
            return { success: false }
          })
      )
    })
    Promise.all(promises)
      .then(results => {
        var translations = {}
        results.filter(result => {
          if (result.id) {
            translations[result.id] = result.name
          }
        })
        setCategoryTranslations(translations)
      })
      .catch(e => {
        // Handle errors here
      })
  }, [familyGroups])

  const checkIfSparePartInActiveTable = part => {
    var checkValid = activeTable ? false : true
    if (activeTable) {
      part?.references?.map(reference => {
        if (reference.tableId === activeTable.imageId) {
          checkValid = true
        }
      })
    }
    return checkValid
  }
  const checkIfSparePartHasReference = part => {
    var checkValid = false
    part.references.map(reference => {
      if (reference.tableId === activeTable.imageId) {
        if (
          reference.sparePartTableId
            .replace(/\s/g, '')
            .indexOf(sparePartsFilterValue.replace(/\s/g, '')) !== -1
        ) {
          checkValid = true
        }
      }
    })
    return checkValid
  }
  const getSelectedQuantity = part => {
    var selectedQuantity = 1
    if (activeTable) {
      part.references.map(reference => {
        if (reference.tableId === activeTable.imageId) {
          selectedQuantity = parseInt(reference.addToCartAmmount)
        }
      })
    }
    return selectedQuantity
  }
  const getSparePartReferenceId = part => {
    var codes = []
    part.references.map(reference => {
      if (reference.tableId === activeTable.imageId) {
        codes.push(reference.sparePartTableId)
      }
    })
    return codes
  }

  const getCookie = name => {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
    return v ? v[2] : null
  }

  const getPath = linktext => {
    let url = __RUNTIME__.binding.canonicalBaseAddress
    let href = window.location.href

    return href.includes('myvtex')
      ? '/' + linktext + '/p' + window.location.search
      : '/' + url.split('/')[url.split('/').length - 1] + '/' + linktext + '/p'
  }
  return (
    <div className={styles.customProductPage}>
      <div className={styles.customProductPageHeader}>
        <p>{translateMessage(messages.resultFor)}</p>
        <h4>{productIds.join(' / ')}</h4>
      </div>
      <div className={styles.customProductPageCategoriesWrapper}>
        <p>{translateMessage(messages.filterByCategory)}</p>
        <div className={styles.customProductPageCategories}>
          {familyGroups.map(group => {
            return (
              <div
                onClick={e => {
                  setActiveFamilyGroup(e.target.closest('div').dataset.name)
                  setActiveFamilyGroupCount(
                    e.target.closest('div').dataset.count
                  )
                }}
                data-name={group.name}
                data-count={group.value}
                className={[
                  styles.customProductPageCategory,
                  activeFamilyGroup && activeFamilyGroup === group.name
                    ? styles.customProductPageCategoryActive
                    : '',
                ].join(' ')}>
                <img
                  src={
                    group.name !== 'total'
                      ? `/arquivos/${group.id}.jpg`
                      : 'https://parts.whirlpool.be/assets/frontend/images/whirlpool/placeholder.svg'
                  }
                  class="card-img-top"
                  alt="..."
                />
                <b>
                  {categoryTranslations[group.id]
                    ? categoryTranslations[group.id]
                    : group.name === 'total'
                    ? translateMessage(messages.total)
                    : group.name}
                </b>
                <span>({group.value})</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.customProductPageTablesWrapper}>
        <p>{translateMessage(messages.findYourPart)}</p>
        <div className={styles.customProductPageTables}>
          {tables.map((table, index) => {
            return (
              <div
                className={styles.customProductPageTable}
                role="button"
                onClick={e => onTableClick(e)}
                data-id={table.imageId}>
                {table.clicked ? <SearchIconMinus /> : <SearchIconPlus />}
                <img src={table.imageUrl}></img>
              </div>
            )
          })}
        </div>
        {activeTable && <img src={activeTable.imageUrl} alt="" />}
      </div>
      <div className={styles.customProductPageProductsFilter}>
        <div className={styles.customProductPageProductsFilterWrapper}>
          <p>
            {activeFamilyGroup}({activeFamilyGroupCount})
          </p>
          {activeTable && (
            <div>
              {translateMessage(messages.search)}:
              <input
                type="text"
                onChange={e => {
                  setSparePartsFilterValue(e.currentTarget.value)
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.customProductPageSpareParts}>
        {spareParts &&
          spareParts.map(part => {
            if (
              ((part.familyGroup &&
                part.familyGroup.includes(activeFamilyGroup)) ||
                activeFamilyGroup === 'total') &&
              checkIfSparePartInActiveTable(part) &&
              (!sparePartsFilterValue || checkIfSparePartHasReference(part))
            ) {
              return (
                <div className={styles.customProductPageSparePartsCard}>
                  <a
                    href={encodeURI(
                      getPath(part.linkText ? part.linkText : '')
                    )}>
                    <img
                      src={
                        part.items &&
                        part.items[0] &&
                        part.items[0].images &&
                        part.items[0].images[0]
                          ? part.items[0].images[0].imageUrl
                          : ''
                      }
                    />
                  </a>
                  <div className={styles.customProductPageSparePartsCardInfo}>
                    {activeTable && (
                      <span
                        className={
                          styles.customProductPageSparePartsCardInfoTableReference
                        }>
                        {translateMessage(messages.reference)}:{' '}
                        {getSparePartReferenceId(part).map((code, index) => {
                          return index === 0 ? code : ' | ' + code
                        })}
                      </span>
                    )}
                    <a
                      href={encodeURI(
                        getPath(part.linkText ? part.linkText : '')
                      )}>
                      {part.productName}
                    </a>
                    <p>
                      {translateMessage(messages.code)}: {part['jCode']}
                    </p>
                    <div
                      className={
                        styles.customProductPageSparePartsAvailability
                      }>
                      <ProductAvailabilityWrapper product={part} />
                      <Warning product={part} />
                    </div>
                  </div>
                  <div className={styles.customProductPageSparePartsCardFooter}>
                    <SellingPrice product={part} classes={classes} />
                    <Wrapper
                      product={part}
                      selectedQuantity={getSelectedQuantity(part)}
                    />
                  </div>
                </div>
              )
            }
          })}
      </div>
      {isLoading && (
        <div className={styles.customProductPageLoader}>
          <SpinnerIcon className={styles.customProductPageLoaderSpinner} />
        </div>
      )}
    </div>
  )
}

export default CustomProductPage
