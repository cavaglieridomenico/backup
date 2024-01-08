import React from 'react'
import { Image } from 'vtex.store-image'
import type { ImagesSchema } from './typings/images'

export const ImagesFromSchema = (
  images: ImagesSchema,
  isMobile: boolean,
  height: string | number,
  preload?: boolean,
  blockClass?:any
) => {
  return images.map(
    (
      {
        image,
        mobileImage,
        description,
        experimentalPreventLayoutShift,
        width = '100%',
        ...props
      },
      idx
    ) => (
      <Image
        key={idx}
        src={isMobile && mobileImage ? mobileImage : image}
        alt={description}
        maxHeight={height}
        width={width}
        experimentalPreventLayoutShift={experimentalPreventLayoutShift}
        preload={preload && idx === 0}
        blockClass={blockClass}
        {...props}
      />
    )
  )
}