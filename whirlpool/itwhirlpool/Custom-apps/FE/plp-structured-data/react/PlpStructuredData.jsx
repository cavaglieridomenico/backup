/* eslint-disable */
/* eslint-disable prettier/prettier */
//import { product } from 'ramda';
import React, { useState, useEffect } from 'react'
import { canUseDOM } from "vtex.render-runtime";
const PlpStructuredData = () => {
  const [count, setCount] = useState(0)
  const baseUrl = "https://www.whirlpool.it/"

  
  const getScriptParse = (prop) => {
    if(prop.innerHTML.length > 0){
      let scriptParse = JSON.parse(prop.innerHTML)
    return scriptParse
    }
    
  }

  const returnScript = (prop) => {
    if(prop?.itemListElement?.length > 2){
      let script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'carousel-structured-data'
      script.innerHTML = JSON.stringify(prop)
      document.head.appendChild(script)
    }
  }

/*   const mergeScripts = (bigScript , smallScript) => {
    let temp = document.getElementById('carousel-structured-data')
    if(temp){
      temp.remove()
    }
    if (bigScript?.itemListElement?.length && smallScript?.itemListElement?.length){
      let adjustedLenght = bigScript.itemListElement.length 
      for(let x = 0 ; x < smallScript.itemListElement.length ; x++){
        smallScript.itemListElement[x].position = adjustedLenght + x + 1
      }
      let temp2 = bigScript.itemListElement.concat(smallScript.itemListElement)
      bigScript.itemListElement = temp2
    }
    if(temp){
      returnScript(bigScript)
    }
    console.log("small and big" , smallScript , bigScript)
  } */

  const checkForBreadCrumb = () => {
    const breadCrumb = document.querySelectorAll('script[type="application/ld+json"]')
    if (breadCrumb.length > 0) {
      for (let x = 0; x < breadCrumb.length; x++) {
        if (breadCrumb[x]) {
          let breadCrumbParse = getScriptParse(breadCrumb[x])
          if (breadCrumbParse?.itemListElement?.length === 2) {
            breadCrumb[x].remove()
          }
          if (breadCrumbParse["@type"] === "BreadcrumbList") {
            breadCrumb[x].id = "breadcrumb-list"
          }
        }
      }
    }
  }
  
  const getCorrectURL = (prop) => {
    let itemList = prop.itemListElement
    let number = (itemList.length > 2) ? 6 : 4
    for (let z = 0; z < itemList.length; z++) {
      let listItem = itemList[z]?.url
      let productUrl = baseUrl + listItem.split("/")[number] + "/p"
      prop.itemListElement[z].url = productUrl      
    }    
    return prop
  }


  useEffect(() => {
    let test = null
    if (canUseDOM) {
      const productScript = document.querySelectorAll('script[type="application/ld+json"]')      
      checkForBreadCrumb()
      if (productScript?.length) {
        for (let y = 0; y < productScript.length; y++) {
          if (productScript[y] && !productScript[y].id) {
            let scriptParse = getScriptParse(productScript[y])
            if(scriptParse && scriptParse["@type"] === "ItemList"){
              if(scriptParse.itemListElement.length > 2){
               test = scriptParse
              }       
              productScript[y].remove()
              scriptParse = getCorrectURL(scriptParse) 
/*               if (test !== scriptParse) {
                mergeScripts(test , scriptParse)
              } else returnScript(scriptParse) */
              returnScript(scriptParse)
              console.log("scriptparse" , test, scriptParse)             
              
            }           
          }
        }
      }
    } else setCount(count + 1)
  }, [count])


  return <React.Fragment></React.Fragment>

}

export default PlpStructuredData;


