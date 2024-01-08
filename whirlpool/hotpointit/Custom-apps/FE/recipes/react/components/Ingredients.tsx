import React from 'react'
import styles from '../styles.css'

interface IngredientsProps {
  singleRecipe: any
  imageListCheck: any
}

const Ingredients: StorefrontFunctionComponent<IngredientsProps> = ({
  singleRecipe,
  imageListCheck,
}) => {
  return (
    <>
      <div className={styles.sectionContainer}>
        <span className={styles.ingredientsTitle}>Ingredienti</span>
        <div className={styles.ingredientsDiv}>
          <div className={styles.ingredientsSpecs}>
            <span className={styles.ingredientsSpecsTitle}>
              {singleRecipe.peoples}
            </span>
            <div className={styles.ingredientsListDiv}>
              <ul className={styles.ingredientsListUl}>
                {singleRecipe?.ingredients?.list?.map(ingredient => (
                  <li className={styles.ingredientsListLi}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.ingredientsImageDiv}>
            <div
              className={styles.ingredientsImageBG}
              style={{
                backgroundImage: imageListCheck(singleRecipe)
                  ? `url(${singleRecipe.mainimageMobile})`
                  : `url(${singleRecipe?.imageList[0]})`,
              }}
            ></div>
            <img
              src={
                imageListCheck(singleRecipe)
                  ? singleRecipe.mainimageMobile
                  : singleRecipe.imageList[0]
              }
              alt="immagine ingredienti"
              className={styles.ingredientsImage}
            />
          </div>
        </div>
      </div>
      {/* PREPARAZIONE SECTION*/}
      <div className={styles.sectionContainer}>
        <span className={styles.ingredientsTitle}>Preparazione</span>
        <div className={styles.ingredientsDivPreparation}>
          <div className={styles.ingredientsImageDiv}>
            <div
              className={styles.ingredientsImageBG}
              style={{
                backgroundImage: imageListCheck(singleRecipe)
                  ? `url(${singleRecipe.mainimageMobile})`
                  : `url(${singleRecipe?.imageList[0]})`,
              }}
            ></div>
            <img
              src={
                imageListCheck(singleRecipe)
                  ? singleRecipe.mainimageMobile
                  : singleRecipe.imageList[0]
              }
              alt="immagine preparazione"
              className={styles.ingredientsImage}
            />
          </div>
          <div className={styles.preparationSpecs}>
            <div className={styles.ingredientsListDiv}>
              <ul className={styles.preparationListUl}>
                {singleRecipe?.steps?.list?.map((ingredient, index) => (
                  <div className={styles.preparationListDiv}>
                    <span className={styles.preparationListSpan}>
                      Passo {index + 1}
                      <li className={styles.preparationListLi}>{ingredient}</li>
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

export default Ingredients
