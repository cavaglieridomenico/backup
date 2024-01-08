import React, { useEffect, useState } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { ProfileContextProvider } from '../context/ProfileContext'
// import ProfileEditableForm from './ProfileEditableForm'
// import ProfileSummary from '../ProfileSummary'
// import StepHeader from '../../../step-group/StepHeader'
// import useFetch, { RequestInfo } from '../../../../hooks/useFetch'
// import { useForm } from '../../../../hooks/useForm'
import { useOrder } from '../../../../providers/orderform'
import CheckoutAlert from '../../../common/CheckoutAlert'
// import {pushCheckoutStep} from '../../../../analytics-events/checkout/pushCheckoutStep'
interface ProfileFormProps {
  children: any
}

const ProfileForm: React.FC<ProfileFormProps> = ({ children }) => {
  const intl = useIntl()
  const { orderForm, orderError } = useOrder()
  const { canEditData } = orderForm

  /*--- ORDERFORM QUERY ERROR HANDLING ---*/
  const [showAlertError, setShowAlertError] = useState(false)

  useEffect(() => {
    if (orderError) {
      setShowAlertError(true)
    }
  }, [orderError])

  const handleCloseAlertError = () => {
    setShowAlertError(false)
  }

  const ProfileEditableForm = children?.find(
    (child: any) => child.props.id == 'profile-editable-form'
  )
  const ProfileSummary = children?.find(
    (child: any) => child.props.id == 'profile-summary'
  )

  return (
    <>
      {canEditData ? (
        <ProfileContextProvider>{ProfileEditableForm}</ProfileContextProvider>
      ) : (
        <ProfileContextProvider>{ProfileSummary}</ProfileContextProvider>
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
  email: {
    defaultMessage: 'Email',
    id: 'checkout-io.email',
  },
  change: {
    defaultMessage: 'Change',
    id: 'checkout-io.change',
  },
  profile: {
    defaultMessage: 'Profile',
    id: 'checkout-io.profile',
  },
  requestError: {
    defaultMessage: 'Request failed, try again',
    id: 'checkout-io.request-error',
  },
})

export default ProfileForm
