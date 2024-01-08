import React from 'react'
import { Helmet } from 'vtex.render-runtime'

interface NoIndexHelmetProps {
  isIndex?: boolean;
}
const NoIndexHelmet: StorefrontFunctionComponent<NoIndexHelmetProps> = ({isIndex = true }) => {
  return(
    <>
    {isIndex ? (
    <Helmet>
      <meta name="robots" content="noindex" data-react-helmet="true" />
    </Helmet>
    ):(<div></div>)}
    </>
  )
};

NoIndexHelmet.schema = {
  title: "No Index Helmet",
  type: "object",
  properties: {
		isIndex: {
			type: 'boolean',
			default: true
		}
  }
};

export default NoIndexHelmet