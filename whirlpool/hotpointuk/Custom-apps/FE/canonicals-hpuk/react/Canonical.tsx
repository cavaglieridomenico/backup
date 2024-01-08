// @ts-ignore
import React from 'react'
// @ts-ignore
import { Helmet } from 'vtex.render-runtime'


function Canonical(
  // @ts-ignore
  isIndex, isTrue,

) {

  return (<>
   {isIndex.isIndex && <Helmet>
    <link  data-react-helmet="true" rel="canonical" href={isIndex.isIndex}/>
    </Helmet>}</>
  )
}

Canonical.schema = {
  title: 'Canonical url',
  type: 'object',
  properties: {
    isIndex: {
      title: 'Canonical url',
      type: 'string'
    
    }
  }
}

export default Canonical