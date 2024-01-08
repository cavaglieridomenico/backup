import React from 'react'
import styles from '../styles.css'

interface BannerProps {
  singleRecipe: any
  brand: string
}

const Banner: StorefrontFunctionComponent<BannerProps> = ({
  singleRecipe,
  brand,
}) => {
  return (
    <div className={styles.bannerImage}>
      <picture>
        <source media="(max-width:640px)" srcSet={singleRecipe.imageMobile} />
        <source media="(min-width:641px)" srcSet={singleRecipe.imageDesktop} />
        <img
          src={singleRecipe.imageDesktop}
          alt={singleRecipe.name}
          className={styles.imageCard}
        />
      </picture>
      {brand === 'whirlpool' && (
        <span className={styles.bannerTitle}>{singleRecipe.name}</span>
      )}
    </div>
  )
}

export default Banner
