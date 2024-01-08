import React from 'react'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import Pagination from './components/Pagination'
import HPFilters from './components/HPFilters'
import WPFilters from './components/WPFilters'
import RecipeList from './components/Recipes'
import { Helmet } from 'vtex.render-runtime/react/components/RenderContext'
import styles from './styles.css'
import RECIPES_QUERY from '../graphql/recipes.gql'
import { useIntl, defineMessages } from 'react-intl'
import Breadcumb from './components/Breadcumb'

interface RecipesProps {
  brand: string
}

interface Filters {
  [key: string]: any[]
}

const messages = defineMessages({
  title: { id: 'recipes.title' },
  counter: { id: 'recipes.counter' },
  recipes: { id: 'recipes.recipes' },
})

const Recipes: StorefrontFunctionComponent<RecipesProps> = ({ brand }) => {
  const { useEffect, useState } = React
  const intl = useIntl()
  const { query } = useRuntime()
  const [currentRecipe, setCurrentRecipe] = useState(
    parseInt(query['page']) || 1
  )
  const [recipePerPage] = useState(12)
  const [filters, setFilters] = useState({} as Filters)

  const { loading, error, data } = useQuery(RECIPES_QUERY, {
    variables: {
      query: {
        pageNumber: currentRecipe,
        pageSize: recipePerPage,
        facets: Object.entries(filters).map(([key, value]) => ({
          name: key,
          values: value,
        })),
      },
    },
  })

  //Pagination
  // const indexOfLastRecipe = currentRecipe * recipePerPage
  // const indexOfFirstRecipe = indexOfLastRecipe - recipePerPage

  const paginate = pageNumber => setCurrentRecipe(pageNumber)

  const onFiltersChange = (filters: Record<any, any[]>) => setFilters(filters)

  const handleChangeQueryParams = (filters: Filters, currentPage: number) => {
    if (Object.entries(filters).length === 0)
      return window.history.pushState(null, '', `?page=${currentPage}`)

    const queryParams = Object.entries(filters).reduce((acc, [, value]) => {
      if (typeof acc !== 'string') return `filters[]=${value}`
      else return `${acc}&filters[]=${value}`
    }, {})
    window.history.pushState(null, '', `?${queryParams}&page=${currentPage}`)
  }

  useEffect(() => {
    handleChangeQueryParams(filters, currentRecipe)
  }, [filters, currentRecipe])

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.title)}</title>
        <meta name="description" content="Ricette" />
      </Helmet>
      <Breadcumb brand={brand} />
      <div className={styles.containerTop}>
        {brand === 'hotpoint' && (
          <HPFilters
            onChange={onFiltersChange}
            results={data?.queryRecipes?.recipes}
            query={query}
          ></HPFilters>
        )}
        {brand === 'whirlpool' && (
          <WPFilters onChange={onFiltersChange} query={query}></WPFilters>
        )}
        {loading && (
          <div
            className={`${styles.loaderForm} ${brand === 'whirlpool' &&
              styles.loaderFormCompact}`}
          ></div>
        )}
        {!loading && !error && data?.queryRecipes?.recipes && (
          <>
            <div className={styles.recipeNumber}>
              <span
                className={`${styles.recipeNumberText} ${brand ===
                  'whirlpool' && styles.recipeNumberTextCompact}`}
              >
                {data?.queryRecipes?.recipes?.length}{' '}
                {intl.formatMessage(messages.recipes)}
              </span>
            </div>
            <div className={styles.container}>
              <RecipeList recipes={data?.queryRecipes?.recipes} brand={brand} />
              {data?.queryRecipes?.page.totalRowCount != 0 ? (
                <>
                  <Pagination
                    recipePerPage={recipePerPage}
                    totalRecipes={data?.queryRecipes?.page.totalRowCount}
                    paginate={paginate}
                    brand={brand}
                    currentPage={currentRecipe}
                  />
                  {/* <div className={styles.recipeNumberBottom}>
                    <span className={styles.recipeNumberText}>
                      {indexOfFirstRecipe + 1}-
                      {indexOfLastRecipe >
                      data?.queryRecipes?.page.totalRowCount
                        ? data?.queryRecipes?.page.totalRowCount
                        : indexOfLastRecipe}{' '}
                      {intl.formatMessage(messages.counter)}{' '}
                      {data?.queryRecipes?.page.totalRowCount}
                    </span>
                  </div> */}
                </>
              ) : null}
            </div>
          </>
        )}
      </div>
    </>
  )
}
Recipes.schema = {
  title: 'Brand selection',
  description: 'Brand selection',
  type: 'object',
  properties: {
    brand: {
      title: 'Brand Selection',
      description: '',
      type: 'string',
      enum: ['hotpoint', 'whirlpool'],
      enumNames: ['Hotpoint', 'Whirlpool'],
      default: '',
    },
  },
}

export default Recipes
