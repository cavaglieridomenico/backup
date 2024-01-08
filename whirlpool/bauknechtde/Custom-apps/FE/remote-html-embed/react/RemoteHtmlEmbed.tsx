import React, {useEffect} from 'react';
import classnames from "classnames";

import style from "./style";
import Loader from './Loader';

interface RemoteHtmlEmbedProps {
  sourceUrl: string
}

const RemoteHtmlEmbed: StorefrontFunctionComponent<RemoteHtmlEmbedProps> = ({
  sourceUrl,
}) => {

  useEffect(() => {
    const url = new URL(sourceUrl);
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        const $embedWrapper = window.document.getElementById('remote-html-embed-wrapper');

        if ($embedWrapper !== null) {
          $embedWrapper.innerHTML = xhr.response.replaceAll('__BASEURL__', url.origin);

          const $scriptObject = window.document.getElementById('remote-html-embed-required-scripts');

          let $robotsTag = window.document.querySelector('meta[name="robots"][content="noindex"]');
          if ($robotsTag !== undefined && $robotsTag !== null) {
            $robotsTag.remove();
          }

          if ($scriptObject !== undefined && $scriptObject !== null && $scriptObject.dataset !== undefined && $scriptObject.dataset.scripts !== undefined) {

            let scriptsToEmbed = $scriptObject
              .dataset
              .scripts
              .split(',');

            let loadedScripts = 0;
            scriptsToEmbed
              .forEach(s => {
                let newScript = document.createElement('script');
                newScript.onload = function() {
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

    xhr.open('GET', sourceUrl, true);
    xhr.send('');
  }, [sourceUrl]);

  return (
    <div>
      <div id="remote-html-embed-loader">
        <Loader />
      </div>
      <div id="remote-html-embed-wrapper" className={classnames(style.embedWrapper)}></div>
    </div>
  )
}


RemoteHtmlEmbed.schema = {
  title: 'editor.remote_html_embed.title',
  description: 'editor.remote_html_embed.description',
  type: 'object',
  properties: {
    sourceUrl: {
        title: 'Source URL',
        description: 'Source URL for bootstrapping the HTML Embed',
        type: 'string',
        default: null,
    },
  }
}

export default RemoteHtmlEmbed
