import React from 'react'
import { canUseDOM } from 'vtex.render-runtime'
import Loading from './Skeleton'

const ToggleLayout: StorefrontComponent = ({
  renderChildren = true,
  children,
  skeletonVisible,
  height,
  heightUnit,
}: {
  renderChildren: boolean
  children: React.ComponentType
  skeletonVisible: boolean
  height: number
  heightUnit: string
}) => {
  console.log("Children" , children)
  if (!renderChildren) return null

  return canUseDOM? children : skeletonVisible ? (
    <Loading
      height={height ? height.toString() : '400'}
      unit={heightUnit ? heightUnit : 'px'}
    />
  ) : (
    children
  )
}
//@ts-ignore
ToggleLayout.schema = {
  title: 'Visibility-Toggle',
  description: 'A container that allows to select visibility and skeleton settings',
  type: 'object',
  properties: {
    renderChildren: {
      title: 'Visible?',
      type: 'boolean',
      default: true,
    },
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

export default ToggleLayout
