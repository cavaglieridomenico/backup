import React, { Fragment, useEffect, useState } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { useQuery } from 'react-apollo'

import Stars from './components/Stars'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import styles from './styles.css'
import AggregateStructuredData from './components/AggregateStructuredData'

const RatingSummary = ({}: { appSettings: Settings }) => {
  const { product } = useProduct()
  const [isOpen, setModalReviewOpen] = useState(false)

  const { data, loading, error } = useQuery(queryRatingSummary, {
    skip: !product,
    variables: {
      sort: 'SubmissionTime:desc',
      offset: 0,
      filter: 0,
      pageId: JSON.stringify({
        linkText: product?.linkText,
        productId: product?.productId,
        productReference: product?.items?.[0]?.name,
      }),
    },
  })
  const productId = product?.items[0]?.name

  let isNotMobile = false

  if (window.innerWidth > 756) {
    isNotMobile = true
  } else {
    isNotMobile = false
  }

  useEffect(() => {
    if (isOpen) {
      if (!window.$BV || !productId) {
        return
      }

      window.$BV.configure('global', {
        events: {
          submissionClose() {
            setModalReviewOpen(false)
          },
          submissionSubmitted() {
            setModalReviewOpen(false)
          },
        },
      })
      window.$BV.ui('rr', 'submit_review', {
        productId,
      })
    }
  }, [isOpen])

  const averageToRound =
    !loading && !error && data && data.productReviews.Includes.Products[0]
      ? data.productReviews.Includes.Products[0].ReviewStatistics
          .AverageOverallRating
      : null

  const average = Math.round(averageToRound * 10) / 10

  const totalReviews =
    !loading && !error && data && data.productReviews
      ? data.productReviews.TotalResults
      : null

  return (
    <>
      <style>
        {
          '\
          .vtex-reviews-and-ratings-2-x-stars {\
            display: none;\
          }\
        '
        }
      </style>
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
              {totalReviews == !null || totalReviews > 0 ? (
                <>
                  {/* @ts-ignore */}
                  <AggregateStructuredData
                    average={average}
                    total={totalReviews}
                  />
                  <div className={`${styles.ratingSummaryStars} nowrap dib`}>
                    {totalReviews == !null || totalReviews > 0 ? (
                      <Stars rating={average} />
                    ) : null}
                  </div>
                  <span
                    className={`${styles.ratingSummaryTotal} c-muted-2 t-body mr2`}
                  >
                    {isNotMobile ? (
                      <p className={`${styles.ratingParagraph} c-link`}>
                        {totalReviews == !null || totalReviews > 0
                          ? totalReviews
                          : null}
                      </p>
                    ) : (
                      <p className={`${styles.ratingParagraph} c-link`}>
                        {average} (
                        {totalReviews == !null || totalReviews > 0
                          ? totalReviews
                          : null}
                        )
                      </p>
                    )}
                  </span>
                  {/* { reviewsOpenPage ? (
                <Link
                  className={`${styles.ratingSummaryWrite} ml2 c-link t-body`}
                  href={`/new-review?product_id=${product[productId]}&return_page=/${product.linkText}/p`}
                >
              <FormattedMessage id="store/bazaar-voice.write-a-review" />
            </Link>
            ) :
            (
              <>
                { <span className="c-link pointer" style={{fontWeight:'bold'}} onClick={()=>setModalReviewOpen(true)}><FormattedMessage id="store/bazaar-voice.write-a-review" /></span> }
              </>
            )} */}
                </>
              ) : null}
            </Fragment>
          )}
        </div>
      </div>
    </>
  )
}

export default RatingSummary
