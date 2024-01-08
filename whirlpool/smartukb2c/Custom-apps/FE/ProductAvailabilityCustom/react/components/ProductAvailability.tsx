import React, { FunctionComponent, memo, useEffect, useContext } from 'react'
import classNames from 'classnames'
import styles from '../styles.css'
import TickIcon from '../Icons/TickIcon'
import UnavailableIcon from '../Icons/UnavailableIcon'
import ExclamationIcon from '../Icons/ExclamationIcon'
import { assertAbstractType } from 'graphql'
import { ProductContext } from 'vtex.product-context'
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages
} from 'react-intl'

interface Props {
  threshold: number
  lowStockMessage: string
  highStockMessage: string
  availability: any
}

const messages = defineMessages({
  outOfStock: { id: 'store/product-availability-custom.outOfStock' },
  limitedAvailability: { id: 'store/product-availability-custom.limitedAvailability' },
  obsolete: { id: 'store/product-availability-custom.obsolete' },
  inStock: { id: 'store/product-availability-custom.inStock' },
  notSellable: { id: 'store/product-availability-custom.notSellable' },
  noStatus: { id: 'store/product-availability-custom.noStatus' }
})
const Container: FunctionComponent = ({ children }) => {
  return (
    <div className={classNames(styles.container, 'flex pv2')}>
      {children}
    </div>
  )
}

const ProductAvailability: FunctionComponent<Props> = ({ threshold, lowStockMessage, highStockMessage, availability }) => {

  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)

  const valuesFromContext = useContext(ProductContext)

  useEffect(
    () => {
      //console.log(" %c My availability is --> " + availability, 'background: #222; color: #bada55')
    }, []
  )

  if (availability == "out of stock" || availability == "ausverkauft" || availability == "Esaurito" || availability == "En rupture de stock") {
    return (
      <Container>
        <div className={styles.availabilityDiv}>
          <UnavailableIcon className={styles.unavailableIcon} /> <p>{translateMessage(messages.outOfStock)}</p>
        </div>
      </Container>
    )
  }

  if (availability == "limited availability" || availability == "Begrenzte Verfügbarkeit" || availability == "disponibilità limitata" || availability == "disponibilité limitée") {
    return (
      <Container>
        <div className={styles.availabilityDiv}><ExclamationIcon className={styles.exclamationIcon} />{translateMessage(messages.limitedAvailability)}</div>
      </Container>)
  }

  if (availability == "obsolete" || availability == "obsolet" || availability == "obsoleto" || availability == "obsolète") {
    return (
      <Container>
        <div className={styles.availabilityDiv}><ExclamationIcon className={styles.discountIcon} />{translateMessage(messages.obsolete)}</div>
      </Container>)
  }

  if (highStockMessage || availability == "in stock" || availability == "auf Lager" || availability == "disponibile" || availability == "en stock") {
    return (
      <Container>
        <div className={styles.availabilityDiv}><TickIcon className={styles.tickIcon} />{translateMessage(messages.inStock)}</div>
      </Container>
    )
  }

  if (availability == "not sellable" || availability == "nicht verkaufbar" ||
    availability == "non vendibile" || availability == "non vendable") {
    return (
      <Container>
        {/*<div className={styles.availabilityDiv}>{translateMessage(messages.notSellable)}⛔️</div>*/}
        <div className={styles.notSellableContainer}>
          <UnavailableIcon className={styles.unavailableIcon} /> <p>{translateMessage(messages.outOfStock)}</p>
        </div>
      </Container>
    )
  }
  return (
    <div className={styles.availabilityDiv}>{translateMessage(messages.noStatus)}</div>
  )
}

export default memo(ProductAvailability)
