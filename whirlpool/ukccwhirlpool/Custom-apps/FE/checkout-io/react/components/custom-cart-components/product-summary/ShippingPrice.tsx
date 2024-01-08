import React from "react"
import style from "./product-summary.css"
import { useIntl, defineMessages } from "react-intl"
import { useCart } from "../../../providers/cart"
import { useOrder } from "../../../providers/orderform"
import { formatPrice } from "../../../utils/utils"

const messages = defineMessages({
	shippingLabel: {
		defaultMessage: "Shipping",
		id: "checkout-io.cart.shipping-label",
	},
	discountLabel: {
		defaultMessage: "Discounts",
		id: "checkout-io.discount",
	},
	shippingLabelFree: {
		defaultMessage: "Free",
		id: "checkout-io.summary.freeLabel",
	},
})

const ShippingPrice: React.FC = () => {
	const { SHIPPING_PRICE } = useCart()
	const { orderForm } = useOrder()
	const isDiscount = orderForm?.totalizers?.find(
		(data: any) => data?.id == "Discounts",
	)
		? true
		: false
	const isShipping = orderForm?.totalizers?.find(
		(data: any) => data?.id == "Shipping",
	)
		? true
		: false
	console.log(isDiscount, isShipping, SHIPPING_PRICE, "SPECCS")
	const discounts = orderForm?.totalizers[1]
		? formatPrice(
				orderForm?.totalizers[1]?.value,
				orderForm?.storePreferencesData?.currencySymbol,
		  )
		: ""
	const intl = useIntl()
	// message to be rendered : if shipping is 0 Free willl be displayed
	const shippingLabel = SHIPPING_PRICE.includes(" 0,00")
		? intl.formatMessage(messages.shippingLabelFree)
		: SHIPPING_PRICE

	return (
		<>
			{isDiscount && (
				<div className={style.shippingContainer}>
					<span className={style.shippingLabel}>
						{intl.formatMessage(messages.discountLabel)}
					</span>
					<span className={style.shippingPrice}>{discounts}</span>
				</div>
			)}
			{isShipping && SHIPPING_PRICE !== "" && (
				<div className={style.shippingContainer}>
					<span className={style.shippingLabel}>
						{intl.formatMessage(messages.shippingLabel)}
					</span>
					<span className={style.shippingPrice}>{shippingLabel}</span>
				</div>
			)}
		</>
	)
}

export default ShippingPrice
