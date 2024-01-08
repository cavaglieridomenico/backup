import React, { FC } from 'react'
import xss from 'xss'

interface Props {
  productName: string
  review: {
    Rating: number
    UserNickname: string
    ReviewText: string
    SubmissionTime: string
  }
  productUrl: any
}

const ReviewStructuredData: FC<Props> = ({ productName, review , productUrl }) => {
  const reviewStructuredData = {
    '@context': 'http://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: productName,
    review: {
      '@type': 'Review',
      reviewRating: {
        ratingValue: `${review.Rating}`,
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: review.UserNickname || 'Anonymous',
      },
      datePublished: review.SubmissionTime,
      reviewBody: review.ReviewText,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: xss(JSON.stringify(reviewStructuredData)),
      }}
    />
  )
}

export default ReviewStructuredData