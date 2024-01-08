import React, { Suspense, FC } from 'react'
import { useDevice } from 'vtex.device-detector'

const ResponsiveLayoutTablet: FC = ({ children }) => {
  const { device } = useDevice()

  return device === 'tablet' ? (
    <Suspense fallback={<></>}>{children}</Suspense>
  ) : null
}

export default ResponsiveLayoutTablet
