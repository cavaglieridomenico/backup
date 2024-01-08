import React from 'react'
import { defineMessages, FormattedNumber } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { useCssHandles, CssHandlesTypes, useCustomClasses } from 'vtex.css-handles'

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
  'customProductPrice'
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
  product?: any,
  customClassNames?: any
}

function SellingPrice({
  message = messages.default.id,
  markers = [],
  classes,
  product
}: Props) {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES, {
    classes,
  })

  const seller = getDefaultSeller(product.items[0].sellers)

  const commercialOffer = seller?.commertialOffer

  if (product.status && !(product.status[0] == "out of stock" || product.status[0] == "in stock")) {
    return null
  }
  console.log(product)
  const sellingPriceValue = commercialOffer.Price
  const listPriceValue = commercialOffer.ListPrice
  const { taxPercentage } = commercialOffer
  const sellingPriceWithTax =
    sellingPriceValue + sellingPriceValue * taxPercentage

  const measurementUnit =
    product.items[0].measurementUnit ?? ''

  const unitMultiplier = product.items[0].unitMultiplier ?? 1
  const sellingPriceWithUnitMultiplier = commercialOffer.Price * unitMultiplier

  const taxValue = commercialOffer.Tax

  const hasListPrice = sellingPriceValue !== listPriceValue
  const hasMeasurementUnit = measurementUnit && measurementUnit !== 'un'
  const hasUnitMultiplier = unitMultiplier !== 1

  const containerClasses = withModifiers('sellingPrice', [
    hasListPrice ? 'hasListPrice' : '',
    hasMeasurementUnit ? 'hasMeasurementUnit' : '',
    hasUnitMultiplier ? 'hasUnitMultiplier' : '',
  ])
console.log(sellingPriceValue)
  return (
    <span className={[containerClasses, handles.customProductPrice].join(" ")}>
      <IOMessageWithMarkers
        message="{sellingPriceValue}"
        markers={markers}
        handleBase="sellingPrice"
        values={{
          sellingPriceValue: (
            <span key="sellingPriceValue" className={handles.sellingPriceValue}>
              <FormattedCurrency value={sellingPriceValue}/>
            </span>
          ),
          sellingPriceWithTax: (
            <span
              key="sellingPriceWithTax"
              className={handles.sellingPriceWithTax}
            >
              <FormattedCurrency value={sellingPriceWithTax}/>
            </span>
          ),
          sellingPriceWithUnitMultiplier: (
            <span
              key="sellingPriceWithUnitMultiplier"
              className={handles.sellingPriceWithUnitMultiplier}
            >
              <FormattedCurrency value={sellingPriceWithUnitMultiplier}/>
            </span>
          ),
          taxPercentage: (
            <span key="taxPercentage" className={handles.taxPercentage}>
              <FormattedNumber value={taxPercentage} style="percent" />
            </span>
          ),
          taxValue: (
            <span key="taxValue" className={handles.taxValue}>
              <FormattedCurrency value={taxValue}/>
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
