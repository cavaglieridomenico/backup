import React, { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { css_handles } from '../types/styles'
import '../styles/styles.css'

const Skeleton: FC = () => {
  const handles = useCssHandles(css_handles)

  return <div className={`${handles.container__skeleton}`}></div>
}

export default Skeleton
