import React, { FunctionComponent, Fragment, useState, useEffect  } from 'react'
import { FormattedMessage } from 'react-intl'

import Review from './Review'
import ReviewsDropdowns from './ReviewsDropdowns'
import styles from '../styles.css'

const ReviewsContainer: FunctionComponent<ReviewsContainerProps> = ({
  count,
  handleSort,
  selected,
  props,
  handleFilter,
  filter,
  productIdentifier,
  reviews,
  appSettings,
}) => {
  const [isOpen, setModalReviewOpen] = useState(false);
  let productId = productIdentifier

  useEffect(() => {
    if(isOpen){
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
  }, [isOpen]);
  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.reviewsContainerHead}>
        <h4
          className={`${styles.reviewsContainerTitle} t-heading-4 bb b--muted-5 mb5 pb4`}
        >
          <FormattedMessage
            id="store/bazaar-voice.reviewed-by"
            values={{
              count,
            }}
          />
        </h4>
        <ReviewsDropdowns
          handleSort={handleSort}
          selected={selected}
          props={props}
          handleFilter={handleFilter}
          filter={filter}
        />
        {/* <div className={`${styles.reviewsContainerWriteButton} mt5 mb8`}>
            <span className="c-link pointer" style={{fontWeight:'bold'}} onClick={()=>setModalReviewOpen(true)}>
              <FormattedMessage id="store/bazaar-voice.write-a-review" />{' '}
            </span>
        </div> */}
      </div>

      <Fragment>
        {reviews.map((review: any, i: number) => {
          return <Review review={review} key={i} appSettings={appSettings} />
        })}
      </Fragment>
    </div>
  )
}

interface ReviewsContainerProps {
  count: number
  handleSort: any
  selected: string
  props: any
  productIdentifier: string
  linkText: string
  reviews: any[]
  handleFilter: any
  filter: string
  appSettings: any
}

export default ReviewsContainer
