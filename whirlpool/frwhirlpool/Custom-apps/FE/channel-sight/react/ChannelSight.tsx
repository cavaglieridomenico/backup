import React, {useLayoutEffect} from 'react'
import {useProduct} from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
interface ChannelSightProps {
  textButton:string,
  idDataAsset:string
}

const CSS_HANDLES = ['channelsight']

const ChannelSight: StorefrontFunctionComponent<ChannelSightProps> = ({idDataAsset = "1333"}) => {
  const productContextValue = useProduct()
  const handleAddToCart: React.MouseEventHandler = event => {
      event.stopPropagation()
      event.preventDefault()
    }

    const handles = useCssHandles(CSS_HANDLES)
  
    //const button = "<button class=\"cswidget\" data-asset-id=\"1302\" data-product-sku="+productContextValue.selectedItem.ean+">"+textButton+"</button>"
  useLayoutEffect(()=>{
      let previousScript :any
      const script = document.createElement('script')
      script.src = 'https://cscoreproweustor.blob.core.windows.net/widget/scripts/cswidget.loader.js'
      //script.async = true
      script.setAttribute('type','text/javascript')  
      script.setAttribute('defer', '')
      const head = document.querySelector("head")
      head?.appendChild(script)
      previousScript = script
    
    return () => {
			// Remove the script
			previousScript?.parentNode?.removeChild(previousScript) // remove from the DOM tree
			previousScript = null // Trigger the garbage collector to free some RAM to avoi memory leak
			// Remove the button
      ;(document as Document).getElementById('cswidgetjs')?.remove() // Remove the script imported automatically
      ;(document as Document).getElementById('cswidgetstyle3')?.remove() // Remove the style imported automatically
			;(document as Document)
				.querySelectorAll(".csWidgetModal")
				.forEach((e: Element | null) => {
					e?.remove() // remove from the DOM tree
					e = null // Trigger the garbage collector to free some RAM to avoi memory leak
			})
    }
  },[])

  
  return (
    <button className={`${handles.channelsight} cswidget`} data-asset-id={idDataAsset} onClick={handleAddToCart} data-product-sku={productContextValue.selectedItem.ean}>
      {/* {textButton} */}
      Où acheter
    </button>
  )
}

ChannelSight.schema = {
  title: 'editor.channelSight.title',
  description: 'editor.channelSight.description',
  type: 'object',
  properties: {
    textButton:{
      title:"Text for button buy now",
      description:"",
      default:"",
      type:"string"
    },
    idDataAsset:{
      title:"id for data asset id",
      description:"",
      default:null,
      type:"string"
    }
  },
}

export default ChannelSight
