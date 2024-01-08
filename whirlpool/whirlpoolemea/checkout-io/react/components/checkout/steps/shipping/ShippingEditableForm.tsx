import React from "react"
import { useOrder } from "../../../../providers/orderform"
import StepHeader from "../../step-group/StepHeader"
import { useIntl, defineMessages } from "react-intl"
import style from "./standard/shipping.css"

interface ShippingEditableFormProps {
  children: any
}

const ShippingEditableForm: React.FC<ShippingEditableFormProps> = ({
  children,
}: 
any) => {
  const intl = useIntl()
  const { orderForm } = useOrder()
  const { canEditData } = orderForm



  return(
    <>
      <div className={style.StepHeader}>
        <StepHeader
          title={intl.formatMessage(messages.shipping)}
          canEditData={canEditData}
        />
      </div>
      <div className="mt6">
        {children}
      </div>
    </>
  )
}

const messages = defineMessages({
  shipping: {
		defaultMessage: "Shipping",
		id: "checkout-io.shipping",
	},
})

export default ShippingEditableForm
