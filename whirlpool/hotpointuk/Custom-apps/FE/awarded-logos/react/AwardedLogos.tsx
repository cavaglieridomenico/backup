import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import getAwarded from '../graphql/getAwarded.graphql'
// import ContentLoader from 'react-content-loader'

const CSS_HANDLES = ['awardedLogosContainer', 'awardedLogoImage']

const AwardedLogos: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  // const {
  //   product: {
  //     items: [{ itemId }],
  //   },
  // } = useProduct()
  const { product } = useProduct()
  const itemId = product?.items?.[0]?.itemId

  /*---------- QUERY TO RETRIEVE AWARDED LOGOS ----------*/
  const {
    data,
    // loading,
    error,
  } = useQuery(getAwarded, {
    variables: {
      skuId: itemId,
    },
  })
  const awardedLogos = data?.productLogos
  /*---------- ERROR HANDLING ----------*/
  if (error) {
    console.error(error)
    return <></>
  }

  /*---------- SKELETON WHEN LOADING ----------*/
  // if (loading) {
  //   return (
  //     <>
  //       <ContentLoader
  //         speed={2}
  //         width={400}
  //         height={160}
  //         viewBox="0 0 400 160"
  //         backgroundColor="#f3f3f3"
  //         foregroundColor="#ecebeb"
  //       >
  //         <rect x="11" y="10" rx="8" ry="8" width="56" height="56" />
  //       </ContentLoader>
  //     </>
  //   )
  // }

  /*---------- AWARDED LOGOS ----------*/
  return (
    <div className={handles.awardedLogosContainer}>
      {awardedLogos?.map((logoUrl: string) => (
        <img
          className={handles.awardedLogoImage}
          src={logoUrl}
          alt="award-logo"
        />
      ))}
    </div>
  )
}

AwardedLogos.schema = {}

export default AwardedLogos
