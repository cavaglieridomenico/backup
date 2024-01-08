import React from 'react'
import styles from '../styles.css'
import { useIntl, defineMessages } from 'react-intl'
import { Link } from 'vtex.render-runtime'

interface BannerProps {
  recipeName?: string
  brand: string
}

const messages = defineMessages({
  home: { id: 'recipes.breadcumb.home' },
  recipes: { id: 'recipes.breadcumb.recipes' },
})

const Breadcumb: StorefrontFunctionComponent<BannerProps> = ({
  recipeName,
  brand,
}) => {
  const intl = useIntl()
  return (
    <div className={styles.breadcrumbContainer}>
      <a
        href="/"
        className={`${styles.breadLink} ${brand === 'whirlpool' &&
          styles.breadLinkCompact}`}
      >
        {intl.formatMessage(messages.home)}
      </a>
      <img
        src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
        alt=""
      />
      <Link
        page={'store.custom#recipes'}
        className={`${styles.breadLink} ${brand === 'whirlpool' &&
          styles.breadLinkCompact}`}
      >
        {intl.formatMessage(messages.recipes)}
      </Link>
      {recipeName && (
        <>
          <img
            src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
            alt=""
          />
          <span className={styles.breadLinkBold}>{recipeName}</span>
        </>
      )}
    </div>
  )
}

export default Breadcumb
