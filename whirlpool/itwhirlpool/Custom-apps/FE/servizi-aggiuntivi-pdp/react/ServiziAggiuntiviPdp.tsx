import React, { useContext, useEffect, useState } from 'react'
import { ProductContext, useProduct } from 'vtex.product-context'
import { canUseDOM } from 'vtex.render-runtime'
import style from './style.css'
import whirlpoolClub from '../assets/whirlpoolClub.svg'
import { Collapsible } from 'vtex.styleguide'
import { FormattedCurrency } from 'vtex.format-currency'
import Skeleton from 'react-loading-skeleton'

interface SelectedItem {
	sellers: Array<{
		commertialOffer: {
			AvailableQuantity: number
		}
	}>
}
interface serviceProps {
	serviceTitle: string
	serviceLabel1: string
	serviceLabel2: string
	serviceLabel3: string
	serviceLabel4: string
	serviceLabel5: string
	discountTitle: string
	freeLabel: string
}

const servAggTooltip = {
	paddingTop: '0.875rem',
}
const servTitleStyle = {
	fontWeight: 700,
	fontFamily: 'myriadLight',
	lineHeight: 1.5,
}

const ServiziAggiuntiviPdp: StorefrontFunctionComponent<serviceProps> = ({
	serviceTitle = 'Titolo di prova',
	serviceLabel1,
	serviceLabel2,
	serviceLabel3,
	serviceLabel4,
	serviceLabel5,
	discountTitle,
	freeLabel = 'GRATUITO',
}) => {
	const [tableRows, settableRows] = useState([])
	const [showTitle, setShowTitle] = useState(false)
	const [showAccordion, setShowAccordion] = useState(false)
	const [openQuestion, setOpenQuestion] = useState({})
	const { product } = useProduct()
	const serviceLabelList: string[] = []
	serviceLabelList.push(
		serviceLabel1,
		serviceLabel2,
		serviceLabel3,
		serviceLabel4,
		serviceLabel5,
	)

	const valuesFromContext = useContext(ProductContext)
	// @ts-ignore
	const { selectedItem }: { selectedItem: SelectedItem } = valuesFromContext
	// @ts-ignore
	const { itemId: skuId } = selectedItem
	const categoryId = (valuesFromContext as any).product.categoryId

	const consegnaPiano = {
		Id: 0,
		ServiceTypeId: 0,
		Name: 'Consegna al piano',
		IsFile: false,
		IsGiftCard: false,
		IsRequired: false,
		Options: [
			{
				Id: 608,
				Name: 'Consegna al piano',
				Description: 'Consegna al piano',
				PriceName: 'INCLUSO',
				ListPrice: 0,
				Price: 0,
			},
		],
		Attachments: [],
	}
	// @ts-ignore
	const isItAnAccessory = product.categories.some((path) =>
		path.includes('accessori'),
	)
	if (isItAnAccessory) {
		return null
	}

	const isSellable =
		product.properties.filter((e: any) => e.name == 'sellable')[0].values[0] ==
		'true'
	if (!isSellable) {
		return null
	}

	const setInitialState = (services: any) => {
		let array: any = {}
		for (let i = 0; i < services.length; i++) {
			array[services[i].ServiceTypeId] = {
				isOpen: false,
			}
		}
		return array
	}

	const isPremium =
		product.properties.filter((e: any) => e.name == 'PRODOTTI PREMIUM').length >
		0
			? product.properties.filter((e: any) => e.name == 'PRODOTTI PREMIUM')[0]
					.values[0] == 'Whirlpool Club'
			: false

	const toggleAccordion = (questionNbr) => {
		let newOpen: any = { ...openQuestion }
		let newValue = !newOpen[questionNbr].isOpen
		newOpen[questionNbr].isOpen = newValue
		setOpenQuestion(newOpen)
	}

	const isEqual = (price: number, listprice: number) => {
		return price == listprice
	}

	const isLess = (price: number, listprice: number) => {
		console.log(price, listprice, price < listprice)
		return price < listprice
	}

	const isDifferentFromZero = (price: number) => {
		return price !== 0
	}

	useEffect(() => {
		async function getData() {
			let json = await fetch(
				`/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${skuId}`,
				{
					method: 'GET',
				},
			).then((res) => res.json())
			let services = await fetch(
				'/_v/wrapper/api/additionalservice/info?categoryId=' + categoryId,
				{
					method: 'GET',
				},
			).then((res) => res.json())
			let serviceJson: any = [...json.Services]
			// if (json.Services.length > 0) {
			serviceJson.unshift(consegnaPiano)
			serviceJson = serviceJson.filter((el: any) => el.Name !== 'Installation')
			// console.log(updateServiceJson,'updateServiceJson')
			serviceJson.forEach((service: any) => {
				let listPrice =
					services.filter((el: any) => el.serviceName == service.Name)?.[0]
						?.price || 0
				service.Options[0].ListPrice = listPrice
				service.ListPrice = listPrice
			})
			setOpenQuestion(setInitialState(serviceJson))
			settableRows(serviceJson)
			setShowTitle(true)
			if (canUseDOM) {
				setShowAccordion(true)
			}
		}
		getData()
		return () => {}
	}, [])

	return (
		<>
			{showAccordion ? (
				<div className={style.serviziAggiuntiviTable}>
					<div className={style.serviceTitle}>
						{showTitle ? (
							<p className={style.serviceTitleParagraph} style={servTitleStyle}>
								{serviceTitle}
							</p>
						) : null}
						{isPremium ? (
							<img
								src={whirlpoolClub}
								className={style.whirlClub}
								alt="Whirlpool Club"
							/>
						) : null}
					</div>
					{tableRows.map((service: any, key: number) => (
						<div
							key={key}
							className={style.servAggRow + ' servizi-aggiuntivi-row'}
						>
							<div className={style.serviziAggRow}>
								<Collapsible
									key={key}
									header={
										<div className={style.servOptions}>
											<div className={style.serviceName}>
												{service.Options[0].Name}
											</div>
											{service.Options[0].Price === 0 ? (
												<React.Fragment>
													{isDifferentFromZero(
														service.Options[0].ListPrice,
													) && (
														<div className={style.theoreticalValue}>
															<FormattedCurrency
																value={service.Options[0].ListPrice}
															/>
														</div>
													)}
													<span className={style.freeLabel}>{freeLabel}</span>
												</React.Fragment>
											) : (
												<span
													key="servicePriceValue"
													className={style.labelPrice}
												>
													{!isEqual(
														service.Options[0].ListPrice,
														service.Options[0].Price,
													) &&
														isLess(
															service.Options[0].Price,
															service.Options[0].ListPrice,
														) &&
														isDifferentFromZero(
															service.Options[0].ListPrice,
														) && (
															<div className={style.theoreticalValue}>
																<FormattedCurrency
																	value={service.Options[0].ListPrice}
																/>
															</div>
														)}
													<div className={style.servicePriceContainer}>
														<FormattedCurrency
															value={service.Options[0].Price}
														/>
													</div>
												</span>
											)}
										</div>
									}
									align="right"
									onClick={() => {
										toggleAccordion(service.ServiceTypeId)
									}}
									isOpen={
										openQuestion && openQuestion[service.ServiceTypeId].isOpen
									}
									caretColor="#505050"
								>
									<div
										style={servAggTooltip}
										className={style.serviziAggiuntiviTooltip}
									>
										{serviceLabelList[service.ServiceTypeId]}
									</div>
								</Collapsible>
							</div>
						</div>
					))}
					{isPremium ? (
						<div className={style.servAggRow + ' servizi-aggiuntivi-row'}>
							<div className={style.servOptionsDiscount}>
								{discountTitle}
								{/* <span className={style.freeLabel}>{freeLabel}</span> */}
							</div>
						</div>
					) : null}
				</div>
			) : (
				<Skeleton
					count={1}
					containerClassName={style.skeletonWrapper}
					className={style.skeleton}
					style={{ height: '317px' }}
				/>
			)}
		</>
	)
}

