import React, { useEffect } from 'react';
import classnames from "classnames";
import style from "./style";
import Loader from './Loader';
import { useRuntime } from 'vtex.render-runtime'
import MetaTags from './components/metaTags';
import { useQuery } from 'react-apollo'
import getQueryParams from "../graphql/getQueryParams.graphql"

interface RemoteHtmlEmbedProps {
  sourceUrl: string,
  dynamicUrl: boolean,
  dynamicUrlFrom: string,
  metaFrom: string
}

/*
 
  
  --- sourceUrl (string) --------------------------------------------------

  Specify the url where the remote HTML comes from.

  --- dynamicUrl (boolean) -------------------------------------------------

  Specify if the sourceUrl is composed with custom logic

  --- dynamicUrlFrom (string) ----------------------------------------------

  Specify how the sourceUrl is composed. Choose from:
    
    - urlPath

      The sourceUrl will be concatenated with the current page Path     
      
  --- metaFrom (string) ----------------------------------------------------
  
  Specify from where the metta tags feed comes from. Choose from:

   -  queryFromUrl

      The metatags will be retrieved trough a graphql query using the current page path

   -  vtexQueryParams

      The metatags will be retrieved from the VTEX runtime object
 
*/
const RemoteHtmlEmbed: StorefrontFunctionComponent<RemoteHtmlEmbedProps> = ({
  sourceUrl,
  dynamicUrl = false,
  dynamicUrlFrom = "urlPath",
  metaFrom = "none"
}) => {

  const runtime = useRuntime();
  const pagePath = runtime.route.canonicalPath;
  const queryParams = runtime.route.queryString;
  const { data } = useQuery(getQueryParams, {
    variables: {
      "from": pagePath
    },
    ssr: true
  });
  
  useEffect(() => {

    if (sourceUrl) {
      let processedUrl = sourceUrl;
      if (dynamicUrl) {
        switch (dynamicUrlFrom) {
          case "urlPath": processedUrl = processedUrl + pagePath
            break;
        }
      }

      const url = new URL(processedUrl);
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          const $embedWrapper = window.document.getElementById('remote-html-embed-wrapper');

          if ($embedWrapper !== null) {
            $embedWrapper.innerHTML = xhr.response.replaceAll('__BASEURL__', url.origin);

            const $scriptObject = window.document.getElementById('remote-html-embed-required-scripts');

            if ($scriptObject !== undefined && $scriptObject !== null && $scriptObject.dataset !== undefined && $scriptObject.dataset.scripts !== undefined) {

              let scriptsToEmbed = $scriptObject
                .dataset
                .scripts
                .split(',');

              let loadedScripts = 0;
              scriptsToEmbed
                .forEach(s => {
                  let newScript = document.createElement('script');
                  newScript.onload = function () {
                    loadedScripts++;
                    if (loadedScripts === scriptsToEmbed.length) {
                      window.dispatchEvent(new Event('remoteEmbedHtmlLoaded'));
                    }
                  }
                  newScript.setAttribute('src', s);
                  document.head.appendChild(newScript);
                });
            }


            setTimeout(() => {
              let $loader = window.document.getElementById('remote-html-embed-loader');
              if ($loader) {
                $loader.style.display = 'none';
              }
              let $embedder = window.document.getElementById('remote-html-embed-wrapper');
              if ($embedder) {
                $embedder.classList.add(classnames(style.embedWrapperVisible));
              }
            }, 1000);

          }
        }
      }

      xhr.open('GET', processedUrl, true);
      xhr.send('');
    }


  }, [sourceUrl]);

  return (
    <div>
      <div id="remote-html-embed-loader">
        <Loader />
      </div>
      <div id="remote-html-embed-wrapper" className={classnames(style.embedWrapper)}></div>

      {metaFrom !== "none" && (
          <MetaTags metaObject={metaFrom === "vtexQueryParams" ? queryParams : data && data.getVBaseQueryParam ? JSON.parse(JSON.parse(data.getVBaseQueryParam)) : {}}/>
      )}

    </div>

  )
}


RemoteHtmlEmbed.schema = {
  title: 'editor.remote_html_embed.title',
  description: 'editor.remote_html_embed.description',
  type: 'object',
  properties: {
    sourceUrl: {
      title: 'editor.sourceUrl.title',
      description: 'editor.sourceUrl.description',
      type: 'string',
      default: null,
    },
    dynamicUrl: {
      title: 'Dynamic Url',
      description: 'Either the component had dynamic path or not',
      type: 'boolean',
      default: false,
    },
    dynamicUrlFrom: {
      title: "Dynamic Url From",
      description: "Specify how the dynamic url is builded",
      enum: ["urlPath"],
      enumNames: ["From the page url"],
      widget: {
        "ui:widget": "radio",
      },
      default: "urlPath",
    },
    metaFrom: {
      title: "Meta object from",
      description: "Specify the meta ttags object feed",
      enum: ["none", "vtexQueryParams", "queryFromUrl"],
      enumNames: ["No meta", "From VTEX native query params", "From graphql query"],
      widget: {
        "ui:widget": "radio",
      },
      default: "vtexQueryParams",
    }
  }
}

export default RemoteHtmlEmbed
