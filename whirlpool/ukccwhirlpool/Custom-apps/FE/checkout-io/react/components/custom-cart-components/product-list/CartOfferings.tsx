import React, { useState } from "react"
import style from "./offerings.css"
import { useItemContext } from "./ItemContext"
import { useIntl, defineMessages } from "react-intl"
import { useRuntime } from "vtex.render-runtime"
import { tootltipIcon } from "../../../../assets/tootltipIcon"
import { useCartOrder } from "../../../providers/cartOrderform"
import { useCart } from "../../../providers/cart"
import CartModal from "../cart-modal/CartModal"
import { Modal, Spinner, Checkbox } from "vtex.styleguide"
import { formatPrice } from "../../../utils/utils"

// import { Icon } from "vtex.store-icons"

interface CartOfferingsProps {
	IncludedOfferings: ItemProps[]
	installationModal: boolean
}
interface ItemProps {
	OfferingName: string
	TootltipText: string
}

const messages = defineMessages({
	offeringsTitle: {
		defaultMessage: "Seleziona i servizi aggiuntivi inclusi nel prezzo",
		id: "checkout-io.cart.offeringsTitle",
	},
	offeringsFreeLabel: {
		defaultMessage: "Gratuito",
		id: "checkout-io.cart.offeringsFreeLabel",
	},
	offeringsNameForModal: {
		defaultMessage: "Installation",
		id: "checkout-io.cart.offeringsNameForModal",
	},
})
const CartOfferings: StorefrontFunctionComponent<CartOfferingsProps> = ({
	IncludedOfferings = [
		// {
		// 	OfferingName: "Consegna al piano",
		// 	TootltipText: "Consegna al piano gratuita e su appuntamento.",
		// },
	],
	installationModal,
}) => {
	const createSvg = (svgString: string) => {
		const svgBase64 = Buffer.from(svgString).toString("base64")
		return `data:image/svg+xml;base64,${svgBase64}`
	}
	const { production } = useRuntime()
	const intl = useIntl()
	const { offerings, itemIndex, item } = useItemContext()
	const { cartOrderForm } = useCartOrder()
	const {
		addItemOfferings,
		removeItemOfferings,
		offeringLoading,
		removeOfferingLoading,
	} = useCart()
	const [showCartModal, setShowCartModal] = useState<boolean>(false)
	const [offeringState, setOfferingState] = useState<any>()
	const [isInstallationClicked, setIsinstallationClicked] =
		useState<boolean>(false)
	const [dataForModal, setDataForModal] = useState<any>()

	if (!production) {
		console.log(IncludedOfferings, "IncludedOfferings by CMS")
	}

	const isOfferingSelected = (offeringId: string) =>
		item.bundleItems.some((bundleItem: any) => bundleItem.id == offeringId)

	const checkboxClickHandler = (e: any, offering: any) => {
		setOfferingState(offering)
		setIsinstallationClicked(true)

		/* CHECKING IF THE CHECKBOX CLICKED SHOULD POP MODAL 
		"Installation" --> Usata una key per renderlo configurabile
		@marco Gatto fare unica chiamata graphQl con  dati modale
		*/

		if (e.target.checked == true) {
			if (
				offering.name === intl.formatMessage(messages.offeringsNameForModal) &&
				installationModal
			) {
				fetch(
					`/_v/wrapper/api/additional-services/contents?productId=${item?.productId}`,
				)
					.then((response) => response.json())
					.then((secondData) => {
						setDataForModal(secondData)
						if (secondData.length) {
							setShowCartModal(true)
							setIsinstallationClicked(false)
						} else {
							addItemOfferings(itemIndex, offering.id)
							setIsinstallationClicked(false)
						}
					})
			} else {
				addItemOfferings(itemIndex, offering.id)
				setIsinstallationClicked(false)
			}
		} else {
			removeItemOfferings(itemIndex, offering.id)
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

	return (
		<>
			{IncludedOfferings?.length > 0 || offerings?.length != 0 ? (
				<div className={`${style.offeringsContainer} b--action-primary`}>
					<div className={style.offeringsTitleContainer}>
						<span className={style.offeringsTitle}>
							{intl.formatMessage(messages.offeringsTitle)}
						</span>
					</div>
					{/* {IncludedOfferings &&
            IncludedOfferings.map((includedOffering: any, index: number) => (
              <div key={index} className={style.offeringRow}>
                <div className={style.offeringLeft}>
                  <img
                    className={style.tickLogo}
                    src={createSvg(tickIcon)}
                    alt="tick icon"
                  />
                  <span className={style.offeringNameText}>
                    {includedOffering.OfferingName}
                  </span>
                  <div className={style.tootltipContainer}>
                    <img
                      className={style.offeringTootltipLogo}
                      src={createSvg(tootltipIcon)}
                      alt="tooltip icon"
                    />
                    <span className={style.offeringTootltipText}>
                      {includedOffering.TootltipText}
                    </span>
                  </div>
                </div>
                <div className={style.offeringRight}>
                  <span className={style.offeringPriceTextFree}>
                    {intl.formatMessage(messages.offeringsFreeLabel)}
                  </span>
                </div>
              </div>
            ))} */}
					{offeringLoading || removeOfferingLoading || isInstallationClicked ? (
						<span className="c-action-primary">
							<Spinner color="currentColor" />
						</span>
					) : (
						offerings?.map((offering: any, index: number) => (
							<div key={index} className={`${style.offeringRow} flex`}>
								<div className={`${style.offeringLeft} mr3 flex items-center`}>
									<div className="mr3">
										<Checkbox
											checked={isOfferingSelected(offering.id)}
											id={offering.name}
											label={offering.name}
											name="default-checkbox-group"
											onChange={(e: any) => checkboxClickHandler(e, offering)}
											value={offering.name}
										/>
									</div>
									<div className={style.tootltipContainer}>
										<img
											className={style.offeringTootltipLogo}
											src={createSvg(tootltipIcon)}
											alt="tooltip icon"
										/>
										<span className={style.offeringTootltipText}>
											{offering.name}
										</span>
									</div>
								</div>
								<div className={style.offeringRight}>
									<span
										className={`${
											offering.price == 0
												? style.offeringPriceTextFree
												: style.offeringPriceText
										} c-action-primary`}
									>
										{offering.price == 0
											? intl.formatMessage(messages.offeringsFreeLabel)
											: `+${formatPrice(
													offering.price,
													cartOrderForm?.storePreferencesData?.currencySymbol,
											  )}`}
									</span>
								</div>
							</div>
						))
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

export default CartOfferings

CartOfferings.schema = {
	title: "Always included offering",
	description: "Here you can add always included and selected offerings",
	type: "object",
	properties: {
		IncludedOfferings: {
			title: "Always included offerings",
			type: "array",
			items: {
				properties: {
					OfferingName: {
						title: "Offering Name",
						type: "string",
					},
					TootltipText: {
						title: "Tootltip Text",
						type: "string",
					},
				},
			},
		},
		installationModal: {
			title: "Installation Modal Toggler",
			description: "If dont want the modal set to false",
			default: true,
			type: "boolean",
		},
	},
}
