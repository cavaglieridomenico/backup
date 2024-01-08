/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { useRuntime , Helmet} from 'vtex.render-runtime'

const wiaCanonicalFix = () => {
    const rt = useRuntime()
    if(rt?.page?.includes('services-diagnostic-des-anomalies') && rt?.page?.includes('--')){
        return <Helmet>
          {(rt?.page?.includes('--step2') || rt?.page?.includes('--step3')) && <meta name="robots" content="noindex"/>}
      <link rel="canonical"/>
    </Helmet>
    }
   
    return null
}


export default wiaCanonicalFix