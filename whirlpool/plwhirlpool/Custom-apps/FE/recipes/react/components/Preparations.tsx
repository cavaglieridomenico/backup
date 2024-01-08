import React from 'react'
import styles from '../styles.css'
import { useIntl, defineMessages } from 'react-intl'

interface PreparationsProps {
  singleRecipe: any
  imageListCheck: any
  brand: string
}

const messages = defineMessages({
  title: { id: 'recipes.single.preparation' },
  phase: { id: 'recipes.single.preparationPhase' },
})

const Preparations: StorefrontFunctionComponent<PreparationsProps> = ({
  singleRecipe,
  imageListCheck,
  brand,
}) => {
  const intl = useIntl()
  return (
    <>
      <div
        className={`${styles.sectionContainer} ${brand === 'whirlpool' &&
          styles.sectionContainerPreparationCompact}`}
      >
        <span
          className={`${styles.ingredientsTitle} ${brand === 'whirlpool' &&
            styles.ingredientsTitleCompact}`}
        >
          {intl.formatMessage(messages.title)}
        </span>
        <div className={styles.ingredientsDivPreparation}>
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
                alt="immagine preparazione"
                className={styles.ingredientsImage}
              />
            </div>
          )}
          <div
            className={`${styles.preparationSpecs} ${brand === 'whirlpool' &&
              styles.preparationSpecsCompact}`}
          >
            <div className={styles.ingredientsListDiv}>
              <ul
                className={`${styles.preparationListUl} ${brand ===
                  'whirlpool' && styles.preparationListUlCompact}`}
              >
                {singleRecipe?.steps?.map((ingredient, index) => (
                  <div className={styles.preparationListDiv}>
                    <span className={styles.preparationListSpan}>
                      <span className={styles.preparationListSpanIndicator}>
                        {brand === 'hotpoint' && (
                          <>
                            {intl.formatMessage(messages.phase)} {index + 1}
                          </>
                        )}
                        {brand === 'whirlpool' && <>{index + 1}.</>}
                      </span>
                      <li className={styles.preparationListLi}>
                        {' '}
                        {ingredient}
                      </li>
                    </span>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Preparations
