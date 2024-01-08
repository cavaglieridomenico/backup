import React, {useLayoutEffect} from 'react'
import {useProduct} from 'vtex.product-context'
interface ChannelSightProps {
  textButton:string
}

const styleButton = {
  color:"white",
  backgroundColor:"#edb112",
  paddingTop: ".25em",
  paddingBottom: ".32em",
  paddingLeft:"1.5rem",
  paddingRight:"1.5rem",
  minHeight: "2.5rem",
  borderRadius: ".25rem",
  border:"none",
  cursor:"pointer",
  fontFamily:"myriadSemibold",
  fontSize:"1 rem"
}

const ChannelSight: StorefrontFunctionComponent<ChannelSightProps> = ({textButton}) => {
  const productContextValue = useProduct()

  console.log(styleButton)
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
    <button className={"cswidget"} data-asset-id="1302" data-product-sku={productContextValue.selectedItem.ean} style={styleButton}>{textButton}</button>
  )
}

ChannelSight.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    textButton:{
      title:"Text for button buy now",
      description:"",
      default:"",
      type:"string"
    }
  },
}

export default ChannelSight
