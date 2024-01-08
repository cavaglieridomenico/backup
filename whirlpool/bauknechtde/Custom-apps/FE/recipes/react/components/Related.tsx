import React, { useState } from 'react'
import styles from '../styles.css'
import Carousel from 'react-simply-carousel'
import { Link } from 'vtex.render-runtime'
import './styles.global.css'
// import { correctFormat } from '../utils/utils'

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
        <span className={styles.relatedTitle}>
          <p className={styles.relatedTitleText}>Ähnliche Rezepte</p>
        </span>
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
              className: styles.rightArrowButton,
            }}
            backwardBtnProps={{
              children: '<',
              className: styles.leftArrowButton,
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
                display: window.screen.width <= 640 && 'none',
                position: 'absolute',
                bottom: '-4rem',
              },
            }}
          >
            {singleRecipe?.relatedItems?.map(related => (
              <Link
                to={`/rezepte/details/${related.nameNormalized}`}
                className={styles.buttonLinkRelated}
                page={'store.custom#single-recipe'}
                params={{ slug: related.nameNormalized }}
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
                      to={`/rezepte/details/${related.nameNormalized}`}
                      page={'store.custom#single-recipe'}
                      params={{ slug: related.nameNormalized }}
                    >
                      <button className={styles.relatedButton}>
                        <span className={styles.relatedButtonText}>
                          Rezept entdecken &gt;
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
