import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import {Divider} from 'vtex.styleguide'
import style from '../delivery.css'

interface DeliveryTypeLabelProps {
  type: string
  // description?: string //temp as description is not present from orderForm shippingData
  price: string
}

const DeliveryTypeLabel: React.FC<DeliveryTypeLabelProps> = ({ 
  type,
  price,
  // description
}: any) => {

  const intl = useIntl()

  const getDeliveryMethodDescription = () => {
    switch(type) {
      case "Standard": return `${intl.formatMessage(messages.deliveryDescStandard)}`;
      case "Next-day": return `${intl.formatMessage(messages.deliveryDescNextDay)}`;
      default: return ''
    }
  }

  //TEMP AS DESCRIPTION IS NOT RETRIEVED FROM ORDERFORM SHIPPINGDATA
  const description = getDeliveryMethodDescription()  

  return(
    <div className={style.deliveryTypeContainer} >
      <div className={style.deliveryNameContainer}>
        <span className={style.deliveryType}>{type}</span>
        <span className={style.deliveryDescription}>{description}</span>
      </div>
      <div className={style.deliveryPriceContainer}>
        <div>
          <Divider orientation="vertical" />
        </div>
        <span className={style.deliveryPrice}>{price !== 0 ? price : intl?.formatMessage(messages.freeDelivery)}</span>
      </div>
    </div>
  )
}

const messages = defineMessages({
  deliveryDescStandard: {
    defaultMessage: 'A maximum of 5 working days',
    id: 'checkout-io.shipping.delivery-description.standard',
  },
  deliveryDescNextDay: {
    defaultMessage: 'One working day',
    id: 'checkout-io.shipping.delivery-description.next-day',
  },
  freeDelivery: {
    defaultMessage: 'Free',
    id: 'checkout-io.shipping.delivery-price.free',
  }
})

export default DeliveryTypeLabel