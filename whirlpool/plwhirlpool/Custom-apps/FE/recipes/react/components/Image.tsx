import React from 'react'
import styles from '../styles.css'

interface ImageProps {
  singleRecipe: any
}

const Image: StorefrontFunctionComponent<ImageProps> = ({ singleRecipe }) => {
  return (
    <div className={styles.recipeSingleImage}>
      <img
        src={singleRecipe?.images[0]}
        alt={singleRecipe.name}
        className={styles.imageCard}
      />
    </div>
  )
}

export default Image
