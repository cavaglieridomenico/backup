import React, { useState, useEffect } from "react"
import style from "./product-summary.css"
import { useIntl, defineMessages } from "react-intl"
import { Alert } from "vtex.styleguide"
import { IconClose } from "vtex.store-icons"
import { useOrder } from "../../../providers/orderform"

const messages = defineMessages({
	inputPlaceholder: {
		defaultMessage: "Insert the code",
		id: "checkout-io.cart.coupon-input-placeholder",
	},
	buttonText: {
		defaultMessage: "Apply",
		id: "checkout-io.cart.coupon-button-text",
	},
})

interface CouponProps {}

const Coupon: React.FC<CouponProps> = ({}) => {
	const intl = useIntl()
	const {
		couponData,
		insertCoupon,
		couponMessages,
		push,
		isCouponCallDone,
		setIsCouponCallDone,
	} = useOrder()
	const [couponValue, setCouponValue] = useState("")
	const [isAlertOpen, setIsAlertOpen] = useState(false)

	const resetCoupon = () => {
		insertCoupon("")
		setCouponValue("")
	}

	const handleChangeInput = (e: any) => {
		setCouponValue(e.target.value)
	}

	useEffect(() => {
		if (isCouponCallDone) {
			if (couponMessages?.marketingData?.coupon != "") {
				push({
					event: "ga4-coupon",
					eventAction: couponValue,
					isValid: true,
				})
			}
			if (
				couponMessages?.messages?.couponMessages[0]?.code === "couponExpired" ||
				couponMessages?.messages?.couponMessages[0]?.code === "couponNotFound"
			) {
				push({
					event: "ga4-coupon",
					eventAction: couponValue,
					isValid: false,
				})
			}
		}
		setIsCouponCallDone(false)
	}, [isCouponCallDone])

	const handleSubmit = (e: any) => {
		e.preventDefault()
		insertCoupon(couponValue)
	}

	return (
		<>
			{isAlertOpen && couponMessages?.messages?.couponMessages[0]?.code && (
				<div className={style.couponAlertContainer}>
					<Alert
						type={couponMessages?.messages?.couponMessages[0]?.status}
						onClose={() => setIsAlertOpen(false)}
						autoClose="5000"
					>
						{couponMessages?.messages?.couponMessages[0]?.text}
					</Alert>
				</div>
			)}

			{!couponData && (
				<form
					action=""
					onSubmit={(e: any) => handleSubmit(e)}
					className={style.couponForm}
				>
					<input
						className={`${style.couponInput} t-small`}
						type="text"
						placeholder={intl.formatMessage(messages.inputPlaceholder)}
						value={couponValue}
						onChange={(e: any) => handleChangeInput(e)}
					/>
					<button
						type="submit"
						className={`${style.couponButton} t-small bg-action-primary b--action-primary c-on-action-primary hover-bg-action-primary hover-b--action-primary hover-c-on-action-primary b`}
						disabled={couponValue.trim().length <= 0}
					>
						{intl.formatMessage(messages.buttonText)}
					</button>
				</form>
			)}

			{couponData && (
				<>
					<div
						className={`${style.couponSubmitted} flex items-center justify-center`}
					>
						<p>{couponData}</p>
						<div className="pointer" onClick={() => resetCoupon()}>
							<IconClose type="outline" />
						</div>
					</div>
				</>
			)}
		</>
	)
}

export default Coupon
