import React, { FC } from 'react'
import { useIntl } from 'react-intl'

import styles from '../styles.css'
import Histogram from './Histogram'
import { useCssHandles } from 'vtex.css-handles'

interface ReviewsTooltipProps {
  buttonLink: string
  blockClass: string
  percentages: any[]
  histogram: any[]
  totalReviews: number
}

const CSS_HANDLES = ['reviewsTooltip']

const ReviewsTooltip: FC<ReviewsTooltipProps> = ({
  buttonLink = '',
  blockClass = '',
  percentages = [],
  histogram = [],
  totalReviews,
}) => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES, blockClass)

  return totalReviews !== null && histogram.length !== 0 ? (
    <div className={handles.reviewsTooltip}>
      <Histogram
        percentages={percentages}
        histogram={histogram}
        secondaryRatingsAverage={[]}
      />
      <div className={styles.reviewsTooltipButtonContainer}>
        <a className={styles.reviewsTooltipButton} href={buttonLink}>
          <p className={styles.reviewsTooltipButtonText}>
            {totalReviews}{' '}
            {intl.formatMessage({
              id: 'store/bazaar-voice.reviews-tooltip.ButtonText',
            })}
          </p>
        </a>
      </div>
    </div>
  ) : (
    <React.Fragment></React.Fragment>
  )
}

export default ReviewsTooltip
