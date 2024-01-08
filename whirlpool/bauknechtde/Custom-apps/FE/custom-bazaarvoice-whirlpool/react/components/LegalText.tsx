import React from 'react'
import { FormattedMessage } from 'react-intl'
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
            defaultMessage='Bewertungen'
            />
          </span>
        </div>
      </div>
      {IncentivizedReviewCount > 0 && (
        <span className={styles.legalTextIncentivizedText}>
          {IncentivizedReviewCount} von {totalReviews} Bewertern erhielten das
          Produkt kostenlos zum Testen oder als Teil einer Werbeaktion
        </span>
      )}
    </div>
  )
}

export default LegalText
