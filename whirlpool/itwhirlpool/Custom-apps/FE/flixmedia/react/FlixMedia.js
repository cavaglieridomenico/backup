import React, { useEffect } from 'react'
import publicAppSettings from './graphql/publicAppSettings.gql'
import { graphql } from 'react-apollo'
import withProductContext from './components/withProductContext'


function FlixMedia({
  data: { loading, publicAppSettings },
  product,
  selectedItem,
}) {
  useEffect(() => {
    if (loading) {
      return
    }
    const sku = selectedItem ? selectedItem : product.items[0]
    const referenceId = product.productReference
    /*
    const referenceId =
      sku && sku.referenceId && sku.referenceId.length > 0
        ? sku.referenceId[0].Value //DOVE SI TROVA STO MPN??
        : ''
    */
    const script = document.createElement('script')
    script.src = "//media.flixfacts.com/js/loader.js"
    script.async = true
    script.setAttribute('id', 'flixmedia')
    script.setAttribute('data-flix-distributor',"16197")

    script.setAttribute('data-flix-ean', "")
    script.setAttribute('data-flix-mpn', referenceId)
    script.setAttribute('data-flix-language', "it")
    script.setAttribute('data-flix-3d', 'flix-3dfw')
    script.setAttribute('data-flix-hotspot', 'true')
    script.setAttribute('data-flix-autoload', 'hotspot')

    document.head.appendChild(script)

    return () => {
      const previousScript = document.getElementById('flixmedia')
      const previousContainer = document.getElementById('flix_hotspots')
      console.log("return")
      if (previousScript && previousScript.parentNode) {
        previousScript.parentNode.removeChild(previousScript)
      }
      if(previousContainer){
        console.log("item")
        previousContainer.remove()
      }
    }
  }, [loading, product, selectedItem, publicAppSettings]);

  return (
    <>
      <div id="flix-3dfw" className={"vtex__flixmedia"}></div>
    </>  
     )
}

const withPublicAppSettings = graphql(publicAppSettings, {
  options: () => ({
    ssr: false,
  }),
})

export default withPublicAppSettings(withProductContext(FlixMedia))
