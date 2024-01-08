import React from 'react'
import styles from '../styles.css'
import { useIntl, defineMessages } from 'react-intl'

interface ClockProps {
  singleRecipe: any
  brand: string
}

const messages = defineMessages({
  title: { id: 'recipes.single.preparation' },
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
              <path d="M52.3 19.1c-3.3-3.3-8.7-3.3-12.1 0L36.3 23v-6.5C36.3 7.5 29 .2 20 .2S3.6 7.5 3.6 16.5v35c0 1.2.9 2.2 2.1 2.4V56h1v-2.1h26.6V56h1v-2.1c1.1-.2 2-1.2 2-2.3v-4.3l16-16c1.6-1.6 2.5-3.8 2.5-6s-.9-4.5-2.5-6.2zm-.7 11.4L35.3 46.8v4.8c0 .8-.6 1.4-1.4 1.4H6c-.8 0-1.4-.6-1.4-1.4v-35C4.6 8.1 11.5 1.2 20 1.2s15.3 6.9 15.3 15.3v9l5.6-5.6c1.4-1.4 3.3-2.2 5.3-2.2s3.9.8 5.3 2.2c1.4 1.4 2.2 3.3 2.2 5.3.1 2-.7 3.9-2.1 5.3z"></path>
            </>
          ) : (
            <>
              <g>
                <path d="M0,0h24v24H0V0z" fill="none" />
              </g>
              <g>
                <g>
                  <path d="M16.13,15.13L18,3h-4V2h-4v1H5C3.9,3,3,3.9,3,5v4c0,1.1,0.9,2,2,2h2.23l0.64,4.13C6.74,16.05,6,17.43,6,19v1 c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2v-1C18,17.43,17.26,16.05,16.13,15.13z M5,9V5h1.31l0.62,4H5z M15.67,5l-1.38,9H9.72L8.33,5 H15.67z M16,20H8v-1c0-1.65,1.35-3,3-3h2c1.65,0,3,1.35,3,3V20z" />
                  <circle cx="12" cy="18" r="1" />
                </g>
              </g>
            </>
          )}
        </svg>
        {brand === 'hotpoint' ? (
          <span>
            {intl.formatMessage(messages.title)}:{singleRecipe.preparationTime}{' '}
            min
          </span>
        ) : (
          <div className={styles.carouselTopTextTimeCompact}>
            <span className={styles.carouselTopTextTimeName}>
              {intl.formatMessage(messages.title)}:
            </span>
            <span className={styles.carouselTopTextTimeUnit}>
              {singleRecipe.preparationTime} min
            </span>
          </div>
        )}
      </span>
    </>
  )
}

export default Clock
