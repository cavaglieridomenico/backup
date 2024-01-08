import React from 'react'
import { CustomerInfo } from 'vtex.order-details'
import { useAdditionalOrderInfo } from './components/AdditionalOrderInfoContext'

import { useOrder } from './components/OrderContext'

const OrderCustomerInfo = () => {
  const { clientProfileData } = useOrder()
  const additionalOrderInfo = useAdditionalOrderInfo();
  const realEmail = additionalOrderInfo.customData?.find((customData: CustomData) => customData.id == "profile")?.fields?.find((field: CustomDataField) => field.key == "email")?.value || "";

  if (
    clientProfileData.firstName == null ||
    clientProfileData.lastName == null
  ) {
    return null
  }

  // return <CustomerInfo profile={clientProfileData} />
  return <CustomerInfo profile={
    {
      ...clientProfileData,
      email: clientProfileData.email.includes("fake") && realEmail != "" ? realEmail : clientProfileData.email
    }
  } />
}

export default OrderCustomerInfo
