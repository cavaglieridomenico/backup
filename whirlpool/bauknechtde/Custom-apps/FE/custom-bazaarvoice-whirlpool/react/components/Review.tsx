import React, { useState, FunctionComponent, useContext } from 'react'
import { defineMessages, useIntl, IntlShape } from 'react-intl'
import { ProductContext } from 'vtex.product-context'
import { useApolloClient } from 'react-apollo'
import { index as RichText } from 'vtex.rich-text'

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
// import icon from '../../icons/gift.svg'

const messages = defineMessages({
  timeAgo: {
    id: 'store/bazaar-voice.timeAgo',
    defaultMessage: 'Vor',
  },
  timeAgoYear: {
    id: 'store/bazaar-voice.timeAgo.year',
    defaultMessage: 'Jahr',
  },
  timeAgoYears: {
    id: 'store/bazaar-voice.timeAgo.years',
    defaultMessage: 'Jahre',
  },
  timeAgoMonth: {
    id: 'store/bazaar-voice.timeAgo.month',
    defaultMessage: 'Monat',
  },
  timeAgoMonths: {
    id: 'store/bazaar-voice.timeAgo.months',
    defaultMessage: 'Monate',
  },
  timeAgoWeek: {
    id: 'store/bazaar-voice.timeAgo.week',
    defaultMessage: 'Woche',
  },
  timeAgoWeeks: {
    id: 'store/bazaar-voice.timeAgo.weeks',
    defaultMessage: 'Wochen',
  },
  timeAgoDay: {
    id: 'store/bazaar-voice.timeAgo.day',
    defaultMessage: 'Tag',
  },
  timeAgoDays: {
    id: 'store/bazaar-voice.timeAgo.days',
    defaultMessage: 'Tagen',
  },
  timeAgoHour: {
    id: 'store/bazaar-voice.timeAgo.hour',
    defaultMessage: 'Stunde',
  },
  timeAgoHours: {
    id: 'store/bazaar-voice.timeAgo.hours',
    defaultMessage: 'Stunden',
  },
  timeAgoMinute: {
    id: 'store/bazaar-voice.timeAgo.minute',
    defaultMessage: 'Minute',
  },
  timeAgoMinutes: {
    id: 'store/bazaar-voice.timeAgo.minutes',
    defaultMessage: 'Minuten',
  },
  timeAgoJustNow: {
    id: 'store/bazaar-voice.timeAgo.justNow',
    defaultMessage: 'Gerade jetzt',
  },
  originalPost: {
    id: 'store/bazaar-voice.original-post.text',
    defaultMessage: 'Originally posted on ',
  },
  incentivedReview: {
    id: 'store/bazaar-voice.incentivedReview',
    defineMessages: 'Review with incentive',
  },
  totalFeedbackLabel: {
    id: 'store/bazaar-voice.totalFeedbackLabel',
    defineMessages: 'Review with incentive',
  },
  totalPositiveFeedbackLabel: {
    id: 'store/bazaar-voice.totalPositiveFeedbackLabel',
    defineMessages: 'Stimmen',
  },
  userAgeLabel: {
    id: 'store/bazaar-voice.userAgeLabel',
    defineMessages: 'Alter',
  },
  userGenderLabel: {
    id: 'store/bazaar-voice.userGenderLabel',
    defineMessages: 'Geschlecht',
  },
  isRecommendedLabel: {
    id: 'store/bazaar-voice.isRecommendedLabel',
    defineMessages: 'Empfiehlt dieses Produkt',
  },
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
    return `${intl.formatMessage(messages.timeAgo)} ${years} ${
      years > 1
        ? intl.formatMessage(messages.timeAgoYears)
        : intl.formatMessage(messages.timeAgoYear)
    }`
  }

  if (months > 0) {
    return `${intl.formatMessage(messages.timeAgo)} ${months} ${
      months > 1
        ? intl.formatMessage(messages.timeAgoMonths)
        : intl.formatMessage(messages.timeAgoMonth)
    }`
  }

  if (days > 0) {
    return `${intl.formatMessage(messages.timeAgo)} ${days} ${
      days > 1
        ? intl.formatMessage(messages.timeAgoDays)
        : intl.formatMessage(messages.timeAgoDay)
    }`
  }

  if (hours > 0) {
    return `${intl.formatMessage(messages.timeAgo)} ${hours} ${
      hours > 1
        ? intl.formatMessage(messages.timeAgoHours)
        : intl.formatMessage(messages.timeAgoHour)
    }`
  }

  if (minutes > 0) {
    return `${intl.formatMessage(messages.timeAgo)} ${minutes} ${
      minutes > 1
        ? intl.formatMessage(messages.timeAgoMinutes)
        : intl.formatMessage(messages.timeAgoMinute)
    }`
  }

  return intl.formatMessage(messages.timeAgoJustNow)
}

