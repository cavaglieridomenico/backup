import React from 'react'
import styles from './styles.css'
import Slider from './components/Slider'
import Ingredients from './components/Ingredients'
import IconsBar from './components/IconsBar'
import Related from './components/Related'
import Banner from './components/Banner'
import Details from './components/Details'
import { Helmet } from 'vtex.render-runtime/react/components/RenderContext'
// import { useRuntime } from 'vtex.render-runtime';
import Preparations from './components/Preparations'
import { useQuery } from 'react-apollo'
import RECIPE_QUERY from '../graphql/recipe.gql'
import Breadcumb from './components/Breadcumb'

export interface SingleRecipeProps {
  params: any
  brand: string
}

// const mapping = require("./utils/singleRecipeMapping.json")

const SingleRecipe = (props: SingleRecipeProps) => {
  const {
    params: { slug },
    brand,
  } = props

  const { useEffect } = React

  const { loading, error, data } = useQuery(RECIPE_QUERY, {
    variables: {
      query: {
        pageNumber: 1,
        pageSize: 1,
        facets: [{ name: 'id', values: [slug] }],
      },
    },
  })

  useEffect(() => {
    console.log(data, loading, error)
  }, [data, loading, error])

  const imageListCheck = singleRecipe => {
    return singleRecipe.images == undefined || singleRecipe.images.length === 0
  }

  return (
    <>
      <Helmet>
        <title>
          {' '}
          {`${!loading ? data?.queryRecipes?.recipes[0]?.name || '' : ''} | ${
            brand === 'hotpoint' ? 'Hotpoint' : 'Whirlpool'
          } Italia`}{' '}
        </title>
        <meta
          name="description"
          content={data?.queryRecipes?.recipes[0]?.description || ''}
        />
      </Helmet>
      {!loading && data?.queryRecipes?.recipes[0] && !error ? (
        <>
          <Breadcumb
            recipeName={data?.queryRecipes?.recipes[0]?.name}
            brand={brand}
          />
          <Banner brand={brand} singleRecipe={data?.queryRecipes?.recipes[0]} />
          <div
            className={`${styles.sectionsContainer} ${brand === 'whirlpool' &&
              styles.sectionContainerMainCompact}`}
          >
            {brand === 'whirlpool' && (
              <IconsBar
                singleRecipe={data?.queryRecipes?.recipes[0]}
                brand={brand}
              />
            )}
            {brand === 'whirlpool' && (
              <>
                <Details
                  singleRecipe={data?.queryRecipes?.recipes[0]}
                  brand={brand}
                />
                <div className={styles.sectionsGridCompact}>
                  {typeof window !== 'undefined' && (
                    <Slider
                      imageListCheck={imageListCheck}
                      singleRecipe={data?.queryRecipes?.recipes[0]}
                      brand={brand}
                    ></Slider>
                  )}
                  <div className={styles.sectionsColCompact}>
                    <Ingredients
                      singleRecipe={data?.queryRecipes?.recipes[0]}
                      imageListCheck={imageListCheck}
                      brand={brand}
                    ></Ingredients>
                    <Preparations
                      singleRecipe={data?.queryRecipes?.recipes[0]}
                      imageListCheck={imageListCheck}
                      brand={brand}
                    ></Preparations>
                  </div>
                </div>
              </>
            )}
            {brand === 'hotpoint' && (
              <>
                {typeof window !== 'undefined' && (
                  <Slider
                    imageListCheck={imageListCheck}
                    singleRecipe={data?.queryRecipes?.recipes[0]}
                    brand={brand}
                  ></Slider>
                )}
                <Ingredients
                  singleRecipe={data?.queryRecipes?.recipes[0]}
                  imageListCheck={imageListCheck}
                  brand={brand}
                ></Ingredients>
                <Preparations
                  singleRecipe={data?.queryRecipes?.recipes[0]}
                  imageListCheck={imageListCheck}
                  brand={brand}
                ></Preparations>
              </>
            )}
          </div>
          {data?.queryRecipes?.recipes[0]?.relatedRecipes?.length != 0 &&
          typeof window !== 'undefined' ? (
            <Related
              ids={data?.queryRecipes?.recipes[0]?.relatedRecipes}
              brand={brand}
            ></Related>
          ) : null}
        </>
      ) : (
        <div
          className={`${styles.loaderForm} ${brand === 'whirlpool' &&
            styles.loaderFormCompact}`}
        ></div>
      )}
    </>
  )
}

SingleRecipe.schema = {
  title: 'Recipes SingleRecipe',
  description: 'Single Recipe',
  type: 'object',
  properties: {
    brand: {
      title: 'Brand',
      description: '',
      type: 'string',
      enum: ['hotpoint', 'whirlpool'],
      enumNames: ['Hotpoint', 'Whirlpool'],
      default: 'whirlpool',
    },
  },
}

export default SingleRecipe
