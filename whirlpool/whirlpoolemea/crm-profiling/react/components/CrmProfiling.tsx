import React, { useEffect, useState } from 'react'
import { Helmet } from 'vtex.render-runtime'
import getAppSettings from '../graphql/queries/getAppSettings.graphql'
import { useQuery } from 'react-apollo'
import { AppSettings, appInfos } from '../types/app_settings'
import { useCssHandles } from 'vtex.css-handles'
import { css_handles } from '../types/styles'
import Skeleton from './Skeleton'

interface CrmProfilingProps {
  children?: any
  metaTags?: MetaTag[]
}

interface MetaTag {
  name?: string
  content?: string
}

const CrmProfiling: StorefrontFunctionComponent<CrmProfilingProps> = ({
  children,
  metaTags = [{ name: 'robots', content: 'noindex' }],
}) => {
  // CSS HANDLES FOR STYLE
  const handles = useCssHandles(css_handles)
  const [loading, setLoading] = useState<boolean>(true)
  // GET APP SETTINGS DATA
  const { data } = useQuery(getAppSettings, {
    ssr: false,
    variables: {
      app: `${appInfos.vendor}.${appInfos.appName}`,
      version: appInfos.version,
    },
  })
  const settings: AppSettings =
    data && JSON.parse(data?.publicSettingsForApp?.message)
  const crmProfilingApiEndpoint =
    settings?.crmProfilingApiEndpoint ?? '/_v/user/profiling'
  // TAKE QUERY PARAMETERS FROM URL
  const queryString = window?.location?.search
  const urlParams = queryString ? new URLSearchParams(queryString) : null
  const crmProfilingApiBody = {
    email: urlParams ? urlParams?.get('email') : '',
    profilingOptin: urlParams
      ? urlParams?.get('profilingOptin') === 'true'
      : false,
    dig: urlParams ? urlParams?.get('dig') : '',
    firstName: urlParams ? urlParams?.get('name') : '',
    lastName: urlParams ? urlParams?.get('surname') : '',
  }

  const handleApiCall = (retries: number) => {
    setLoading(true)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: crmProfilingApiBody ? JSON.stringify(crmProfilingApiBody) : null,
    }
    fetch(crmProfilingApiEndpoint, options)
      .then((res: any) => {
        if (res.ok) {
          // console.log('🚀 ~ file: CrmProfiling.tsx:50 ~ .then ~ res:', res)
          return
        }
        if (retries > 1) {
          return handleApiCall(retries - 1)
        }
        throw new Error(res.status)
      })
      .catch((error: any) => console.error(error))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (crmProfilingApiEndpoint && crmProfilingApiBody) {
      handleApiCall(3)
    }
  }, [])

  return (
    <>
      {metaTags && metaTags.length > 0 && (
        <Helmet>
          {metaTags.map((metaTag: MetaTag) => (
            <meta name={metaTag?.name} content={metaTag?.content} />
          ))}
        </Helmet>
      )}
      {loading ? (
        <Skeleton />
      ) : (
        <div className={`${handles.container} flex flex-column w-100`}>
          {children}
        </div>
      )}
    </>
  )
}

CrmProfiling.schema = {
  title: 'Crm Profiling',
  description: 'Crm Profiling thank you page content',
  type: 'object',
  properties: {
    metaTags: {
      type: 'array',
      title: 'Meta Tags',
      description: 'Add meta tags',
      items: {
        type: 'object',
        properties: {
          name: {
            title: 'Name',
            description: 'Set the meta tag name',
            type: 'string',
            widget: {
              'ui:widget': 'textarea',
            },
          },
          content: {
            title: 'Content',
            description: 'Set the meta tag content',
            type: 'string',
            widget: {
              'ui:widget': 'textarea',
            },
          },
        },
      },
    },
  },
}

export default CrmProfiling
