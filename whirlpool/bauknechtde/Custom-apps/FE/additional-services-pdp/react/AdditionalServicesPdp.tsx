import React, { useEffect, useState } from 'react'
import { useLazyQuery } from 'react-apollo'
import getAdditionalServices from './graphql/getAdditionalServices.graphql'
// import { useRuntime } from 'vtex.render-runtime'
import { useProduct } from 'vtex.product-context'
//import { Collapsible } from 'vtex.styleguide'
import ContentLoader from 'react-content-loader'
import { useIntl } from 'react-intl'
import { useCssHandles } from "vtex.css-handles"
import { FormattedCurrency } from 'vtex.format-currency'
import { usePixel } from 'vtex.pixel-manager'
import { Modal } from 'vtex.styleguide'
import infoIcon from '../react/assets/BK-Info.svg'
// import {
// 	standardDelivery
// } from './utils/AdditionalServicesToPush'
import { addServLogo } from './utils/vectors'

interface serviceProps {
	//Theme Props
	showTitle: boolean
	showWarrantyTitle: boolean
	//CMS Props
	servicesTitle: string
	warrantySectionTitle: string
}

const CSS_HANDLES = [
 "serviziAggiuntiviTable",
 "serviceGroup",
 "serviceTitle",
 "servTitleStyle",
 "infoIcon",
 "mainContainer",
 "servAggRow",
 "servOptions",
 "addServicesTitleContainer",
 "addServicesTitleMarkLogo",
 "addServicesTitle",
 "freeLabel",
 "labelPrice",
 "warrantyServicesTitle"
] as const;

