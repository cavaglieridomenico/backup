import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import style from './style.css'
import { getRetailers } from './utils/wtbIntegration'
import { usePixel } from 'vtex.pixel-manager'

interface WhereToBuyProps {
	storeLocatorLink: string
}

const WhereToBuy: StorefrontFunctionComponent<WhereToBuyProps> = ({
	storeLocatorLink = '/store-locator',
}) => {
	const productContext = useProduct()
	const { name } = productContext.selectedItem
	const [retailers, setRetailers] = useState([])
	const { push } = usePixel()

	useEffect(() => {
		//GA4FUNREQ36
		push({
			event: 'store_locator_from_product',
			slug: productContext?.product?.linkText,
		})
		/*------------------*/
		//GA4FUNREQ38
		push({ event: 'intentionToBuy', slug: productContext?.product?.linkText })
		/*------------------*/

		getRetailers(name)
			.then((response) => response.json())
			.then((data) => setRetailers(data.d))
	}, [])

	return (
		<>
			<div style={{ display: 'flex', margin: '1rem 2rem 2rem 2rem' }}>
				<div className={style.wtbTitleUnderline}>WH</div>
				<div className={style.wtbTitle}>ERE TO BUY</div>
			</div>
			<div className={style.retailerWrapper}>
				{retailers.map((element: any) => (
					<div className={style.retailerItemContainer}>
						<img
							className={style.wtbImage}
							src={encodeURI(element.MerchantLogoUrl)}
						/>
						<button
							onClick={() => {
								//GA4FUNREQ39
								push({
									event: 'ga4_retailer_click',
									name: element.MerchantName,
								})
								/*------------*/
								window.open(element.NavigateUrl, '_blank')
							}}
							className={[style.buyNowButton, style.fromLeft].join(' ')}
						>
							<span className={style.buyNowContent}>Buy now</span>
						</button>
					</div>
				))}
				<div className={style.storeLocatorLinkContainer}>
					<a
						className={style.storeLocatorLink}
						href={storeLocatorLink}
						target="_blank"
					>
						Click here to find your nearest store.
					</a>
				</div>
			</div>
		</>
	)
}

WhereToBuy.schema = {
	title: 'Where To Buy Label',
	description: 'editor.wheretobuy.description',
	type: 'object',
	properties: {
		storeLocatorLink: {
			title: 'Store Locator link',
			description: 'This is the Store Locator link',
			type: 'string',
			default: '/store-locator',
		},
	},
}

export default WhereToBuy
