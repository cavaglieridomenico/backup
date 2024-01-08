import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import styles from '../styles.css'
import Stars from './Stars'

interface LegalTextProps {
  totalReviews: number
  IncentivizedReviewCount: number
  fixedAverage: any
}

const LegalText: React.FC<LegalTextProps> = ({
  totalReviews,
  IncentivizedReviewCount,
  fixedAverage,
}) => {
  const intl = useIntl()
  return (
    <div className={styles.legalTextContainer}>
      <div className={styles.reviewsLegalTextContainer}>
        <div className={`review__rating pb4 ${styles.reviewRatingLegalText}`}>
          <Stars rating={fixedAverage} />
          <span className="review__rating--average dib v-mid c-muted-1">
            ({fixedAverage})
          </span>
        </div>
        <div className={styles.reviewsLegalTextTotalReviewsContainer}>
          <span className={styles.reviewsLegalTextTotalReviewsText}>
            {totalReviews} &nbsp;
            <FormattedMessage
              id="store/bazaar-voice.total-reviews"
              defaultMessage="Bewertungen"
            />
          </span>
        </div>
      </div>
      {IncentivizedReviewCount > 0 && (
        <span className={styles.legalTextIncentivizedText}>
          {IncentivizedReviewCount}
          {intl.formatMessage({
            id: 'store/bazaar-voice.reviews-tooltip.preposition',
          })}
          {totalReviews}
          {intl.formatMessage({
            id: 'store/bazaar-voice.reviews-tooltip.legalText',
          })}
        </span>
      )}
    </div>
  )
}

export default LegalText
