import React, {useEffect} from 'react'
import { FunctionComponent } from "react"
import { usePixel } from "vtex.pixel-manager"

interface Props {}

const  PixelEvent : FunctionComponent<Props> = () => {

  const pixelContent = usePixel()
  useEffect(()=>{
    pixelContent.push({event:"pageComponentInteraction",id:"optin_granted"})
  },
  [])
  return <></>
}

export default PixelEvent
