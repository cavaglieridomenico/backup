import React, { FC } from 'react'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
// import useProduct from 'vtex.product-context/useProduct'

import { useQuery } from 'react-apollo'
import { useDevice } from 'vtex.device-detector'

import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import Stars from './components/Stars'

const RatingInline: FC = () => {
  const { product } = useProductSummary()
    const { isMobile } = useDevice()
  // const { product } = useProduct()
  const { data, loading, error } = useQuery(queryRatingSummary, {
    skip: !product,
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
  const average =
    !loading && !error && data && data.productReviews.Includes.Products[0]
      ? (data.productReviews.Includes.Products[0].ReviewStatistics
          .AverageOverallRating.toString().length > 1 ? data.productReviews.Includes.Products[0].ReviewStatistics
          .AverageOverallRating.toFixed(1) : data.productReviews.Includes.Products[0].ReviewStatistics
          .AverageOverallRating)
      : null

  const totalResults = 
    !loading && !error && data && data.productReviews.Includes.Products[0]
      ? data.productReviews.TotalResults
      : null
  const result = !isMobile ? (     
   (
    <div className="review__rating mw8 ph2" style={{textAlign: "end"}}>
      {average !== null ?<Stars rating={average || 0}  /> : null}
      {totalResults !== null ? <span>{average}({totalResults})</span> : null}
    </div>
  )
  ) : (
    <div className="review__rating mw8 ph2" style={{textAlign: "start", padding:0}}>
      {average !== null ?<Stars rating={average || 0}  /> : null}
      {totalResults !== null ? <span>{average}({totalResults})</span> : null}
    </div>
  )
  return result

}

export default RatingInline
