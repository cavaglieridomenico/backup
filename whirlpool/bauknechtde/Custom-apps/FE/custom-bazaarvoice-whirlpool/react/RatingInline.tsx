import React, { FC } from 'react'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { useQuery } from 'react-apollo'

import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import Stars from './components/Stars'
import styles from './styles.css'

const RatingInline: FC = () => {
  const { product } = useProductSummary()

  const { data, loading, error } = useQuery(queryRatingSummary, {
    skip: !product,
    ssr: false,
    variables: {
      sort: 'SubmissionTime:desc',
      offset: 0,
      pageId: JSON.stringify({
        linkText: product?.linkText,
        productId: product?.productId,
        productReference: product?.productReference,
      }),
    },
  })

  if (error) {
    console.log(error)
  }
  const average =
    !loading && !error && data && data.productReviews.Includes.Products[0]
      ? data?.productReviews?.Includes?.Products?.[0]?.ReviewStatistics?.AverageOverallRating?.toFixed(
          1
        )
      : null

  const total =
    !loading && !error && data && data.productReviews.Includes.Products[0]
      ? data?.productReviews?.TotalResults
      : null

  const IncentivizedReviewCount =
    data?.productReviews?.Includes?.Products[0]?.ReviewStatistics
      ?.IncentivizedReviewCount

  return average !== null ? (
    <>
      <div
        className={styles.containerInline + ' review__rating mw8 center ph5'}
      >
        <Stars rating={average || 0} />
        <span className="review__rating--average dib v-mid c-muted-1">
          {average} ({total})
        </span>
      </div>
      <div className={styles.ratingSummaryLegalTextContainer}>
        {IncentivizedReviewCount > 0 && (
          <span className={styles.legalTextIncentivizedSummary}>
            {IncentivizedReviewCount} von {total} Bewertern erhielten das
            Produkt kostenlos zum Testen oder als Teil einer Werbeaktion
          </span>
        )}
      </div>
    </>
  ) : (
    <React.Fragment></React.Fragment>
  )
}

export default RatingInline
