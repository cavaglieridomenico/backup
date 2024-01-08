import React from 'react'
import styles from '../styles.css'
import { useIntl, defineMessages } from 'react-intl'
interface ClockProps {
  singleRecipe: any
  brand: string
}

const messages = defineMessages({
  cookTime: { id: 'recipes.single.cookTime' },
  cookTimeSupreme: { id: 'recipes.single.cookTimeSupreme' },
  cookTimeChef: { id: 'recipes.single.cookTimeChef' },
})

const Clock: StorefrontFunctionComponent<ClockProps> = ({
  singleRecipe,
  brand,
}) => {
  const intl = useIntl()
  return (
    <>
      <span
        className={`${styles.carouselTopTextTime} ${
          brand === 'whirlpool' ? styles.carouselIconTopCompact : ''
        }`}
      >
        <svg
          className={styles.clockSvg}
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox={brand === 'hotpoint' ? '0 0 24 24' : '0 0 66 66'}
          width="24px"
          fill="#197c83"
        >
          {brand === 'whirlpool' ? (
            <>
              <path d="M33 0C14.77 0 0 14.77 0 33s14.77 33 33 33 33-14.77 33-33S51.23 0 33 0zm0 64.7C15.52 64.7 1.3 50.48 1.3 33S15.52 1.3 33 1.3 64.7 15.52 64.7 33 50.48 64.7 33 64.7z"></path>
              <path d="M33.65 32.35V9.82h-1.3v23.83h23.42v-1.3z"></path>
            </>
          ) : (
            <>
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </>
          )}
        </svg>
        {brand === 'hotpoint' ? (
          <span>
            {intl.formatMessage(messages.cookTime)}:{singleRecipe.cookTime} min
          </span>
        ) : (
          <div className={styles.carouselTopTextTimeCompact}>
            <span className={styles.carouselTopTextTimeName}>
              {intl.formatMessage(messages.cookTime)}:
            </span>
            <span className={styles.carouselTopTextTimeUnit}>
              {singleRecipe.cookTime} min
            </span>
            {singleRecipe.supremeChefTime && (
              <>
                <span className={styles.carouselTopTextTimeName}>
                  {intl.formatMessage(messages.cookTimeSupreme)}:
                </span>
                <span className={styles.carouselTopTextTimeUnit}>
                  {singleRecipe.supremeChefTime} min
                </span>
              </>
            )}
            {singleRecipe.chefplusTime && (
              <>
                <span className={styles.carouselTopTextTimeName}>
                  {intl.formatMessage(messages.cookTimeChef)}:
                </span>
                <span className={styles.carouselTopTextTimeUnit}>
                  {singleRecipe.chefplusTime} min
                </span>
              </>
            )}
          </div>
        )}
      </span>
    </>
  )
}

export default Clock
