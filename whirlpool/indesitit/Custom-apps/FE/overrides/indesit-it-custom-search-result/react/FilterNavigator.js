import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo, Fragment, useState, useEffect } from 'react'
import ContentLoader from 'react-content-loader'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
// eslint-disable-next-line no-restricted-imports
import { filter, flatten } from 'ramda'

import FilterSidebar from './components/FilterSidebar'
import SelectedFilters from './components/SelectedFilters'
import AvailableFilters from './components/AvailableFilters'
import DepartmentFilters from './components/DepartmentFilters'
import {
  facetOptionShape,
  paramShape,
  hiddenFacetsSchema,
} from './constants/propTypes'
import useFacetNavigation from './hooks/useFacetNavigation'
import FilterNavigatorTitleTag from './components/FilterNavigatorTitleTag'
import styles from './searchResult.css'
import { CATEGORIES_TITLE } from './utils/getFilters'
import { newFacetPathName } from './utils/slug'
import { FACETS_RENDER_THRESHOLD } from './constants/filterConstants'

const CSS_HANDLES = [
  'filter__container',
  'filtersWrapper',
  'filtersWrapperMobile',
]

const LAYOUT_TYPES = {
  responsive: 'responsive',
  desktop: 'desktop',
  phone: 'phone',
}

const getSelectedCategories = (tree) => {
  for (const node of tree) {
    if (!node.selected) {
      continue
    }

    if (node.children) {
      return [node, ...getSelectedCategories(node.children)]
    }

    return [node]
  }

  return []
}

const newNamedFacet = (facet) => {
  return { ...facet, newQuerySegment: newFacetPathName(facet) }
}

/**
 * Wrapper around the filters (selected and available) as well
 * as the popup filters that appear on mobile devices
 */
const FilterNavigator = ({
  priceRange,
  tree = [],
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  loading = false,
  filters = [],
  preventRouteChange = false,
  hiddenFacets = {},
  initiallyCollapsed = false,
  truncateFilters = false,
  layout = LAYOUT_TYPES.responsive,
  maxItemsDepartment = 8,
  maxItemsCategory = 8,
  categoryFiltersMode = 'default',
  filtersTitleHtmlTag = 'h5',
  scrollToTop = 'none',
  openFiltersMode = 'many',
  filtersFetchMore,
  closeOnOutsideClick = false,
  appliedFiltersOverview = 'hide',
  totalProductsOnMobile = 'hide',
  fullWidthOnMobile = false,
  navigationTypeOnMobile = 'page',
  updateOnFilterSelectionOnMobile = false,
  showClearByFilter = false,
  priceRangeLayout = 'slider',
}) => {
  const { isMobile } = useDevice()
  const handles = useCssHandles(CSS_HANDLES)
  const [truncatedFacetsFetched, setTruncatedFacetsFetched] = useState(false)

  const mobileLayout =
    (isMobile && layout === LAYOUT_TYPES.responsive) ||
    layout === LAYOUT_TYPES.mobile ||
    layout === LAYOUT_TYPES.phone

  useEffect(() => {
    // This condition confirms if there are facets that still need fetching
    const needsFetching = !!filters.find(
      (filter) => filter.quantity > filter.facets.length
    ) 
    if (truncatedFacetsFetched && needsFetching && !loading) {
      filtersFetchMore({
        variables: {
          from: FACETS_RENDER_THRESHOLD,
          to: undefined, // to the end of the results
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!prevResult || !fetchMoreResult) {
            return
          }

          const prevFacets = prevResult.facets.facets
          const newFacets = fetchMoreResult.facets.facets
          const fullFacets = []

          for (let i = 0; i < prevFacets.length; i++) {
            const completeFacets = [
              ...prevFacets[i].facets,
              ...newFacets[i].facets,
            ]

            fullFacets.push({
              ...prevFacets[i],
              facets: completeFacets,
            })
          }

          return {
            facets: {
              ...prevResult.facets,
              facets: fullFacets,
            },
          }
        },
      })
    } 
  }, [filters, filtersFetchMore, truncatedFacetsFetched, loading])

  const selectedFilters = useMemo(() => {
    const options = [
      ...specificationFilters.map((filter) => {
        return filter.facets.map((facet) => {
          return {
            ...newNamedFacet({ ...facet, title: filter.name }),
            hidden: filter.hidden,
          }
        })
      }),
      ...brands,
      ...priceRanges,
    ]

    return flatten(options)
  }, [brands, priceRanges, specificationFilters]).filter(
    (facet) => facet.selected
  )

  const selectedCategories = getSelectedCategories(tree)
  const navigateToFacet = useFacetNavigation(
    useMemo(() => {
      return selectedCategories.concat(selectedFilters)
    }, [selectedFilters, selectedCategories]),
    scrollToTop
  )

  return (
            <FilterSidebar
              selectedFilters={selectedCategories.concat(selectedFilters)}
              filters={filters}
              tree={tree}
              priceRange={priceRange}
              preventRouteChange={preventRouteChange}
              navigateToFacet={navigateToFacet}
              appliedFiltersOverview={appliedFiltersOverview}
              totalProductsOnMobile={totalProductsOnMobile}
              fullWidth={fullWidthOnMobile}
              navigationType={navigationTypeOnMobile}
              initiallyCollapsed={initiallyCollapsed}
              truncateFilters={truncateFilters}
              truncatedFacetsFetched={truncatedFacetsFetched}
              setTruncatedFacetsFetched={setTruncatedFacetsFetched}
              categoryFiltersMode={categoryFiltersMode}
              loading={loading}
              updateOnFilterSelectionOnMobile={updateOnFilterSelectionOnMobile}
              showClearByFilter={showClearByFilter}
              priceRangeLayout={priceRangeLayout}
            />
  )
}

FilterNavigator.propTypes = {
  /** Categories tree */
  tree: PropTypes.arrayOf(facetOptionShape),
  /** Params from pages */
  params: paramShape,
  /** List of brand filters (e.g. Samsung) */
  brands: PropTypes.arrayOf(facetOptionShape),
  /** List of specification filters (e.g. Android 7.0) */
  specificationFilters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      facets: PropTypes.arrayOf(facetOptionShape),
    })
  ),
  /** List of price ranges filters (e.g. from-0-to-100) */
  priceRanges: PropTypes.arrayOf(facetOptionShape),
  /** Current price range filter query parameter */
  priceRange: PropTypes.string,
  /** Loading indicator */
  loading: PropTypes.bool,
  layout: PropTypes.oneOf(Object.values(LAYOUT_TYPES)),
  initiallyCollapsed: PropTypes.bool,
  truncateFilters: PropTypes.bool,
  filtersTitleHtmlTag: PropTypes.string,
  /** Whether an overview of the applied filters should be displayed (`"show"`) or not (`"hide"`). */
  appliedFiltersOverview: PropTypes.string,
  ...hiddenFacetsSchema,
}

export default FilterNavigator
