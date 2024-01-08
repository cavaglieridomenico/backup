import { path } from 'ramda'
import React, { useEffect, useMemo, useState } from 'react'
import { ProductTypes, useProduct } from 'vtex.product-context'
import { withToast } from 'vtex.styleguide'

import AddToCartButton from './AddToCartButton'
import { AssemblyOptions } from './modules/assemblyOptions'
import { CartItem, mapCatalogItemToCart } from './modules/catalogItemToCart'
import fetchRequest from './utilities/fetchRequest'

interface Props {
	isOneClickBuy: boolean
	available: boolean
	disabled: boolean
	customToastUrl?: string
	customOneClickBuyLink?: string
	showToast: Function
	selectedSeller?: ProductTypes.Seller
	text?: string
	unavailableTextProps?: string
	onClickBehavior?:
		| 'add-to-cart'
		| 'go-to-product-page'
		| 'ensure-sku-selection'
	onClickEventPropagation?: 'disabled' | 'enabled'
	skuItems?: CartItem[]
	customPixelEventId?: string
	addToCartFeedback?: 'toast' | 'customEvent'
	canBeHidden?: string
}

interface ScMapping {
	[index: string]: string
}

function checkAvailability(
	isEmptyContext: boolean,
	seller: ProductTypes.Seller | undefined,
	availableProp: Props['available'],
) {
	if (isEmptyContext) {
		return false
	}
	if (availableProp != null) {
		return availableProp
	}

	const availableProductQuantity = seller?.commertialOffer?.AvailableQuantity

	return Boolean(availableProductQuantity)
}

function checkDisabled(
	isEmptyContext: boolean,
	assemblyOptions: AssemblyOptions | undefined,
	disabledProp: Props['disabled'],
) {
	if (isEmptyContext) {
		return true
	}
	if (disabledProp != null) {
		return disabledProp
	}

	const groupsValidArray =
		(assemblyOptions?.areGroupsValid &&
			Object.values(assemblyOptions.areGroupsValid)) ||
		[]
	const areAssemblyGroupsValid = groupsValidArray.every(Boolean)

	return !areAssemblyGroupsValid
}

