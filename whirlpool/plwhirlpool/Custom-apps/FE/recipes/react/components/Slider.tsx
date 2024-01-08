import React, { useState } from 'react'
import Carousel from 'react-simply-carousel'
import styles from '../styles.css'
import Details from './Details'
import Image from './Image'

interface SliderProps {
  singleRecipe: any
  imageListCheck: any
  brand: string
}

const Slider: StorefrontFunctionComponent<SliderProps> = ({
  singleRecipe,
  imageListCheck,
  brand,
}) => {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <div
      className={`${styles.carouselTopDiv} ${brand === 'whirlpool' &&
        styles.carouselTopDivCompact}`}
    >
      {brand === 'hotpoint' && (
        <>
          {imageListCheck(singleRecipe) ||
          typeof window === 'undefined' ? null : (
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
                    display: window?.screen?.width > 640 ? 'none' : 'flex',
                  },
                }}
              >
                {singleRecipe.images.map((img, index) => (
                  <div
                    className={styles.carouselMainImageContainer}
                    key={index}
                  >
                    <img className={styles.carouselTopImg} src={img} alt="" />
                  </div>
                ))}
              </Carousel>
              <div
                className={styles.sideCarouselContainer}
                style={
                  singleRecipe?.images?.length <= 3
                    ? { left: '0' }
                    : window?.screen?.width < 1200 &&
                      singleRecipe.images.length <= 3
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
                      background: '#197c83',
                      alignSelf: 'center',
                      zIndex: '10',
                      border: 'none',
                      color: 'white',
                      fontFamily: 'quicksandRegular',
                      display: 'flex',
                      lineHeight: 0,
                      padding: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '1.3rem',
                      cursor: 'pointer',
                      borderRadius: 0,
                      paddingBottom: '0.3rem',
                      marginLeft: '0.25rem',
                    },
                  }}
                  backwardBtnProps={{
                    children: '<',
                    style: {
                      width: 82,
                      height: 82,
                      background: '#197c83',
                      alignSelf: 'center',
                      zIndex: '10',
                      border: 'none',
                      color: 'white',
                      fontFamily: 'quicksandRegular',
                      display: 'flex',
                      lineHeight: 0,
                      padding: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '1.3rem',
                      cursor: 'pointer',
                      borderRadius: 0,
                      paddingBottom: '0.3rem',
                      marginRight: '0.25rem',
                    },
                  }}
                  itemsToShow={3}
                  speed={300}
                  infinite={false}
                >
                  {singleRecipe?.images?.map((img, index) => (
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
        </>
      )}
      {brand === 'hotpoint' && (
        <Details brand={brand} singleRecipe={singleRecipe} />
      )}
      {brand === 'whirlpool' && <Image singleRecipe={singleRecipe} />}
    </div>
  )
}

export default Slider
