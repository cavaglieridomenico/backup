import React, { useEffect, useState } from "react"
import { useMutation, useQuery } from "react-apollo"
import { FormattedMessage, defineMessages, useIntl } from "react-intl"
import { FormattedPrice } from "vtex.formatted-price"
import { useRuntime } from "vtex.render-runtime"
import { ButtonPlain, Divider, IconArrowBack, IconCheck } from "vtex.styleguide"
import Coupon from "../../../Coupon"
import getProductsProperties from "../../../graphql/productsProperties.graphql"
import updateTextArea from "../../../graphql/updateTextArea.graphql"
import { useCheckout } from "../../../providers/checkout"
import { useOrder } from "../../../providers/orderform"
import DiscountTooltip from "../../common/discountTooltip/discountTooltip"
import style from "./Summary.css"

import { formatPrice } from "../../../utils/utils"

/**
 * @returns a simple summary of the orderform items
 * and all the total values
 */
interface CheckoutSummaryProps {
	openTextCharactersNumber?: number | string
	includedOfferings: IncludedOffering[]
	showEnergyAndSheet: boolean
	showLeadTime: boolean
	showInStockAndLeadtime: boolean
	energyImageProp: Array<string>
	energyLabelProp: Array<string>
	productDataSheetProp: Array<string>
	leadTimeProp: Array<string>
	salesChannelData?: Array<SalesChannel> | []
	enableCouponLogs: boolean
	hasDiscountTooltip: boolean
}
interface SalesChannel {
	salesChannel: number
	prefix: string
}

interface IncludedOffering {
	includedOffering: IncludedOffering
}

interface IncludedOffering {
	name: string
}

