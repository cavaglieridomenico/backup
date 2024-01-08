import React, {
  useEffect,
  // useState
} from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { useOrder } from '../../../../providers/orderform'
import { useShipping } from '../context/ShippingContext'
import { Input, RadioGroup, Button } from 'vtex.styleguide'
import DeliveryTypeLabel from './DeliveryTypeLabel'
import style from '../delivery.css'

interface DeliveryEditableFormProps {
  // children: any
}

const DeliveryEditableForm: React.FC<DeliveryEditableFormProps> = ({}: any) => {
  const intl = useIntl()
  const { orderForm } = useOrder()
  const { shippingData } = orderForm
  const {
    deliveryValues,
    setDeliveryValues,
    handleChangeDeliveryInput,
    isAddressSetted,
    updateDeliveryMutation,
    handleDeliverySubmit,
    // isFetching
  } = useShipping()

  const deliveryMethods = shippingData?.logisticsInfo[0]?.slas
  const selectedDelivery = shippingData?.logisticsInfo[0]?.selectedSla

  const getDeliveryOptions = () => {
    let delOptions: any = []
    deliveryMethods.map((item: any) => {
      delOptions.push({
        value: item.name,
        label: <DeliveryTypeLabel type={item.name} price={item.price} />,
      })
    })
    // delOptions.push({
    //   value: "Delivery",
    //   label: <DeliveryTypeLabel type={"Delivery"} price={"5,00 €"}/>
    // })
    return delOptions
  }

  useEffect(() => {
    if (selectedDelivery) {
      setDeliveryValues({
        ...deliveryValues,
        id: selectedDelivery,
      })
      //updateDeliveryMutation(defaultDeliveryMethod) NOT NECESSARY AS FROM DEFAULT WE HAVE A SELECTED_SLA
    }
  }, [])

  //Get delivery options to put in the RadioGroup
  const deliveryOptions = getDeliveryOptions()

  return (
    <>
      {isAddressSetted && (
        <form className="mt6" onSubmit={() => handleDeliverySubmit()}>
          <div className={style.receiverInput} data-testid="delivery-receiver">
            <Input
              label={`${intl.formatMessage(messages.receiver)}`}
              name="receiver"
              type="text"
              value={deliveryValues?.receiver || ''}
              onChange={(e: any) => {
                handleChangeDeliveryInput(e)
              }}
            />
          </div>
          <div className={style.deliverygroupContainer}>
            <RadioGroup
              name="delivery-types"
              options={deliveryOptions || []}
              value={selectedDelivery}
              label={`${intl.formatMessage(messages.shippingType)}`}
              onChange={(e: any) =>
                updateDeliveryMutation(e.currentTarget.value)
              }
            />
          </div>
          <div className={style.deliveryButton}>
            <Button size="large" type="submit" block>
              <span className="f5">{intl.formatMessage(messages.save)}</span>
            </Button>
          </div>
        </form>
      )}
    </>
  )
}

const messages = defineMessages({
  receiver: {
    defaultMessage: 'Receiver',
    id: 'checkout-io.receiver',
  },
  shippingType: {
    defaultMessage: 'Shipping type',
    id: 'checkout-io.shipping-type',
  },
  save: {
    defaultMessage: 'Save',
    id: 'checkout-io.save',
  },
})

export default DeliveryEditableForm
