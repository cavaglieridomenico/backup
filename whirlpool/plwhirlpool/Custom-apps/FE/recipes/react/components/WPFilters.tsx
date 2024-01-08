import React from 'react'
import styles from '../styles.css'
import { useQuery } from 'react-apollo'
import FILTER_QUERY from '../../graphql/filters.gql'
import { isEqual } from 'lodash'
import { useIntl, defineMessages } from 'react-intl'
import translateInEn from '../utils/translateInEn'
import { usePixel } from 'vtex.pixel-manager'


interface FilterProps {
  onChange: (filter: Filters) => void
  onRefresh?: () => void
  query: any
}

interface Filters {
  [key: string]: any[]
}

interface WindowGTM extends Window {
  dataLayer: any[]
}

const messages = defineMessages({
  title: { id: 'recipes.single.wp.title' },
  filters: { id: 'recipes.filters.title' },
  mainIngredients: { id: 'recipes.filters.mainIngredients' },
  type: { id: 'recipes.filters.type' },
  category: { id: 'recipes.filters.category' },
  reset: { id: 'recipes.filters.reset' },
})

const Filters: StorefrontFunctionComponent<FilterProps> = ({
  onRefresh,
  onChange,
  query,
}) => {
  const { useState, useRef, useEffect } = React
  const intl = useIntl()
  //@ts-ignore
  const { push } = usePixel()

  const { loading, error, data } = useQuery(FILTER_QUERY)

  const [loaded, setLoaded] = useState(false)

  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || []

  useEffect(() => {
    if (loading || error) return
    const temp = data.queryRecipes.facets
      .filter(facet => facet.name != 'idType')
      .map((facet: any) => ({
        name: intl.formatMessage(messages[facet.name]),
        id: facet.name,
        opened: false,
        selected: false,
        field: facet.name,
        filters: facet.values.map((value: any) => ({
          id: value,
          name: value,
          selected: false,
        })),
      }))
    setInternalFilters(temp)
  }, [loading])

  const [internalFilters, setInternalFilters]: any[] = useState([])

  const categoryRef = useRef<any[]>([])

  const handleFilterChange = (
    indexCategory: number,
    indexFilter: number,
    selected?: boolean
  ) => {
    const temp = [...internalFilters]
    const filter = internalFilters[indexCategory].filters[indexFilter]
    const filterCategory = internalFilters[indexCategory]?.name

    if (!filter) return temp
    filter.selected = selected ? selected : !filter.selected
    temp[indexCategory][indexFilter] = filter
    let filterChain = 'filters '
    let isFirstFilter = true 
    //metto push
    const newFilters: Filters = {} as Filters

    temp.forEach(category => {
      category.filters.forEach(filter => {
        if (filter.selected){
          
          filterChain += `${!isFirstFilter ? '&' : ''}${filterCategory.replaceAll(/\s/g, '_')}=${filter.id}` 
          isFirstFilter = false
          newFilters[category.field] = [
            ...(newFilters[category.field] || []),
            filter.id,
          ]
        }

      })
      category.selected = category.filters.some(filter => filter.selected)
    })
    filtersPush(filter.id, filterCategory, filter.selected, filterChain)

    onChange(newFilters)
    return temp
  }

  const handleFilterClick = (indexCategory: number, indexFilter: number) => {
    setInternalFilters(handleFilterChange(indexCategory, indexFilter))
  }

  const handleResetFilters = () => {
    const temp = [...internalFilters]
    temp.forEach(category => {
      category.selected = false
      category.filters.forEach(filter => {
        filter.selected = false
      })
    })
    setInternalFilters(temp)
    onChange({})

    //GA4FUNREQ13
    dataLayer.push({
      event:'filterManipulation',
      filterName: "product-category",
      filterValue: '',
      filterProductCategory: '',
      filterChainedDetails:'',
      filterInteraction:'reset',
      type:'recipe'
    })
  }

  const filtersPush = (filterValue, filterFamily, selected, filterChain) => {
    dataLayer.push({
      event: 'recipeFilters',
      eventCategory: 'Recipe Facet Tracking',
      eventAction: `Filter Recipes - ${translateInEn(filterFamily,false)}`,
      eventLabel: filterValue,
      recipeFilterFamily: translateInEn(filterFamily,true),
    })
    //GA4FUNRE13
    dataLayer.push({
      event:'filterManipulation',
      filterName: translateInEn(filterFamily,false),
      filterValue: filterValue,
      filterProductCategory:'',
      filterChainedDetails:filterChain,
      filterInteraction: selected ? 'selected' : 'remove',
      type:'recipe'
    })
  }

  const handleToggleCategory = (index: number) => {
    const temp = [...internalFilters]
    temp.forEach((category, indexC) => {
      if (indexC !== index) {
        category.opened = false
      }
    })
    temp[index].opened = !temp[index].opened
    setInternalFilters(temp)
  }

  const handleRefreshClick = () => {
    if (typeof onRefresh === 'function') onRefresh()
  }

  useEffect(() => setLoaded(internalFilters.length > 0), [internalFilters])

  useEffect(() => {
    if (!query['filters[]']) return

    if (loading || error) return

    if (internalFilters.length === 0) return

    const newFilters: Filters = {} as Filters

    const temp = [...internalFilters]
    temp.forEach(category => {
      category.filters.forEach(filter => {
        filter.selected = query['filters[]'].includes(filter.id)
        if (filter.selected)
          newFilters[category.field] = [
            ...(newFilters[category.field] || []),
            filter.id,
          ]
      })
      category.selected = category.filters.some(filter => filter.selected)
    })

    onChange(newFilters)
    if (isEqual(temp, internalFilters)) return

    setInternalFilters(temp)
  }, [query, loaded])

  return (
    <div className={styles.filtersContainerCompact}>
      <div className={styles.filtersCompact}>
        <div
          style={{ display: 'flex', flexFlow: 'column', overflow: 'hidden' }}
        >
          <div className={styles.categoryContainerBigTitle}>
            <span>{intl.formatMessage(messages.title)}</span>
          </div>
          <div className={styles.categoryContainerCompact}>
            <span className={styles.categoryFiltersText}>
              {intl.formatMessage(messages.filters)}
            </span>
            <div className={styles.filtersContainerWp}>
              {internalFilters.map((category, indexC) => (
                <div
                  key={indexC}
                  className={styles.categoryDetailCompact}
                  onClick={() => handleToggleCategory(indexC)}
                >
                  <div
                    className={`${styles.categoryName} ${category.selected &&
                      styles.categoryNameSelected}`}
                  >
                    {category.name}
                  </div>
                  <svg
                    viewBox="0 0 8 13"
                    width="8px"
                    height="13px"
                    className={category.opened && styles.categorySvgOpened}
                  >
                    <path
                      fill="#aeaeae"
                      d="M7.03 7.03L1.96 12.102a.75.75 0 0 1-1.06-1.06L5.438 6.5.9 1.959a.75.75 0 1 1 1.06-1.06l5.071 5.07a.75.75 0 0 1 0 1.061z"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              ))}
            </div>
            <div className={styles.refreshFiltersCompact}>
              <span
                className={styles.categoryFiltersTextLight}
                onClick={handleResetFilters}
              >
                {intl.formatMessage(messages.reset)}
              </span>
              <div
                className={styles.categoryRefreshButton}
                onClick={handleRefreshClick}
              >
                <svg viewBox="0 0 15 15" height="15px" width="15px">
                  <path
                    d="M14.711 9.815a.48.48 0 0 0-.618.243c-1.072 2.45-3.548 4.033-6.307 4.033C4.013 14.09.944 11.134.944 7.5c0-3.634 3.07-6.59 6.842-6.59 2.076 0 4.045.929 5.34 2.486h-2.024a.463.463 0 0 0-.472.454c0 .252.211.455.472.455h2.995c.26 0 .471-.203.471-.455V.966c0-.251-.21-.455-.471-.455a.464.464 0 0 0-.472.455v1.579C12.155.942 10.022 0 7.785 0 3.494 0 0 3.365 0 7.5S3.493 15 7.786 15c3.14 0 5.957-1.801 7.177-4.589a.45.45 0 0 0-.252-.596"
                    fill="#9b9b9b"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div>
            {internalFilters.map((category, indexC) => (
              <div
                className={`${styles.categoryOptions} ${category.opened &&
                  styles.categoryOptionsOpen}`}
                ref={el => (categoryRef.current[category.id] = el)}
                style={{
                  height: category.opened
                    ? `${categoryRef.current[category.id]?.scrollHeight}px`
                    : '0px',
                }}
              >
                {category.filters.map((filter, indexF) => (
                  <div
                    key={filter.id}
                    className={`${styles.categoryFilterCompact} ${category
                      .filters.length < 3 &&
                      styles.categoryFilterCompactMini} ${filter.selected &&
                      styles.categoryFilterCompactSelected}`}
                    onClick={() => handleFilterClick(indexC, indexF)}
                  >
                    <span>{filter.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Filters
