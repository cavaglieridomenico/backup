import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import AccordionFilterItem from './AccordionFilterItem'
import DepartmentFilters from './DepartmentFilters'
import AccordionFilterGroup from './AccordionFilterGroup'
import styles from '../searchResult.css'

const CSS_HANDLES = [
  'filterBreadcrumbsItem',
  'filterBreadcrumbsItemName',
  'filterBreadcrumbsContent',
  'filterBreadcrumbsText',
  'filterBreadcrumbsList',
  'filterLoadingOverlay',
  'filter__label',
  'accordionFilterGroupsContainer',
  'accordionFilterOpen--price-ranges',
  'filterContainerAll',
]

const CATEGORIES_TITLE = 'store/search.filter.title.categories'

const AccordionFilterContainer = ({
  filters,
  onFilterCheck,
  tree,
  onCategorySelect,
  appliedFiltersOverview,
  navigationType,
  initiallyCollapsed,
  truncateFilters,
  truncatedFacetsFetched,
  setTruncatedFacetsFetched,
  categoryFiltersMode,
  onClearFilter,
  showClearByFilter
}) => {
  const { getSettings } = useRuntime()
  const [openItem, setOpenItem] = useState(null)
  const handles = useCssHandles(CSS_HANDLES)
  const isLazyFacetsFetchEnabled =
    getSettings('vtex.store')?.enableFiltersFetchOptimization

  const handleOpen = (id) => (e) => {
    e.preventDefault()

    if (navigationType === 'collapsible') {
      return
    }

    if (isLazyFacetsFetchEnabled && !truncatedFacetsFetched) {
      setTruncatedFacetsFetched(true)
    }

    if (openItem === id) {
      setOpenItem(null)
    } else {
      setOpenItem(id)
    }
  }

  const nonEmptyFilters = filters.filter((spec) => spec.facets.length > 0)

  const departmentsOpen = openItem === CATEGORIES_TITLE

  const itemClassName = classNames(
    styles.accordionFilterItemOptions,
    'pt3 h-100',
    { pb9: navigationType !== 'collapsible' }
  )

  return (
    <>
      <div className={handles.filterContainerAll}>
        <span className={handles.filter__label}>Filters</span>
        <div className={handles.accordionFilterGroupsContainer}>
          {tree.length > 0 && (
            <AccordionFilterItem
              title={CATEGORIES_TITLE}
              open={departmentsOpen}
              show={!openItem || departmentsOpen}
              onOpen={handleOpen(CATEGORIES_TITLE)}
              appliedFiltersOverview={appliedFiltersOverview}
              navigationType={navigationType}
              initiallyCollapsed={initiallyCollapsed}
              onClearFilter={onClearFilter}
            >
              <div className={itemClassName}>
                <DepartmentFilters
                  tree={tree}
                  isVisible={tree.length > 0}
                  onCategorySelect={onCategorySelect}
                  categoryFiltersMode={categoryFiltersMode}
                  hideBorder
                />
              </div>
            </AccordionFilterItem>
          )}

          {nonEmptyFilters.map((filter) => {
            const { title } = filter
            const isOpen = openItem === filter.title
            return (
              <AccordionFilterGroup
                title={filter.title}
                facets={filter.facets}
                quantity={filter.quantity}
                key={title}
                className={itemClassName}
                open={true}
                show={!openItem || isOpen}
                onOpen={handleOpen(title)}
                onFilterCheck={onFilterCheck}
                appliedFiltersOverview={appliedFiltersOverview}
                navigationType={navigationType}
                initiallyCollapsed={initiallyCollapsed}
                truncateFilters={truncateFilters}
                truncatedFacetsFetched={truncatedFacetsFetched}
                setTruncatedFacetsFetched={setTruncatedFacetsFetched}
                onClearFilter={onClearFilter}
                showClearByFilter={showClearByFilter}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

AccordionFilterContainer.propTypes = {
  /** Current available filters */
  filters: PropTypes.arrayOf(PropTypes.object),
  /** Filters mapped for checkbox */
  filtersChecks: PropTypes.object,
  /** Checkbox hit callback function */
  onFilterCheck: PropTypes.func,
  /** Current price range filter query parameter */
  priceRange: PropTypes.string,
  tree: PropTypes.any,
  onCategorySelect: PropTypes.func,
  /** Whether an overview of the applied filters should be displayed (`"show"`) or not (`"hide"`). */
  appliedFiltersOverview: PropTypes.string,
  /** Defines the navigation method: 'page' or 'collapsible' */
  navigationType: PropTypes.oneOf(['page', 'collapsible']),
  /** Makes the search filters start out collapsed (`true`) or open (`false`) */
  initiallyCollapsed: PropTypes.bool,
  /** If filters start truncated */
  truncateFilters: PropTypes.bool,
  /** If the truncated facets were fetched */
  truncatedFacetsFetched: PropTypes.bool,
  /** Sets if the truncated facets were fetched */
  setTruncatedFacetsFetched: PropTypes.func,
  categoryFiltersMode: PropTypes.oneOf(['href', 'default']),
  loading: PropTypes.bool,
  /** Clear filter function */
  onClearFilter: PropTypes.func,
  /** Whether a clear button that clear all options in a specific filter should appear beside the filter's name (true) or not (false). */
  showClearByFilter: PropTypes.bool,
  /** Wether the search will be updated on facet selection (`true`) or not (`false`) when the user is on mobile. */
  updateOnFilterSelectionOnMobile: PropTypes.bool,
  /** Price range layout (default or inputAndSlider) */
  priceRangeLayout: PropTypes.string,
}

export default AccordionFilterContainer
