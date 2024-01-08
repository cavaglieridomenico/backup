import React from 'react'
import Skeleton from 'react-loading-skeleton'

import style from "./style.css"
interface Skeleton {
  height: string
  count: number
}

function Loading({ height , count }: Skeleton) {
  return (
    <>
    <Skeleton
      height={`${height}px`}
      className={style.skeleton}
      containerClassName={style.skeletonWrapper}
    />
    <Skeleton
      count={count}
      className={style.skeleton}
      containerClassName={style.skeletonWrapper}
      style={{height:"50px"}}
    />
    </>
  )
}

export default Loading
