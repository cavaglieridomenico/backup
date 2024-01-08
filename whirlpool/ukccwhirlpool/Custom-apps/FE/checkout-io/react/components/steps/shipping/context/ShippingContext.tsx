import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { ValidateAddress } from '../../../../typings/validation'
import { useOrder } from '../../../../providers/orderform'
import { ErrorsObject } from '../../../../typings/errors'
import validateAddress from './validate'
import { useIntl, defineMessages } from 'react-intl'
import { useMutation } from 'react-apollo'
import updateSelectedAddress from '../../../../graphql/updateSelectedAddress.graphql'
import selectDeliveryOption from '../../../../graphql/selectDeliveryOption.graphql'
import { useHistory } from 'react-router'
import routes from '../../../../utils/routes'

interface Context {
  formattedAddress: string
  setFormattedAddress: any
  addressValues: AddressValues
  setAddressValues: any
  isAddressSetted: boolean
  setIsAddressSetted: any
  setIsSubmittingAddress: any
  deliveryValues: DeliveryValues
  setDeliveryValues: any
  isDeliverySetted: boolean
  handleChangeAddressInput: any
  handleChangeDeliveryInput: any
  updateDeliveryMutation: any
  handleAddressSubmit: any
  handleDeliverySubmit: any
  errors: ErrorsObject
  resetInput: any
}

interface AddressValues {
  // address: string
  complement: string
  number: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  geoCoordinates: []
  receiverName: string
}

interface DeliveryValues {
  receiver: string
  id: string
}

const ShippingContext = createContext<Context>({} as Context)

