import React, { FC } from 'react'
import { useOrder } from './components/OrderContext'
import style from './styles.css'

const DeliveryAddress: FC = () => {

    const { deliveryParcels } = useOrder()

    return(
        <div className={style.deliveryAddressWrapper}>
            <div>{deliveryParcels[0].address.street}</div>
          {
            deliveryParcels[0].address.complement !== null &&
            <div>{deliveryParcels[0].address.complement}</div>
          }
          <div>{deliveryParcels[0].address.city}</div>  
          <div>{deliveryParcels[0].address.state}</div>
          <div>{deliveryParcels[0].address.postalCode}</div>
        </div>
    )
}

export default DeliveryAddress