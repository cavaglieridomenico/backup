import React, { useEffect, useState } from 'react'
import { defineMessages, FormattedNumber } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { FormattedCurrency } from 'vtex.format-currency'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'
import { useRuntime } from "vtex.render-runtime";

import { getDefaultSeller } from './modules/seller'

const CSS_HANDLES = [
  'sellingPrice',
  'sellingPriceValue',
  'sellingPriceWithTax',
  'sellingPriceWithUnitMultiplier',
  'taxPercentage',
  'taxValue',
  'measurementUnit',
  'unitMultiplier',
] as const

const messages = defineMessages({
  title: {
    id: 'admin/selling-price.title',
  },
  description: {
    id: 'admin/selling-price.description',
  },
  default: {
    id: 'store/selling-price.default',
  },
})

interface Props {
  message?: string
  markers?: string[]
  /** Used to override default CSS handles */
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}
interface WindowRuntime extends Window  {
  __RUNTIME__:any
} 

export async function getUserSession(): Promise<any> {
  return fetch(`/api/sessions?items=*`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function SellingPrice({
  message = messages.default.id,
  markers = [],
  classes,
}: Props) {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES, {
    classes,
  })
  const { binding } = useRuntime();

  const productContextValue = useProduct()

  const seller = getDefaultSeller(productContextValue?.selectedItem?.sellers)

  const commercialOffer = seller?.commertialOffer

  const outOfStock = !commercialOffer || commercialOffer?.AvailableQuantity <= 0

  if (!commercialOffer) {
    return null
  }

  const { taxPercentage } = commercialOffer

  const measurementUnit =
    productContextValue?.selectedItem?.measurementUnit ?? ''

  const unitMultiplier = productContextValue?.selectedItem?.unitMultiplier ?? 1

  const taxValue = commercialOffer.Tax

  const [currentSc, setCurrentSc] = useState<any>(null);
  // const [sellingPriceValue] = useState<any>(commercialOffer.Price);
  const [sellingPriceValue, setSellingPriceValue] = useState<any>(commercialOffer.Price);
  const [listPriceValue] = useState<any>(commercialOffer.ListPrice);
  const [sellingPriceWithTax] = useState<any>(sellingPriceValue + sellingPriceValue * taxPercentage);
  const [sellingPriceWithUnitMultiplier] = useState<any>(commercialOffer.Price * unitMultiplier);

  const hasListPrice = sellingPriceValue !== listPriceValue
  const hasMeasurementUnit = measurementUnit && measurementUnit !== 'un'
  const hasUnitMultiplier = unitMultiplier !== 1

  const containerClasses = withModifiers('sellingPrice', [
    hasListPrice ? 'hasListPrice' : '',
    hasMeasurementUnit ? 'hasMeasurementUnit' : '',
    hasUnitMultiplier ? 'hasUnitMultiplier' : '',
  ])

  let runtime = (window as unknown as WindowRuntime).__RUNTIME__ //this to take the channel from the runtime obj

  useEffect(() => {
    if(JSON.parse(atob(runtime.segmentToken)).channel === null) {
      getUserSession()
      .then((response) => response.json())
      .then((data: any) => {
        setCurrentSc(data.namespaces.store.channel.value)
        // localStorage.setItem('Current-SC', data.namespaces.store.channel.value)
      });
    } else {
      setCurrentSc(JSON.parse(atob(runtime.segmentToken)).channel)
    }
  }, []);

  useEffect(() => {
    handleShowPrice()
  }, [currentSc]);

  useEffect(() => {
    setSellingPriceValue(seller?.commertialOffer.Price);
  }, [seller])
  
  // const getShowPriceValue = (indexString: string) => {
  //   const showPriceSpecIndex = productContextValue?.product?.properties.map(productSpecification => productSpecification.name).indexOf(indexString)
  //   const showPriceString = (showPriceSpecIndex && showPriceSpecIndex !== -1) && productContextValue?.product?.properties[showPriceSpecIndex].values[0]    
  //   const showPrice = showPriceString === "true" ? true : false
  //   return showPrice
  // }

  // const handleShowPrice = () => {
  //   const isDiscontinued = getShowPriceValue('isDiscontinued')
  //   switch (currentSc) {
  //     case '1':
  //       const showPriceEPP = getShowPriceValue('showPriceEPP')
  //       const sellableEPP = getShowPriceValue('sellableEPP')
  //       if((showPriceEPP && outOfStock) || isDiscontinued || (!sellableEPP || !showPriceEPP)) return false
  //       break;
  //     case '2':
  //       const showPriceFF = getShowPriceValue('showPriceFF')
  //       const sellableFF = getShowPriceValue('sellableFF')
  //       if((showPriceFF && outOfStock) || isDiscontinued || (!sellableFF || !showPriceFF)) return false
  //       break;
  //     case '3':
  //       const showPriceVIP = getShowPriceValue('showPriceVIP')
  //       const sellableVIP = getShowPriceValue('sellableVIP')
  //       if((showPriceVIP && outOfStock) || isDiscontinued || (!sellableVIP || !showPriceVIP)) return false
  //       break;
  //     default:
  //       return false
  //   }
  //   return true
  // }

  /*--- SHOW PRICE HANDLING ---*/
  const tradePolicy =
    binding?.id == "1bbaf935-b5b4-48ae-80c0-346623d9c0c9"
      ? "EPP"
      : binding?.id == "b9f7bf3a-c865-4169-8950-4fbb8b55ec09"
      ? "FF"
      : "VIP";
    
  return (
    <span 
    // style={{display: handleShowPrice() ? 'block' : 'none'}} 
    className={containerClasses}>
      <IOMessageWithMarkers
        message={message}
        markers={markers}
        handleBase="sellingPrice"
        values={{
          sellingPriceValue: (
            <span key="sellingPriceValue" className={handles.sellingPriceValue}>
              <FormattedCurrency value={sellingPriceValue} />
            </span>
          ),
          sellingPriceWithTax: (
            <span
              key="sellingPriceWithTax"
              className={handles.sellingPriceWithTax}
            >
              <FormattedCurrency value={sellingPriceWithTax} />
            </span>
          ),
          sellingPriceWithUnitMultiplier: (
            <span
              key="sellingPriceWithUnitMultiplier"
              className={handles.sellingPriceWithUnitMultiplier}
            >
              <FormattedCurrency value={sellingPriceWithUnitMultiplier} />
            </span>
          ),
          taxPercentage: (
            <span key="taxPercentage" className={handles.taxPercentage}>
              <FormattedNumber value={taxPercentage} style="percent" />
            </span>
          ),
          taxValue: (
            <span key="taxValue" className={handles.taxValue}>
              <FormattedCurrency value={taxValue} />
            </span>
          ),
          hasMeasurementUnit,
          hasListPrice,
          hasUnitMultiplier,
          unitMultiplier: (
            <span key="unitMultiplier" className={handles.unitMultiplier}>
              <FormattedNumber value={unitMultiplier} />
            </span>
          ),
          measurementUnit: (
            <span key="measurementUnit" className={handles.measurementUnit}>
              {measurementUnit}
            </span>
          ),
        }}
      />
    </span>
  )
}

SellingPrice.schema = {
  title: messages.title.id,
}

export default SellingPrice
