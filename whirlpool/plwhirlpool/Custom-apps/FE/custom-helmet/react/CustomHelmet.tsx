import React from 'react'
import { Helmet } from 'vtex.render-runtime'
function CustomHelmet() {
  return (
    <Helmet>
      <meta name="description" content="" data-react-helmet="true" />
      <title data-react-helmet="true"></title>
      <link rel="canonical"/>
    </Helmet>
  )
}

export default CustomHelmet