const Wrapper = withToast(function Wrapper(props: Props) {
	const {
		isOneClickBuy,
		available,
		customToastUrl,
		showToast,
		customOneClickBuyLink,
		selectedSeller,
		text,
		customPixelEventId,
		addToCartFeedback = 'toast',
		onClickBehavior = 'add-to-cart',
		onClickEventPropagation = 'disabled',
		canBeHidden = false,
	} = props
	const { disabled, unavailableTextProps } = props
	const productContext = useProduct()
	const isEmptyContext = Object.keys(productContext ?? {}).length === 0

	const product = productContext?.product
	const itemsLength = product?.items?.length ?? 0
	const multipleAvailableSKUs = itemsLength > 1
	const selectedItem = productContext?.selectedItem
	const assemblyOptions = productContext?.assemblyOptions
	const seller =
		selectedSeller ??
		(productContext?.selectedItem?.sellers[0] as ProductTypes.Seller)
	const selectedQuantity =
		productContext?.selectedQuantity != null
			? productContext.selectedQuantity
			: 1

	const skuItems = useMemo(
		() =>
			props.skuItems ??
			mapCatalogItemToCart({
				product,
				selectedItem,
				selectedQuantity,
				selectedSeller: seller,
				assemblyOptions,
			}),
		[
			assemblyOptions,
			product,
			props.skuItems,
			selectedItem,
			selectedQuantity,
			seller,
		],
	)
	const [isAvailable, setisAvailable] = useState(
		checkAvailability(isEmptyContext, seller, available),
	)

	const [isDisabled, setisDisabled] = useState(
		checkDisabled(isEmptyContext, assemblyOptions, disabled),
	)

	const [unavailableText, setunavailableText] = useState(unavailableTextProps)

	const areAllSkuVariationsSelected = Boolean(
		!isEmptyContext && productContext?.skuSelector?.areAllVariationsSelected,
	)

	const productLink = {
		linkText: product?.linkText,
		productId: product?.productId,
	}

	const availableQuantity = path(
		['sellers', 0, 'commertialOffer', 'AvailableQuantity'],
		selectedItem,
	) as number | undefined

	// @ts-ignore
	const { itemId: skuId } = selectedItem
	// @ts-ignore
	const { categoryId } = productContext?.product

	function notSellable(label = 'Unavailable') {
		setisAvailable(false)
		setunavailableText(label)
	}

	function disableProduct() {
		setisDisabled(true)
	}

	const [salesChannel, setSalesChannel]: any = useState('4')

	const scMapping: ScMapping = {
		'1': 'EPP',
		'2': 'FF',
		'3': 'VIP',
		'4': 'EPP',
	}

	useEffect(() => {
		if (typeof window != undefined) {
			const sc = JSON.parse(
				Buffer.from(
					(window as any).__RUNTIME__.segmentToken,
					'base64',
				).toString(),
			).channel

			const url = window.location.href
			const scWithoutChannel = url.includes('epp')
				? '1'
				: url.includes('ff')
				? '2'
				: '3'

			sc && sc != '4' ? setSalesChannel(sc) : setSalesChannel(scWithoutChannel)
		}
	}, [typeof window])

	/*--- CONTS ---*/
	// const salesChannel: string = window
	//   ? JSON.parse(
	//       Buffer.from(
	//         (window as any).__RUNTIME__.segmentToken,
	//         "base64"
	//       ).toString()
	//     ).channel
	//   : null

	const tradePolicy = scMapping[salesChannel]

	const isSellable =
		productContext?.product?.properties?.find(
			(prop: any) => prop.name == `sellable${tradePolicy}`,
		)?.values[0] == 'true'

	// @ts-ignore
	useEffect(async () => {
		const requestArgs = {
			uri: `/api/catalog_system/pub/specification/field/listByCategoryId/${categoryId}`,
		}
		const response1 = await fetchRequest(requestArgs)

		const specs = response1.filter(
			(obj) =>
				obj.Name == 'minimumQuantityThreshold' ||
				obj.Name == 'showPrice' ||
				obj.Name == 'sellable',
		)

		const categorySpecs = {}

		specs.forEach((s) => {
			categorySpecs[s.Name] = s.FieldId
		})

		requestArgs.uri = `/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${skuId}`
		const response2 = await fetchRequest(requestArgs)

		for (var s of Object.keys(categorySpecs)) {
			specs[s] = response2.ProductSpecifications.find(
				(r) => r.FieldId == categorySpecs[s],
			).FieldValues[0]
		}

		const { minimumQuantityThreshold, sellable, showPrice } = specs

		// @ts-ignore
		if (selectedItem?.images.length < 1) {
			disableProduct()
			return
		}
		// @ts-ignore
		if (sellable === 'false') {
			notSellable()
			return
		}

		if (showPrice === 'false') {
			notSellable()
			return
		}

		if (
			availableQuantity !== undefined &&
			availableQuantity < minimumQuantityThreshold
		) {
			notSellable(unavailableText)
			return
		}
	}, [])

	return (
		<>
			{canBeHidden && (!isSellable || !isAvailable) ? null : (
				<AddToCartButton
					text={text}
					skuItems={skuItems}
					disabled={isDisabled}
					showToast={showToast}
					available={isAvailable}
					isOneClickBuy={isOneClickBuy}
					customToastUrl={customToastUrl}
					unavailableText={unavailableText}
					customOneClickBuyLink={customOneClickBuyLink}
					allSkuVariationsSelected={areAllSkuVariationsSelected}
					productLink={productLink}
					onClickBehavior={onClickBehavior}
					onClickEventPropagation={onClickEventPropagation}
					multipleAvailableSKUs={multipleAvailableSKUs}
					customPixelEventId={customPixelEventId}
					addToCartFeedback={addToCartFeedback}
				/>
			)}
		</>
	)
})

Wrapper.schema = {
	title: 'admin/editor.add-to-cart.title',
}

export default Wrapper
