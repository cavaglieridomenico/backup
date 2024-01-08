import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import useProduct from 'vtex.product-context/useProduct'
import { useQuery } from 'react-apollo'

import Stars from './components/Stars'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import styles from './styles.css'
import AggregateStructuredData from './components/AggregateStructuredData'
import ReviewsTooltip from './components/ReviewsTooltip'
import { useDevice } from 'vtex.device-detector'

const RatingSummary = () => {
  const { product } = useProduct()
  const intl = useIntl()

  /* TOOLTIP HOVER MANAGEMENT */
  const [isHovered, setHovered] = useState(false)
  const [isClicked, setClicked] = useState(false)
  const { isMobile } = useDevice()
  const handleMouseOver = () => {
    setHovered(true)
  }
  const handleMouseDown = () => {
    setHovered(false)
  }
  const handleOnClick = () => {
    if (isMobile) {
      setClicked(!isClicked)
    }
  }

  const { data, loading, error } = useQuery(queryRatingSummary, {
    skip: !product,
    ssr: false,
    variables: {
      sort: 'SubmissionTime:desc',
      offset: 0,
      filter: 0,
      pageId: JSON.stringify({
        linkText: product?.linkText,
        productId: product?.productId,
        productReference: product?.productReference,
      }),
    },
  })

  const average =
    !loading && !error && data && data.productReviews.Includes.Products[0]
      ? data?.productReviews?.Includes?.Products?.[0]?.ReviewStatistics
          ?.AverageOverallRating
      : null

  const totalReviews =
    !loading && !error && data && data.productReviews
      ? data.productReviews.TotalResults
      : null

  const IncentivizedReviewCount =
    data?.productReviews?.Includes?.Products?.[0]?.ReviewStatistics
      ?.IncentivizedReviewCount

  const rollup =
    !loading && !error && data && data.productReviews.TotalResults
      ? data.productReviews.Includes.Products[0].ReviewStatistics
      : null

  const histogram =
    !loading && !error && data && rollup != null
      ? rollup.LocalRatingDistribution
      : []

  const percentage: string[] = []
  histogram.forEach((val: { Count: number }) => {
    percentage.push(`${((100 / totalReviews) * val.Count).toFixed(2)}%`) // percentage calculation
  })
  percentage.reverse() // layout starts from 5, hence the .reverse()

  if (totalReviews == 0) {
    return null
  }

  return (
    <div className={styles.ratingSummary}>
      <div className={`${styles.ratingSummaryContainer} flex items-center`}>
        {loading ? (
          <div
            className={`${styles.ratingSummaryStars} ${styles['ratingSummaryStars--loading']} nowrap dib`}
          >
            <Stars rating={average} />
          </div>
        ) : (
          <div className={styles.ratingSummaryContainerLegal}>
            <div
              className={styles.ratingSummaryStarsContainer}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseDown}
              onClick={handleOnClick}
            >
              <AggregateStructuredData
                productName={product?.productName}
                productId={product?.productId}
                productUrl={product?.link}
                average={average}
                total={totalReviews}
              />
              <div className={`${styles.ratingSummaryStars} nowrap dib`}>
                <Stars rating={average} />
                {/* <span className="review__rating--average dib v-mid c-muted-1">
                ({average})
              </span> */}
              </div>
              <span
                className={`${styles.ratingSummaryTotal} c-muted-2 t-body mr2`}
              >
                {totalReviews !== null
                  ? average.toFixed(1) + ' ' + '(' + totalReviews + ')'
                  : ''}
              </span>
              {/* <span className={styles.containerLink}>
              <FormattedMessage id="store/bazaar-voice.link-reviews">
                {(message) => (
                  <a href={"#" + message} className={styles.linkReviews}>
                    <FormattedMessage id="store/bazaar-voice.view-reviews" />
                  </a>
                )}
              </FormattedMessage>
            </span> */}
              <div
                className={styles.reviewsTooltipVisibilityContainer}
                style={{
                  visibility: isHovered || isClicked ? 'visible' : 'hidden',
                }}
              >
                <ReviewsTooltip
                  blockClass=""
                  buttonLink={intl.formatMessage({
                    id: 'store/bazaar-voice.reviews-tooltip.buttonLink',
                  })}
                  percentages={percentage}
                  histogram={histogram}
                  totalReviews={totalReviews}
                />
              </div>
            </div>
            <div className={styles.ratingSummaryLegalTextContainer}>
              {IncentivizedReviewCount > 0 && (
                <span className={styles.legalTextIncentivizedSummary}>
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
          </div>
        )}
      </div>
    </div>
  )
}

export default RatingSummary
