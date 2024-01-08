import React from 'react'
import style from './product-summary.css'
import { useIntl, defineMessages } from 'react-intl'
import { useCart } from '../../../providers/cart'

const messages = defineMessages({
  totalLabel: {
    defaultMessage: 'Total',
    id: 'checkout-io.cart.total-label',
  },
})


const Total: React.FC = () => {
  const { TOTAL_PRICE } = useCart()
  const intl = useIntl()

  return (
    <div className={style.totalContainer}>
      <span className={style.totalLabel}>{intl.formatMessage(messages.totalLabel)}</span>
      <span className={style.totalPrice}>{TOTAL_PRICE}</span>
    </div>
  )
}

export default Total
