import React, { useEffect, useState } from 'react'
import style from './style.css'
import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'
import getAwarded from '../graphql/getAwarded.graphql'
import { useDevice } from 'vtex.device-detector'

//import { useDevice } from 'vtex.device-detector'

const AwardedLogos: StorefrontFunctionComponent = () => {
  const {
    product: {
      items: [{ itemId }],
    },
  } = useProduct()

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

  const awardedLogos = data?.GetSKULogoSpecifications

  /*---------- ERROR HANDLING ----------*/
  if (error) {
    console.error(error)
    return <></>
  }

  //const [zoomed, setZoomed] = useState<number>(-1)
  const [zoomed, setZoomed] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window != undefined) {
      window.addEventListener('click', () => {
        zoomed && setZoomed(false)
      })
    }
  }, [typeof window, zoomed])

  // const { isMobile } = useDevice()
  const { isMobile } = useDevice()

  const zoomHandler = () => {
    isMobile && setZoomed(!zoomed)
  }

  /*---------- AWARDED LOGOS ----------*/
  return (
    <div className={style.awardedLogosContainer}>
      {awardedLogos?.length == 1 &&
        awardedLogos?.map((logoUrl: string, idx: number) => (
          // The container of each awarded logo has the same width
          <a href="javascript:void(0);" onClick={e => e.stopPropagation()}>
            <div
              style={{
                width: awardedLogos.length
                  ? `${100 / awardedLogos.length}%`
                  : 'auto',
              }}
              onClick={zoomHandler}
            >
              <img
                className={`${style.awardedLogoImage} ${
                  zoomed ? style.zoomedImage : style.notZoomedImage
                }`}
                src={logoUrl}
                alt="award-logo"
                key={idx}
                onClick={zoomHandler}
              />
            </div>
          </a>
        ))}
      {awardedLogos?.length > 1 &&
        awardedLogos?.map((logoUrl: string, idx: number) => (
          <a href="javascript:void(0);" onClick={e => e.stopPropagation()}>
            <div className={style.awardedLogoImagesContainer}>
              <img
                className={`${style.awardedLogoImages} ${
                  zoomed ? style.zoomed : style.notZoomed
                } `}
                src={logoUrl}
                alt="award-logo"
                key={idx}
                onClick={zoomHandler}
              />
            </div>
          </a>
        ))}
    </div>
  )
}

AwardedLogos.schema = {}

export default AwardedLogos
