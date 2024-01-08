/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import React, { Suspense } from 'react'

const Experimental__VisibilityLayout: StorefrontFunctionComponent<VisibilityLayoutProps> = ({
  visible,
  children,
}) => {
  if (!visible) return null
  return <Suspense fallback={<></>}>{children}</Suspense>
}

interface VisibilityLayoutProps {
  visible: boolean
}

Experimental__VisibilityLayout.schema = {
  title: 'Performance Container ',
  type: 'object',
  properties: {},
}

export default Experimental__VisibilityLayout
