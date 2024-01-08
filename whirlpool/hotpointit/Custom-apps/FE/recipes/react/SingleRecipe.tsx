import React, { useEffect, useState } from 'react'
import styles from './styles.css'
import Slider from './components/Slider'
import Ingredients from './components/Ingredients'
import Related from './components/Related'
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import { useRuntime } from 'vtex.render-runtime';
export interface SingleRecipeProps {
  params: any
}

const mapping = require("./utils/singleRecipeMapping.json")

const SingleRecipe = (props: SingleRecipeProps) => {
  const slug = props.params.slug
  const [singleRecipe, setSingleRecipe]: any = useState({})
  const [loading, setLoading]: any = useState(false)
  const [description, setDecription]: any = useState()

  const runtime = useRuntime()
  const recipeName = runtime.route.path.split("/")[3].split("?")[0]
  const idForfetch = mapping.filter(recipe => recipe.name.toLowerCase().replace(/ /g, "-").replace(/,/g,"") == recipeName)[0].id
  const title = (mapping.filter(recipe => recipe.id == idForfetch)[0].name).charAt(0) + (mapping.filter(recipe => recipe.id == idForfetch)[0].name).toLowerCase().slice(1) //Da rifare (non da cani come questo)





  const imageListCheck = singleRecipe => {
    return (
      singleRecipe.imageList == undefined || singleRecipe.imageList.length <= 0
    )
  }

  useEffect(() => {
    setLoading(true)
    fetch(`/_v/wrapper/api/recipes/receipeDetail?recipeId=${idForfetch}`, {
      headers: {
        method: 'GET',
        accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        {
          setSingleRecipe(res), setLoading(false), setDecription(res.description)
        }
      })
  }, [slug])


  return (
    <>
    <Helmet>
    <title> {title ? `${title} | Hotpoint Italia`: null } </title>
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
            <a href="/ricette" className={styles.breadLink}>
              Ricette
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
              className={styles.mainImage}
            />
          </picture>
          <div className={styles.sectionsContainer}>
            <Slider
              imageListCheck={imageListCheck}
              singleRecipe={singleRecipe}
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
      ) : (
        <div className={styles.loaderForm}>Loading</div>
      )}
    </>
  )
}

SingleRecipe.schema = {
  title: 'editor.singleRecipe.title',
  description: 'editor.singleRecipe.description',
  type: 'object',
  properties: {},
}

export default SingleRecipe
