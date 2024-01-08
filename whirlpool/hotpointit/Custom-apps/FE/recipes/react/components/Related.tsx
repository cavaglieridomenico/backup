import React, { useState } from 'react'
import styles from '../styles.css'
import Carousel from 'react-simply-carousel'
import { Link } from 'vtex.render-runtime'
import './styles.global.css'
import {correctFormat} from '../utils/utils'

interface RelatedProps {
  singleRecipe: any
}

const Related: StorefrontFunctionComponent<RelatedProps> = ({
  singleRecipe,
}) => {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <>
      <div className={styles.relatedCarouselContainer}>
        <span className={styles.relatedTitle}>Ricette correlate</span>
        <div className={styles.relatedCarouselDiv}>
          <Carousel
            containerProps={{
              style: {
                width: '100%',
                justifyContent: 'center',
                position: 'relative',
              },
            }}
            activeSlideIndex={activeSlide}
            activeSlideProps={{
              style: {
                position: 'relative',
              },
            }}
            onRequestChange={setActiveSlide}
            forwardBtnProps={{
              children: '>',
              style: {
                display: window.screen.width <= 640 ? 'none' : 'flex',
                width: '4.375rem',
                height: '5rem',
                background: '#B24C24',
                alignSelf: 'center',
                position: 'absolute',
                right: '1rem',
                zIndex: '10',
                border: 'none',
                color: 'white',
                fontFamily: 'hotpointRegular',
                lineHeight: 0,
                padding: 0,
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.3rem',
                cursor: 'pointer',
                borderRadius: '11px',
                paddingBottom: '0.3rem',
              },
            }}
            backwardBtnProps={{
              children: '<',
              style: {
                display: window.screen.width <= 640 ? 'none' : 'flex',
                width: '4.375rem',
                height: '5rem',
                background: '#B24C24',
                alignSelf: 'center',
                position: 'absolute',
                left: '1rem',
                zIndex: '10',
                border: 'none',
                color: 'white',
                fontFamily: 'hotpointRegular',
                lineHeight: 0,
                padding: 0,
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.3rem',
                cursor: 'pointer',
                borderRadius: '11px',
                paddingBottom: '0.3rem',
              },
            }}
            itemsToShow={4}
            responsiveProps={[
              { minWidth: 1151, maxWidth: 1500, itemsToShow: 3 },
              { minWidth: 641, maxWidth: 1150, itemsToShow: 2 },
              { maxWidth: 640, itemsToShow: 1 },
            ]}
            speed={300}
            itemsToScroll={window.screen.width <= 1150 ? 1 : 3}
            infinite={false}
            dotsNav={{
              show: true,
              style: {
                background: '#bbc9c9',
                width: '3rem',
                height: '0.25rem',
                marginLeft: '0.25rem',
                marginRight: '0.25rem',
                cursor: 'pointer',
                border: 'none',
                borderRadius: 0,
              },
              activeClassName: 'activeDots',
            }}
            dotsNavWrapperProps={{
              style: {
                position: 'absolute',
                bottom: '-1rem',
              },
            }}
          >
            {singleRecipe?.relatedItems?.map(related => (
              <Link
                className={styles.buttonLinkRelated}
                page={'store.custom#single-recipe'}
                params={{ slug: correctFormat(related.name) }}
              >
                <div
                  style={{
                    width: 320,
                    padding: '1rem',
                  }}
                  key={related.id}
                >
                  <div className={styles.relatedImageDiv}>
                    <img
                      className={styles.relatedImg}
                      src={related.imageMobile}
                      alt=""
                    />
                  </div>
                  <div className={styles.relatedInfoDiv}>
                    <div className={styles.relatedInfo}>
                      <span className={styles.relatedInfoType}>
                        {related.type}
                      </span>
                      <span className={styles.relatedInfoName}>
                        {related.name}
                      </span>
                      <span className={styles.relatedInfoTime}>
                        <span>{related.level}</span> -{' '}
                        <span>{related.preparationtime}</span>
                      </span>
                    </div>
                    <Link
                    page={'store.custom#single-recipe'}
                    params={{ slug: correctFormat(related.name) }}
                    >
                      <button className={styles.relatedButton}>
                        <span className={styles.relatedButtonText}>
                          Per saperne di più &gt;
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  )
}

export default Related
