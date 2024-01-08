//@ts-nocheck
import React, { useEffect, useState } from "react"
import { useMutation, useQuery } from "react-apollo"
import { FormattedMessage, defineMessages, useIntl } from "react-intl"
import { FormattedPrice } from "vtex.formatted-price"
import { useRuntime } from "vtex.render-runtime"
import { ButtonPlain, Divider, IconArrowBack, IconCheck } from "vtex.styleguide"
import Coupon from "../../Coupon"
import getProductsProperties from "../../graphql/productsProperties.graphql"
import updateTextArea from "../../graphql/updateTextArea.graphql"
import { useOrder } from "../../providers/orderform"
import { ProductTitle } from "../custom-cart-components/product-list/ProductTitle"
import style from "./Summary.css"

import { useCheckout } from "../../providers/checkout"
import { formatPrice } from "../../utils/utils"

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
  applyTradePolicyLogic: any
}

interface IncludedOffering {
	includedOffering: IncludedOffering
}

interface IncludedOffering {
	name: string
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
	openTextCharactersNumber = 216,
	includedOfferings = [],
	showEnergyAndSheet,
	showLeadTime,
	showInStockAndLeadtime,
  applyTradePolicyLogic = false

}) => {
	const intl = useIntl()
	const { navigate } = useRuntime()
	const { orderForm, refreshOrder, orderLoading } = useOrder()
	const { push } = useCheckout()
	const items = orderForm?.items

	const [specifications, setSpecifications] = useState<any>([])

	/** da capire se refactor */
	let itemIds = items?.map((item) => item.id)
	//pulisco da doppioni
	itemIds = [...new Set(itemIds)]
	//tiro giù le properties dei prodotti
	const { data, error, loading } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: itemIds,
		},
	})

    const tradePolicy =
	orderForm?.salesChannel == "1"
    ? "EPP"
    : orderForm?.salesChannel == "2"
    ? "FF"
    : orderForm?.salesChannel == "3"
    ? "VIP"
    : "O2P"

    const setProperLabel = (id: any, leadtime: any) => {
      if(specifications && tradePolicy){
        let itemSpecs = specifications?.filter((item: any) => item?.productId == id)
        let inStockAndSellableSpecs = itemSpecs[0]?.properties?.filter((item: any) => item?.name?.includes("stockavailability") || item?.name?.includes("stockAvailability") || item?.name?.includes("sellable"))
        let specsByTradePolicy = applyTradePolicyLogic ? inStockAndSellableSpecs?.filter((item: any) => item.name.includes(tradePolicy)) : inStockAndSellableSpecs;
        if(specsByTradePolicy && specsByTradePolicy?.length > 0){
          let sellable = specsByTradePolicy?.filter((item: any) => item.name.includes("sellable"))[0]?.values[0]
          let inStock = specsByTradePolicy?.filter((item: any) => item.name.includes("stockavailability") || item.name.includes("stockAvailability"))[0]?.values[0]
          if(sellable == "true"){
            if(inStock.toLowerCase() == "out of stock")
              return leadtime
            else if(inStock.toLowerCase() == "show in stock products only")
              return "In stock"
          }
        }
        return ""

      }
    }


    useEffect(()=>{
		if(data){
			let allProperties = []
            const propertiesList = data?.productsByIdentifier?.map((data: any) => {
				allProperties.push(data)
			})
			setSpecifications(allProperties)
        }
    }, [data, error, loading])

	const propertiesList = data?.productsByIdentifier
	//prendo il lead time e lo passo al contesto
	items?.map((item) => {
		propertiesList?.map((itemWithProps: any) => {
			if (itemWithProps.productId == item.productId) {
				let leadtime = itemWithProps?.properties?.filter(
					(e: any) => e.name == "leadtime",
				)
				let EnergyLogoImage = itemWithProps?.properties?.filter(
					(e: any) => e.name == "EnergyLogo_image",
				)
				let productDataSheet = itemWithProps?.properties?.filter(
					(e: any) => e.name == "nel-data-sheet" || e.name === "product-data-sheet",
				)

        let newEnergyLabel = itemWithProps?.properties?.filter(
				  (e: any) => e.name == "new-energy-label",
			  )

				let energyLabel = itemWithProps?.properties?.filter(
					(e: any) => e.name == "energy-label",
				)

        if (newEnergyLabel.length) item?.energyLabel = newEnergyLabel[0]?.values[0]
        else item?.energyLabel = energyLabel[0]?.values[0]

				item?.leadtime = leadtime[0]?.values[0]
				item?.EnergyLogoImage = EnergyLogoImage[0]?.values[0]
				item?.productDataSheet = productDataSheet[0]?.values[0]
			}
		})
		return item
	})

	const totalizers = orderForm?.totalizers
	const value = orderForm?.value
	const currency = orderForm?.storePreferencesData?.currencySymbol
  // We take all the products' delivery price
  const productsDeliveryValues = orderForm?.items?.map((item) => item.offerings?.find((offering) => offering.name === "Delivery")?.price).filter((item: any) => !!item)
  // We sum them all to obtain the total price
  const productsDeliveryTotal = productsDeliveryValues?.reduce((acc, curr) => curr ? (acc! + curr) : (acc! + 0), 0)

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

	const renderServiceName = (name:string) => {
        let arrayFromName = name.split("_")
        return arrayFromName[arrayFromName.length-1]
    }
  const deliveryValue = (items?.reduce((sum, item) => {
    const deliveryOffering = item.bundleItems?.find(offering => offering.name === "Delivery");
    const deliveryPrice = deliveryOffering ? deliveryOffering.price : 0;
    return sum + deliveryPrice;
  }, 0) / 100).toFixed(2);
  const installationValue = (items?.reduce((sum, item) => {
    const installationOffering = item.bundleItems?.find(offering => offering.name === "Installation");
    const installationPrice = installationOffering ? installationOffering.price : 0;
    return sum + installationPrice;
  }, 0) / 100).toFixed(2);
  const removalValue = (items?.reduce((sum, item) => {
    const removalOffering = item.bundleItems?.find(offering => offering.name === "Removal");
    const removalPrice = removalOffering ? removalOffering.price : 0;
    return sum + removalPrice;
  }, 0) / 100).toFixed(2);
  const hasDiscounts = totalizers?.some((totalizer: Totalizer) => totalizer.id === "Discounts");
  const discountsValue = hasDiscounts ? (totalizers?.find((totalizer: Totalizer) => totalizer.id === "Discounts").value / 100).toFixed(2) : 0;
  const hasShipping = totalizers?.some((totalizer:Totalizer) => totalizer.id === "Shipping");
  const shippingValue = hasShipping ? (totalizers?.find((totalizer: Totalizer) => totalizer.id === "Shipping").value / 100).toFixed(2) : 0;
	return (
		<>
			<div className={style.summaryBackToCart}>
				<span
					className={`${style.BackToCartLabel} link c-action-primary t-small pointer underline-hover`}
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
										) : (showInStockAndLeadtime ?
										<div className={`${style.leadtime} c-action-primary`}>
												{setProperLabel(item?.productId, item?.leadtime)}
											</div> : null)
										}
										<div className={`${style.energyAndSheetContainer} flex items-center`}>
											{showEnergyAndSheet && item.EnergyLogoImage && (
												<a target="_blank" href={item.energyLabel} className="flex items-center mr3">
													<img className={style.energyLogoImage} src={item.EnergyLogoImage} alt="" />
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
						<Coupon />
					</div>
          {totalizers?.map(
            (total: Totalizer, i: number) =>
              total.id === "Items" && (
                <div key={i}>
                  <div className="flex flex-row justify-between">
                    <p className={style.totalizerTitle}>
                      {intl.formatMessage(messages.subTotal)}
                    </p>
                    <span className="flex items-center">
                      <FormattedPrice value={Number(total?.value -
                        (productsDeliveryTotal ? productsDeliveryTotal : 0) -
                        (installationValue ? Number(installationValue) * 100 : 0) -
                        (removalValue ? Number(removalValue) * 100 : 0)) / 100} />
                    </span>
                  </div>
                  {hasDiscounts && (
                    <div className="flex flex-row justify-between">
                      <p className={style.totalizerTitle}>
                        {intl.formatMessage(messages.discount)}
                      </p>
                      <span className="flex items-center">
                        <FormattedPrice value={discountsValue} />
                      </span>
                    </div>
                  )}
                  {deliveryValue === "0.00" && hasShipping && (
                    <div className="flex flex-row justify-between">
                      <p className={style.totalizerTitle}>
                        {intl.formatMessage(messages.shipping)}
                      </p>
                      <span className="flex items-center">
                        <FormattedPrice value={Number(shippingValue)} />
                      </span>
                    </div>
                  )}
                  {deliveryValue !== "0.00" && (
                    <div className="flex flex-row justify-between">
                      <p className={style.totalizerTitle}>
                        {intl.formatMessage(messages.shipping)}
                      </p>
                      <span className="flex items-center">
                        <FormattedPrice value={Number(deliveryValue) + Number(shippingValue)} />
                      </span>
                    </div>
                  )}
                  {installationValue !== "0.00" && (
                    <div className="flex flex-row justify-between">
                      <p className={style.totalizerTitle}>
                        {intl.formatMessage(messages.installation)}
                      </p>
                      <span className="flex items-center">
                        <FormattedPrice value={Number(installationValue)} />
                      </span>
                    </div>
                  )}
                  {removalValue !== "0.00" && (
                    <div className="flex flex-row justify-between">
                      <p className={style.totalizerTitle}>
                        {intl.formatMessage(messages.removal)}
                      </p>
                      <span className="flex items-center">
                        <FormattedPrice value={Number(removalValue)} />
                      </span>
                    </div>
                  )}
								</div>
              ))}
				</div>

				<div className="mv3">
					<Divider orientation="horizontal" />
				</div>

				<div>
					<h5
						className={`${style.summaryTotalText} t-heading-5 flex flex-row justify-between b`}
					>
						{intl.formatMessage(messages.total)}{" "}
						{value > 0 ? <FormattedPrice value={value / 100} /> : "Loading"}
					</h5>
				</div>
				<div className={`${style.summaryTextAreaContainer}  t-small`}>
					<span>
						<FormattedMessage
							id="checkout-io.openText"
							defaultMessage="Personalised message (max {variable} characters)"
							values={{ variable: openTextCharactersNumber }}
						/>
					</span>
					<textarea
						className={style.checkoutTextArea}
						name="cart-note"
						id="cart-note"
						rows={3}
						maxLength={+openTextCharactersNumber}
						onBlur={(e) => updateTextAreaField(e.target.value)}
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
  shipping:{
    defaultMessage: "Shipping",
		id: "checkout-io.shipping",
  },
  installation: {
    defaultMessage: "Installation",
    id: "checkout-io.installation-label",
  },
  removal: {
    defaultMessage: "Removal",
    id: "checkout-io.removal-label",
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
