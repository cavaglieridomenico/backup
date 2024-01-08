import React, { useEffect, useState } from 'react'
import styles from './styles.css'
import Slider from './components/Slider'
import Ingredients from './components/Ingredients'
import Related from './components/Related'
import { Helmet } from 'vtex.render-runtime/react/components/RenderContext'
import { useRuntime } from 'vtex.render-runtime'
//import { useRuntime } from 'vtex.render-runtime'

//let n = require('normalize-strings')

export interface SingleRecipeProps {
  params: any
  h1title?: any
  description?: any
  subdescription?: any
  recipeBlockClass?: any
}

//const mapping = require('./utils/singleRecipeMapping2Normal.json')

const SingleRecipe = (props: SingleRecipeProps) => {
  const { getSettings } = useRuntime()
  const settings = getSettings('vtex.store')
  const slug = props.params.slug
  const [singleRecipe, setSingleRecipe]: any = useState({})
  const [loading, setLoading]: any = useState(false)
  const [description, setDecription]: any = useState()

  const normalizedNameByUrl = window?.location?.pathname?.split('/')[3]
  const idForFetch = slug || normalizedNameByUrl

  /* const title =
		mapping.filter((recipe) => recipe.id == idForfetch)[0].name.charAt(0) +
		mapping
			.filter((recipe) => recipe.id == idForfetch)[0]
			.name.toLowerCase()
			.slice(1) //Da rifare (non da cani come questo)
			replace(/\s/g, '-')*/

  const title = idForFetch?.replace(/-/g, ' ')
  const titleCapitalized = title?.charAt(0).toUpperCase() + title?.slice(1)

  const imageListCheck = singleRecipe => {
    return (
      singleRecipe.imageList == undefined || singleRecipe.imageList.length <= 0
    )
  }

  useEffect(() => {
    setLoading(true)
    fetch(
      `/_v/wrapper/api/recipes/receipeDetail?recipeNameNormalized=${idForFetch}`,

      {
        headers: {
          method: 'GET',
          accept: 'application/json',
        },
      }
    )
      .then(response =>
        response.ok ? response.json() : Promise.resolve(undefined)
      )
      .then(res => {
        if (res != undefined) {
          if (props?.h1title && props?.h1title?.length > 1) {
            res.name = props.h1title
          }
          setSingleRecipe(res), setDecription(res.description)
        }
        setLoading(false)
      })
  }, [slug])

  return (
    <>
      <Helmet>
        <title>
          {titleCapitalized
            ? `${titleCapitalized} - ${settings.storeName}`
            : null}
        </title>
        <meta name="description" content={description ? description : ''} />
      </Helmet>
      {!loading && Object.keys(singleRecipe).length > 0 ? (
        <>
          <div className={styles.breadcrumbContainer}>
            <a href="/" className={styles.breadLink}>
              Home
            </a>
            <img
              src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
              alt=""
            />
            <a href="/rezepte" className={styles.breadLink}>
              Rezepte
            </a>
            <img
              src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
              alt=""
            />
            <span className={styles.breadLinkBold}>{singleRecipe.name}</span>
          </div>
          <picture>
            <source
              media="(max-width:640px)"
              srcSet={singleRecipe.mainimageMobile}
            />
            <source
              media="(min-width:641px)"
              srcSet={singleRecipe.mainimageDesktop}
            />
            <img
              src={singleRecipe.mainimageDesktop}
              alt={singleRecipe.name}
              className={`${styles.mainImage} ${styles[
                props?.recipeBlockClass
              ] ?? ''}`}
            />
          </picture>
          <div className={styles.sectionsContainer}>
            <Slider
              imageListCheck={imageListCheck}
              singleRecipe={singleRecipe}
              description={props.description}
              subdescription={props.subdescription}
            ></Slider>
            <Ingredients
              singleRecipe={singleRecipe}
              imageListCheck={imageListCheck}
            ></Ingredients>
          </div>
          {singleRecipe?.relatedItems?.length != 0 ? (
            <Related singleRecipe={singleRecipe}></Related>
          ) : null}
        </>
      ) : loading ? (
        <div className={styles.loaderFormContainer}>
          <div className={styles.loaderForm}></div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

SingleRecipe.schema = {
  title: 'SingleRecipe',
  description: 'SingleRecipe title and description',
  type: 'object',
  properties: {
    h1title: {
      type: 'string',
      default: '',
    },
    description: {
      type: 'string',
      default: '',
    },
    subdescription: {
      type: 'string',
      default: '',
    },
    recipeBlockClass: {
      type: 'string',
      default: '',
    },
  },
}

export default SingleRecipe
