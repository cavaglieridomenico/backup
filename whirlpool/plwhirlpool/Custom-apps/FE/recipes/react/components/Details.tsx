import React from 'react'
import styles from '../styles.css'
import Clock from './Clock'
import Machinary from './Machinary'
import Arrows from './Arrows'

interface DetailsProps {
  singleRecipe: any
  brand: string
}

const Details: StorefrontFunctionComponent<DetailsProps> = ({
  singleRecipe,
  brand,
}) => {
  return (
    <>
      <div
        className={`${styles.carouselTopTextDiv} ${brand === 'whirlpool' &&
          styles.carouselTopTextCenter}`}
      >
        <div
          className={`${styles.carouselTopTextContainer} ${brand ===
            'whirlpool' && styles.carouselTopTextContainerCenter}`}
        >
          {brand === 'hotpoint' && (
            <h1 className={styles.carouselTopTextName}>{singleRecipe.name}</h1>
          )}
          {brand === 'hotpoint' && (
            <span className={styles.carouselTopTextDesc}>
              {singleRecipe?.description}
            </span>
          )}
          <span className={styles.carouselTopTextSubDesc}>
            {singleRecipe?.subdescription}
          </span>
          {brand === 'hotpoint' && (
            <>
              <Clock singleRecipe={singleRecipe} brand={brand} />
              <Machinary singleRecipe={singleRecipe} brand={brand} />
              <Arrows singleRecipe={singleRecipe} brand={brand} />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Details
