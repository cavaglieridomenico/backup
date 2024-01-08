import React, { useEffect } from 'react'
import Carousel from './Carousel'
import relatedProducts from './relatedProducts'

interface CarouselSalesforceProps {}

const CarouselSalesforce: StorefrontFunctionComponent<
  CarouselSalesforceProps
> = ({}) => {
  const bannersArray = relatedProducts.items
  const bannerProps = {
    height: 420,
    mobileImage: '',
    page: '',
    externalRoute: true,
    runtime: '',
    params: '',
    tabletImage: '',
    customInternalURL: '',
  }
  const items = bannersArray.map(banner => {
    return { ...banner, ...bannerProps }
  })
  useEffect(() => {
    try {
      fetch(
        `https://7329181.recs.igodigital.com/a/v2/7329181/product_it_wh/recommend.json`,
        {
          headers: {
            authority: '7329181.recs.igodigital.com',
            OPTIONS:
              'a/v2/7329181/product_it/recommend.json?locale=it_IT&callback=jsonp_callback_21172',
            accept: '/',
            'Api-key': 'eac75250-6b3b-11e9-a1aa-063c1e816f18',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Allow-Origin':
              'https://mohamedqa--itwhirlpoolqa.myvtex.com',
            Origin: 'https://mohamedqa--itwhirlpoolqa.myvtex.com',
            method: 'GET',
            scheme: 'https',
            'Access-Control-Request-Headers': 'Content-Type',
          },
        }
      )
        .then(response => response.json())
    } catch (err) {
      console.log(err)
    }
  }, [])
  return (
    <>
      <div
        className={
          'vtex-shelf-1-x-title vtex-shelf-1-x-title--margin3125 vtex-shelf-1-x-title--slideMargin vtex-shelf-1-x-title--slide20width t-heading-2 fw3 w-100 flex justify-center pt7 pb6 c-muted-1'
        }
      >
        Suggeriti per te
      </div>
      <Carousel
        height={591}
        autoplay={true}
        showDots={false}
        showArrows={false}
        autoplaySpeed={5}
        banners={items}
      />
    </>
  )
}

CarouselSalesforce.schema = {
  title: 'editor.carouselSalesforce.title',
  description: 'editor.carouselSalesforce.description',
  type: 'object',
  properties: {},
}

export default CarouselSalesforce
