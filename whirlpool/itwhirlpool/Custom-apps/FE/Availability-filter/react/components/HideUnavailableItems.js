import React, { useRef, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import { Checkbox } from 'vtex.styleguide'
import { SearchPageContext, useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { getMainSearches } from '../utils/compatibilityLayer'
import { useFilterNavigator } from '../components/FilterNavigatorContext'
import { buildNewQueryMap } from '../hooks/useFacetNavigation'
import {
  isCategoryDepartmentCollectionOrFT,
  filterCategoryDepartmentCollectionAndFT,
} from '../utils/queryAndMapUtils'
import {
  buildSelectedFacetsAndFullText
} from '../utils/compatibilityLayer'
import useSelectedFilters from '../hooks/useSelectedFilters'

import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'
import FilterOptionTemplate from './FilterOptionTemplate'
import useSearchState from '../hooks/useSearchState'

const DEBOUNCE_TIME = 500 // ms

/** Price range slider component */
const HideUnavailableItems = ({ title, facets, priceRange }) => {
  const [hideUnavailableItems, sethideUnavailableItems] = useState(false)
  const { searchQuery } = useSearchPage()
  const context = useMemo(() => {

    return {
      searchQuery,
    }
  }, [
    searchQuery,
  ])
  const { culture, setQuery } = useRuntime()
  const intl = useIntl()

  const navigateTimeoutId = useRef()

  const { fuzzy, operator, searchState } = useSearchState()
  const filterContext = useFilterNavigator()
  const filters = useSelectedFilters(facets)
  const selectedFilters = filters.filter(facet => facet.selected)

  const handleChangeAvailableItems = () => {
    sethideUnavailableItems(!hideUnavailableItems)
    // console.log("sethideUnavailableItems",hideUnavailableItems);
    searchQuery.variables.hideUnavailableItems = hideUnavailableItems
    // console.log("searchQuery.variables.hideUnavailableItems", searchQuery.variables.hideUnavailableItems)
    console.log("searchQuery", searchQuery)
    const { query, map } = filterContext
    const [selectedFacets, fullText] = buildSelectedFacetsAndFullText(
      query,
      map,
      priceRange
    )
    const mainSearches = getMainSearches(query, map)
    const { query: currentQuery, map: currentMap } = buildNewQueryMap(
      mainSearches,
      facets,
      selectedFacets
    )
    console.log("currentQuery", currentQuery)
    console.log("currentMap", currentMap)
    
    setQuery({
      // query: currentQuery,
      // map: currentMap,
      page: undefined,
      fuzzy: fuzzy || undefined,
      operator: operator || undefined,
      searchState: searchState || undefined,
    })
    // return searchQuery.variables.hideUnavailableItems
  }

  const slugRegex = /^de-(.*)-a-(.*)$/
  const availableOptions = facets.filter(({ slug }) => slugRegex.test(slug))




  return (
    <FilterOptionTemplate
      id="priceRange"
      title={getFilterTitle(title, intl)}
      collapsable={false}
    >

      <SearchPageContext.Provider value={context}>
        <div>
          hide unavailable items
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
          /> From mu component
        </div>
      </SearchPageContext.Provider>
    </FilterOptionTemplate>
  )
}

HideUnavailableItems.propTypes = {
  /** Filter title */
  title: PropTypes.string.isRequired,
  /** Available price ranges */
  facets: PropTypes.arrayOf(facetOptionShape).isRequired,
}

export default HideUnavailableItems
