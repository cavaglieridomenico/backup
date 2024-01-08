import React, { useEffect, useState } from 'react'
import { useLazyQuery } from 'react-apollo'
import ContentLoader from 'react-content-loader'
import { useIntl } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import { useProduct } from 'vtex.product-context'
import getAdditionalServices from './graphql/getAdditionalServices.graphql'
import style from './style.css'
//import { addServLogo } from './utils/vectors'
import { Collapsible, Modal } from 'vtex.styleguide'
import whrClub from '../react/assets/whr-club.svg'

interface serviceProps {
	//Theme Props
	showTitle: boolean
	showWarrantyTitle: boolean
	servicesToPush: []
	//CMS Props
	servicesTitle: string
	warrantySectionTitle: string
	children: any
	premiumProps: any
}

const AdditionalServicesPdp: StorefrontFunctionComponent<serviceProps> = ({
	showTitle = true,
	showWarrantyTitle = false,
	children,
	servicesToPush,
	servicesTitle = 'First section title',
	warrantySectionTitle = 'Warranty section title',
	premiumProps= {
		checkOnPremium: false,
		premiumPropField: "PRODOTTI PREMIUM",
		premiumPropValue: "Whirlpool Club"
	}
}) => {

	const intl = useIntl()

	/*--- BASIC CONSTS ---*/
	const { product } = useProduct()

	// const { production } = useRuntime()
	const skuId = product?.items?.[0]?.itemId

	//labels for control
	const accessoryLabel = intl.formatMessage({	id: 'store/additional-services-pdp.accessories'})
	//const carefree = intl.formatMessage({	id: 'store/additional-services-pdp.carefree'})
	/*--- STATE MANAGEMENT ---*/
	const [additionalServices, setAdditionalServices]: any = useState()
	const [warrantyServices, setWarrantyServices]: any = useState()
	const [initAccordionRow, setInitAccordionRow]: any = useState()
	const [openQuestion, setOpenQuestion] = useState({})

	const [showModal, setShowModal] = useState<any>({ isOpen: false, index: 0 })



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
			let allServices = [
				...(servicesToPush ? servicesToPush : []),
				...(data?.additionalServices ? data?.additionalServices : []),
			]
			const filteredWarrantyServices = []/*allServices.filter(
				(service: any) =>
					service.ServiceTypeId == 4 || service.ServiceTypeId == 5,
			)*/
			const filteredAdditionalServices = allServices.sort((a,b) => a.Position - b.Position)/*.filter(
				(service: any) =>
					service.ServiceTypeId != 4 && service.ServiceTypeId != 5,
			)*/
			setAdditionalServices([
				...(filteredAdditionalServices ? filteredAdditionalServices : [])
			])
			setWarrantyServices([
				...(filteredWarrantyServices ? filteredWarrantyServices : [])
			])
		}
	}, [data])

	const isAnAccessory =
		product?.categories?.some((path: any) =>
			path.includes(accessoryLabel))

	const isSellable =
		product?.properties?.filter((e: any) => e.name == `sellable`)[0]
			?.values[0] == 'true'

	const showModalHandler = (isOpen: boolean, index: number) => {
		setShowModal({ isOpen: isOpen, index: index })
	}
	//const markLogo = Buffer.from(addServLogo).toString('base64')

	const addServiceModalContent = (children as any)?.find(
		(child: any) =>
			child.props.id === 'flex-layout.row#additionalServicesModalRow',
	)
	const warrantyModalContent = (children as any)?.find(
		(child: any) => child.props.id === 'flex-layout.row#warrantyModalRow',
	)

	const toggleAccordion = (questionNbr:any) => {


		let newOpen: any = { ...openQuestion }
		let newValue = !newOpen[questionNbr].isOpen
		newOpen[questionNbr].isOpen = newValue
		setOpenQuestion(newOpen)
	}

	const setInitialState = (services: any) => {
		let array: any = {}
		for (let i = 0; i < services?.length; i++) {
			array[services[i]?.ServiceTypeId] = {
				isOpen: false,
			}
		}
		return array
	}
useEffect(()=>{
	setInitAccordionRow(true)
	//lo fa una volta
	if(initAccordionRow)
	{setOpenQuestion(setInitialState(additionalServices))
	setInitAccordionRow(false)}
},[additionalServices])

// check if product is premium
const isPremium =
product.properties.filter((e: any) => e.name == premiumProps.premiumPropField).length >
0
	? product.properties.filter((e: any) => e.name == premiumProps.premiumPropField)[0]
			.values[0] == premiumProps.premiumPropValue
	: false

