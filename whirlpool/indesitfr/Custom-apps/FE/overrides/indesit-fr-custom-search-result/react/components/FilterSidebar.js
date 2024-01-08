import produce from 'immer'
import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { usePixel } from 'vtex.pixel-manager'

import FilterNavigatorContext, {
  useFilterNavigator,
} from './FilterNavigatorContext'
import AccordionFilterContainer from './AccordionFilterContainer'
import { MAP_CATEGORY_CHAR } from '../constants'
import { buildNewQueryMap } from '../hooks/useFacetNavigation'
import styles from '../searchResult.css'
import { getMainSearches } from '../utils/compatibilityLayer'
import {
  isCategoryDepartmentCollectionOrFT,
  filterCategoryDepartmentCollectionAndFT,
} from '../utils/queryAndMapUtils'
import { pushFilterManipulationPixelEvent } from '../utils/filterManipulationPixelEvents'

import FilterModal from './FilterModal'
import ButtonPrimary from './ButtonPrimary'

const CSS_HANDLES = [
  'filterPopupButton',
  'filterPopupTitle',
  'filterButtonsBox',
  'filterPopupArrowIcon',
  'filterClearButtonWrapper',
  'filterApplyButtonWrapper',
  'filterTotalProducts',
  'resetButton__style',
  'buttons__container',
  'accordionFilterGroupsWrapper',
]

