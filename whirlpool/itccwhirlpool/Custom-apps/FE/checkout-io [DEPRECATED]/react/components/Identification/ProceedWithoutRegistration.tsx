import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import style from './Identification.css'

const messages = defineMessages({
  proceedToCheckout: {
    defaultMessage: 'Proceed without registration',
    id: 'checkout-io.cart.proceed-to-checkout',
  },
})

const ProceedWithoutRegistration = () => {
  const { navigate } = useRuntime()
  const intl = useIntl()

  const handleProceedToCheckout = () => {
    navigate({ page: 'store.checkout.order-form' })
  }

  return (
    <div className={style.proceedToCheckoutButtonContainer}>
      <button
        id="proceed-to-checkout"
        onClick={handleProceedToCheckout}
        className={style.proceedToCheckoutButton}
      >
        {intl.formatMessage(messages.proceedToCheckout)}
      </button>
    </div>
  )
}

export default ProceedWithoutRegistration