const AdditionalServicesPdp: StorefrontFunctionComponent<serviceProps> = ({
	//Theme Props
	showTitle = true,
	showWarrantyTitle = true,
	children,
	//CMS Props
	servicesTitle = 'First section title',
	warrantySectionTitle = 'Warranty section title',
}) => {
	const intl = useIntl()
	const { push } = usePixel()
	const handles = useCssHandles(CSS_HANDLES)

	/*--- BASIC CONSTS ---*/
	const { product } = useProduct()
	// const { production } = useRuntime()
	const skuId = product?.items?.[0]?.itemId
	/*--- STATE MANAGEMENT ---*/
	const [additionalServices, setAdditionalServices]: any = useState([
		// standardDelivery,
		// expressDelivery,
	])

	/*--- GRAPHQL QUERY ---*/
	const [getSearchData, { data, loading }] = useLazyQuery(
		getAdditionalServices,
		{
			onCompleted: () => {
				if (!skuId) console.error('Product Context goes wrong')
			},
		},
	)

	useEffect(() => {
		if (product?.items) {
			getSearchData({
				variables: {
					s: skuId,
					sc: 1,
				},
			})
		}
	}, [product])

	useEffect(() => {
		if (data) {
			const filteredWarrantyServices = data?.additionalServices.filter(
				(service: any) =>
					service.ServiceTypeId == 4 || service.ServiceTypeId == 5,
			)
			const filteredAdditionalServices = data?.additionalServices.filter(
				(service: any) =>
					service.ServiceTypeId != 4 && service.ServiceTypeId != 5,
					)
setAdditionalServices([
	...filteredAdditionalServices,
	//standardDelivery,
])
					/* setOpenQuestion(
						setInitialState([...additionalServices, ...data?.additionalServices]),
						) */
						setWarrantyServices(filteredWarrantyServices)
					}
	}, [data])

	//const [openQuestion, setOpenQuestion]: any = useState()
	const [warrantyServices, setWarrantyServices]: any = useState()

	const [showModal, setShowModal] = useState<any>({ isOpen: false, index: 0 })

	const isAnAccessory = product?.categories?.some((path) =>
		path.includes('accessoires'),
	)

	const isSellable =
		product?.properties?.filter((e: any) => e.name == `sellable`)[0]
			?.values[0] == 'true'

	/* const setInitialState = (services: any) => {
		let obj: any = {}
		for (let i = 0; i < services.length; i++) {
			obj[services[i].ServiceTypeId] = {
				isOpen: false,
			}
		}
		return obj
	} */

	/* 	const toggleAccordion = (questionNbr) => {
		let newOpen: any = { ...openQuestion }
		let newValue = !newOpen[questionNbr].isOpen
		newOpen[questionNbr].isOpen = newValue
		setOpenQuestion(newOpen)
	} */

	/*--- CONSOLE LOGS ---*/
	// if (!production) {
	// 	console.log(
	// 		'%c ADDITIONAL SERVICES ',
	// 		'background: #a6ff00; color: #000000',
	// 		additionalServices,
	// 	)
	// 	console.log(
	// 		'%c warrantyServices ',
	// 		'background: #006eff; color: #ffffff',
	// 		warrantyServices,
	// 	)
	// 	console.log(
	// 		'%c IS SELLABLE? ',
	// 		'background: #ff00b3; color: #000000',
	// 		isSellable,
	// 	)
	// 	console.log(
	// 		'%c IS AN ACCESSORY? ',
	// 		'background: #00ffb3; color: #000000',
	// 		isAnAccessory,
	// 	)
	// }
	const handlePushPopupEvent = (action: string) => {
		push({ event: 'popup', popupId: 'additional-services-pdp', action: action })
	}

	const showModalHandler = (isOpen: boolean, index: number) => {
		setShowModal({ isOpen: isOpen, index: index })
	}
	const markLogo = Buffer.from(addServLogo).toString('base64')

	const addServiceModalContent = (children as any)?.find(
		(child: any) =>
			child.props.id === 'flex-layout.row#additionalServicesModalRow',
	)
	const warrantyModalContent = (children as any)?.find(
		(child: any) => child.props.id === 'flex-layout.row#warrantyModalRow',
	)
	return (
		<>
			{!isAnAccessory && isSellable ? (
				<>
					{!loading ? (
						<div className={handles.serviziAggiuntiviTable}>
							<div className={handles.serviceGroup}>
								<div className={handles.serviceTitle}>
									{showTitle && (
										<p className={handles.servTitleStyle}>
											{servicesTitle}
											<img
												className={handles.infoIcon}
												src={infoIcon}
												alt=""
												onClick={() => {
													handlePushPopupEvent('view')
													showModalHandler(!showModal.isOpen, 1)
												}}
											/>
										</p>
									)}
								</div>

								<Modal
									isOpen={showModal.isOpen}
									onClose={() => {
										handlePushPopupEvent('close'),
											setShowModal({ ...showModal, isOpen: false })
									}}
								>
									<div
										className={handles.mainContainer}
										onClick={() => handlePushPopupEvent('click')}
									>
										{showModal.index == 1
											? addServiceModalContent
											: warrantyModalContent}
									</div>
								</Modal>

								{additionalServices?.map((service: any, index: number) => (
									<div
										key={index}
										className={handles.servAggRow + ' servizi-aggiuntivi-row'}
									>
										<div className={handles.servOptions}>
											<div className={handles.addServicesTitleContainer}>
												<img
													className={handles.addServicesTitleMarkLogo}
													src={`data:image/svg+xml;base64,${markLogo}`}
													alt="Mark logo"
												/>{' '}
												<span className={handles.addServicesTitle}>
													{service.Name}
												</span>
											</div>
											{service.Price === 0 ? (
												<span className={handles.freeLabel}>
													{intl.formatMessage({
														id: 'store/additional-services-pdp.freeLabel',
													})}
												</span>
											) : (
												<span
													key="servicePriceValue"
													className={handles.labelPrice}
												>
													<FormattedCurrency value={service.Price} />
												</span>
											)}
										</div>

										{/* <div
											className={`${style.serviziAggiuntiviTooltip} ${style.servAggTooltip}`}
										>
											{service.Description}
										</div> */}
									</div>
								))}
							</div>
							<div className={handles.serviceGroup}>
								<div
									className={`${handles.serviceTitle} ${handles.warrantyServicesTitle}`}
								>
									{showWarrantyTitle && warrantyServices?.length > 0 && (
										<p className={handles.servTitleStyle}>
											{warrantySectionTitle}
											<img
												className={handles.infoIcon}
												src={infoIcon}
												alt=""
												onClick={() => {
													showModalHandler(!showModal.isOpen, 2)
												}}
											/>
										</p>
									)}
								</div>
								{warrantyServices &&
									warrantyServices?.map((service: any, index: number) => (
										<div
											key={index}
											className={handles.servAggRow + ' servizi-aggiuntivi-row'}
										>
											<div className={handles.servOptions}>
												<div className={handles.addServicesTitleContainer}>
													<img
														className={handles.addServicesTitleMarkLogo}
														src={`data:image/svg+xml;base64,${markLogo}`}
														alt="Mark logo"
													/>{' '}
													<span className={handles.addServicesTitle}>
														{service.Name}
													</span>
												</div>
												{service.Price === 0 ? (
													// If the service is Sorglos PLUS Geräteschutz, the label must be different
													service.Name === 'Sorglos PLUS Geräteschutz' ? (
														<span className={handles.freeLabel}>
															{intl.formatMessage({
																id: 'store/additional-services-pdp.alternativeWarrantyLabel',
															})}
														</span>
													) : (
														<span className={handles.freeLabel}>
															{intl.formatMessage({
																id: 'store/additional-services-pdp.warrantyLabel',
															})}
														</span>
													)
												) : (
													<span
														key="servicePriceValue"
														className={handles.labelPrice}
													>
														<FormattedCurrency value={service.Price} />
													</span>
												)}
											</div>

											{/* <div
													className={`${style.serviziAggiuntiviTooltip} ${style.servAggTooltip}`}
												>
													{service.Description}
												</div> */}
										</div>
									))}
							</div>
						</div>
					) : (
						<ContentLoader
							width="100%"
							speed={1}
							height="100%"
							viewBox="0 0 380 70"
						></ContentLoader>
					)}
				</>
			) : null}
		</>
	)
}

AdditionalServicesPdp.schema = {
	title: 'AdditionalServicesPdp',
	description: 'editor.services.description',
	type: 'object',
	properties: {
		servicesTitle: {
			title: 'First Section Title',
			description: 'Title of the first section',
			default: 'First section title',
			type: 'string',
		},
		warrantySectionTitle: {
			title: 'Warranty Section Title',
			description: 'Title of the second section',
			default: 'Warranty section title',
			type: 'string',
		},
	},
}

export default AdditionalServicesPdp
