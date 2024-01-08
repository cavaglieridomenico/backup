import React, { useState, useEffect } from 'react'
import Recipe from './components/Recipe'
import Pagination from './components/Pagination'
import Filters from './components/Filters'
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import styles from './styles.css'

interface RecipesProps {}

const Recipes: StorefrontFunctionComponent<RecipesProps> = () => {
  const [initialRecipes, setInitialRecipes]: any[] = useState([])
  const [recipes, setRecipes]: any[] = useState([])
  const [loading, setLoading]: any[] = useState()
  const [currentRecipe, setCurrentRecipe] = useState(1)
  const [recipePerPage] = useState(6)
  const [categoryFilter]: any[] = useState([])
  const [coursesFilter, setCoursesFilter] = useState('')
  // FIlters states
  const [antipastoFilter, setAntipastoFilter]: any[] = useState(true)
  const [primiFilter, setPrimiFilter]: any[] = useState(true)
  const [dolciFilter, setDolciFilter]: any[] = useState(true)
  const [estrattiFilter, setEstrattiFilter]: any[] = useState(true)
  const [microondeFilter, setMicroondeFilter]: any[] = useState(true)
  const [fornoFilter, setFornoFilter]: any[] = useState(true)
  const [juicerFilter, setJuicerFilter]: any[] = useState(true)

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
        setRecipes(res), setInitialRecipes(res)
      })
    setLoading(false)
  }, [])


  //Pagination
  const indexOfLastRecipe = currentRecipe * recipePerPage
  const indexOfFirstRecipe = indexOfLastRecipe - recipePerPage
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe)

  const paginate = pageNumber => setCurrentRecipe(pageNumber)
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
      filteredCourse.some(recipe => recipe.category == 'Antipasti')
    )
    setPrimiFilter(
      filteredCourse.some(recipe => recipe.category == 'Primi e secondi')
    )
    setDolciFilter(filteredCourse.some(recipe => recipe.category == 'Dolci'))
    setEstrattiFilter(
      filteredCourse.some(recipe => recipe.category == 'Estratti')
    )
  }
  const hideFiltersCourses = (filteredCategory: any[]) => {
    setMicroondeFilter(
      categoryFilter.length == 0 ||
        filteredCategory.some(recipe => recipe.type == 'MICROONDE')
    )
    setFornoFilter(
      categoryFilter.length == 0 ||
        filteredCategory.some(recipe => recipe.type == 'FORNO')
    )
    setJuicerFilter(
      categoryFilter.length == 0 ||
        filteredCategory.some(recipe => recipe.type == 'SLOW JUICER')
    )
  }

  return (
    <>
    <Helmet>
      <title> Ricette | Hotpoint Italia </title>
      <meta name="description" content="Ricette" />
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
            estrattiFilter={estrattiFilter}
            microondeFilter={microondeFilter}
            fornoFilter={fornoFilter}
            juicerFilter={juicerFilter}
          ></Filters>
          <div className={styles.recipeNumber}>
            <span className={styles.recipeNumberText}>
              {recipes.length} Ricette
            </span>
          </div>
          <div className={styles.container}>
            <Recipe recipes={currentRecipes} />
            {recipes.length != 0 ? (
              <>
                <Pagination
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
                    di {recipes.length}
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
