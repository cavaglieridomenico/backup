import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'

interface isCutPriceInterface {
  Then?: any
  Else?: any
}

const IsCutPrice: StorefrontFunctionComponent<isCutPriceInterface> = ({
  Then,
  Else,
}) => {
  let initialState = 'undefined'
  const [isCutted, setIsCutted] = useState(initialState)
  const productContext = useProduct()

  let skuId = productContext.selectedItem.itemId

  useEffect(() => {
    const url = ` /v2/wrapper/api/catalog/promo?skuId=${skuId}`
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }

    fetch(url, options)
      .then((res: any) => res.json())
      .then(json => {
        if (json.type == "cutPrice") {
          setIsCutted('true')
        } else {
          setIsCutted('false')
        }
      })
  }, [])

  return (
    <React.Fragment>
      {isCutted == 'true' && Then ? (
        <Then />
      ) : (
        <React.Fragment></React.Fragment>
      )}
      {isCutted == 'false' && Else ? (
        <Else />
      ) : (
        <React.Fragment></React.Fragment>
      )}
      {isCutted == 'undefined' && <React.Fragment></React.Fragment>}
    </React.Fragment>
  )
}

IsCutPrice.schema = {
  title: '',
  description: '',
  type: 'object',
  properties: {},
}

export default IsCutPrice
