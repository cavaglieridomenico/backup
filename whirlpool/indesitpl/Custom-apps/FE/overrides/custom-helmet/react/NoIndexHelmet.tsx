import React from 'react'
import { Helmet } from 'vtex.render-runtime'
function NoIndexHelmet() {
  return (
    <Helmet>
      <meta name="robots" content="noindex" data-react-helmet="true" />
    </Helmet>
  )
}

export default NoIndexHelmet
