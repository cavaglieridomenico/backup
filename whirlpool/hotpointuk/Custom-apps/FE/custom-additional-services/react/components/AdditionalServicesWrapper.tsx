import useCart from "hotpointuk.checkout-container-custom/CartContext"
import React, { Fragment, useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { defineMessages, useIntl } from "react-intl"
import { usePixel } from 'vtex.pixel-manager'
import { Checkbox, Modal, Spinner } from "vtex.styleguide"
import { tooltipIcon } from "../../assets/tooltip"
import isServedPC from "../graphql/isServedPC.graphql"
import style from "../styles/style.css"
import { formatPrice } from "../utils/utils"
import CartModal from "./CartModal"

interface AdditionalServicesWrapperProps {
	services: Service[] | undefined,
	installationModal: boolean
	itemIndex: any
	item: any
}

interface Service {
	id: string
	name: string
	price: number
	__typename: string

}

const messages = defineMessages({
	offeringsTitle: {
		defaultMessage: 'Seleziona i servizi aggiuntivi inclusi nel prezzo',
		id: 'store/custom-additional-services.offeringsTitle',
	},
	offeringsFreeLabel: {
		defaultMessage: 'Gratuito',
		id: 'store/custom-additional-services.offeringsFreeLabel',
	},
	offeringsNameForModal: {
		defaultMessage: 'Installation',
		id: 'store/custom-additional-services.offeringsNameForModal',
	},
})

const AdditionalServicesWrapper: StorefrontFunctionComponent<AdditionalServicesWrapperProps> = ({ services, installationModal = true, itemIndex, item }) => {

	const intl = useIntl()
	const [offeringState, setOfferingState] = useState<any>()
	const [isInstallationClicked, setIsinstallationClicked] = useState<boolean>(false)
	const [dataForModal, setDataForModal] = useState<any>()
	const [showCartModal, setShowCartModal] = useState<boolean>(false)
	const { addItemOfferings, removeItemOfferings, removeOfferingLoading, ORDER_FROM_ID } = useCart()
	const [showInstallation, setShowInstallation] = useState(true)
	const [showServices, setShowServices] = useState(false);
	const { push } = usePixel()
	const createSvg = (svgString: string) => {
		const svgBase64 = Buffer.from(svgString).toString("base64")
		return `data:image/svg+xml;base64,${svgBase64}`
	}
	const [postalCodeServed]: any = useMutation(isServedPC, {
		onCompleted(data) {
			if (data && data["isServedPC"]) {
				if (!data["isServedPC"]["isServed"]) {
					setShowInstallation(false)
				}
			}
			setShowServices(true);
		}
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
					intl.formatMessage(messages.offeringsNameForModal),
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

	const isOfferingSelected = (offeringId: string) =>
		item?.bundleItems?.some((bundleItem: any) => bundleItem.id == offeringId)

	const renderServiceName = (name: string) => {
		let arrayFromName = name.split("_")
		return arrayFromName[arrayFromName.length - 1]
	}

	useEffect(() => {
		postalCodeServed({
			variables: {
				orderFormId: ORDER_FROM_ID
			}
		})
	}, [])

  useEffect(() => {
    // When we're sure that 'services' props is populated, we preselect the delivery additional service if present
    const deliveryOffering = services && services?.length > 0 && services?.find((service: Service) => service.name === "Delivery")
    if (deliveryOffering) {
      addItemOfferings(itemIndex, deliveryOffering.id)
    }
  }, [services, item])

	const checkIfOnlyInstallation = () => {
		if(services?.length === 1 && services.filter(service => service.name === "Installation").length === 1 && !showInstallation){
			return true;
		}
		return false
	}
  // function to sort services and make Delivery appear first
  const sortingFunction = (a: Service) => {
    if (a.name === "Delivery") return -1
    return 0
  }
  const deliveryService = services?.find(offering => offering.name === "Delivery");
	return (
		<>
			{(services && services?.length != 0 && !checkIfOnlyInstallation()) ? (
				<div className={`${style.offeringsContainer} b--action-primary`}>

          {deliveryService && isOfferingSelected(deliveryService.id) && (
            <div className={`${style.offeringRow} flex`}>
              <div className={`${style.offeringLeft} mr3 flex items-center`}>
                <div className={`mr3 ${style.disabledCheckbox}`}>
                  <Checkbox
                    checked={isOfferingSelected(deliveryService.id)}
                    id={deliveryService.name}
                    label={renderServiceName(deliveryService.name)}
                    name={deliveryService.name}
                    onChange={(e: any) => checkboxClickHandler(e, deliveryService)}
                    value={deliveryService.name}
                  />
                </div>
                <div
                  className={style.tootltipContainer}
                  onMouseEnter={() =>
                    push({ event: 'extra_info_interaction_tooltip' })
                  }
                >
                  <img
                    className={style.offeringTootltipLogo}
                    src={createSvg(tooltipIcon)}
                    alt="tooltip icon"
                  />
                  <span className={style.offeringTootltipText}>
                    {renderServiceName(deliveryService.name)}
                  </span>
                </div>
              </div>
              <div className={style.offeringRight}>
                <span
                  className={`${deliveryService.price == 0
                    ? style.offeringPriceTextFree
                    : style.offeringPriceText
                    } c-action-primary`}
                >
                  {deliveryService.price == 0
                    ? intl.formatMessage(messages.offeringsFreeLabel)
                    : formatPrice(deliveryService.price)}
                </span>
              </div>
            </div>
          )}
          {services.length !== 1 || (services.length === 1 && !isOfferingSelected(services[0].id)) ? (
            <div className={style.offeringsTitleContainer}>
              <span className={style.offeringsTitle}>
                {intl.formatMessage(messages.offeringsTitle)}
              </span>
            </div>
          ): null}
					{removeOfferingLoading || isInstallationClicked ? (
						<span className="c-action-primary">
							<Spinner color="currentColor" />
						</span>
					) : (
						<>{showServices && (
							services?.sort(sortingFunction).map((offering: any, index: number) => (


								<Fragment key={index}>

									{(offering.name !== "Installation" || showInstallation) && (offering.name !== "Delivery" || !isOfferingSelected(offering.id)) && (
										<div className={`${style.offeringRow} flex`}>
											<div className={`${style.offeringLeft} mr3 flex items-center`}>
												<div className={`mr3 ${offering.name === "Delivery" ? style.disabledCheckbox : ""}`}>
													<Checkbox
														checked={isOfferingSelected(offering.id)}
														id={offering.name + "_" + itemIndex}
														label={renderServiceName(offering.name)}
														name={offering.name + "_" + itemIndex}
														onChange={(e: any) => checkboxClickHandler(e, offering)}
														value={offering.name}
													/>
												</div>
												<div
													className={style.tooltipContainer}
													onMouseEnter={() =>
														push({ event: 'extra_info_interaction_tooltip' })
													}
												>
													<img
														className={style.offeringTootltipLogo}
														src={createSvg(tooltipIcon)}
														alt="tooltip icon"
													/>
													<span className={style.offeringTootltipText}>
														{renderServiceName(offering.description)}
													</span>
												</div>
											</div>
											<div className={style.offeringRight}>
												<span
													className={`${offering.price == 0
														? style.offeringPriceTextFree
														: style.offeringPriceText
														} c-action-primary`}
												>
													{offering.price == 0
														? intl.formatMessage(messages.offeringsFreeLabel)
														: formatPrice(offering.price)}
												</span>
											</div>
										</div>
									)}

								</Fragment>

							))
						)}</>
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
