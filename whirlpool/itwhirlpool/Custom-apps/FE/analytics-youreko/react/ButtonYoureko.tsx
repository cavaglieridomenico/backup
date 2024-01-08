import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'
//import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import Helmet from 'react-helmet'

export default function ButtonYoureko() {
  function getYoureko() {
    const script = document.createElement('script')

    script.async = true
    script.src =
      'https://static.youreko.com/js/partners/it/whirlpool/youreko.energy-review.whirlpool.all.min.js'
    script.id = 'button-youreko'
    script.type = 'text/javascript'

    document.body.appendChild(script)
  }

  const [prodCat, setProdCat] = useState()

  const productInfo = useProduct()

  const prodId = productInfo?.product?.productReference
  const prodName = productInfo?.product?.productName

  function getYourekoCallback(category: string) {

    if (
      document?.getElementById('button-youreko-callback-' + prodId) === null
    ) {
      const script = document.createElement('script')
      //script.text ='window["v_" + prodId + ""] = 0; function Youreko_Callback_" + prodId + "(v) {window["v_" + prodId + ""] = v; document.getElementById("youreko-callback-button-" + prodId + "").focus()}'
      script.text =
        'function Youreko_Callback_' +
        prodId +
        "(v) {dataLayer?.push({ event: 'youreko_badge', eventCategory: 'Youreko Badge', eventAction: v, eventLabel: `" +
        prodId +
        ' - ' +
        prodName +
        '`, energy_saving_value: v, item_id: `' +
        prodId +
        '`, item_name: `' +
        prodName +
        '`, item_category: `' +
        category +
        '`, item_macrocategory: `' +
        prodMacrocat +
        '` });}'
      script.id = 'button-youreko-callback-' + prodId
      script.type = 'text/javascript'

      document.body.appendChild(script)
    }
  }

  let catId = productInfo?.product?.categoryId

  let prodMacrocat = getProdMacroCategory(catId)

  useEffect(() => {
    getYoureko()

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`/_v/wrapper/api/catalog/category/` + catId, options)
      .then(res => res.json())
      .then(res => {
        setProdCat(res?.AdWordsRemarketingCode)
        getYourekoCallback(res?.AdWordsRemarketingCode)
      })
      .catch(err => console.error(err))
  }, [])

  function getProdMacroCategory(id: any) {
    switch (id) {
      case '4':
      case '15':
      case '16':
      case '17':
        return 'LD'
      case '5':
      case '18':
      case '19':
        return 'CO'
      case '6':
      case '20':
      case '21':
      case '22':
      case '23':
      case '24':
      case '25':
        return 'CK'
      case '7':
      case '26':
        return 'DW'
      case '8':
      case '27':
        return 'AC'
      default:
        return 'ACC'
    }
  }

  return prodCat ? (
    <>
      {/*<p id={"youreko-callback-button-" + prodId} onFocus={e => {console.log(window["v_" + prodId]);}} style={{display: "none", width: 0, height: 0}} />*/}

      <Helmet>
        <meta name="macrocategory" content={prodMacrocat} />
        <meta name="category" content={prodCat} />
      </Helmet>
    </>
  ) : (
    <></>
  )
}
