import React, { useEffect, useState } from 'react'
import getAdditionalServices from './graphql/getAdditionalServices.graphql'
import { useLazyQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { useProduct } from 'vtex.product-context'
import style from './style.css'
import { Collapsible } from 'vtex.styleguide'
import ContentLoader from 'react-content-loader'
import { FormattedCurrency } from 'vtex.format-currency'
// import { Livraison, twoYearsWarranty } from './utils/AdditionalServicesToPush'
import { useIntl } from 'react-intl'

interface serviceProps {
	//Theme Props
	showTitle: boolean
	//CMS Props
	// serviceTitle: string;
	// serviceLabel1: string;
	// serviceLabel2: string;
	// serviceLabel3: string;
	// serviceLabel4: string;
	// serviceLabel5: string;
	// freeLabel: string;
}

const AdditionalServicesPdp: StorefrontFunctionComponent<serviceProps> = ({
	//Theme Props
	showTitle = true,
	//CMS Props
	// serviceTitle,
	// serviceLabel1,
	// serviceLabel2,
	// serviceLabel3,
	// serviceLabel4,
	// serviceLabel5,
	// freeLabel,
}) => {
	const intl = useIntl()

	/*--- BASIC CONSTS ---*/
	const { product } = useProduct()
	const { production, binding, culture } = useRuntime()
	const skuId = product?.items?.[0]?.itemId
	const tradePolicy =
		binding?.id == 'd2ef55bf-ed56-4961-82bc-6bb753a25e90'
			? 'EPP'
			: binding?.id == 'df038a38-b21d-4a04-adbe-592af410dae3'
				? 'FF'
				: 'VIP'

	/*--- STATE MANAGEMENT ---*/
	const [additionalServices, setAdditionalServices]: any = useState([])

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
					sc: tradePolicy == 'EPP' ? '1' : tradePolicy == 'FF' ? '2' : '3',
					locale: culture?.locale,
				},
			})
		}
	}, [product])

	useEffect(() => {
		if (data) {
			setAdditionalServices([
				// ...additionalServices,
				...data?.additionalServices,
			])
			setOpenQuestion(
				setInitialState([...data?.additionalServices]),
			)
			// setwarranty5years(
			// 	data?.additionalServices?.filter(
			// 		(service: any) =>
			// 			formatName(service.Name) == '5 ans de garantie sur votre appareil',
			// 	).length > 0,
			// )
		}
	}, [data])

	const [openQuestion, setOpenQuestion]: any = useState()
	// const [warranty5years, setwarranty5years]: any = useState(false)

	// const serviceLabelList: string[] = [];
	// serviceLabelList?.push(
	//   serviceLabel1,
	//   serviceLabel2,
	//   serviceLabel3,
	//   serviceLabel4,
	//   serviceLabel5
	// );

	const isAnAccessory = product?.categories?.some((path) =>
		path.includes('accessoires'),
	)

	const isSellable =
		product?.properties?.filter(
			(e: any) => e.name == `sellable${tradePolicy}`,
		)[0]?.values[0] == 'true'

	const setInitialState = (services: any) => {
		let obj: any = {}
		for (let i = 0; i < services.length; i++) {
			obj[services[i].ServiceTypeId] = {
				isOpen: false,
			}
		}
		return obj
	}

	const toggleAccordion = (questionNbr) => {
		let newOpen: any = { ...openQuestion }
		let newValue = !newOpen[questionNbr]?.isOpen
		newOpen[questionNbr].isOpen = newValue
		setOpenQuestion(newOpen)
	}

	// const formatName = (name: string) => {
	// 	return name.includes(`${tradePolicy}_`)
	// 		? name.split(`${tradePolicy}_`)[1]
	// 		: name
	// }

	/*--- CONSOLE LOGS ---*/
	if (!production) {
		console.log(
			'%c ADDITIONAL SERVICES ',
			'background: #a6ff00; color: #000000',
			additionalServices,
		)
		// console.log(
		// 	'%c HAS 5 YEARS WARRANTY ',
		// 	'background: #006eff; color: #ffffff',
		// 	warranty5years,
		// )
		console.log(
			'%c IS SELLABLE? ',
			'background: #ff00b3; color: #000000',
			isSellable,
		)
		console.log(
			'%c IS AN ACCESSORY? ',
			'background: #00ffb3; color: #000000',
			isAnAccessory,
		)
		// console.log(
		//   "%c CMS LABELS ",
		//   "background: #ff6600; color: #ffffff",
		//   serviceLabelList
		// );
	}
	return (
		<>
			{!isAnAccessory && isSellable && additionalServices.length > 0 ? (
				<>
					{!loading ? (
						<div className={style.serviziAggiuntiviTable}>
							<div className={style.serviceTitle}>
								{showTitle && (
									<p className={style.servTitleStyle}>
										{intl.formatMessage({
											id: 'store/additional-services-pdp.serviceTitle',
										})}
									</p>
								)}
							</div>
							{additionalServices?.map((service: any, index: number) => (
								<div
									key={index}
									className={style.servAggRow + ' servizi-aggiuntivi-row'}
								>
									{/* if description is empty use Collapsible component else not */}
									{service.Description && service.Description != '' ? (
										<Collapsible
											key={index}
											header={
												<div className={style.servOptions}>
													{service.Name}
													{service.Price === 0 ? (
														<span className={style.freeLabel}>
															{intl.formatMessage({
																id: 'store/additional-services-pdp.freeLabel',
															})}
														</span>
													) : (
														<span
															key="servicePriceValue"
															className={style.labelPrice}
														>
															<FormattedCurrency value={service.Price} />
														</span>
													)}
												</div>
											}
											align="right"
											onClick={() => {
												toggleAccordion(service.ServiceTypeId)
											}}
											isOpen={
												openQuestion &&
												openQuestion[service.ServiceTypeId]?.isOpen
											}
											caretColor="#505050"
										>
											<div
												className={`${style.serviziAggiuntiviTooltip} ${style.servAggTooltip}`}
											>
												{console.log("DescriptionTest", service.Description)}
												{service.Description}
											</div>
										</Collapsible>
									) : (
										<div className={style.servOptions}>
											{service.Name}
											{service.Price === 0 ? (
												<span className={style.freeLabel}>
													{intl.formatMessage({
														id: 'store/additional-services-pdp.freeLabel',
													})}
												</span>
											) : (
												<span
													key="servicePriceValue"
													className={style.labelPrice}
												>
													<FormattedCurrency value={service.Price} />
												</span>
											)}
										</div>
									)}
								</div>
							))}
							{/* {!warranty5years && (
								<div
									key={10}
									className={style.servAggRow + ' servizi-aggiuntivi-row '}
								>
									<div
										className={`${style.servOptions} ${style.twoYearsWarranty}`}
									>
										{twoYearsWarranty.Name}
										{twoYearsWarranty.Price === 0 ? (
											<span className={style.freeLabel}>
												{intl.formatMessage({
													id: 'store/additional-services-pdp.freeLabel',
												})}
											</span>
										) : (
											<span
												key="servicePriceValue"
												className={style.labelPrice}
											>
												<FormattedCurrency value={twoYearsWarranty.Price} />
											</span>
										)}
									</div>
								</div>
							)} */}
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
		serviceTitle: {
			title: 'Title',
			description: 'Title of the section',
			default: 'Services included',
			type: 'string',
		},
		serviceLabel1: {
			title: 'serviceLabel1',
			description: 'Label for service 1',
			default: 'Servizi 1',
			type: 'string',
		},
		serviceLabel2: {
			title: 'serviceLabel2',
			description: 'Label for service 2',
			default: 'Servizi 2',
			type: 'string',
		},
		serviceLabel3: {
			title: 'serviceLabel3',
			description: 'Label for service 3',
			default: 'Servizio 3',
			type: 'string',
		},
		serviceLabel4: {
			title: 'serviceLabel4',
			description: 'Label for service 4',
			default: 'Servizio 4',
			type: 'string',
		},
		serviceLabel5: {
			title: 'serviceLabel5',
			description: 'Label for service 5',
			default: 'Servizio 5',
			type: 'string',
		},
		discountDesc: {
			title: 'discountDesc',
			description: 'Description of discountDesc',
			default: 'Descrizione',
			type: 'string',
		},
		freeLabel: {
			title: 'Free Label',
			description: 'Free label',
			default: 'Inclus',
			type: 'string',
		},
	},
}

export default AdditionalServicesPdp
