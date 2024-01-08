import React from "react";
import { Helmet } from 'vtex.render-runtime';

interface Props {
  metaObject: any
};

const MetaTags: StorefrontFunctionComponent<Props> = ({ metaObject }) => {
  const buildMeta = (obj: any) => {
    let snippet: any;

    const parsedObj = JSON.parse(obj);

    switch (parsedObj.type) {
      case "LEGACY":
        snippet = <meta name={parsedObj.name} content={parsedObj.content} />
        break;
      case "OG":
        snippet = <meta property={parsedObj.property} content={parsedObj.content} />
        break;
      case "TITLE":
        snippet = parsedObj.value.includes("Hotpoint") ? <title>{`${parsedObj.value} - Hotpoint`}</title> : <title>{parsedObj.value}</title>
        break;
      case "HTTP":
        snippet = <meta http-equiv={parsedObj.http_equiv} content={parsedObj.content} />
        break;
      case "CHARSET":
        snippet = <meta charSet={parsedObj.charSet} />
        break;
      case "STRUCTURED_DATA":
        try {
          snippet = <script type="application/ld+json">{JSON.stringify(parsedObj.data)}</script>
        } catch (error) {
          snippet = <script type="application/ld+json">Not a valid JSON object</script>
        }
        break
      default:
        break
    }

    return snippet;
  }

  return (
    <Helmet>
      {Object.keys(metaObject).map(key => buildMeta(metaObject[key]))}
    </Helmet>
  );
};

export default MetaTags;