return (
		<>
			{!isAnAccessory && isSellable ? (
				<>
					{!loading ? (
						<div className={style.serviziAggiuntiviTable}>
							<div className={style.serviceTitle}>
								{showTitle && (
									<p className={style.servTitleStyle}>
										{servicesTitle}
										{/* se isWhirlpoolImage messo a true da TEMA visualizzi l'immagine wrlclub */}
										{isPremium &&
										<img
											className={style.whrClub}
											src={whrClub}
											alt=""
											onClick={() => {
												showModalHandler(!showModal.isOpen, 1)
											}}
										/>}
									</p>
								)}
							</div>

							<Modal
								isOpen={showModal.isOpen}
								onClose={() => {
									setShowModal({ ...showModal, isOpen: false })
								}}
							>
								<div className={style.mainContainer}>
									{showModal.index == 1
										? addServiceModalContent
										: warrantyModalContent}
								</div>
							</Modal>

							{additionalServices?.map((service: any, index: number) => (
								<div
									key={index}
									className={style.servAggRow + ' servizi-aggiuntivi-row'}
								>
									<Collapsible

										key={index}

										header={
											<div className={style.servOptions}>
											<div className={style.addServicesTitle}> {service.Name} </div>
												{service?.Price === 0 ? (
													<React.Fragment>
													{service?.ListPrice > 0 &&
													(
														<div className={style.theoreticalValue}>
															<FormattedCurrency value={service?.ListPrice} />
														</div>
													)}
														<span className={style.freeLabel}>
															{intl.formatMessage({id: 'store/additional-services-pdp.freeLabel',})}
														</span>
													</React.Fragment>
												) : (
													<span key="servicePriceValue" className={style.labelPrice} >

														{
															service?.ListPrice != service?.Price
															&&
															service?.Price < service?.ListPrice
															&&
															service?.ListPrice > 0
															&& (
																service?.ListPrice > 0 && <div className={style.theoreticalValue}>
																	<FormattedCurrency
																		value={service?.ListPrice}
																	/>
																</div>
															)
														}
														{service?.Price > 0 && <div className={style.servicePriceContainer}>
															<FormattedCurrency value={service?.Price} />
														</div>}
													</span>
												)}
											</div>
										}
										onClick={() => {
											toggleAccordion(service.ServiceTypeId)
										}}
										isOpen={
											openQuestion && openQuestion[service.ServiceTypeId]?.isOpen
										}
										align="right"
										>
										<div className={style.serviziAggiuntiviTooltip}>
											 {service.Description}
										</div>
									</Collapsible>
								</div>
							))}
							<div
								className={`${style.serviceTitle} ${style.warrantyServicesTitle}`}
							>
								{showWarrantyTitle && warrantyServices?.length > 0 && (
									<p className={style.servTitleStyle}>
										{warrantySectionTitle}
										<img
											className={style.whrClubWarranty}
											src={whrClub}
											alt=""
											onClick={() => {
												showModalHandler(!showModal.isOpen, 1)
											}}
										/>
									</p>
								)}
							</div>
							{warrantyServices &&
								warrantyServices?.map((service: any, index: number) => (
									<div
										key={index}
										className={style.servAggRow + ' servizi-aggiuntivi-row'}
									>
										<Collapsible

											key={index}

											header={
													<div className={style.servOptions}>
															<div className={style.addServicesTitleContainer}>
																	<div className={style.addServicesTitle}> {service.Name} </div>
															</div>
															{service?.Price === 0 ? (
																	<React.Fragment>
																	{service?.ListPrice > 0 &&
																	(
																			<div className={style.theoreticalValue}>
																					<FormattedCurrency value={service?.ListPrice} />
																			</div>
																	)}
																			<span className={style.freeLabel}>
																					{intl.formatMessage({id: 'store/additional-services-pdp.freeLabel',})}
																			</span>
																	</React.Fragment>
															) : (
																	<span key="servicePriceValue" className={style.labelPrice} >

																			{
																					service?.ListPrice != service?.Price
																					&&
																					service?.Price < service?.ListPrice
																					&&
																					service?.ListPrice > 0
																					&& (
																							service?.ListPrice > 0 && <div className={style.theoreticalValue}>
																									<FormattedCurrency
																											value={service?.ListPrice}
																									/>
																							</div>
																					)
																			}
																			{service?.Price > 0 && <div className={style.servicePriceContainer}>
																					<FormattedCurrency value={service?.Price} />
																			</div>}
																	</span>
															)}
													</div>
											}
											onClick={() => {
													toggleAccordion(service.ServiceTypeId)
											}}
											isOpen={
													openQuestion && openQuestion[service.ServiceTypeId]?.isOpen
											}
											align="right"
											>
											<div className={style.serviziAggiuntiviTooltip}>
													{service.Description}
											</div>
											</Collapsible>
									</div>
								))}
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
