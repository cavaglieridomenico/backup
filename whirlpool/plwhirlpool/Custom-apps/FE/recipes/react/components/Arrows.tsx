import React from 'react'
import styles from '../styles.css'
import { useIntl, defineMessages } from 'react-intl'
interface ClockProps {
  singleRecipe: any
  brand: string
}

const messages = defineMessages({
  title: { id: 'recipes.single.level' },
})

const Clock: StorefrontFunctionComponent<ClockProps> = ({ singleRecipe }) => {
  const intl = useIntl()
  return (
    <>
      <span className={styles.carouselTopTextLevel}>
        <svg
          className={styles.clockSvg}
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#197c83"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />
        </svg>
        <span>
          {intl.formatMessage(messages.title)}: {singleRecipe.level}
        </span>
      </span>
    </>
  )
}

export default Clock