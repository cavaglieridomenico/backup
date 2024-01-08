import React, {useEffect} from 'react'
import { Switch, Route } from 'react-router'
import routes from '../../../utils/routes'
import Step from '../../step-group/Step'
import { useOrder } from '../../../providers/orderform'
//import { useCheckout } from "../../../providers/checkout"

interface ShippingStepProps {
  children: any[]
}

const ShippingStep: React.FC<ShippingStepProps> = ({ children }) => {

  const { orderLoading } = useOrder()
	//const { push } = useCheckout()
  const ShippingForm = children?.find(
    (child: any) => child.props.id == 'shipping-form'
  )
  const ShippingSummary = children?.find(
    (child: any) => child.props.id == 'shipping-summary'
  )

	const sendEccCheckoutEvent = () => {
		/*push({
			event: "eec.checkout",
			step: "step 2",
			orderForm: orderForm,
		})*/
	}

	useEffect(() => {
    //@ts-ignore
    sendEccCheckoutEvent()

	}, [])

  return (
    <>
      {!orderLoading && (
        <Step>
          <Switch>
            <Route path={routes.SHIPPING.route}>{ShippingForm}</Route>
            <Route path="*">{ShippingSummary}</Route>
          </Switch>
        </Step>
      )}
    </>
  )
}

export default ShippingStep