const FilterSidebar = ({
  selectedFilters,
  filters,
  tree,
  priceRange,
  preventRouteChange,
  navigateToFacet,
  appliedFiltersOverview,
  navigationType,
  initiallyCollapsed,
  truncateFilters,
  truncatedFacetsFetched,
  setTruncatedFacetsFetched,
  categoryFiltersMode,
  loading,
  updateOnFilterSelectionOnMobile,
  showClearByFilter,
  priceRangeLayout,
}) => {
  const { searchQuery } = useSearchPage()
  const filterContext = useFilterNavigator()
  const [open, setOpen] = useState(true)
  const handles = useCssHandles(CSS_HANDLES)
  const shouldClear = useRef(false)
  const [filterOperations, setFilterOperations] = useState([])
  const [categoryTreeOperations, setCategoryTreeOperations] = useState([])
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const currentTree = useCategoryTree(tree, categoryTreeOperations)

  const isFilterSelected = (slectableFilters, filter) => {
    return slectableFilters.find(
      (filterOperation) => filter.value === filterOperation.value
    )
  }

  const handleFilterCheck = (filter) => {
    if (updateOnFilterSelectionOnMobile && preventRouteChange) {
      navigateToFacet(filter, preventRouteChange)

      return
    }

    if (!isFilterSelected(filterOperations, filter)) {
      setFilterOperations(filterOperations.concat(filter))
    } else {
      setFilterOperations(
        filterOperations.filter((facet) => facet.value !== filter.value)
      )
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleApply = () => {
    setOpen(false)

    if (updateOnFilterSelectionOnMobile && preventRouteChange) {
      return
    }

    navigateToFacet(filterOperations, preventRouteChange)
    setFilterOperations([])
  }

  const { push } = usePixel()

  const handleClearFilters = (key) => {
    pushFilterManipulationPixelEvent({
      name: 'CleanFilters',
      value: true,
      checked: 'reset',
      products: searchQuery?.products ?? [],
      push,
    })

    shouldClear.current =
      !updateOnFilterSelectionOnMobile || !preventRouteChange
    // Gets the previously selected facets that should be cleared
    const selectedFacets = selectedFilters.filter(
      (facet) =>
        !isCategoryDepartmentCollectionOrFT(facet.key) &&
        facet.selected &&
        (!key || (key && key === facet.key))
    )

    // Should not clear categories, departments and clusterIds
    const selectedRest = filterOperations.filter((facet) =>
      isCategoryDepartmentCollectionOrFT(facet.key)
    )

    const facetsToRemove = [...selectedFacets, ...selectedRest]

    if (updateOnFilterSelectionOnMobile && preventRouteChange) {
      navigateToFacet(facetsToRemove, preventRouteChange)

      return
    }

    setFilterOperations(facetsToRemove)
  }

  const handleUpdateCategories = (maybeCategories) => {
    const categories = Array.isArray(maybeCategories)
      ? maybeCategories
      : [maybeCategories]

    /* There is no need to compare with CATEGORY and DEPARTMENT since
     they are seen as a normal facet in the new VTEX search */
    const categoriesSelected = filterOperations.filter(
      (op) => op.map === MAP_CATEGORY_CHAR
    )

    const newCategories = [...categoriesSelected, ...categories]

    if (updateOnFilterSelectionOnMobile && preventRouteChange) {
      navigateToFacet(newCategories, preventRouteChange)

      return
    }

    // Just save the newest operation here to be recorded at the category tree hook and update the tree
    setCategoryTreeOperations(categories)

    // Save all filters along with the new categories, appended to the old ones
    setFilterOperations((selectableFilters) => {
      return selectableFilters
        .filter((operations) => operations.map !== MAP_CATEGORY_CHAR)
        .concat(newCategories)
    })
  }

  const context = useMemo(() => {
    const { query, map } = filterContext
    const fullTextAndCollection = getMainSearches(query, map)

    /* This removes the previously selected stuff from the context when you click on 'clear'.
    It is important to notice that it keeps categories, departments and clusterIds since they
    are important to show the correct facets. */
    if (shouldClear.current) {
      shouldClear.current = false

      return filterCategoryDepartmentCollectionAndFT(filterContext)
    }

    /* The spread on selectedFilters was necessary because buildNewQueryMap
     changes the object but we do not want that on mobile */
    return {
      ...filterContext,
      ...buildNewQueryMap(fullTextAndCollection, filterOperations, [
        ...selectedFilters,
      ]),
    }
  }, [filterOperations, filterContext, selectedFilters])

  return (
    <Fragment>
      <FilterModal isOpen={open} handleClose={handleClose}>
        <FilterNavigatorContext.Provider value={context}>
          <div className={handles.accordionFilterGroupsWrapper}>
            <AccordionFilterContainer
              filters={filters}
              tree={currentTree}
              onFilterCheck={handleFilterCheck}
              onCategorySelect={handleUpdateCategories}
              priceRange={priceRange}
              appliedFiltersOverview={appliedFiltersOverview}
              navigationType={navigationType}
              initiallyCollapsed={initiallyCollapsed}
              truncateFilters={truncateFilters}
              truncatedFacetsFetched={truncatedFacetsFetched}
              setTruncatedFacetsFetched={setTruncatedFacetsFetched}
              categoryFiltersMode={categoryFiltersMode}
              loading={loading}
              onClearFilter={handleClearFilters}
              showClearByFilter={showClearByFilter}
              updateOnFilterSelectionOnMobile={updateOnFilterSelectionOnMobile}
              priceRangeLayout={priceRangeLayout}
            />
          </div>
          <ExtensionPoint id="sidebar-close-button" onClose={handleClose} />
        </FilterNavigatorContext.Provider>

          <div className={handles.buttons__container}>
           <span className={handles.resetButton__style} onClick={() => handleClearFilters()}>
              Réinitialiser
            </span>
            <ButtonPrimary onClick={() => {handleApply()}} />
          </div>
      </FilterModal>
    </Fragment>
  )
}

const updateTree = (categories) =>
  produce((draft) => {
    if (!categories.length) {
      return
    }

    let currentLevel = draft

    while (
      !(
        currentLevel.find(
          (category) => category.value === categories[0].value
        ) || currentLevel.every((category) => !category.selected)
      )
    ) {
      currentLevel = currentLevel.find((category) => category.selected).children
    }

    categories.forEach((category) => {
      const selectedIndex = currentLevel.findIndex(
        (cat) => cat.value === category.value
      )

      currentLevel[selectedIndex].selected = !currentLevel[selectedIndex]
        .selected
      currentLevel = currentLevel[selectedIndex].children
    })
  })

// in order for us to avoid sending a request to the facets
// API and refetch all filters on every category change (like
// we are doing on desktop), we'll keep a local copy of the category
// tree structure, and locally modify it with the information we
// have.
//
// the component responsible for displaying the category tree
// in a user-friendly manner should reflect to the changes
// we make in the tree, the same as it would with a tree fetched
// from the API.
const useCategoryTree = (initialTree, categoryTreeOperations) => {
  const [tree, setTree] = useState(initialTree)

  useEffect(() => {
    setTree(initialTree)
  }, [initialTree])

  useEffect(() => {
    setTree(updateTree(categoryTreeOperations))
  }, [categoryTreeOperations, initialTree])

  return tree
}

export default FilterSidebar
