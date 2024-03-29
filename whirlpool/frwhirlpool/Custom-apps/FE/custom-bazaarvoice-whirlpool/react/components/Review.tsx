import React, { FunctionComponent, useContext } from 'react'
import { defineMessages, useIntl, IntlShape } from 'react-intl'
import { ProductContext } from 'vtex.product-context'

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

const messages = defineMessages({
  timeAgo: {
    id: 'store/bazaar-voice.timeAgo',
    defaultMessage: 'Il y a',
  },
  timeAgoYear: {
    id: 'store/bazaar-voice.timeAgo.year',
    defaultMessage: 'année',
  },
  timeAgoYears: {
    id: 'store/bazaar-voice.timeAgo.years',
    defaultMessage: 'ans',
  },
  timeAgoMonth: {
    id: 'store/bazaar-voice.timeAgo.month',
    defaultMessage: 'mois',
  },
  timeAgoMonths: {
    id: 'store/bazaar-voice.timeAgo.months',
    defaultMessage: 'mois',
  },
  timeAgoWeek: {
    id: 'store/bazaar-voice.timeAgo.week',
    defaultMessage: 'semaine',
  },
  timeAgoWeeks: {
    id: 'store/bazaar-voice.timeAgo.weeks',
    defaultMessage: 'semaines',
  },
  timeAgoDay: {
    id: 'store/bazaar-voice.timeAgo.day',
    defaultMessage: 'jour',
  },
  timeAgoDays: {
    id: 'store/bazaar-voice.timeAgo.days',
    defaultMessage: 'jours',
  },
  timeAgoHour: {
    id: 'store/bazaar-voice.timeAgo.hour',
    defaultMessage: 'heure',
  },
  timeAgoHours: {
    id: 'store/bazaar-voice.timeAgo.hours',
    defaultMessage: 'heures',
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
    defaultMessage: 'juste maintenant',
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
    } `
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
    } `
  }

  if (hours > 0) {
    return `${intl.formatMessage(messages.timeAgo)} ${hours} ${
      hours > 1
        ? intl.formatMessage(messages.timeAgoHours)
        : intl.formatMessage(messages.timeAgoHour)
    } `
  }

  if (minutes > 0) {
    return `${intl.formatMessage(messages.timeAgo)} ${minutes} ${
      minutes > 1
        ? intl.formatMessage(messages.timeAgoMinutes)
        : intl.formatMessage(messages.timeAgoMinute)
    } `
  }

  return intl.formatMessage(messages.timeAgoJustNow)
}

const Review: FunctionComponent<ReviewProps> = ({ review, appSettings }) => {
  const { product } = useContext(ProductContext)
  const intl = useIntl()

  const elementId = `bazaarvoice-review-${review.Id}`

  useTrackImpression(product.productId, review.Id)
  useTrackInView(product.productId, elementId)
  useTrackViewedCGC(product.productId, elementId)

  //Used to check if "testeur" badge need to be shown
  const incentivizedReview = review?.ContextDataValues?.IncentivizedReview

  return (
    <div
      id={elementId}
      className={`${styles.review} bw2 bb b--muted-5 mb5 pb4-ns pb8-s`}
    >
      <ReviewStructuredData productName={product.productName} review={review} productUrl={"https://www.whirlpool.fr/"+product?.linkText+"/p"} />
      <div className={`${styles.reviewRating} flex items-center`}>
        <Stars rating={review.Rating} />
        <span className="c-muted-1 t-small ml2">
          {getTimeAgo(intl, review.SubmissionTime)}
        </span>
        {incentivizedReview !== null && incentivizedReview?.Value == 'True' &&
          <div className={styles.badgeContainer}>
            {/* <span className="bv-badge-icon" aria-hidden="true"> ⊞ </span> */}
            <span className="bv-badge-label">Avis de testeurs</span>
          </div>
        }
      </div>
      
      <h5 className={`${styles.reviewTitle} lh-copy mw7 t-heading-5 mv5`}>
        {review.Title}
      </h5>
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
                    <div
                      className={`${styles.clientResponseName} t-body c-muted-1`}
                    >
                      {item.Name} - {item.ResponseSource}
                    </div>
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
  ContextDataValues: ContextDataValues
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

interface ContextDataValues {
  IncentivizedReview: IncentivizedReview
}

interface IncentivizedReview {
  Value: String
  ValueLabel: String 
  DimensionLabel: String
  Id: String
}

export default Review
