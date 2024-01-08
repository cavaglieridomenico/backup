import React, { useState, useEffect } from "react"
import style from "./styles/style.css"
import { Checkbox, Modal, Spinner } from "vtex.styleguide"
import { useIntl } from "react-intl"
import { formatPrice } from "./utils/utils"
import CartModal from "./CartModal"
import { usePixel } from "vtex.pixel-manager"
import { useCart } from "../../../providers/cart"
import isServedPC from "../../../graphql/isServedPC.graphql"
import { useMutation } from "react-apollo"
import { useOrder } from "../../../providers/orderform"
import { tooltipIcon } from "./utils/vectors"
import { createSvg } from "../../../utils/createSvg"
import { AddServicesSkeleton } from "../../common/skeleton/ContentLoaders"
import { useAppSettings } from "../../../providers/appSettings"

interface AdditionalServicesWrapperProps {
	services: Service[] | undefined
	installationModal: boolean
	itemIndex: any
	item: any
	fixedServiceTypeIds?: Array<string>
}
interface Service {
	id: string
	name: string
	description: string
	price: number
	sellingPrice: number
	position: number
	__typename: string
}

const AdditionalServicesWrapper: StorefrontFunctionComponent<AdditionalServicesWrapperProps> = ({
	services,
	installationModal,
	itemIndex,
	item,
	fixedServiceTypeIds = [],
}) => {
	const intl = useIntl()
	const { push } = usePixel()

	const [offeringState, setOfferingState] = useState<any>()
	const [isInstallationClicked, setIsinstallationClicked] = useState<boolean>(
		false,
	)
	const [dataForModal, setDataForModal] = useState<any>()
	const [showCartModal, setShowCartModal] = useState<boolean>(false)
	const {
		appSettings: { country },
	} = useAppSettings()
	const [offeringsToPrint, setOfferingsToPrint] = useState<
		Service[] | undefined
	>(
		//Sort based on position prop
		services?.sort((a, b) => a.position - b.position),
	)
	const {
		addItemOfferings,
		removeItemOfferings,
		removeOfferingLoading,
	} = useCart()
	const { orderForm } = useOrder()

	const pushAnalyticsEvent = () => {
		push({ event: "extra_info_interaction_tooltip" })
	}

	useEffect(() => {
		// if (!offeringsToPrint)
		setOfferingsToPrint(services?.sort((a, b) => a.position - b.position))
	}, [services])

	const [
		postalCodeServed,
		{ data: postalCodeServedResponse, loading: postalCodeServedLoading },
	]: any = useMutation(isServedPC, {
		onCompleted(data) {
			if (data && data["isServedPC"]) {
				if (!data["isServedPC"]["isServed"]) {
					setOfferingsToPrint(
						offeringsToPrint?.filter(
							service =>
								!service.name
									?.toLowerCase()
									.includes(data.isServedPC?.__typename.toLowerCase()),
						),
					)
				}
			}
		},
	})

	const checkboxClickHandler = (e: any, offering: any) => {
		setOfferingState(offering)
		setIsinstallationClicked(true)

		/* CHECKING IF THE CHECKBOX CLICKED SHOULD POP MODAL 
		"Installation" --> Usata una key per renderlo configurabile
		@marco Gatto fare unica chiamata graphQl con  dati modale
		*/

		if (e?.target?.checked == true) {
			if (
				offering?.name?.includes(
					intl.formatMessage({
						id: "checkout-io.custom-additional-services.offeringsNameForModal",
					}),
				) &&
				installationModal
			) {
				fetch(
					`/_v/wrapper/api/additional-services/contents?productId=${item?.productId}`,
				)
					.then((response: any) => response.json())
					.then((secondData: any) => {
						setDataForModal(secondData)
						if (secondData.length) {
							setShowCartModal(true)
							push({
								event: "popupInteraction",
								data: { eventAction: "cartModalContainer", eventLabel: "view" },
							})
							setIsinstallationClicked(false)
						} else {
							addItemOfferings(
								itemIndex,
								offering?.id?.toString() || offering?.id?.toString(),
							)
							setIsinstallationClicked(false)
						}
					})
			} else {
				addItemOfferings(
					itemIndex,
					offering?.id?.toString() || offering?.id?.toString(),
				)
				setIsinstallationClicked(false)
			}
		} else {
			removeItemOfferings(
				itemIndex,
				offering?.id?.toString() || offering?.id?.toString(),
			)
			setIsinstallationClicked(false)
		}
	}

	const closeModalHandler = () => {
		setShowCartModal(false)
		setIsinstallationClicked(false)
	}

	const modalSaveButtonHandler = () => {
		addItemOfferings(itemIndex, offeringState.id)
		setShowCartModal(false)
		setIsinstallationClicked(false)
	}

	const isOfferingSelected = (offeringId: string) => {
		return item?.bundleItems?.some(
			(bundleItem: any) => bundleItem.id == offeringId,
		)
	}

	const renderServiceName = (name: string) => {
		const arrayFromName = name.split("_")
		return arrayFromName[arrayFromName.length - 1]
	}

	useEffect(() => {
		if (orderForm && services) {
			if (!postalCodeServedResponse && country == "GB") {
				postalCodeServed({
					variables: {
						orderFormId: orderForm?.orderFormId,
					},
				})
			}
		}
	}, [orderForm, services])

	return (
		<>
			{postalCodeServedLoading ? (
				<AddServicesSkeleton />
			) : offeringsToPrint &&
			  offeringsToPrint?.length != 0 &&
			  !postalCodeServedLoading ? (
				<div className={`${style.offeringsContainer} b--action-primary`}>
					{/* Title */}
					<div className={style.offeringsTitleContainer}>
						<span className={style.offeringsTitle}>
							{intl.formatMessage({
								id: "checkout-io.custom-additional-services.offeringsTitle",
							})}
						</span>
					</div>
					{removeOfferingLoading || isInstallationClicked ? (
						<span className="c-action-primary">
							<Spinner color="currentColor" />
						</span>
					) : (
						<>
							{offeringsToPrint?.map((offering, index) => (
								<div key={index} className={`${style.offeringRow} flex`}>
									<div
										className={`${style.offeringLeft} mr3 flex items-center`}
									>
										{/* Checkbox */}
										<div className="mr3">
											<>
												<Checkbox
													id={offering?.name}
													label={renderServiceName(offering?.name)}
													name="default-checkbox-group"
													onChange={(e: any) => {
														fixedServiceTypeIds.includes(offering.id)
															? null
															: checkboxClickHandler(e, offering)
													}}
													value={offering?.name}
													checked={
														fixedServiceTypeIds.includes(offering.id)
															? true
															: isOfferingSelected(offering?.id)
													}
												/>
											</>
										</div>
										{/* Description */}
										{offering?.description && (
											<div className={style.tootltipContainer}>
												<img
													className={style.offeringTootltipLogo}
													src={createSvg(tooltipIcon)}
													alt="tooltip icon"
													onMouseOver={pushAnalyticsEvent}
												/>
												<span className={style.offeringTootltipText}>
													{offering?.description}
												</span>
											</div>
										)}
									</div>
									{/* Price */}
									<div className={style.offeringRight}>
										<span
											className={`${
												offering?.price == 0
													? style.offeringPriceTextFree
													: style.offeringPriceText
											} c-action-primary`}
										>
											{offering.price == 0
												? intl.formatMessage({
														id:
															"checkout-io.custom-additional-services.offeringsFreeLabel",
												  })
												: `+ ${formatPrice(
														offering?.price,
														orderForm?.storePreferencesData?.currencySymbol,
												  )}`}
										</span>
									</div>
								</div>
							))}
						</>
					)}
				</div>
			) : null}

			{installationModal && (
				<Modal
					isOpen={showCartModal}
					onClose={closeModalHandler}
					showCloseIcon={false}
				>
					<CartModal
						onCloseModal={closeModalHandler}
						onSave={modalSaveButtonHandler}
						modalData={dataForModal}
					/>
				</Modal>
			)}
		</>
	)
}

export default AdditionalServicesWrapper
