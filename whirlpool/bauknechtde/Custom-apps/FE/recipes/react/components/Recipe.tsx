import React from 'react'
import styles from '../styles.css'
import { Link } from 'vtex.render-runtime'

interface RecipeProps {
  recipes: any
}

const Recipe: StorefrontFunctionComponent<RecipeProps> = ({ recipes }) => {
  return recipes.map((recipe: any) => (
    <Link
	    to={`/rezepte/details/${recipe.nameNormalized}`}
      page={'store.custom#single-recipe'}
      params={{ slug: recipe.nameNormalized }}
      className={styles.recipeCard}
    >
      <div>
        <div className={styles.recipeImageContainer}>
          <picture>
            <source media="(max-width:640px)" srcSet={recipe.imageMobile} />
            <source media="(min-width:641px)" srcSet={recipe.imageDesktop} />
            <img
              src={recipe.image}
              alt={recipe.name}
              className={styles.recipeImage}
            />
          </picture>
          <div className={styles.recipeContent}>
            <div className={styles.recipeContentContainer}>
              <span className={styles.recipeContentType}>{recipe.type}</span>
              <span className={styles.recipeContentName}>{recipe.name}</span>
              <p className={styles.recipeContentTime}>
                {recipe.level} -{' '}
                <span>{recipe.preparationtime.replace(':', '')}</span>{' '}
              </p>

              <span className={styles.recipeContentDescription}>
                {recipe.description}
              </span>
            </div>
            <Link
              to={`/rezepte/details/${recipe.nameNormalized}`}
              className={styles.buttonLink}
              page={'store.custom#single-recipe'}
              params={{ slug: recipe.nameNormalized }}
            >
              <span className={styles.buttonLinkText}>
                Mehr erfahren <span className={styles.buttonArrow}>&gt;</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  ))
}

export default Recipe
