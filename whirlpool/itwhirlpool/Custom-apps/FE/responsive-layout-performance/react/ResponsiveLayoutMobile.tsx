import React, { Suspense, FC } from 'react'
import { useDevice } from 'vtex.device-detector'

const ResponsiveLayoutMobile: FC = ({ children }) => {
  const { isMobile } = useDevice()

  return isMobile ? <Suspense fallback={<></>}>{children}</Suspense> : null
}

export default ResponsiveLayoutMobile
