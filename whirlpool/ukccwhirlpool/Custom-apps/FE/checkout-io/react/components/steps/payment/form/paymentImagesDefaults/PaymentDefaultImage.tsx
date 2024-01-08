import React, { PureComponent } from "react"
import GenericCard from "./GenericCard"
import PayPal from "./PayPal"
import WorldPay from "./WorldPay"

interface Props {
	paymentSystemGroup: string
}

class PaymentDefaultImage extends PureComponent<Props> {
	public render() {
		const { paymentSystemGroup } = this.props
		let Flag

		switch (paymentSystemGroup) {
			case "202":
				Flag = WorldPay
				break
			case "12":
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
