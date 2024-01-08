import React, { useState } from 'react'
import Carousel from 'react-simply-carousel'
import styles from '../styles.css'

interface SliderProps {
  singleRecipe: any
  imageListCheck: any
}

const Slider: StorefrontFunctionComponent<SliderProps> = ({
  singleRecipe,
  imageListCheck,
}) => {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <div className={styles.carouselTopDiv}>
      {imageListCheck(singleRecipe) ? null : (
        <div className={styles.carouselTopContainer}>
          <Carousel
            containerProps={{
              style: {
                width: '100%',
                justifyContent: 'center',
                maxWidth: '550px',
              },
            }}
            activeSlideIndex={activeSlide}
            onRequestChange={setActiveSlide}
            forwardBtnProps={{
              style: {
                display: 'none',
              },
            }}
            backwardBtnProps={{
              style: {
                display: 'none',
              },
            }}
            itemsToShow={1}
            speed={300}
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
                display: window.screen.width > 640 ? 'none' : 'flex',
              },
            }}
          >
            {singleRecipe?.imageList?.map((img, index) => (
              <div className={styles.carouselMainImageContainer} key={index}>
                <img className={styles.carouselTopImg} src={img} alt="" />
              </div>
            ))}
          </Carousel>
          <div
            className={styles.sideCarouselContainer}
            style={
              singleRecipe.imageList.length <= 3
                ? { left: '0' }
                : window.screen.width < 1200 &&
                  singleRecipe.imageList.length <= 3
                ? { left: '-25%' }
                : { left: '-12%' }
            }
          >
            <Carousel
              updateOnItemClick
              containerProps={{
                style: {
                  justifyContent: 'center',
                  maxWidth: 500,
                },
              }}
              activeSlideIndex={activeSlide}
              onRequestChange={setActiveSlide}
              forwardBtnProps={{
                children: '>',
                style: {
                  width: 82,
                  height: 82,
                  background: 'white',
                  alignSelf: 'center',
                  zIndex: '10',
                   border: '1px solid #B24C24',
                  color: '#B24C24',
                  fontFamily: 'hotpointRegular',
                  display: 'flex',
                  lineHeight: 0,
                  padding: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  borderRadius: '11px',
                  paddingBottom: '0.3rem',
                  marginLeft: '0.25rem',
                },
              }}
              backwardBtnProps={{
                children: '<',
                style: {
                  width: 82,
                  height: 82,
                  background: 'white',
                  alignSelf: 'center',
                  zIndex: '10',
                  border: '1px solid #B24C24',
                  color: '#B24C24',
                  fontFamily: 'hotpointRegular',
                  display: 'flex',
                  lineHeight: 0,
                  padding: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  borderRadius: '11px',
                  paddingBottom: '0.3rem',
                  marginRight: '0.25rem',
                },
              }}
              itemsToShow={3}
              speed={300}
              infinite={false}
            >
              {singleRecipe.imageList.map((img, index) => (
                <div
                  className={styles.carouselTopImgSmallContainer}
                  style={{
                    width: 90,
                    height: 90,
                    padding: '.25rem',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  key={index}
                >
                  <img
                    className={
                      activeSlide == index
                        ? styles.carouselTopImgSmallActive
                        : styles.carouselTopImgSmall
                    }
                    src={img}
                    alt=""
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
      <div className={styles.carouselTopTextDiv}>
        <div className={styles.carouselTopTextContainer}>
          <h1 className={styles.carouselTopTextName}>{singleRecipe.name}</h1>
          <span className={styles.carouselTopTextDesc}>
            {singleRecipe.description}
          </span>
          <span className={styles.carouselTopTextSubDesc}>
            {singleRecipe.subdescription}
          </span>
          <span className={styles.carouselTopTextTime}>
            <svg
              className={styles.clockSvg}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#B24C24"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <span>{singleRecipe.cooktime}</span>
          </span>
          <span className={styles.carouselTopTextPrep}>
            <svg
              className={styles.clockSvg}
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#B24C24"
            >
              <g>
                <path d="M0,0h24v24H0V0z" fill="none" />
              </g>
              <g>
                <g>
                  <path d="M16.13,15.13L18,3h-4V2h-4v1H5C3.9,3,3,3.9,3,5v4c0,1.1,0.9,2,2,2h2.23l0.64,4.13C6.74,16.05,6,17.43,6,19v1 c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2v-1C18,17.43,17.26,16.05,16.13,15.13z M5,9V5h1.31l0.62,4H5z M15.67,5l-1.38,9H9.72L8.33,5 H15.67z M16,20H8v-1c0-1.65,1.35-3,3-3h2c1.65,0,3,1.35,3,3V20z" />
                  <circle cx="12" cy="18" r="1" />
                </g>
              </g>
            </svg>
            <span>{singleRecipe.preparationtime}</span>
          </span>
          <span className={styles.carouselTopTextLevel}>
            <svg
              className={styles.clockSvg}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#B24C24"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />
            </svg>
            <span>{singleRecipe.level}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Slider
