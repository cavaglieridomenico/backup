import React from 'react'
import Skeleton from 'react-loading-skeleton'

import style from "./style.css"
interface Skeleton {
  height: string
}

function Loading({ height}: Skeleton) {
  return (
    <Skeleton
      height={`${height}px`}
      className={style.skeleton}
      containerClassName={style.skeletonWrapper}
    />

  )
}

export default Loading
