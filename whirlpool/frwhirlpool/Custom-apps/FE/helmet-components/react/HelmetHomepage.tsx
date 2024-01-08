import React, {FC} from 'react';
import { Helmet } from 'vtex.render-runtime'

interface HelmetHomepageProps {
  metaName: string,
  metaContent: string
}

const HelmetHomepage: FC<HelmetHomepageProps> = ({
  metaName = "facebook-domain-verification",
  metaContent = "qnszfqeq9ct05scpzk85qhg7ujkm2a"
}) => {

  return <>
    <Helmet>
      <meta name={metaName} content={metaContent} />
    </Helmet>
  </>
}

//@ts-ignore
HelmetHomepage.schema = {
  title: "HelmetHomepage",
  description: "HelmetHomepage component",
  type: "object",
  properties: {
    metaName: {
      title: "Meta Name",
      description: "Meta name inserted in meta tag",
      default: "facebook-domain-verification",
      type: "string"
    },
    metaContent: {
      title: "Meta Content",
      description: "Meta content inserted in meta tag",
      default: "qnszfqeq9ct05scpzk85qhg7ujkm2a",
      type: "string"
    },
  }
}

export default HelmetHomepage
