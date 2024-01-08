import React, { useRef, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import { Slider } from 'vtex.styleguide'
import { formatCurrency } from 'vtex.format-currency'
import { Checkbox } from 'vtex.styleguide'
import { SearchPageContext, useSearchPage} from 'vtex.search-page-context/SearchPageContext'
import { getMainSearches } from '../utils/compatibilityLayer'
import { useFilterNavigator } from '../components/FilterNavigatorContext'

import { buildNewQueryMap } from '../hooks/useFacetNavigation'
/*
import {
  isCategoryDepartmentCollectionOrFT,
  filterCategoryDepartmentCollectionAndFT,
} from '../utils/queryAndMapUtils'
*/
import {
  buildSelectedFacetsAndFullText
} from '../utils/compatibilityLayer'
import useSelectedFilters from '../hooks/useSelectedFilters'



//import useFacetNavigation from './hooks/useFacetNavigation'


function transformMapToCategory(facets){
  var i = 1
  var newFacets = []
  newFacets.push(facets.map(e => {
    if (e.key == "c") {
      e.map = "category-"+i
      i = i + 1
    } else {
      e.map = e.key
    } 
    return e
  }))
  return newFacets
}

function concatArray(array,char,startedWithChar = false){
  var newString = startedWithChar?char:''
  var i = 0
  let max = array.length-1
  array.forEach(e =>{
    if(i < max){
      newString = newString + e.concat('',char)
    }else{
      newString = newString + e
    }
    i = i + 1
  })
  return newString.slice(0, -1)
}

function removeParam(array,param){
  var i = 0
  var newArray = []
  array.forEach(e => {
    console.log('condition',e !== param || e.trim().length !== 0)
    if(e !== param){      
      newArray.push(e)
    } 
    i = i + 1
  })
  return newArray
}

function removeHideParams(map,paramMap,query,paramQuery){
  var splittedQuery = query.split('/')
  var splittedMap = map.split(',')

  splittedQuery = removeParam(splittedQuery,paramQuery)
  splittedMap = removeParam(splittedMap,paramMap)


  return {"query":concatArray(splittedQuery,'/',true),"map":concatArray(splittedMap,',')}
}


import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'
import FilterOptionTemplate from './FilterOptionTemplate'
import useSearchState from '../hooks/useSearchState'

const DEBOUNCE_TIME = 500 // ms

/** Price range slider component */
const PriceRange = ({ title, facets, priceRange }) => {
  const [hideUnavailableItems, sethideUnavailableItems] = useState(true)
  
  const { searchQuery } = useSearchPage()
  const context = useMemo(() => {
    return {
      searchQuery,
    }
  }, [
    searchQuery,
  ])
  // const { culture, setQuery } = useRuntime()
  const intl = useIntl()

  const navigateTimeoutId = useRef()

  // const { fuzzy, operator, searchState } = useSearchState()
  const filterContext = useFilterNavigator()
  const { getSettings, culture, navigate, setQuery, query: runtimeQuery } = useRuntime()
  const { map, query } = useFilterNavigator()
  const { fuzzy, operator, searchState } = useSearchState()

  // const { searchQuery } = useSearchPage()

  // const mainSearches = getMainSearches(query, map)

  const handleChange = ([left, right]) => {
    if (navigateTimeoutId.current) {
      clearTimeout(navigateTimeoutId.current)
    }
    navigateTimeoutId.current = setTimeout(() => {
      setQuery({
        priceRange: `${left} TO ${right}`,
        page: undefined,
        fuzzy: fuzzy || undefined,
        operator: operator || undefined,
        searchState: searchState || undefined,
      })
    }, DEBOUNCE_TIME)
  }

  const filters = useSelectedFilters(facets)

  const handleChangeAvailableItems = () => {
    // const selectedCategories = getSelectedCategories(tree)
    // const navigateToFacet = useFacetNavigation(
    //   useMemo(() => {
    //     return selectedCategories.concat(selectedFilters)
    //   }, [selectedFilters, selectedCategories]),
    //   scrollToTop
    // )

    sethideUnavailableItems(!hideUnavailableItems)
    
    searchQuery.variables.hideUnavailableItems = hideUnavailableItems
    const selectedFilters = filters.filter(facet => facet.selected)
    console.log("searchQuery.variables.hideUnavailableItems", searchQuery.variables.hideUnavailableItems)
    var { query, map } = filterContext
    const [selectedFacets, fullText] = buildSelectedFacetsAndFullText(
      query,
      map,
      priceRange
    )
    // const selectedFacets = searchQuery.variables.selectedFacets
    // console.log("selectedFacets",selectedFacets);

    const mainSearches = getMainSearches(query, map)
    
    let facetsHide = []
    selectedFacets.forEach(e => facetsHide.push(e))
    facetsHide.push({value:hideUnavailableItems,key:"hideUnavailable",map:"hideUnavailable"})
    facetsHide = transformMapToCategory(facetsHide)
    
    var { query , map } = buildNewQueryMap(
       mainSearches,
       facetsHide,
       selectedFacets
    )
    
    var { query , map } = removeHideParams(map,"hideUnavailable",query,hideUnavailableItems.toString())
    setQuery({
       query : query,
       map: map,
       page: undefined,
       fuzzy: fuzzy || undefined,
       operator: operator || undefined,
       searchState: searchState || undefined,
     })

    // const navigateToFacet = useFacetNavigation(
    //   useMemo(() => {
    //     return selectedCategories.concat(selectedFilters)
    //   }, [selectedFilters, selectedCategories]),
    //   scrollToTop
    // )



  }

  const slugRegex = /^de-(.*)-a-(.*)$/
  const availableOptions = facets.filter(({ slug }) => slugRegex.test(slug))

  if (!availableOptions.length) {
    return null
  }

  let minValue = Number.MAX_VALUE
  let maxValue = Number.MIN_VALUE

  availableOptions.forEach(({ slug }) => {
    const [, minSlug, maxSlug] = slug.match(slugRegex)

    const min = parseInt(minSlug, 10)
    const max = parseInt(Math.ceil(maxSlug), 10)

    if (min < minValue) {
      minValue = min
    }

    if (max > maxValue) {
      maxValue = max
    }
  })

  const defaultValues = [minValue, maxValue]
  const currentValuesRegex = /^(.*) TO (.*)$/

  if (priceRange && currentValuesRegex.test(priceRange)) {
    const [, currentMin, currentMax] = priceRange.match(currentValuesRegex)

    defaultValues[0] = parseInt(currentMin, 10)
    defaultValues[1] = parseInt(currentMax, 10)
  }

  return (
    <FilterOptionTemplate
      id="priceRange"
      title={getFilterTitle(title, intl)}
      collapsable={false}
    >
      <Slider
        min={minValue}
        max={maxValue}
        onChange={handleChange}
        defaultValues={defaultValues}
        formatValue={(value) => formatCurrency({ intl, culture, value })}
        range
      />
      <SearchPageContext.Provider value={context}>
        <div>
          <Checkbox
            className="mb0"
            checked={hideUnavailableItems}
            id={"name"}
            // label={
            //   showFacetQuantity
            //     ? `${facet.name} (${facet.quantity})`
            //     : facet.name
            // }
            name={"name"}
            onChange={() => handleChangeAvailableItems()}
            value={"name"}
          />  hide Unavailable Items
        </div>
      </SearchPageContext.Provider>
    </FilterOptionTemplate>
  )
}

PriceRange.propTypes = {
  /** Filter title */
  title: PropTypes.string.isRequired,
  /** Available price ranges */
  facets: PropTypes.arrayOf(facetOptionShape).isRequired,
  /** Current price range filter query parameter */
  priceRange: PropTypes.string,
}

export default PriceRange
