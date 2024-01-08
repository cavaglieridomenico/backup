import React, { Suspense } from 'react'
export default function Experimental__VisibilityLayout({
  visible,
  children,
}: VisibilityLayoutProps) {
  if (!visible) return null
  return <Suspense fallback={<></>}>{children}</Suspense>
}

interface VisibilityLayoutProps {
  visible: boolean
  children: any
}

Experimental__VisibilityLayout.schema = {
  title: 'Performance Container ',
  type: 'object',
  properties: {},
}
