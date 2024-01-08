import React, { Suspense, FC } from 'react'
import { useDevice } from 'vtex.device-detector'

const ResponsiveLayoutPhone: FC = ({ children }) => {
  const { device } = useDevice()

  return device === 'phone' ? (
    <Suspense fallback={<></>}>{children}</Suspense>
  ) : null
}

export default ResponsiveLayoutPhone