const CheckoutSummary: StorefrontFunctionComponent<CheckoutSummaryProps> = ({
	openTextCharactersNumber = 216,
	includedOfferings = [],
	showEnergyAndSheet,
	showLeadTime,
	showInStockAndLeadtime,
	energyImageProp,
	energyLabelProp,
	productDataSheetProp,
	leadTimeProp,
	salesChannelData = [],
	enableCouponLogs = false,
	hasDiscountTooltip = false,
}) => {
	const intl = useIntl()
	const { navigate } = useRuntime()
	const { orderForm, refreshOrder } = useOrder()
  const {exhaustedDeliveries } = useCheckout()
	const items = orderForm?.items
  const isDeliveryValid = !exhaustedDeliveries

	const [specifications, setSpecifications] = useState<any>([])

	/** da capire se refactor */
	let itemIds = items?.map(item => item.id)
	//pulisco da doppioni
	itemIds = [...new Set(itemIds)]
	//tiro giù le properties dei prodotti
	const { data, error, loading } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: itemIds,
		},
	})
	const tradePolicy = salesChannelData?.filter(
		(data: any) => data?.salesChannel == orderForm?.salesChannel,
	)[0]?.prefix

	const setProperLabel = (id: any, leadtime: any) => {
		if (specifications && tradePolicy) {
			let itemSpecs = specifications?.filter(
				(item: any) => item?.productId == id,
			)
			let inStockAndSellableSpecs = itemSpecs[0]?.properties?.filter(
				(item: any) =>
					item?.name?.includes("stockavailability") ||
					item?.name?.includes("sellable"),
			)
			let specsByTradePolicy = inStockAndSellableSpecs?.filter((item: any) =>
				item.name.includes(tradePolicy),
			)
			if (specsByTradePolicy && specsByTradePolicy?.length > 0) {
				let sellable = specsByTradePolicy?.filter((item: any) =>
					item.name.includes("sellable"),
				)[0]?.values[0]
				let inStock = specsByTradePolicy?.filter((item: any) =>
					item.name.includes("stockavailability"),
				)[0]?.values[0]
				if (sellable == "true") {
					if (inStock.toLowerCase() == "out of stock") return leadtime
					else if (inStock.toLowerCase() == "show in stock products only")
						return intl.formatMessage(messages.inStock)
				}
			}
			return ""
		}
	}

	useEffect(() => {
		if (data) {
			let allProperties = []
			allProperties.push(data)
			setSpecifications(allProperties)
		}
	}, [data, error, loading])

	const propertiesList = data?.productsByIdentifier
	//prendo il lead time e lo passo al contesto
	items?.map(item => {
		propertiesList?.map((itemWithProps: any) => {
			if (itemWithProps.productId == item.productId) {
				let productDataSheetSpec
				let energyLabelSpec
				let energyLabelImageSpec
				let leadTimeSpec

				for (let specificationName of productDataSheetProp) {
					productDataSheetSpec = itemWithProps?.properties?.filter(
						(e: any) => e.name == specificationName,
					)
					if (productDataSheetSpec.length > 0) break
				}

				for (let specificationName of energyLabelProp) {
					energyLabelSpec = itemWithProps?.properties?.filter(
						(e: any) => e.name == specificationName,
					)
					if (energyLabelSpec.length > 0) break
				}

				for (let specificationName of energyImageProp) {
					energyLabelImageSpec = itemWithProps?.properties?.filter(
						(e: any) => e.name == specificationName,
					)
					if (energyLabelImageSpec.length > 0) break
				}

				for (let specificationName of leadTimeProp) {
					leadTimeSpec = itemWithProps?.properties?.filter(
						(e: any) => e.name == specificationName,
					)
					if (leadTimeSpec.length > 0) break
				}

				item.leadtime = leadTimeSpec[0]?.values[0]
				item.EnergyLogoImage = energyLabelImageSpec[0]?.values[0]
				item.energyLabel = energyLabelSpec[0]?.values[0]
				item.productDataSheet = productDataSheetSpec[0]?.values[0]
			}
		})
		return item
	})

	const totalizers = orderForm?.totalizers
	const value = orderForm?.value
	const currency = orderForm?.storePreferencesData?.currencySymbol

	const handleBackToCart = () => {
		navigate({ page: "store.checkout.cart" })
	}

	const [updateText]: any = useMutation(updateTextArea, {
		onCompleted() {
			refreshOrder()
		},
	})
	const updateTextAreaField = (value: string) => {
		updateText({
			variables: {
				orderFormId: orderForm.orderFormId,
				input: { value },
			},
		})
	}

	const renderServiceName = (name: string) => {
		let arrayFromName = name.split("_")
		return arrayFromName[arrayFromName.length - 1]
	}

	return (
		<>
			<div className={style.summaryBackToCart}>
				<span
					className={`${style.BackToCartLabel} link c-action-primary t-small pointer underline-hover `}
					onClick={handleBackToCart}
				>
					<IconArrowBack />
					{intl.formatMessage(messages.backToCart)}
				</span>
			</div>
			<h4 className={style.summaryTitle}>
				{intl.formatMessage(messages.summary)}
			</h4>
			{/* <div className="mv3">
        <Divider orientation="horizontal" />
      </div> */}
			<div>
				<ul className={style.summaryProductList}>
					{items?.map((item: Item, i: number) => (
						<>
							<li className="pv4" key={i}>
								<div className={style.container}>
									<div className={`${style.summaryImage}  relative`}>
										<img width="45" src={item?.imageUrl} alt={item?.name} />
										{/* <div className={`${style.quantity} t-mini`}> */}
										{/* <span className={style.quantityLabel}>
												{intl.formatMessage(messages.qty)}
											</span> */}
										<span
											className={`${style.quantityNumber} t-mini b--action-primary`}
										>
											{item?.quantity}
										</span>
										{/* </div> */}
									</div>
									<div className={`${style.description} ph4 c-on-base`}>
										<div className={`${style.name} t-mini`}>{item?.name}</div>
										{showLeadTime && item?.leadtime ? (
											<div className={`${style.leadtime} c-action-primary`}>
												{item?.leadtime}
											</div>
										) : showInStockAndLeadtime ? (
											<div className={`${style.leadtime} c-action-primary`}>
												{setProperLabel(item?.productId, item?.leadtime)}
											</div>
										) : null}
										<div className="flex items-center">
											{showEnergyAndSheet && item.EnergyLogoImage && (
												<a
													href={item.energyLabel}
													target="_blank"
													className="mr3"
												>
													<img src={item.EnergyLogoImage} alt="" />
												</a>
											)}

											{showEnergyAndSheet && item.productDataSheet && (
												<ButtonPlain
													href={item.productDataSheet}
													target="_blank"
													size="small"
												>
													{intl.formatMessage({ id: "checkout-io.dataSheet" })}
												</ButtonPlain>
											)}
										</div>
									</div>
									<div className={style.price}>
										<FormattedPrice value={item?.price / 100} />
									</div>
								</div>
								<div className={style.summaryProductOfferings}>
									{includedOfferings?.map((bundle: any, index: number) => (
										<div
											key={index}
											className={`${style.offeringContainer} b--action-primary`}
										>
											<div
												className={`${style.offeringNameAndIcon} flex items-center c-action-primary`}
											>
												<IconCheck />
												<span
													className={`${style.offeringName} c-action-primary`}
												>
													{bundle.name}
												</span>
											</div>
											<span
												className={`${style.offeringPrice} c-action-primary`}
											>
												{intl.formatMessage(messages.freeLabel)}
											</span>
										</div>
									))}
									{item?.bundleItems?.map((bundle: any, index: number) => (
										<div
											key={index}
											className={`${style.offeringContainer} b--action-primary`}
										>
											<div
												className={`${style.offeringNameAndIcon} flex items-center c-action-primary`}
											>
												<IconCheck />
												<span
													className={`${style.offeringName} c-action-primary`}
												>
													{renderServiceName(bundle?.name)}
												</span>
											</div>
											<span
												className={`${style.offeringPrice} c-action-primary`}
											>
												{bundle.price != 0
													? formatPrice(bundle.price, currency)
													: intl.formatMessage(messages.freeLabel)}
											</span>
										</div>
									))}
								</div>
							</li>
							<Divider></Divider>
						</>
					))}
				</ul>
			</div>
			{/* <div className="mv3">
				<Divider orientation="horizontal" />
			</div> */}
			<div>
				<div className={style.totalizersContainer}>
					<div className={style.checkoutSummaryCoupon}>
						<Coupon useLogs={enableCouponLogs} />
					</div>
					{totalizers?.map((total: Totalizer, i: number) =>
						total.id != "Shipping" ? (
							<div
								key={i}
								className={`flex flex-row justify-between ${
									style[`totalizer-${total.id.toLocaleLowerCase()}`]
								}`}
							>
								<div className={style.totalizerContainer}>
									<p className={style.totalizerTitle}>
										{total.id == "Items"
											? intl.formatMessage(messages.subTotal)
											: intl.formatMessage(messages.discount)}
									</p>
									{total.id == "Discounts" && hasDiscountTooltip && (
										<DiscountTooltip
											discounts={formatPrice(
												orderForm?.totalizers?.[1]?.value,
												orderForm?.storePreferencesData?.currencySymbol,
											)}
										/>
									)}
								</div>
								<span className="flex items-center">
									<FormattedPrice value={Number(total?.value) / 100} />
								</span>
							</div>
						) : (
							<div key={i} className="flex flex-row justify-between">
								<p className={style.totalizerTitle}>
									{intl.formatMessage(messages.shipping)}
								</p>
								<span className="flex items-center">
									{total?.value == 0 ? (
										intl.formatMessage(messages.freeLabel)
									) : (
										<FormattedPrice value={Number(total?.value) / 100} />
									)}
								</span>
							</div>
						),
					)}
				</div>

				<div className="mv3">
					<Divider orientation="horizontal" />
				</div>

				<div className={style.summaryTotalContainer}>
          {isDeliveryValid && (
            <h5 className={`${style.summaryTotalText} t-heading-5 flex flex-row justify-between b`}>
              {intl.formatMessage(messages.total)}{" "}
              {value > 0 ? <FormattedPrice value={value / 100} /> : "Loading"}
            </h5>
          )}
				</div>
				<div className={`${style.summaryTextAreaContainer}  t-small`}>
					<span>
						<FormattedMessage
							id="checkout-io.openText"
							defaultMessage="pPersonalised message (max {variable} characters)"
							values={{ variable: openTextCharactersNumber }}
						/>
					</span>
					<textarea
						className={style.checkoutTextArea}
						name="cart-note"
						id="cart-note"
						rows={3}
						maxLength={+openTextCharactersNumber}
						onBlur={e => updateTextAreaField(e.target.value)}
					></textarea>
				</div>
			</div>
		</>
	)
}

