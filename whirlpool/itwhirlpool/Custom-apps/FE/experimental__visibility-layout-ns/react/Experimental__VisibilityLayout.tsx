/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { canUseDOM } from 'vtex.render-runtime'
import Loading from './Skeleton'

//@ts-ignore
const Experimental__VisibilityLayout: StorefrontFunctionComponent<VisibilityLayoutProps> = ({
  visible,
  children,
  skeletonVisible,
  height,
  heightUnit,
}) => {
  if (!visible) return null

  return canUseDOM ? (
    children
  ) : skeletonVisible ? (
    <Loading
      height={height ? height.toString() : '400'}
      unit={heightUnit ? heightUnit : 'px'}
    />
  ) : (
    children
  )
}

interface VisibilityLayoutProps {
  visible: boolean
  skeletonVisible: boolean
  height: number
  heightUnit: string
}

Experimental__VisibilityLayout.schema = {
  title: 'Performance Container ',
  type: 'object',
  properties: {
    skeletonVisible: {
      type: 'boolean',
      description: 'Toggle this to load the component with a skeleton ',
      title: 'Skeleton Toggle',
    },
    height: {
      type: 'number',
      description: 'Specify the height for the element to visualize correctly',
      title: 'Container Height',
    },
    heightUnit: {
      type: 'string',
      description: 'Specify the preferred height unit',
      title: 'Height Unit',
      enum: ['Pixel', 'Viewport', 'Percentage'],
    },
  },
}

export default Experimental__VisibilityLayout
