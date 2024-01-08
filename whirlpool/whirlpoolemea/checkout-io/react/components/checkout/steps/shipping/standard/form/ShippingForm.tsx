import React, { useState } from 'react'
import { useOrder } from '../../../../../../providers/orderform'
import { useIntl, defineMessages } from 'react-intl'
import {ShippingContextProvider} from '../context/ShippingContext'
import CheckoutAlert from '../../../../../common/CheckoutAlert'

interface ShippingFormProps {
  children: any
}

const ShippingForm: React.FC<ShippingFormProps> = ({ children }) => {

  const intl = useIntl()
  const { orderForm, orderError } = useOrder()
  const { canEditData } = orderForm
  /*--- ORDERFORM QUERY ERROR HANDLING ---*/
  const [showAlertError, setShowAlertError] = useState(false)

  const handleCloseAlertError = () => {
    setShowAlertError(false)
  }

  const ShippingEditableForm = children?.find(
    (child: any) => child.props.id == 'shipping-editable-form'
  )
  const ShippingSummary = children?.find(
    (child: any) => child.props.id == 'shipping-summary'
  )

  return (
    <>
      {canEditData ? (
        <ShippingContextProvider>{ShippingEditableForm}</ShippingContextProvider>
      ) : (
        <ShippingContextProvider>{ShippingSummary}</ShippingContextProvider>
      )}

      {showAlertError && (
        <div className="mt5">
          <CheckoutAlert
            message={intl.formatMessage(messages.requestError)}
            orderError={orderError}
            handleCloseAlertError={handleCloseAlertError}
          />
        </div>
      )}
    </>
  )
}

const messages = defineMessages({
  requestError: {
    defaultMessage: 'Request failed, try again',
    id: 'checkout-io.request-error',
  },
})

export default ShippingForm