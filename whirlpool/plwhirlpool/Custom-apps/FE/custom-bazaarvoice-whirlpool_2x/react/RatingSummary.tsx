import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import useProduct from 'vtex.product-context/useProduct'
import { useQuery } from 'react-apollo'

import Stars from './components/Stars'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import styles from './styles.css'
//import AggregateStructuredData from "./components/AggregateStructuredData";

const RatingSummary = () => {
  const { product } = useProduct()
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
      ? data.productReviews.Includes.Products[0].ReviewStatistics
          .AverageOverallRating
      : null

  const totalReviews =
    !loading && !error && data && data.productReviews
      ? data.productReviews.TotalResults
      : null

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
          <Fragment>
            {/*@ts-ignore*/}
            {/*  <AggregateStructuredData
              average={average}
              total={totalReviews}
            /> */}
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
                ? average.toFixed(1) + '(' + totalReviews + ')'
                : ''}
            </span>
            <span className={styles.containerLink}>
              <FormattedMessage id="store/bazaar-voice.link-reviews">
                {(message) => (
                  <a href={'#' + message} className={styles.linkReviews}>
                    Zobacz opinie
                  </a>
                )}
              </FormattedMessage>
            </span>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default RatingSummary
