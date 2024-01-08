import React, { useEffect, useState } from 'react'
import getAdditionalServices from './graphql/getAdditionalServices.graphql'
import { useLazyQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import { useRenderSession } from 'vtex.session-client'
import style from './style.css'
import { Collapsible } from 'vtex.styleguide'
import ContentLoader from 'react-content-loader'
import { FormattedCurrency } from 'vtex.format-currency'
import { usePixel } from 'vtex.pixel-manager'
// import { delivery, twoYearsWarranty } from './utils/AdditionalServicesToPush'
import { useIntl } from 'react-intl'

interface serviceProps {
	showTitle: boolean
	addServicesFromCMS?: AddServicesFromCMS[]
	servicesToHide?: ServicesToHide[]
}
interface AddServicesFromCMS {
	Name: string
	Price: number
	Description: string
	ServiceTypeId: string
}
interface ServicesToHide {
	Name: string
}
interface WindowRuntime extends Window {
	__RUNTIME__: any
}

const AdditionalServicesPdp: StorefrontFunctionComponent<serviceProps> = ({
	showTitle = true,
	servicesToHide = [],
}) => {
	const intl = useIntl()
	let runtime = (window as unknown as WindowRuntime).__RUNTIME__
	/*--- BASIC CONSTS ---*/
	const { product } = useProduct()
	const skuId = product?.items?.[0]?.itemId
	const { session, error } = useRenderSession()
	const { push } = usePixel()

	useEffect(() => {
		if (session) {
			if (JSON.parse(atob(runtime.segmentToken)).channel === null) {
				setCurrentSc(session?.namespaces?.store?.channel?.value)
			} else {
				setCurrentSc(JSON.parse(atob(runtime.segmentToken)).channel)
			}
		} else {
			if (error) {
				console.log(error.message)
			}
		}
	}, [session])

	const getCommunityFromSalesChannel = (channel: String): String => {
		switch (channel) {
			case '1':
				return 'EPP'
			case '2':
				return 'FF'
			case '3':
				return 'VIP'
			default:
				return ''
		}
	}
	/*--- STATE MANAGEMENT ---*/
	const [additionalServices, setAdditionalServices]: any = useState([])
	const [currentSc, setCurrentSc] = useState<any>(null)
	const tradePolicy = getCommunityFromSalesChannel(currentSc)

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
		if (product?.items && currentSc) {
			getSearchData({
				variables: {
					s: skuId,
					sc: '1',
				},
			})
		}
	}, [product, currentSc])

	useEffect(() => {
		if (data) {
			setAdditionalServices([
				// ...additionalServices,
				...data?.additionalServices,
			])
			setOpenQuestion(
				setInitialState([...additionalServices, ...data?.additionalServices]),
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

	const isAnAccessory = product?.categories?.some((path) =>
		path.includes('accessoires'),
	)

	/* const isSellable =
    product?.properties?.filter((e: any) => e.name == `sellable${tradePolicy}`)[0]?.values[0] ==
    "true"; */

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
		let newValue = !newOpen[questionNbr].isOpen
		/* Analytics push */
		const pixelObject = {
			event: 'accordionInteraction',
			action: newValue,
			product: product,
		}
		push(pixelObject)
		/*---*/
		newOpen[questionNbr].isOpen = newValue
		setOpenQuestion(newOpen)
	}

	const formatName = (name: string) => {
		return name.includes(`${tradePolicy}_`)
			? name.split(`${tradePolicy}_`)[1]
			: name
	}

	const shouldHideAddService = (serviceName: string) => {
		return (
			servicesToHide?.filter(
				(service: ServicesToHide) => service.Name == serviceName,
			).length >= 1
		)
	}

	return (
		<>
			{!isAnAccessory && additionalServices.length /* && isSellable */ ? (
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
							{additionalServices?.map(
								(service: any, index: number) =>
									!shouldHideAddService(service.Name) && (
										<div
											key={index}
											className={style.servAggRow + ' servizi-aggiuntivi-row'}
										>
											{service.Description && service.Description != '' ? (
												<Collapsible
													key={index}
													header={
														<div className={style.servOptions}>
															{formatName(service.Name)}
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
													caretColor="base"
												>
													<div
														className={`${style.serviziAggiuntiviTooltip} ${style.servAggTooltip}`}
													>
														{service.Description}
													</div>
												</Collapsible>
											) : (
												<div
													className={`${style.servOptions} ${style.servOptionsNoDesc}`}
												>
													{formatName(service.Name)}
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
									),
							)}
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
	properties: {},
}

export default AdditionalServicesPdp
