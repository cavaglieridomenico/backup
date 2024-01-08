import React from 'react'
import Skeleton from 'react-loading-skeleton'

import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['skeleton', 'skeleton-wrapper'] as const
interface Skeleton {
  height: string
  unit: string
}

function Loading({ height, unit }: Skeleton) {
  const handles = useCssHandles(CSS_HANDLES)
  let u = ''
  switch (unit) {
    case 'Pixel': {
      u = 'px'
      break
    }
    case 'Viewport': {
      u = 'vh'
      break
    }
    case 'Percentage': {
      u = '%'
      break
    }
    default: {
      u = 'px'
      break
    }
  }
  return (
    <Skeleton
      height={`${height}${u}`}
      className={handles.skeleton}
      containerClassName={handles['skeleton-wrapper']}
    />
  )
}

export default Loading
