import React, { useState, useEffect } from 'react'
import Recipe from './components/Recipe'
import Pagination from './components/Pagination'
import Filters from './components/Filters'
import {
  Helmet,
  useRuntime,
} from 'vtex.render-runtime/react/components/RenderContext'
import styles from './styles.css'
import { canUseDOM } from 'vtex.render-runtime'

//var n = require('normalize-strings')

interface RecipesProps {}

const Recipes: StorefrontFunctionComponent<RecipesProps> = () => {
  const rt = useRuntime()
  const page: number = parseInt(rt.route?.queryString.page ?? 1)

  const [initialRecipes, setInitialRecipes]: any[] = useState([])
  const [recipes, setRecipes]: any[] = useState([])
  const [loading, setLoading]: any[] = useState()
  const [currentRecipe, setCurrentRecipe] = useState<number>(page)
  const [recipePerPage] = useState(6)
  const [categoryFilter]: any[] = useState([])
  const [coursesFilter, setCoursesFilter] = useState('')

  // FIlters states
  const [antipastoFilter, setAntipastoFilter]: any[] = useState(true)
  const [primiFilter, setPrimiFilter]: any[] = useState(true)
  const [dolciFilter, setDolciFilter]: any[] = useState(true)

  //const [estrattiFilter, setEstrattiFilter]: any[] = useState(true)
  const [microondeFilter, setMicroondeFilter]: any[] = useState(true)
  const [fornoFilter, setFornoFilter]: any[] = useState(true)
  const [hobsFilter, setHobsFilter]: any[] = useState(true)
  const [steamer, setSteamer]: any[] = useState(true)
  const [cooler, setCooler]: any[] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/_v/wrapper/api/recipes/receipeList?limit=100`, {
      headers: {
        method: 'GET',
        scheme: 'https',
        accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        setRecipes(
          res /* .map((ricette: any) => ({ ...ricette, name: n(ricette.name) })) */
        ),
          setInitialRecipes(
            res /* .map((ricette: any) => ({ ...ricette, name: n(ricette.name) })) */
          )
      })

    setLoading(false)

    window.addEventListener('popstate', function() {
      window.location.reload() // Fixes situational pagination issues with pop action of the browser
    })
  }, [])

  //Pagination
  const indexOfLastRecipe = currentRecipe * recipePerPage
  const indexOfFirstRecipe = indexOfLastRecipe - recipePerPage
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe)

  const paginate = pageNumber => {
    setCurrentRecipe(pageNumber)

    // Updates URL parameter for pagination
    window.history.replaceState(
      {},
      '',
      pageNumber === 1 ? '/rezepte' : `/rezepte?page=${pageNumber}`
    )
  }

  // Filter Category
  const filterCourses = (Recipetype: string) => {
    let filteredCourse = []
    if (Recipetype != coursesFilter) {
      filteredCourse = initialRecipes.filter(
        recipe =>
          recipe.type == Recipetype &&
          (categoryFilter.length == 0 ||
            categoryFilter.includes(recipe.category))
      )
      setCoursesFilter(Recipetype)
    } else {
      filteredCourse = initialRecipes.filter(
        recipe =>
          categoryFilter.length == 0 || categoryFilter.includes(recipe.category)
      )
      setCoursesFilter('')
    }
    setRecipes(filteredCourse)
    hideFiltersCategory(filteredCourse)
  }

  // Filter Courses
  const filterCategory = (RecipeCategory: string) => {
    if (categoryFilter.includes(RecipeCategory)) {
      categoryFilter.splice(categoryFilter.indexOf(RecipeCategory), 1)
    } else {
      categoryFilter.push(RecipeCategory)
    }
    let filteredCategory = initialRecipes.filter(
      recipe =>
        categoryFilter.length == 0 || categoryFilter.includes(recipe.category)
    )
    setRecipes(
      filteredCategory.filter(
        recipe => coursesFilter == '' || recipe.type == coursesFilter
      )
    )
    hideFiltersCourses(filteredCategory)
  }

  //Hide filters
  const hideFiltersCategory = (filteredCourse: any[]) => {
    setAntipastoFilter(
      filteredCourse.some(recipe => recipe.category == 'Vorspeise')
    )
    setPrimiFilter(
      filteredCourse.some(recipe => recipe.category == 'Hauptgang')
    )
    setDolciFilter(
      filteredCourse.some(recipe => recipe.category == 'Nachspeise')
    )
    /* setEstrattiFilter(
			filteredCourse.some((recipe) => recipe.category == 'Saft'),
		) */
  }

  const hideFiltersCourses = (filteredCategory: any[]) => {
    setMicroondeFilter(
      categoryFilter.length == 0 ||
        filteredCategory.some(recipe => recipe.type == 'MIKROWELLE')
    )
    setFornoFilter(
      categoryFilter.length == 0 ||
        filteredCategory.some(recipe => recipe.type == 'BACKOFEN')
    )
    setHobsFilter(
      categoryFilter.length == 0 ||
        filteredCategory.some(recipe => recipe.type == 'KOCHFELDER')
    )
    setSteamer(
      categoryFilter.length == 0 ||
        filteredCategory.some(recipe => recipe.type == 'DAMPFGARER')
    )
    setCooler(
      categoryFilter.length == 0 ||
        filteredCategory.some(recipe => recipe.type == 'KÜHLSCHRANK')
    )
  }

  return (
    <>
      <Helmet>
        <title>Rezepte | Bauknecht</title>
        <meta
          name="description"
          content={
            currentRecipe === 1
              ? 'Rezepte - In unserem online Magazin finden Sie neben zahlreichen Rezepten. Wählen Sie aus unseren leckeren Vorschlägen das passende Rezept.'
              : `Rezepte - Seite ${
                  canUseDOM ? currentRecipe : page
                } - In unserem online Magazin finden Sie neben zahlreichen Rezepten. Wählen Sie aus unseren leckeren Vorschlägen das passende Rezept. `
          }
        />
        <meta
          property="og:description"
          content={
            currentRecipe === 1
              ? 'Rezepte - In unserem online Magazin finden Sie neben zahlreichen Rezepten. Wählen Sie aus unseren leckeren Vorschlägen das passende Rezept.'
              : `Rezepte - Seite ${
                  canUseDOM ? currentRecipe : page
                } - In unserem online Magazin finden Sie neben zahlreichen Rezepten. Wählen Sie aus unseren leckeren Vorschlägen das passende Rezept. `
          }
        />
        {canUseDOM ? (
          <link
            rel="canonical"
            href={
              currentRecipe === 1
                ? 'https://www.bauknecht.de/rezepte'
                : `https://www.bauknecht.de/rezepte?page=${currentRecipe}`
            }
          />
        ) : (
          <link
            rel="canonical"
            href={
              page === 1
                ? 'https://www.bauknecht.de/rezepte'
                : `https://www.bauknecht.de/rezepte?page=${page}`
            }
          />
        )}
      </Helmet>
      <div className={styles.containerTop}>
        {loading ? (
          <div className={styles.loaderForm}></div>
        ) : (
          <>
            <Filters
              filterCategory={filterCategory}
              filterCourses={filterCourses}
              antipastoFilter={antipastoFilter}
              primiFilter={primiFilter}
              dolciFilter={dolciFilter}
              //	estrattiFilter={estrattiFilter}
              microondeFilter={microondeFilter}
              fornoFilter={fornoFilter}
              hobsFilter={hobsFilter}
              steamer={steamer}
              cooler={cooler}
            ></Filters>
            <div className={styles.recipeNumber}>
              <span className={styles.recipeNumberText}>
                {recipes.length} Rezepte
              </span>
            </div>
            <div className={styles.container}>
              <Recipe recipes={currentRecipes} />
              {recipes.length != 0 ? (
                <>
                  <Pagination
                    page={currentRecipe}
                    recipePerPage={recipePerPage}
                    totalRecipes={recipes.length}
                    paginate={paginate}
                  />
                  <div className={styles.recipeNumberBottom}>
                    <span className={styles.recipeNumberText}>
                      {indexOfFirstRecipe + 1}-
                      {indexOfLastRecipe > recipes.length
                        ? recipes.length
                        : indexOfLastRecipe}{' '}
                      von {recipes.length}
                    </span>
                  </div>
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
  title: 'editor.domande-frequenti.title',
  description: 'editor.domande-frequenti.description',
  type: 'object',
  properties: {},
}

export default Recipes
