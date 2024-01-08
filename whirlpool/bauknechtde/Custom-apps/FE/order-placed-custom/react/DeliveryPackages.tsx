import React, { FC, Fragment, useState, useEffect } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import ProductList from './components/ProductList'
import DeliveryHeader from './components/DeliveryHeader'
import { useOrder } from './components/OrderContext'


const CSS_HANDLES = ['package', 'packageHeaderColumn']

const DeliveryPackages: FC = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const { deliveryParcels, giftRegistryData } = useOrder()
  const [dngPayload, setDngPayload] = useState({ items: [] })

  const { orderId } = useOrder()
  if (deliveryParcels.length === 0) {
    return null
  }

  useEffect(() => {
    getdngPayload()
  }, [])

  const getdngPayload = async () => {
    return await fetch(`/app/dng/order/${orderId}`, { method: "GET", })
      .then(response => response.json())
      .then(json => {
        setDngPayload(json)
        return json
      }).catch((error) => {
        console.error('Error:', error);
      });
  }
  return (
    <Fragment>
      {deliveryParcels.map((deliveryParcel, index) => (
        <>
          <div
            className={`${applyModifiers(
              handles.package,
              'delivery'
            )} mv8 flex-l justify-between flex-column flex-row-m`}
            key={index}
          >
            {index === 0 && (
              <div className={handles.packageHeaderColumn}>
                <DeliveryHeader
                  shippingData={deliveryParcel}
                  index={index}
                  numPackages={deliveryParcels.length}
                  giftRegistry={giftRegistryData}
                />
              </div>
            )}
            <ProductList products={deliveryParcel.items} dngPayload={dngPayload} />
          </div>
        </>
      ))}
    </Fragment>
  )
}
export default DeliveryPackages
