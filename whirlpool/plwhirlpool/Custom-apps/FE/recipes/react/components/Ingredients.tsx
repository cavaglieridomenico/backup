import React from 'react'
import styles from '../styles.css'
import { useIntl, defineMessages } from 'react-intl'

interface IngredientsProps {
  singleRecipe: any
  imageListCheck: any
  brand: string
}

const messages = defineMessages({
  title: { id: 'recipes.single.ingredients' },
})

const Ingredients: StorefrontFunctionComponent<IngredientsProps> = ({
  singleRecipe,
  imageListCheck,
  brand,
}) => {
  const intl = useIntl()

  return (
    <>
      <div
        className={`${styles.sectionContainer} ${brand === 'whirlpool' &&
          styles.sectionContainerCompact}`}
      >
        <span
          className={`${styles.ingredientsTitle} ${brand === 'whirlpool' &&
            styles.ingredientsTitleCompact}`}
        >
          {intl.formatMessage(messages.title)}
        </span>
        <div className={styles.ingredientsDiv}>
          <div className={styles.ingredientsSpecs}>
            {brand === 'hotpoint' && (
              <span className={styles.ingredientsSpecsTitle}>
                {singleRecipe.peoples}
              </span>
            )}
            <div className={styles.ingredientsListDiv}>
              <ul
                className={`${styles.ingredientsListUl} ${brand ===
                  'whirlpool' && styles.ingredientsListUlCompact}`}
              >
                {singleRecipe?.ingredients?.map(ingredient => (
                  <li
                    className={`${styles.ingredientsListLi} ${brand ===
                      'whirlpool' && styles.ingredientsListLiCompact}`}
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {brand === 'hotpoint' && (
            <div className={styles.ingredientsImageDiv}>
              <div
                className={styles.ingredientsImageBG}
                style={{
                  backgroundImage: imageListCheck(singleRecipe)
                    ? `url(${singleRecipe.imageMobile})`
                    : `url(${singleRecipe?.images[0]})`,
                }}
              ></div>
              <img
                src={
                  imageListCheck(singleRecipe)
                    ? singleRecipe.imageMobile
                    : singleRecipe.images[0]
                }
                alt="immagine ingredienti"
                className={styles.ingredientsImage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Ingredients