const Review: FunctionComponent<ReviewProps> = ({
  review,
  appSettings,
  relatedProducts = [],
  isHistogramVisible = true,
  isModalReview = false,
}) => {
  const [state, setState] = useState<any>({
    isSyndicated: review?.IsSyndicated
      ? review?.IsSyndicated?.toString()?.toLowerCase() === 'true'
      : null,
    syndicateName: review.SyndicationSource?.Name,
    logoImage: review.SyndicationSource?.LogoImageUrl,
    showRelated: null,
    relatedProductName: '',
  })

  const [positiveFeedback, setPositiveFeedback] = useState(
    review.TotalPositiveFeedbackCount
  )
  const [negativeFeedback, setNegativeFeedback] = useState(
    review.TotalNegativeFeedbackCount
  )
  const [isFeedbackClicked, setIsFeedbackClicked] = useState(false)
  const [isReportClicked, setIsReportClicked] = useState(false)

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

  const isIncentivized =
    review.BadgesOrder.length > 0 &&
    review.BadgesOrder.includes('incentivizedReview')

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
      review.ProductId !== product[appSettings.uniqueId]
    ) {
      for (const prod of relatedProducts) {
        if (prod.ProductId === review.ProductId) {
          setState({
            ...state,
            showRelated: true,
            relatedProductName: prod?.Name,
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

  console.log(review, 'review')

  /*-------------- FEEDBACK SUBMISSION -----------------*/
  const handleFetch = (reviewId: string, helpfulnessType: string) => {
    const BV_API =
      'https://api.bazaarvoice.com/data/submitfeedback.json?apiversion=5.4'

    if (helpfulnessType != 'Report') {
      //Helpfulness Feedback submission
      const fetchUrl = `${BV_API}&ContentType=review&ContentId=${reviewId}&FeedbackType=helpfulness&Vote=${helpfulnessType}&PassKey=${appSettings.appKey}`

      return fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((res: any) => res.json())
        .then((response: any) => console.log(response, 'response'))
    } else {
      //Inappropriate Feedback submission
      const fetchUrl = `${BV_API}&ContentType=review&ContentId=${reviewId}&FeedbackType=inappropriate&PassKey=${appSettings.appKey}`

      return fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((res: any) => res.json())
        .then((response: any) => console.log(response, 'response'))
    }
  }

  const handleClick = (reviewId: string, type: string) => {
    if (type == 'Positive') {
      setIsFeedbackClicked(true)
      handleFetch(reviewId, type).then(() =>
        setPositiveFeedback(positiveFeedback + 1)
      )
    } else if (type == 'Negative') {
      setIsFeedbackClicked(true)
      handleFetch(reviewId, type).then(() =>
        setNegativeFeedback(negativeFeedback + 1)
      )
    } else {
      handleFetch(reviewId, type).then(() => setIsReportClicked(true))
    }
  }
  /*-------------------------------*/

  return (
    <div className={styles.reviewsLeftColumnContainer}>
      <div className={styles.reviewsLeftColumnWrapper}>
        <div className={styles.reviewsLeftColumnUserNameContainer}>
          <span className={styles.reviewsLeftColumnUserName}>
            {review.UserNickname}
          </span>
        </div>
        <div className={styles.reviewUserCity}>
          <span className={styles.reviewsLeftColumnInfo}>
            {review.UserLocation}
          </span>
        </div>
        <div className={styles.reviewUserStats}>
          <div className={styles.reviewUserStatsContainer}>
            <div className={styles.reviewUserStatsWrapper}>
              <span className={styles.reviewUserStatsData}>
                {intl.formatMessage(messages.totalFeedbackLabel)}
              </span>
              <span className={styles.reviewUserStatsValue}>
                {review.TotalFeedbackCount}
              </span>
            </div>
            <div className={styles.reviewUserStatsWrapper}>
              <span className={styles.reviewUserStatsData}>
                {intl.formatMessage(messages.totalPositiveFeedbackLabel)}
              </span>
              <span className={styles.reviewUserStatsValue}>
                {review.TotalPositiveFeedbackCount}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.reviewUserStats}>
          <span className={styles.reviewUserStatsData}>
            {intl.formatMessage(messages.userAgeLabel)}
          </span>
          <span className={styles.reviewUserStatsValue}>
            {review.ContextDataValues?.Age?.ValueLabel}
          </span>
        </div>
        {review.ContextDataValues?.Gender?.ValueLabel && (
          <div className={styles.reviewUserStats}>
            <span className={styles.reviewUserStatsData}>
              {intl.formatMessage(messages.userGenderLabel)}
            </span>
            <span className={styles.reviewUserStatsValue}>
              {review.ContextDataValues?.Gender?.ValueLabel}
            </span>
          </div>
        )}
      </div>
      <div
        id={elementId}
        className={`${styles.review} bw2 bb b--muted-5 mb5 pb4-ns pb8-s`}
      >
        <ReviewStructuredData
          productName={product.productName}
          productId={product.productId}
          productUrl={product.link}
          review={review}
        />
        <div className={`${styles.reviewRating} flex items-center`}>
          <Stars rating={review.Rating} />
          <span className="c-muted-1 t-small ml2">
            {getTimeAgo(intl, review.SubmissionTime)}
          </span>
        </div>
        <div className={`${styles.titleContainer}`}>
          <h5
            className={`${styles.reviewTitle} lh-copy mw7 t-heading-5 mv5 ${
              isIncentivized ? styles.incentivedReviewTitle : ''
            }`}
          >
            {review.Title}
          </h5>
          {isIncentivized && (
            <span className={styles.incentivedReview}>
              <img
                src="/arquivos/gift-bv.svg"
                className={styles.imageReviewIncentived}
              />
              {intl.formatMessage(messages.incentivedReview)}
            </span>
          )}
        </div>
        <div className="flex flex-column-s flex-row-ns">
          <div className="flex flex-grow-1 flex-column w-70-ns">
            <div className={`${styles.reviewByField} t-small c-muted-1`}>
              {`${review.UserNickname || '-'}${
                review.UserLocation ? `, aus ${review.UserLocation}` : ''
              }`}
            </div>
            <ReviewImages review={review} />
            <p
              className={`${styles.reviewText} ${
                isModalReview ? styles.reviewTextClamped : ''
              } t-body lh-copy ${!isModalReview ? 'mw7' : ''} pr5-ns`}
            >
              <RichText text={review.ReviewText} />
            </p>
            <div className={styles.legalTextReviewContainer}>
              <span className={styles.legalTextIncentivizedText}>
                Hat einen Anreiz zum Verfassen dieser Bewertung
              </span>
              <span className={styles.reviewIsReccomendedValue}>
                {isIncentivized ? 'Ja' : 'Nein'}
              </span>
            </div>
            <div className={styles.legalTextReviewContainer}>
              <span className={styles.reviewIsReccomendedLabel}>
                {`${intl.formatMessage(messages.isRecommendedLabel)}`}
              </span>
              <span className={styles.reviewIsReccomendedValue}>
                {review.IsRecommended ? '✔ Ja' : '✘ Nein'}
              </span>
            </div>
            <div className={styles.reviewFeedbackConatiner}>
              <span className={styles.reviewFeedbackLabel}>Hilfreich?</span>
              <button
                disabled={isFeedbackClicked}
                className={`${styles.reviewFeedback} ${
                  isFeedbackClicked ? styles.reviewFeedbackDisabled : ''
                }`}
                onClick={() => handleClick(review.Id, 'Positive')}
              >
                <span className={styles.reviewFeedbackText}>
                  Ja ·{' '}
                  <span
                    className={`${
                      isFeedbackClicked ? styles.reviewPositiveFeedbackText : ''
                    }`}
                  >
                    {positiveFeedback}
                  </span>
                </span>
              </button>
              <button
                disabled={isFeedbackClicked}
                className={`${styles.reviewFeedback} ${
                  isFeedbackClicked ? styles.reviewFeedbackDisabled : ''
                }`}
                onClick={() => handleClick(review.Id, 'Negative')}
              >
                <span className={styles.reviewFeedbackText}>
                  Nein ·{' '}
                  <span
                    className={`${
                      isFeedbackClicked ? styles.reviewNegativeFeedbackText : ''
                    }`}
                  >
                    {negativeFeedback}
                  </span>
                </span>
              </button>
              <button
                disabled={isReportClicked}
                className={`${styles.reviewFeedback} ${
                  isReportClicked ? styles.reviewFeedbackDisabled : ''
                }`}
                onClick={() => handleClick(review.Id, 'Report')}
              >
                <span className={styles.reviewFeedbackText}>
                  {!isReportClicked ? 'Melden' : 'Gemeldet'}
                </span>
              </button>
            </div>

            {appSettings.showClientResponses &&
            review.ClientResponses.length ? (
              <div
                className={
                  !isModalReview
                    ? `${styles.clientResponseContainer} mw7 pr5-ns pl7`
                    : `${styles.clientResponseContainer}`
                }
              >
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
                        className={`${
                          styles.clientResponseMessage
                        } t-body lh-copy ${
                          isModalReview ? styles.reviewTextClamped : ''
                        }`}
                      >
                        <RichText text={item.Response} />
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
                      {/* <div
                      className={`${styles.clientResponseDate} t-small c-muted-1`}
                    >
                      {getTimeAgo(intl, item.Date)}
                    </div> */}
                    </div>
                  )
                })}
              </div>
            ) : null}

            {isSyndicated && (
              <div className="flex bg-muted-5 pa4 ma3">
                <img
                  src={logoImage}
                  className="db mr2"
                  width="50"
                  alt=""
                  style={{ objectFit: 'contain' }}
                />
                <p className="t-body lh-copy mw7 pr5-ns">
                  {intl.formatMessage(messages.originalPost)}
                  {' ' + syndicateName}
                </p>
              </div>
            )}

            {showRelated && (
              <div className="flex bg-muted-5 pl4 ma3">
                <p className="t-body lh-copy mw7 pr5-ns">
                  {intl.formatMessage(messages.originalPost)}
                  {' ' + relatedProductName}
                </p>
              </div>
            )}
          </div>

          {review.SecondaryRatings && isHistogramVisible && (
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
    </div>
  )
}

interface ReviewProps {
  review: Review
  appSettings: any
  relatedProducts?: any
  isHistogramVisible?: boolean
  isModalReview?: boolean
  IncentivizedReviewCount?: number
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
  TotalFeedbackCount: number
  TotalPositiveFeedbackCount: number
  TotalNegativeFeedbackCount: number
  ContextDataValues: ContextDataValues
  IsRecommended: boolean
}
interface ContextDataValues {
  Age: ContextDataFields
  Gender: ContextDataFields
}

interface ContextDataFields {
  DimensionLabel: String
  Value: String
  ValueLabel: String
  Id: String
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
