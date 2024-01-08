import React, { useState, useEffect } from 'react'
import styles from '../styles.css'
import Carousel from 'react-simply-carousel'
import Recipe from './Recipe'
import './styles.global.css'
import { useQuery } from 'react-apollo'
import RELATED_RECIPES_QUERY from '../../graphql/related.gql'
import { useIntl, defineMessages } from 'react-intl'

interface RelatedProps {
  brand: string
  ids: string[]
}

const messages = defineMessages({
  related: { id: 'recipes.single.related' },
})

const Related: StorefrontFunctionComponent<RelatedProps> = ({ brand, ids }) => {
  const intl = useIntl()
  const { loading, error, data } = useQuery(RELATED_RECIPES_QUERY, {
    variables: {
      query: {
        facets: [
          {
            name: 'id',
            values: ids,
          },
        ],
      },
    },
  })
  const [activeSlide, setActiveSlide] = useState(0)
  const [mounted, setMounted] = useState(false)

  const forwardBtnProps = {
    children: '>',
    style: {
      display: window?.screen?.width <= 640 ? 'none' : 'flex',
      width: '4.375rem',
      height: '5rem',
      background: '#197c83',
      alignSelf: 'center',
      position: 'absolute',
      right: '1rem',
      zIndex: '10',
      border: 'none',
      color: 'white',
      fontFamily: 'quicksandRegular',
      lineHeight: 0,
      padding: 0,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.3rem',
      cursor: 'pointer',
      borderRadius: 0,
      paddingBottom: '0.3rem',
    },
  }
  const backwardBtnProps = {
    children: '<',
    style: {
      display: window?.screen?.width <= 640 ? 'none' : 'flex',
      width: '4.375rem',
      height: '5rem',
      background: '#197c83',
      alignSelf: 'center',
      position: 'absolute',
      left: '1rem',
      zIndex: '10',
      border: 'none',
      color: 'white',
      fontFamily: 'quicksandRegular',
      lineHeight: 0,
      padding: 0,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.3rem',
      cursor: 'pointer',
      borderRadius: 0,
      paddingBottom: '0.3rem',
    },
  }

  const forwardBtnPropsCompact = {
    children: null,
    style: {
      display: 'none',
    },
  }
  const backwardBtnPropsCompact = {
    children: null,
    style: {
      display: 'none',
    },
  }

  const dotsNav = {
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
  }
  const dotsNavCompact = {
    show: true,
    style: {
      background: '#bbc9c9',
      width: '0.55rem',
      height: '0.55rem',
      marginLeft: '0.25rem',
      marginRight: '0.25rem',
      cursor: 'pointer',
      border: 'none',
      borderRadius: 100,
      padding: '0',
    },
    activeClassName: 'activeDotsCompact',
  }

  //check if i m not on server side render
  useEffect(() => {
    if (window) {
      setMounted(true)
    }
  }, [])

  return (
    <>
      {typeof window !== 'undefined' &&
        mounted &&
        !loading &&
        !error &&
        data?.queryRecipes?.recipes && (
          <div
            className={`${styles.relatedCarouselContainer} ${brand ===
              'whirlpool' && styles.relatedCarouselContainerCompact}`}
          >
            <span
              className={`${styles.relatedTitle} ${brand === 'whirlpool' &&
                styles.relatedTitleCompact}`}
            >
              {intl.formatMessage(messages.related)}
            </span>
            <div
              className={`${styles.relatedCarouselDiv} ${brand ===
                'whirlpool' && styles.relatedCarouselDivCompact}`}
            >
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
                forwardBtnProps={
                  brand === 'hotpoint'
                    ? forwardBtnProps
                    : forwardBtnPropsCompact
                }
                backwardBtnProps={
                  brand === 'hotpoint'
                    ? backwardBtnProps
                    : backwardBtnPropsCompact
                }
                itemsToShow={brand === 'whirlpool' ? 3 : 4}
                responsiveProps={[
                  {
                    minWidth: 1151,
                    maxWidth: 1700,
                    itemsToShow: brand === 'whirlpool' ? 3 : 4,
                  },
                  { minWidth: 641, maxWidth: 1150, itemsToShow: 1 },
                  { maxWidth: 640, itemsToShow: 1 },
                ]}
                speed={300}
                itemsToScroll={
                  window?.screen?.width <= 1150
                    ? 1
                    : brand === 'hotpoint'
                    ? 4
                    : 3
                }
                infinite={false}
                dotsNav={brand === 'hotpoint' ? dotsNav : dotsNavCompact}
                dotsNavWrapperProps={{
                  style: {
                    position: 'absolute',
                    display: 'flex',
                    flexFlow: 'row',
                    bottom: '-1rem',
                  },
                }}
              >
                {data?.queryRecipes?.recipes.map(related => (
                  <div style={{ width: '300px' }}>
                    <Recipe
                      brand={brand}
                      recipe={related}
                      width={brand === 'whirlpool' ? '280px' : '280px'}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        )}
    </>
  )
}

export default Related
