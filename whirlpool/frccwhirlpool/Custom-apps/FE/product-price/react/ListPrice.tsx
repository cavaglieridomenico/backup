import React, { useState, useEffect } from 'react'
import { defineMessages, FormattedNumber } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { FormattedCurrency } from 'vtex.format-currency'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'
import { IOMessageWithMarkers } from 'vtex.native-types'

import { getDefaultSeller } from './modules/seller'

const CSS_HANDLES = [
  'listPrice',
  'listPriceValue',
  'listPriceWithTax',
  'listPriceWithUnitMultiplier',
  'taxPercentage',
  'taxValue',
  'unitMultiplier',
  'measurementUnit',
] as const

const messages = defineMessages({
  title: {
    id: 'admin/list-price.title',
  },
  description: {
    id: 'admin/list-price.description',
  },
  default: {
    id: 'store/list-price.default',
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

function ListPrice({
  message = messages.default.id,
  markers = [],
  classes,
}: Props) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const productContextValue = useProduct()
  let runtime = (window as unknown as WindowRuntime).__RUNTIME__

  const seller = getDefaultSeller(productContextValue?.selectedItem?.sellers)
  const commercialOffer = seller?.commertialOffer

  if (!commercialOffer) {
    return null
  }

  const outOfStock = !commercialOffer || commercialOffer?.AvailableQuantity <= 0

  const { taxPercentage } = commercialOffer

  const measurementUnit =
    productContextValue?.selectedItem?.measurementUnit ?? ''

  const unitMultiplier = productContextValue?.selectedItem?.unitMultiplier ?? 1

  const taxValue = commercialOffer.Tax

  const [currentSc, setCurrentSc] = useState<any>(null);
  const [sellingPriceValue] = useState<any>(commercialOffer.Price);
  const [listPriceValue] = useState<any>(commercialOffer.ListPrice);
  const [listPriceWithTax] = useState<any>(listPriceValue + listPriceValue * taxPercentage);
  const [listPriceWithUnitMultiplier] = useState<any>(commercialOffer.ListPrice * unitMultiplier);

  // const hasListPrice = sellingPriceValue !== listPriceValue
  const hasMeasurementUnit = measurementUnit && measurementUnit !== 'un'
  const hasUnitMultiplier = unitMultiplier !== 1


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
      // setCurrentSc(localStorage.getItem('Current-SC'))
      
    }
  }, []);

  useEffect(() => {
    handleShowPrice()
  }, [currentSc]);

  const getShowPriceValue = (indexString: string) => {
    const showPriceSpecIndex = productContextValue?.product?.properties.map(productSpecification => productSpecification.name).indexOf(indexString)
    const showPriceString = (showPriceSpecIndex && showPriceSpecIndex !== -1) && productContextValue?.product?.properties[showPriceSpecIndex].values[0]
    const showPrice = showPriceString === "true" ? true : false
    return showPrice
  }

  const handleShowPrice = () => {
    const isDiscontinued = getShowPriceValue('isDiscontinued')
    switch (currentSc) {
      case '1':
        const showPriceEPP = getShowPriceValue('showPriceEPP')
        const sellableEPP = getShowPriceValue('sellableEPP')
        if((showPriceEPP && outOfStock) || isDiscontinued || (!sellableEPP || !showPriceEPP)) return false
        break;
      case '2':
        const showPriceFF = getShowPriceValue('showPriceFF')
        const sellableFF = getShowPriceValue('sellableFF')
        if((showPriceFF && outOfStock) || isDiscontinued || (!sellableFF || !showPriceFF)) return false
        break;
      case '3':
        const showPriceVIP = getShowPriceValue('showPriceVIP')
        const sellableVIP = getShowPriceValue('sellableVIP')
        if((showPriceVIP && outOfStock) || isDiscontinued || (!sellableVIP || !showPriceVIP)) return false
        break;
      default:
        return false
    }
    return true
  }

  if (listPriceValue <= sellingPriceValue) {
    return null
  }

  return (
    <span 
    // style={{display: handleShowPrice() ? 'block' : 'none'}} 
    className={handles.listPrice}>
      <IOMessageWithMarkers
        message={message}
        markers={markers}
        handleBase="listPrice"
        values={{
          hasMeasurementUnit,
          hasUnitMultiplier,
          listPriceValue: (
            <span
              key="listPriceValue"
              className={`${handles.listPriceValue} strike`}
            >
              <FormattedCurrency value={listPriceValue} />
            </span>
          ),
          listPriceWithTax: (
            <span
              key="listPriceWithTax"
              className={`${handles.listPriceWithTax} strike`}
            >
              <FormattedCurrency value={listPriceWithTax} />
            </span>
          ),
          listPriceWithUnitMultiplier: (
            <span
              key="listPriceWithUnitMultiplier"
              className={`${handles.listPriceWithUnitMultiplier} strike`}
            >
              <FormattedCurrency value={listPriceWithUnitMultiplier} />
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

ListPrice.schema = {
  title: messages.title.id,
}

export default ListPrice
