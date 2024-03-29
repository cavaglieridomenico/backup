import React, { useState, FunctionComponent, useContext } from 'react'
import { defineMessages, useIntl, IntlShape } from 'react-intl'
import { ProductContext } from 'vtex.product-context'
import { useApolloClient, useQuery } from 'react-apollo'

import Stars from './Stars'
import HistogramBar from './HistogramBar'
import styles from '../styles.css'
import {
  useTrackImpression,
  useTrackInView,
  useTrackViewedCGC,
} from '../modules/trackers'
import ReviewStructuredData from './ReviewStructuredData'
import ReviewImages from './ReviewImages'
import GetReviews from '../graphql/queries/querySyndicatedReview.gql'
import queryRatingSummary from '../graphql/queries/queryRatingSummary.gql'
import icon from '../../icons/gift.svg'

const messages = defineMessages({
  timeAgo: {
    id: 'store/bazaar-voice.timeAgo',
    defaultMessage: 'ago',
  },
  timeAgoYear: {
    id: 'store/bazaar-voice.timeAgo.year',
    defaultMessage: 'year',
  },
  timeAgoYears: {
    id: 'store/bazaar-voice.timeAgo.years',
    defaultMessage: 'years',
  },
  timeAgoMonth: {
    id: 'store/bazaar-voice.timeAgo.month',
    defaultMessage: 'month',
  },
  timeAgoMonths: {
    id: 'store/bazaar-voice.timeAgo.months',
    defaultMessage: 'months',
  },
  timeAgoWeek: {
    id: 'store/bazaar-voice.timeAgo.week',
    defaultMessage: 'week',
  },
  timeAgoWeeks: {
    id: 'store/bazaar-voice.timeAgo.weeks',
    defaultMessage: 'weeks',
  },
  timeAgoDay: {
    id: 'store/bazaar-voice.timeAgo.day',
    defaultMessage: 'day',
  },
  timeAgoDays: {
    id: 'store/bazaar-voice.timeAgo.days',
    defaultMessage: 'days',
  },
  timeAgoHour: {
    id: 'store/bazaar-voice.timeAgo.hour',
    defaultMessage: 'hour',
  },
  timeAgoHours: {
    id: 'store/bazaar-voice.timeAgo.hours',
    defaultMessage: 'hours',
  },
  timeAgoMinute: {
    id: 'store/bazaar-voice.timeAgo.minute',
    defaultMessage: 'minute',
  },
  timeAgoMinutes: {
    id: 'store/bazaar-voice.timeAgo.minutes',
    defaultMessage: 'minutes',
  },
  timeAgoJustNow: {
    id: 'store/bazaar-voice.timeAgo.justNow',
    defaultMessage: 'just now',
  },
  originalPost: {
    id: 'store/bazaar-voice.original-post.text',
    defaultMessage: 'Originally posted on ',
  },
  incentivedReview: {
    id: 'store/bazaar-voice.incentivedReview',
    defineMessages: 'Review with incentive'
  }
})

const getTimeAgo = (intl: IntlShape, time: string) => {
  const before = new Date(time)
  const now = new Date()
  const diff = new Date(now.valueOf() - before.valueOf())

  const minutes = diff.getUTCMinutes()
  const hours = diff.getUTCHours()
  const days = diff.getUTCDate() - 1
  const months = diff.getUTCMonth()
  const years = diff.getUTCFullYear() - 1970

  if (years > 0) {
    return `${years} ${
      years > 1
        ? intl.formatMessage(messages.timeAgoYears)
        : intl.formatMessage(messages.timeAgoYear)
    } ${intl.formatMessage(messages.timeAgo)}`
  }

  if (months > 0) {
    return `${months} ${
      months > 1
        ? intl.formatMessage(messages.timeAgoMonths)
        : intl.formatMessage(messages.timeAgoMonth)
    } ${intl.formatMessage(messages.timeAgo)}`
  }

  if (days > 0) {
    return `${days} ${
      days > 1
        ? intl.formatMessage(messages.timeAgoDays)
        : intl.formatMessage(messages.timeAgoDay)
    } ${intl.formatMessage(messages.timeAgo)}`
  }

  if (hours > 0) {
    return `${hours} ${
      hours > 1
        ? intl.formatMessage(messages.timeAgoHours)
        : intl.formatMessage(messages.timeAgoHour)
    } ${intl.formatMessage(messages.timeAgo)}`
  }

  if (minutes > 0) {
    return `${minutes} ${
      minutes > 1
        ? intl.formatMessage(messages.timeAgoMinutes)
        : intl.formatMessage(messages.timeAgoMinute)
    } ${intl.formatMessage(messages.timeAgo)}`
  }

  return intl.formatMessage(messages.timeAgoJustNow)
}

