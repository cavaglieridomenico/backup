import React, { FC } from 'react'
import { useProduct } from 'vtex.product-context'

interface Props {
  productName: string
  productId: string
  productUrl: string
  review: {
    Rating: number
    UserNickname: string
    ReviewText: string
    SubmissionTime: string
  }
}

const ReviewStructuredData: FC<Props> = ({
  productName,
  productId,
  review,
}) => {
  const baseUrl = "https://www.bauknecht.de/";
  const productInfo = useProduct();
  const reviewStructuredData = {
    '@context': 'http://schema.org',
    '@type': 'Product',
    '@id': baseUrl + productInfo?.product?.linkText + "/p",
    mpn: productId,
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewStructuredData) }}
    />
  )
}

export default ReviewStructuredData
