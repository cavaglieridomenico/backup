import React from 'react'
import { Helmet, canUseDOM} from 'vtex.render-runtime'
function CustomHelmet() {
  return (
    <Helmet>
      <meta name="description" content="" data-react-helmet="true" />
      <title data-react-helmet="true"></title>
      <link
        rel="canonical"
        href={canUseDOM ? window.location.href : undefined}
      />
    </Helmet>
  )
}

export default CustomHelmet