const Review: FunctionComponent<ReviewProps> = ({
  review,
  appSettings,
  relatedProducts,
}) => {
  const [state, setState] = useState<any>({
    isSyndicated: review.IsSyndicated ? review.IsSyndicated.toLowerCase() === 'true': null,
    syndicateName: review.SyndicationSource.Name,
    logoImage: review.SyndicationSource.LogoImageUrl,
    showRelated: null,
    relatedProductName: '',
  })

  const {
    isSyndicated,
    syndicateName,
    logoImage,
    showRelated,
    relatedProductName,
  } = state

  const { product } = useContext(ProductContext)
  const intl = useIntl()
  const client = useApolloClient()

  const isIncentivized = review.BadgesOrder.length > 0 && review.BadgesOrder.includes("incentivizedReview")

  const getSyndicatedReview = async () => {
    const query = {
      query: GetReviews,
      variables: { reviewId: review.Id, appKey: appSettings.appKey },
    }

    const data: any = await client.query(query)
    const reviewData = data.data.getReview
    
    if (reviewData.isSyndicated) {
      setState({
        ...state,
        isSyndicated: reviewData.isSyndicated,
        logoImage: reviewData.logoImage,
        syndicateName: reviewData.syndicateName,
      })

      return true
    }

    return false
  }

  const relatedProduct = async () => {
    if (
      appSettings.showSimilarProducts &&
      relatedProducts?.length &&
      review.ProductId !== product[appSettings?.uniqueId]
    ) {
      for (const prod of relatedProducts) {
        if (prod.ProductId === review.ProductId) {
          setState({
            ...state,
            showRelated: true,
            relatedProductName: prod.Name,
          })

          return true
        }
      }
    }

    return false
  }

  if (state.isSyndicated === null) {
    getSyndicatedReview()
  }

  if (showRelated === null) {
    relatedProduct()
  }

  const elementId = `bazaarvoice-review-${review.Id}`

  useTrackImpression(product.productId, review.Id)
  useTrackInView(product.productId, elementId)
  useTrackViewedCGC(product.productId, elementId)

  const { data, loading, error } = useQuery(queryRatingSummary, {
    skip: !product,
    variables: {
      sort: "SubmissionTime:desc",
      offset: 0,
      filter: 0,
      pageId: JSON.stringify({
        linkText: product?.linkText,
        productId: product?.productId,
        productReference: product?.productReference,
      }),
    },
  });



  const totalReviews =
    !loading && !error && data && data.productReviews
      ? data.productReviews.TotalResults
      : null;

  if (totalReviews == 0) {
    return null;
  }

  return (
    <div
      id={elementId}
      className={`${styles.review} bw2 bb b--muted-5 mb5 pb4-ns pb8-s`}
    >
      <ReviewStructuredData
        productName={product.productName}
        productId={product.productId}
        productUrl={"https://www.whirlpool.it/"+product?.linkText+"/p"} //to fix the vtex url generation which was returning https://portal.vtexcommercestable.com...
        review={review} 
     />
      <div className={`${styles.reviewRating} flex items-center`}>
        <Stars rating={review.Rating} />
        <span className="c-muted-1 t-small ml2">
          {getTimeAgo(intl, review.SubmissionTime)}
        </span>
      </div>
      <div className={`${styles.titleContainer}`}>
        <h5 className={`${styles.reviewTitle} lh-copy mw7 t-heading-5 mv5 ${isIncentivized ? styles.incentivedReviewTitle: ''}`}>
        {review.Title}
        </h5>
        {isIncentivized && <span className={styles.incentivedReview}><img src={icon} className={styles.imageReviewIncentived}/>{intl.formatMessage(messages.incentivedReview)}</span>}
      </div>
      <div className="flex flex-column-s flex-row-ns">
        <div className="flex flex-grow-1 flex-column w-70-ns">
          <div className={`${styles.reviewByField} t-small c-muted-1`}>
            {`${review.UserNickname || '-'} ${
              review.UserLocation ? `, from ${review.UserLocation}` : ''
            }`}
          </div>
          <ReviewImages review={review} />
          <p className={`${styles.reviewText} t-body lh-copy mw7 pr5-ns`}>
            {review.ReviewText}
          </p>

          {appSettings.showClientResponses && review.ClientResponses.length ? (
            <div className={`${styles.clientResponseContainer} mw7 pr5-ns pl7`}>
              {review.ClientResponses.map((item) => {
                return (
                  <div
                    key={item.Date}
                    className={`${styles.clientResponse} t-body lh-copy`}
                  >
                    <div
                      className={`${styles.clientResponseDepartment} t-body b c-muted-1`}
                    >
                      {item.Department}
                    </div>
                    <div
                      className={`${styles.clientResponseMessage} t-body lh-copy`}
                    >
                      {item.Response}
                    </div>
                    <div
                      className={`${styles.clientResponseType} t-body c-muted-1`}
                    >
                      {item.ResponseType}
                    </div>
                    {/* <div
                      className={`${styles.clientResponseName} t-body c-muted-1`}
                    >
                      {item.Name} - {item.ResponseSource}
                    </div> */}
                    <div
                      className={`${styles.clientResponseDate} t-small c-muted-1`}
                    >
                      {getTimeAgo(intl, item.Date)}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}

          {isSyndicated && (
            <div className="flex bg-muted-5 pa4 ma3">
              <img src={logoImage} className="db mr2" width="50" alt="" style={{objectFit:"contain"}}/>
              <p className="t-body lh-copy mw7 pr5-ns">
                {intl.formatMessage(messages.originalPost)}
                {' '+syndicateName}
              </p>
            </div>
          )}

          {showRelated && (
            <div className="flex bg-muted-5 pl4 ma3">
              <p className="t-body lh-copy mw7 pr5-ns">
                {intl.formatMessage(messages.originalPost)}
                {' '+relatedProductName}
              </p>
            </div>
          )}
        </div>

        {review.SecondaryRatings && (
          <ul className="flex flex-grow-1 flex-column pl0 pl3-ns list">
            {review.SecondaryRatings.map((rating, i) => {
              if (rating == null) {
                return <li key={i} />
              }

              return (
                <li
                  key={i}
                  className={`${styles.secondaryHistogramLine} mv3 flex flex-column`}
                >
                  <div
                    className={`${styles.secondaryHistogramLabel} dib v-mid nowrap pr2`}
                  >
                    {rating.Label}
                  </div>
                  <HistogramBar
                    barClassName={styles.reviewHistogramBar}
                    barValueClassName={styles.reviewHistogramBarValue}
                    percentage={`${rating.Value * 20}%`}
                    shouldShowDivisions
                  />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

interface ReviewProps {
  review: Review
  appSettings: any
  relatedProducts: any
}

interface Review {
  Id: string
  ClientResponses: ClientResponse[]
  Photos: Photo[]
  Rating: number
  ReviewText: string
  SecondaryRatings: SecondaryRating[]
  SubmissionTime: string
  Title: string
  UserLocation: string
  UserNickname: string
  ProductId: string
  IsSyndicated: any
  SyndicationSource: any
  BadgesOrder?: any 
}

interface Photo {
  Sizes: ImageSize
}

interface ImageSize {
  normal: Image
  thumbnail: Image
}

interface Image {
  Url: string
}

interface ClientResponse {
  Department: string
  Response: string
  ResponseType: string
  ResponseSource: string
  Name: string
  Date: string
}

interface SecondaryRating {
  DisplayType: string
  Id: string
  Label: string
  MaxLabel: string | null
  MinLabel: string | null
  Value: number
  ValueLabel: string | null
  ValueRange: number
}

export default Review
