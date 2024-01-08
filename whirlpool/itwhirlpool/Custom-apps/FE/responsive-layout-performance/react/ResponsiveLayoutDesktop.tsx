import React, { Suspense, FC } from 'react'
import { useDevice } from 'vtex.device-detector'

const ResponsiveLayoutDesktop: FC = ({ children }) => {
  const { device } = useDevice()

  return device === 'desktop' ? (
    <Suspense fallback={<></>}>{children}</Suspense>
  ) : null
}

export default ResponsiveLayoutDesktop
