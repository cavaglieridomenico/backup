import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styles from  './skeleton.css'

interface Skeleton
{
  height: string,
  unit: string
}

function Loading({ height, unit }: Skeleton) {
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
      className={styles.skeleton}
      containerClassName={'skeletonWrapper'}
    />
  )
}

export default Loading
