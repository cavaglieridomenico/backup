import { isEmpty, path } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { defineMessages } from 'react-intl'
import { ProductContext } from 'vtex.product-context'
import fetchRequest from '../utilities/fetchRequest'
import ProductAvailability from './ProductAvailability'


const messages = defineMessages({
  title: {
    defaultMessage: 'Product Availability',
    id: 'admin/editor.product-availability.title',
  },
  description: {
    defaultMessage: 'Component that shows the remaining available quantity',
    id: 'admin/editor.product-availability.description',
  },
  thresholdTitle: {
    defaultMessage: 'Threshold quantity',
    id: 'admin/editor.product-availability.threshold.title',
  },
  thresholdDescription: {
    defaultMessage: 'Minimum quantity that makes low stock message appear (if message is set)',
    id: 'admin/editor.product-availability.threshold.description',
  },
  lowStockMessageTitle: {
    defaultMessage: 'Low stock message',
    id: 'admin/editor.product-availability.lowStockMessage.title',
  },
  lowStockMessageDescription: {
    defaultMessage: 'String to be shown to user when stock is lower than threshold. Should have {quantity} inside the given string, to be replaced for the threshold property. Example: \"Only {quantity} left!\". Leave empty to not show.',
    id: 'admin/editor.product-availability.lowStockMessage.description',
  },
  highStockMessageTitle: {
    defaultMessage: 'High stock message',
    id: 'admin/editor.product-availability.highStockMessage.title',
  },
  highStockMessageDescription: {
    defaultMessage: 'String to be shown when stock is higher or equal than threshold. If left empty, won\'t show',
    id: 'admin/editor.product-availability.highStockMessage.description',
  },
})

interface Props {
  threshold: number
  lowStockMessage: string
  highStockMessage: string
}

interface SelectedItem {
  sellers: Array<{
    commertialOffer: {
      AvailableQuantity: number
    }
  }>
}

const ProductAvailabilityWrapper: StorefrontFunctionComponent<Props> = ({ threshold, lowStockMessage, highStockMessage }) => {
  const valuesFromContext = useContext(ProductContext)
  if (!valuesFromContext || isEmpty(valuesFromContext)) {
    return null
  }
  const { selectedItem }: { selectedItem: SelectedItem } = valuesFromContext
  const { categoryId } = valuesFromContext.product
  // @ts-ignore
  const { itemId: skuId } = selectedItem
  const availableQuantity = path(['sellers', 0, 'commertialOffer', 'AvailableQuantity'], selectedItem) as number | undefined

  // @ts-ignore
  useEffect(async () => {

    let requestArgs = {
      uri: `/api/catalog_system/pub/specification/field/listByCategoryId/${categoryId}`
    }
    const response1 = await fetchRequest(requestArgs)
    // @ts-ignore
    const specs = response1.filter(obj => obj.Name == 'fewPiecesThreshold')

    const categorySpecs = {}
    // @ts-ignore
    specs.forEach(s => {
      // @ts-ignore
      categorySpecs[s.Name] = s.FieldId
    });
    //@ts-ignore
    requestArgs.uri = `/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${skuId}/specification`
    const response2 = await fetchRequest(requestArgs)
    // @ts-ignore
    for (var s of Object.keys(categorySpecs)) {
      // @ts-ignore
      specs[s] = response2.find(r => r.FieldId == categorySpecs[s]).Text;
    }
    const { fewPiecesThreshold } = specs
    // @ts-ignore 
    if (availableQuantity < fewPiecesThreshold) {
      threshold = fewPiecesThreshold
    }
    return () => { }
  }, [categoryId])



  return <ProductAvailability {...{ threshold, lowStockMessage, highStockMessage, availableQuantity }} />
}

ProductAvailabilityWrapper.defaultProps = {
  threshold: 0,
}

ProductAvailabilityWrapper.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    threshold: {
      title: messages.thresholdTitle.id,
      description: messages.thresholdDescription.id,
      type: 'number',
      default: 0,
      isLayout: true,
    },
    lowStockMessage: {
      title: messages.lowStockMessageTitle.id,
      description: messages.lowStockMessageDescription.id,
      type: 'string',
    },
    highStockMessage: {
      title: messages.highStockMessageTitle.id,
      description: messages.highStockMessageDescription.id,
      type: 'string',
    }
  },
}

export default ProductAvailabilityWrapper
