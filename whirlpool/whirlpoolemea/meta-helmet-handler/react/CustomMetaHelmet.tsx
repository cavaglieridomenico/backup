import React from 'react'
import { Helmet } from 'vtex.render-runtime'

interface CustomMetaHelmetProps {
  metaTags?: MetaTag[]
}

interface MetaTag {
  name: string
  content: string
  isActive?: boolean
}

const CustomMetaHelmet: StorefrontFunctionComponent<CustomMetaHelmetProps> = ({
  metaTags = [],
}) => {
  const activeMetaTags =
    (metaTags && metaTags.filter((metaTag: MetaTag) => metaTag?.isActive)) ?? []
  return (
    <>
      {activeMetaTags.length > 0 && (
        <Helmet>
          {activeMetaTags.map((metaTag: MetaTag) => (
            <meta name={metaTag?.name ?? ''} content={metaTag?.content ?? ''} />
          ))}
        </Helmet>
      )}
    </>
  )
}

CustomMetaHelmet.schema = {
  title: 'Here you can handle your custom meta tag',
  type: 'object',
  properties: {
    metaTags: {
      type: 'array',
      title: 'Meta Tags',
      description: 'Add your custom meta tags',
      items: {
        type: 'object',
        properties: {
          isActive: {
            type: 'boolean',
            default: true,
          },
          name: {
            title: 'Meta Tag Name',
            description: 'Set the meta tag name',
            type: 'string',
            default: '',
          },
          content: {
            title: 'Meta Tag Content',
            description: 'Set the meta tag content',
            type: 'string',
            default: '',
          },
        },
      },
    },
  },
}

export default CustomMetaHelmet
