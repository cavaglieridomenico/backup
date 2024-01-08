import * as React from "react"
import { defineMessages, useIntl } from "react-intl"
import { useHistory } from "react-router"
// import TranslateEstimate from "vtex.shipping-estimate-translator/TranslateEstimate"
import { ButtonPlain, IconEdit, IconInfo, Tooltip } from "vtex.styleguide"
import { useCheckout } from "../../../../../../providers/checkout"
import { useOrder } from "../../../../../../providers/orderform"
import routes, { getCurrentStep } from "../../../../../../utils/routes"
import CheckoutAlert from "../../../../../common/CheckoutAlert"
import ScheduledDeliverySummary from "../../scheduled/ScheduledDeliverySummary"

const messages = defineMessages({
	delivery: {
		defaultMessage: "Delivery",
		id: "checkout-io.delivery",
	},
	edit: {
		defaultMessage: "Edit",
		id: "checkout-io.edit",
	},
	noDeliveryWindowSelected: {
		defaultMessage: "NO DELIVERY WINDOW SELECTED",
		id: "checkout-io.no-delivery-window-selected",
	},
	shippingUnavailable: {
		defaultMessage: "No shipping method available",
		id: "checkout-io.shipping-unavailable",
	},
	shippingUnavailableBasket: {
		defaultMessage: "Your items can't be delivered to your Postal Code",
		id: "checkout-io.shipping-unavailable-basket",
	},
	addressEmptyCTA: {
		defaultMessage: "No address selected",
		id: "checkout-io.address-empty-CTA",
	},
	shippingOptions: {
		defaultMessage: "Modify the shipping options",
		id: "checkout-io.address-shipping-options",
	},
  summaryFetchError: {
    defaultMessage: "You will be contacted to arrange a shipping and/or installation date",
		id: "checkout-io.summary-fetch-error",
  }
})

const DeliverySummary: React.FC = () => {
	const intl = useIntl()
	const {
		orderForm: { shippingData, items, clientProfileData },
		orderLoading,
	} = useOrder()

	const { isScheduledDeliveryError, exhaustedDeliveries } = useCheckout()

	const hasSelectedAddress = shippingData.selectedAddresses.length > 0

	const history = useHistory()

	const handleEditShipping = () => {
		history.push(routes.SHIPPING.route)
	}

	let currentStep = getCurrentStep(window)

	const getDeliveryCTA = () => {
		if (!hasSelectedAddress) {
			return (
				<div className="dib ml4">
					<Tooltip label={intl.formatMessage(messages.addressEmptyCTA)}>
						<span>
							<IconInfo />
						</span>
					</Tooltip>
				</div>
			)
		}

		if (!exhaustedDeliveries) {
			return (
				<div className="dib ml4">
					{clientProfileData?.email &&
						routes.SHIPPING.order < currentStep.order && (
							<ButtonPlain onClick={handleEditShipping}>
								<IconEdit solid />
								{intl.formatMessage(messages.shippingOptions)}
							</ButtonPlain>
						)}
				</div>
			)
		}

		return null
	}

	return (
		<div>
			<span className="t-heading-5 w-100  fw6 flex justify-between">
				{intl.formatMessage(messages.delivery)}
				{getDeliveryCTA()}
			</span>
			{hasSelectedAddress && !orderLoading ? (
				<div className="flex flex-column">
					{!exhaustedDeliveries ? (
						<>
							{items.map((item: Item, index: number) => {
								const { selectedSla, slas } = shippingData.logisticsInfo[index]
								const slaInfo = slas.filter(
									(sla: SLA) => sla.id === selectedSla,
								)

								const isScheduled =
									slaInfo.length > 0 &&
									slaInfo[0].availableDeliveryWindows.length > 0

								const selectedDeliveryWindow =
									isScheduled && slaInfo[0].deliveryWindow

								return (
									<div key={index} className="flex flex-column mt4">
										<span className="db mt2 mb3 w-100 c-on-base t-small">
											{item.name}
										</span>
										<span>
											{slas.length > 0 ? (
												<>
													{isScheduled ? (
														selectedDeliveryWindow ? (
                              !isScheduledDeliveryError ? (
                                <ScheduledDeliverySummary scheduledDeliveryWindow={slaInfo[0].deliveryWindow} />
                              ) : (
                                <span>
                                  {intl.formatMessage(
                                    messages.summaryFetchError,
                                  )}
                                </span>
                              )
														) : (
															null
														)
													) : (
														selectedSla
													)}
												</>
											) : (
												<div className="mt2">
													<CheckoutAlert
														type="warning"
														message={intl.formatMessage(
															messages.shippingUnavailable,
														)}
													/>
												</div>
											)}
										</span>
									</div>
								)
							})}
						</>
					) : (
						<div className="mt5">
							<CheckoutAlert
								type="warning"
								message={intl.formatMessage(messages.shippingUnavailableBasket)}
							/>
						</div>
					)}
				</div>
			) : (
				""
			)}
		</div>
	)
}

export default DeliverySummary