const messages = defineMessages({
	backToCart: {
		defaultMessage: "Back to cart",
		id: "checkout-io.backToCart",
	},
	summary: {
		defaultMessage: "Summary",
		id: "checkout-io.summary",
	},
	qty: {
		defaultMessage: "Qty.",
		id: "checkout-io.qty",
	},
	subTotal: {
		defaultMessage: "Subtotal",
		id: "checkout-io.subTotal",
	},
	discount: {
		defaultMessage: "Discounts",
		id: "checkout-io.discount",
	},
	total: {
		defaultMessage: "Total",
		id: "checkout-io.total",
	},
	openTextLabel: {
		defaultMessage: "Personalised message (max {characters} characters)",
		id: "checkout-io.openText",
	},
	freeLabel: {
		defaultMessage: "Free",
		id: "checkout-io.summary.freeLabel",
	},
	shipping: {
		defaultMessage: "Shipping",
		id: "checkout-io.shipping",
	},
	inStock: {
		defaultMessage: "In stock",
		id: "checkout-io.inStock-label",
	},
})

export default CheckoutSummary

CheckoutSummary.schema = {
	title: "Summary Schema",
	description:
		"Here you can chose if you want to show the Energy Label and The Product Sheet",
	type: "object",
	properties: {
		showEnergyAndSheet: {
			title: "Energy Label and Product Sheet",
			description:
				"Chose if you want to show the Energy Label and Product Sheet",
			default: true,
			type: "boolean",
		},
		showLeadTime: {
			title: "Lead Time",
			description: "Choose if you want to show the Lead Time",
			default: true,
			type: "boolean",
		},
		showInStockAndLeadtime: {
			title: "In stock and Lead Time label",
			description: "Choose if you want to show the In stock/Lead Time label",
			default: true,
			type: "boolean",
		},
	},
}