ServiziAggiuntiviPdp.schema = {
	title: 'store/servizi-aggiuntivi-pdp.title',
	description: 'store/servizi-aggiuntivi-pdp.description',
	type: 'object',
	properties: {
		serviceTitle: {
			title: 'Title',
			description: 'Title of the section',
			default: 'Servizi inclusi nel prezzo',
			type: 'string',
		},
		serviceLabel1: {
			title: 'Consegna',
			description: 'Label for service 1',
			default: 'Servizi 1',
			type: 'string',
		},
		serviceLabel2: {
			title: 'Installazione',
			description: 'Label for service 2',
			default: 'Servizi 2',
			type: 'string',
		},
		serviceLabel3: {
			title: 'Ritiro',
			description: 'Label for service 3',
			default: 'Servizio 3',
			type: 'string',
		},
		serviceLabel4: {
			title: 'Esperto',
			description: 'Label for service 4',
			default: 'Servizio 4',
			type: 'string',
		},
		serviceLabel5: {
			title: 'Consulenza',
			description: 'Label for service 5',
			default: 'Servizio 5',
			type: 'string',
		},
		discountTitle: {
			title: 'Sconto',
			description:
				'Con il tuo acquisto ricevi subito il 10% di sconto da spendere sul tuo prossimo ordine.',
			default: 'Servizio 5',
			type: 'string',
		},
		discountDesc: {
			title: 'Descrizione Sconto',
			description: 'Descrizione',
			default: 'Descrizione',
			type: 'string',
		},
		freeLabel: {
			title: 'Gratuito Label',
			description: 'Gratuito',
			default: 'Gratuito',
			type: 'string',
		},
	},
}

export default ServiziAggiuntiviPdp
