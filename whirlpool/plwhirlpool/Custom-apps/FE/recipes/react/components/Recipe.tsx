import React from 'react'
import styles from '../styles.css'
import { Link } from 'vtex.render-runtime'
import Facebook from './Facebook'
import Twitter from './Twitter'

interface RecipeProps {
  recipe: any
  brand: string
  width?: string
}

const Recipe: StorefrontFunctionComponent<RecipeProps> = ({
  brand,
  recipe,
  width,
}) => {
  return (
    <>
      {brand === 'hotpoint' ? (
        <div
          className={styles.recipeCard}
          style={{ width, margin: width ? 0 : '' }}
        >
          <Link
            page={'store.custom#recipe'}
            params={{
              slug: recipe.id,
              name: recipe.name,
            }}
          >
            <div className={styles.recipeImageContainer}>
              <picture>
                <source media="(max-width:640px)" srcSet={recipe.imageMobile} />
                <source
                  media="(min-width:641px)"
                  srcSet={recipe.imageDesktop}
                />
                <img
                  src={recipe.imageCard}
                  alt={recipe.name}
                  className={styles.recipeImage}
                />
              </picture>
              <div className={styles.recipeContent}>
                <div className={styles.recipeContentContainer}>
                  <span className={styles.recipeContentType}>
                    {recipe.type}
                  </span>
                  <span className={styles.recipeContentName}>
                    {recipe.name}
                  </span>
                  <p className={styles.recipeContentTime}>
                    {recipe.level} - <span>{recipe.preparationtime}</span>{' '}
                  </p>
                  <span className={styles.recipeContentDescription}>
                    {recipe.description}
                  </span>
                </div>
                <Link
                  className={styles.buttonLink}
                  page={'store.custom#recipe'}
                  params={{
                    slug: recipe.name.toLowerCase().replace(/ /g, '-'),
                    name: recipe.name,
                  }}
                >
                  <span className={styles.buttonLinkText}>
                    Per saperne di più{' '}
                    <span className={styles.buttonArrow}>&gt;</span>
                  </span>
                </Link>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div
          className={styles.recipeItemWrapper}
          style={{ width, margin: width ? 0 : '' }}
        >
          <Link
            page={'store.custom#recipe'}
            params={{
              slug: recipe.id,
              name: recipe.name,
            }}
          >
            <picture>
              <source media="(max-width:640px)" srcSet={recipe.imageMobile} />
              <source media="(min-width:641px)" srcSet={recipe.imageDesktop} />
              <img
                src={recipe.image}
                alt={recipe.name}
                className={styles.recipeImageCard}
              />
            </picture>
          </Link>
          <div className={styles.recipeItemInfo}>
            <Link className={styles.recipeItemTitle}>{recipe.name}</Link>
            <div className={styles.recipeSocial}>
              <Facebook size={35} link={''} />
              <Twitter size={35} link={''} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Recipe
