import React, { FunctionComponent, useState,useEffect  } from 'react'
import { FormattedMessage } from 'react-intl'

import ReviewsDropdowns from './ReviewsDropdowns'
import styles from '../styles.css'

const NoReviews: FunctionComponent<NoReviewsProps> = ({
  productIdentifier,
  handleSort,
  selected,
  props,
  handleFilter,
  filter,
}) => {

  const isAllReviewsFilter = filter === '0'
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
    <div className={`${styles.reviews} mw8 center c-on-base`}>
      <h3 className={`${styles.reviewsTitle} t-heading-3 b--muted-5 mb5`}>
        <FormattedMessage id="store/bazaar-voice.reviews" />
      </h3>
      <div className={styles.reviewsContainer}>
        <div className={`${styles.noReviewsContainer} bw2 b--muted-5 mb5 pb3`}>
          <h5
            className={`${styles.reviewsContainerTitle} lh-copy mw9 t-heading-5 mv5`}
          >
            {isAllReviewsFilter ? (
              <FormattedMessage id="store/bazaar-voice.no-reviews" />
            ) : (
              <FormattedMessage id="store/bazaar-voice.no-reviews-for-filter" />
            )}
          </h5>
        </div>
        {!isAllReviewsFilter && (
          <ReviewsDropdowns
            handleSort={handleSort}
            selected={selected}
            props={props}
            handleFilter={handleFilter}
            filter={filter}
          />
        )}
        {/* <div className={`${styles.reviewsContainerWriteButton} mb5`}>
            <> 
              <span className="c-link pointer" style={{fontWeight:'bold'}} onClick={()=>setModalReviewOpen(true)}>
              {isAllReviewsFilter ? (
                  <FormattedMessage id="store/bazaar-voice.write-a-review-first" />
                ) : (
                  <FormattedMessage id="store/bazaar-voice.write-a-review" />
                )}
              </span>
            </> 
        </div> */}
      </div>
    </div>
  )
}

interface NoReviewsProps {
  productIdentifier: string
  linkText: string
  handleSort: any
  selected: string
  props: any
  handleFilter: any
  filter: string
}

export default NoReviews