export const ShippingContextProvider: React.FC = ({ children }) => {

  const intl = useIntl()
  const history = useHistory()
  const { orderForm, refreshOrder } = useOrder()
  const { production } = useRuntime()
  const [errors, setErrors]: any = useState({})
  const [isSubmittingAddress, setIsSubmittingAddress]: any = useState(false)
  const [formattedAddress,setFormattedAddress] = useState<string>("")

  // ADDRESS
  const [addressValues,setAddressValues]: any = useState({
    // address: orderForm?.shippingData?.address?.addressId || '',
    complement: orderForm?.shippingData?.address?.complement || '',
    number: orderForm?.shippingData?.address?.number || '',
    street: orderForm?.shippingData?.address?.street || '',
    city: orderForm?.shippingData?.address?.city || '',
    state: orderForm?.shippingData?.address?.state || '',
    postalCode: orderForm?.shippingData?.address?.postalCode || '',
    country: orderForm?.shippingData?.address?.country || '',
    geoCoordinates: orderForm?.shippingData?.address?.geoCoordinates || [],
    receiverName: orderForm?.shippingData?.address?.receiverName || ''
  })

  useEffect(() => {
    setAddressValues({
      ...addressValues,
      complement: orderForm?.shippingData?.address?.complement || '',
      number: orderForm?.shippingData?.address?.number || '',
      street: orderForm?.shippingData?.address?.street || '',
      city: orderForm?.shippingData?.address?.city || '',
      state: orderForm?.shippingData?.address?.state || '',
      postalCode: orderForm?.shippingData?.address?.postalCode || '',
      country: orderForm?.shippingData?.address?.country || '',
      geoCoordinates: orderForm?.shippingData?.address?.geoCoordinates || [],
      receiverName: orderForm?.shippingData?.address?.receiverName || ''
    })
  }, [orderForm])

  const checkProfileData = () => {
    if(orderForm && orderForm.clientProfileData){
      const { firstName, lastName, phone } = orderForm.clientProfileData;
      if (!firstName || !lastName  || !phone) {
        history.push(routes.PROFILE)
      }
    } else {
      history.push(routes.PROFILE)
    }
  }

  checkProfileData()


  const [isAddressSetted,setIsAddressSetted] = useState<boolean>(orderForm.shippingData.address !== null)

  const handleChangeAddressInput = (e: any) => {
    const { name, value } = e.target
    setAddressValues({
      ...addressValues,
      [name]: value,
    })
  }

  /*--- ADDRESS FORM SUBMITTING ---*/
  const handleAddressSubmit = (e: any, validation: ValidateAddress) => {
    e.preventDefault()
    setErrors(
      validateAddress(
        formattedAddress,
        addressValues,
        validation,
        intl?.messages
      )
    )
    setIsSubmittingAddress(true)
  }

  useEffect(() => {
    if (Object.keys(errors).length == 0 && isSubmittingAddress) {
      updateAddressInfoMutation()
    } else {
      setIsSubmittingAddress(false)
    }
  }, [errors])

  const updateAddressInfoMutation = () => {
    updateAddressData({
      variables: {
        orderFormId: orderForm.orderFormId,
        address: { 
          ...addressValues
        },
      },
    })
  }

  /*--- ADDRESS MUTATION ---*/
  const [updateAddressData]: any = useMutation(updateSelectedAddress, {
    onCompleted() {
      console.log("ADDRESS MUTATION FATTA")
      refreshOrder()
      setIsAddressSetted(true)
    },
  })

  // DELIVERY
  const [isDeliverySetted,setIsDeliverySetted] = useState<boolean>(false)

  const [deliveryValues,setDeliveryValues]: any = useState({
    receiver: orderForm?.shippingData?.address?.receiverName || '',
    id: orderForm?.shippingData?.logisticsInfo[0]?.selectedSla 
  })

  useEffect(() => {
    setDeliveryValues({
      ...deliveryValues,
      receiver: orderForm?.shippingData?.address?.receiverName || '',
      id: orderForm?.shippingData?.logisticsInfo[0]?.selectedSla || '',
    })
  }, [orderForm])

  const handleChangeDeliveryInput = (e: any) => {
    const { name, value } = e.target
    setDeliveryValues({
      ...deliveryValues,
      [name]: value,
    })
  }

  const handleDeliverySubmit = () => {
    history.push(routes.PAYMENT)
  }

  const updateDeliveryMutation = (deliveryId: string) => {
    updateDeliveryMethod({
      variables: {
        orderFormId: orderForm.orderFormId,
        deliveryOption: deliveryId,
      },
    })
  }

  /*--- DELIVERY MUTATION ---*/
  const [updateDeliveryMethod]: any = useMutation(selectDeliveryOption, {
    onCompleted() {
      console.log("DELIVERY MUTATION FATTA")
      refreshOrder()
      setIsDeliverySetted(true)
    },
  })

  /*---ERRORS RESET ---*/
  const resetInput = (value: string) => {
    errors[value] && delete errors[value], setErrors({ ...errors })
  }

    /*--- LOGS ---*/
    if (!production) {
      console.log(
        '%c 2.1.ADDRESS FORM VALUES ',
        'background: #4c00ff; color: #ffffff',
        addressValues
      )
      console.log(
        '%c 2.2.DELIVERY FORM VALUES ',
        'background: #8c00ff; color: #ffffff',
        deliveryValues
      )
    }

  const context = useMemo(
    () => ({
      formattedAddress,
      setFormattedAddress,
      addressValues,
      setAddressValues,
      isAddressSetted,
      setIsAddressSetted,
      setIsSubmittingAddress,
      deliveryValues,
      setDeliveryValues,
      isDeliverySetted,
      handleChangeAddressInput,
      handleChangeDeliveryInput,
      updateDeliveryMutation,
      handleAddressSubmit,
      handleDeliverySubmit,
      errors,
      resetInput
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      formattedAddress,
      setFormattedAddress,
      addressValues,
      setAddressValues,
      isAddressSetted,
      setIsAddressSetted,
      setIsSubmittingAddress,
      deliveryValues,
      setDeliveryValues,
      isDeliverySetted,
      handleChangeAddressInput,
      handleChangeDeliveryInput,
      updateDeliveryMutation,
      handleAddressSubmit,
      handleDeliverySubmit,
      errors,
      resetInput
    ]
  )

  return (
    <ShippingContext.Provider value={context}>
      {children}
    </ShippingContext.Provider>
  )
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
 export const useShipping = () => {
  const context = useContext(ShippingContext)

  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderContextProvider')
  }

  return context
}

export default { ShippingContextProvider, useShipping }

defineMessages({
  emptyError: {
    defaultMessage: "This field can't be empty",
    id: 'checkout-io.address.errors.empty',
  },
  postalCodeError: {
    defaultMessage: 'The postal code need to be digits',
    id: 'checkout-io.address.errors.postal-code',
  },
})