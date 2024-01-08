// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react'
import { isEmpty, path } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import { defineMessages } from 'react-intl'
import fetchRequest from '../utils/fetchRequest'
import styles from './styles.css'
import IconScrew from './Icons/IconScrew'
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages
} from 'react-intl'

interface product {
  properties: Array<{
    values: Array<string>
  }>
}

const messages = defineMessages({
  bannerFirst: { id: 'store/countdown.bannerFirst' },
  bannerSecond: { id: 'store/countdown.bannerSecond' },
  bannerThird: { id: 'store/countdown.bannerThird' },
  And: { id: 'store/countdown.And' },
  Part: { id: 'store/countdown.Part' },
  Quantity: { id: 'store/countdown.Quantity' },
})

const ProductHeaderCustom: StorefrontFunctionComponent<Props> = () => {
  const valuesFromContext = useContext(ProductContext)
  if (!valuesFromContext || isEmpty(valuesFromContext)) {
    return null
  }
  const [jState, setJstate] = useState("")
  const [isKit, setIsKit] = useState(false)
  const { product }: { product: product } = valuesFromContext
  const availabilityObject = path(['properties'], product)
  const [qty, setQty] = useState(null);

  const availability = (availabilityObject?.filter(x => { return x.name == "jCode" })[0]?.values[0])
  const winnerCode = (availabilityObject?.filter(x => { return x.name == "winnerCode" || x.name == "gagnantCode" })[0]?.values[0])


  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)

  useEffect(() => {
    console.log(valuesFromContext)
    if (window.location.search.includes("jcode") && window.location.search.includes("qty")) {
      setJstate(window.location.search.split("=")[window.location.search.split("=").length - 2].split("&")[0])
    } else {
      if (window.location.search.includes("jcode")) {
        setJstate(window.location.search.split("=")[window.location.search.split("=").length - 1])
      }
    }

    if (product.items[0] && product.items[0].kitItems && product.items[0].kitItems.length > 0) {
      setIsKit(true);
    }
    if( window && window.location && window.location.search.includes("qty")) { 
      let paramQty = window.location.search.split("=")[window.location.search.split("=").length -1];
      setQty(paramQty)
    }
  }, []);

  return (<div className={(jState != "") ? styles.mainHeaderDiv : styles.mainHeaderHide}>
    <IconScrew className={styles.iconScrew} />
    <div style={{ marginRight: '5px' }} >
      {translateMessage(messages.bannerFirst)}

      {` ${jState}  `}
    </div>

    {!isKit ? (
      <div>{translateMessage(messages.bannerSecond)} {winnerCode} ( {translateMessage(messages.bannerFirst)} {availability}  {qty && parseInt(qty) > 1 ? translateMessage(messages.Quantity) + " " + qty: ""} ) </div>
    ) : <div>

      {` ${translateMessage(messages.bannerSecond)}`}
      {product.items[0].kitItems.map((item, index) => {
        if (index === 0) {
          return ` ${item.sku.referenceId[0].Value}`
        } else {
          return `, ${item.sku.referenceId[0].Value} `
        }
      })}
      ({product.items[0].kitItems.map((item, index) => {
        if (index === 0) {
          return `${translateMessage(messages.Part)} ${item.product.linkText}`
        } else {
          return ` ${translateMessage(messages.And)} ${translateMessage(messages.Part)} ${item.product.linkText}  ${qty && parseInt(qty) > 1 ? translateMessage(messages.Quantity) + " " + qty: ""}`
        }
      })})

    </div>}

  </div>)
}

export default ProductHeaderCustom
