/* eslint-disable */
import React from 'react'
import { useRuntime, Helmet } from 'vtex.render-runtime'
const WiaCanonicalFix = () => {
  const rt = useRuntime()
  if (
    rt?.route?.path.includes('problemi-e-soluzioni') &&
    rt?.route?.path.includes('--')
  ) {
    return (
      <Helmet>
        {(rt?.route?.path.includes('--step2') ||
          rt?.route?.path.includes('--step3')) && (
          <meta name="robots" content="noindex" />
        )}
        <link rel="canonical" />
      </Helmet>
    )
  }

  return null
}

export default WiaCanonicalFix
