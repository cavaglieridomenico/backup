
import React ,  {useState} from 'react'
import { canUseDOM } from "vtex.render-runtime";

export default function PdpAggregateData(){
  if(canUseDOM)
  { 
      const productScript = document.querySelectorAll('script[type="application/ld+json"]')
      for (let i = 0; i < productScript.length; i++) {
        if (productScript[i] !== null && productScript[i] !== undefined) {
          if (productScript[i].innerHTML !== null && productScript[i].innerHTML !== undefined) {
            if (JSON.parse(productScript[i].innerHTML).sku !== null && JSON.parse(productScript[i].innerHTML).sku !== undefined && productScript[i].id !== "product-script") {
              productScript[i].remove()
              return null
            }
          }
        }
      }
    }
    
  console.log("count")
  return null

}




