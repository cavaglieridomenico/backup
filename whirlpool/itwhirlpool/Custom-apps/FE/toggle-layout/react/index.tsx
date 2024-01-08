/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import React, { Suspense } from 'react'

const ToggleLayout: StorefrontComponent = ({
  renderChildren = true,
  children,
} : {
  renderChildren: boolean
  children: React.ComponentType
}) => {
  if (!renderChildren) return null
  return <Suspense fallback={<></>}>{children}</Suspense>
}


ToggleLayout.schema = {
  title: 'Performance Container ',
  type: 'object',
  properties: {
    renderChildren: {
      title: 'Visible?',
      type: 'boolean',
      default: true,
    }
  }
}

export default ToggleLayout

