import React from 'react'
import style from './product-summary.css'
import { useIntl, defineMessages } from 'react-intl'
import { useCart } from '../../../providers/cart'

const messages = defineMessages({
  subtotalLabel: {
    defaultMessage: 'Subtotal',
    id: 'checkout-io.cart.subtotal-label',
  },
})


const SubTotal: React.FC = () => {
  const { SUBTOTAL_PRICE } = useCart()
  const intl = useIntl()

  return (
    <div className={style.subtotalContainer}>
      <span className={style.subtotalLabel}>{intl.formatMessage(messages.subtotalLabel)}</span>
      <span className={style.subtotalPrice}>{SUBTOTAL_PRICE}</span>
    </div>
  )
}

export default SubTotal
