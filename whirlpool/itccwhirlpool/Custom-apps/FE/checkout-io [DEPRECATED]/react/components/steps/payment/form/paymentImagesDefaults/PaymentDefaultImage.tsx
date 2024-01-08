import React, { PureComponent } from "react"
import { AppSettings } from "../../../../../typings/configs"
import GenericCard from "./GenericCard"
import PayPal from "./PayPal"
import WorldPay from "./WorldPay"

interface Props {
	paymentSystemGroup: string
  appSettings: AppSettings
}

class PaymentDefaultImage extends PureComponent<Props> {
	public render() {
		const { paymentSystemGroup, appSettings } = this.props
		let Flag

		switch (paymentSystemGroup) {
			case appSettings.worldpayConnectorId:
				Flag = WorldPay
				break
			case appSettings.paypalConnectorId:
				Flag = PayPal
				break
			default:
				Flag = GenericCard
				break
		}

		return <Flag />
	}
}

export default PaymentDefaultImage
