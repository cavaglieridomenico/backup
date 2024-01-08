import React, { useState, Fragment, useMemo, useRef, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconPlusLines } from 'vtex.styleguide'
import { ProductListContext } from 'vtex.product-list-context'
import { useProduct } from 'vtex.product-context'
import { useTreePath, useRuntime, ExtensionPoint } from 'vtex.render-runtime'
import { FormattedCurrency } from 'vtex.format-currency'
import { ProductGroupContext } from 'vtex.product-group-context'
import { useCssHandles } from 'vtex.css-handles'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { useRecommendation } from 'vtex.recommendation-context/RecommendationContext'
import IconEqual from '../../icons/iconEqual'
import ProductSummaryWithActions from './ProductSummaryWithActions'
import { mapSKUItemsToCartItems } from '../../utils'
import { useOnView } from '../../hooks/useOnView'
import { useEvents } from '../../hooks/useEvents'
import { useQuery, useMutation } from 'react-apollo'
import RETRIEVE_ASSOCIATIONS from '../../graphql/retrieveAssociations.graphql'
import discountDataMutation from '../../graphql/discountData.graphql'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'

const { ProductGroupProvider } = ProductGroupContext

interface Props {
	title?: string
	suggestedProducts?: Product[][]
	BuyButton: React.ComponentType<{ skuItems: CartItem[]; disabled: boolean }>
}

const { ProductListProvider } = ProductListContext

const CSS_HANDLES = [
	'buyTogetherContainer',
	'buyTogetherTitleContainer',
	'buyTogetherTitle',
	'priceWithoutDiscount',
	'priceWithtDiscount',
	'totalValue',
	'totalLabel',
	'firstCard',
]

const notNull = (item: CartItem | null): item is CartItem => item !== null

const BuyTogether: StorefrontFunctionComponent<Props> = ({
	title,
	BuyButton,
}) => {
	const { product: baseProduct } = useProduct() as any
	const currentItem = baseProduct as Product
	const { loading, data } = useQuery(RETRIEVE_ASSOCIATIONS, {
		variables: {
			skuId: currentItem?.items?.[0]?.itemId,
			categoryId: currentItem?.categoryId,
		},
	})
	const [
		mutateFunction,
		{ data: discountData, loading: loadingDiscountData, error },
	] = useMutation(discountDataMutation)
	const handles = useCssHandles(CSS_HANDLES)
	const { page } = useRuntime()
	const { push } = usePixel()
	const ref = useRef<HTMLDivElement | null>(null)
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { treePath } = useTreePath()
	const recommendation = useRecommendation?.()
	const { onView, onProductClick } = useEvents(recommendation, push, page)
	const [suggestedLists, setSuggestedLists] = useState<SuggestedList[]>([])
	const [priceWithoutDiscount, setPriceWithoutDiscount] = useState<number>(0)
	const [discount, setDiscount] = useState<number|null>(null)

	useOnView({
		ref,
		onView: () => onView('buy-together'),
		once: true,
		initializeOnInteraction: true,
	})

	const normalizedBaseProduct = useMemo(
		() => ProductSummary.mapCatalogProductToProductSummary(baseProduct),
		[baseProduct],
	)

	useEffect(() => {
		if (loading === false && data) {
			setSuggestedLists(
				data?.retrieveAssociation?.map((list: Product) => {
					return { products: [list], hidden: false, current: 0 }
				}) ?? [],
			)
		}
	}, [loading, data])

	useEffect(() => {
		if (loadingDiscountData === false && discountData && !error) {
				const totalItemsPrice = discountData.discountData?.totals?.find((total:any) => total.id == "Items")?.value
				const discount = discountData.discountData?.totals?.find((total:any) => total.id == "Discounts")?.value
				setPriceWithoutDiscount(totalItemsPrice / 100)
				if(!isNaN(discount)) setDiscount(discount/100)
		}
	}, [loadingDiscountData, discountData])

	useEffect(() => {
		if (suggestedLists.length) {
			const skuList = suggestedLists
				.filter((list) => list.hidden === false)
				?.map((list) => {
					return list.products[list?.current]?.items[0]?.itemId
				})
			skuList.unshift(currentItem?.items[0].itemId)
			if (skuList.length > 1)
				mutateFunction({ variables: { listSku: skuList } })
		}
	}, [suggestedLists])

	const filteredItems = useMemo(() => {
		const sortedItems = suggestedLists?.map((list) => {
			return {
				quantity: 1,
				product: list.products[list?.current],
				selectedItem: list.products[list.current]?.items[0],
			}
		})
		return sortedItems.filter((item, index) => {
			if (item.quantity === 1) {
				return !suggestedLists[index].hidden
			}
			return !(
				suggestedLists[index - 1].hidden && !suggestedLists[index].hidden
			)
		})
	}, [suggestedLists])

	const treePathList =
		(typeof treePath === 'string' && treePath.split('/')) || []
	const trackingId = treePathList[treePathList.length - 1] || 'BuyTogetherShelf'

	const onDeleteOrAdd = (index: number) => {
		let newSuggestedLists = []
		if (suggestedLists[index].hidden) {
			newSuggestedLists = suggestedLists?.map((list, listIndex) =>
				listIndex !== index ? list : { ...list, hidden: false },
			)
		} else {
			newSuggestedLists = suggestedLists?.map((list, listIndex) =>
				listIndex !== index ? list : { ...list, hidden: true },
			)
		}
		setSuggestedLists(newSuggestedLists)
	}

	const cartItems = useMemo(() => {
		return mapSKUItemsToCartItems(filteredItems, currentItem)?.filter(notNull)
	}, [filteredItems])

	const totalPrice = useMemo(() => {
		return cartItems.reduce((total: number, currentItem: CartItem) => {
			return total + currentItem.sellingPrice / 100
		}, 0)
	}, [cartItems])

	const totalProducts = cartItems?.length

	if (!suggestedLists.length) {
		return null
	}
	return (
		<div className={`flex-none tc ${handles.buyTogetherContainer}`} ref={ref}>
			<div className={`mv4 v-mid ${handles.buyTogetherTitleContainer}`}>
				<span className={handles.buyTogetherTitle}>
					{title && title !== '' ? (
						title
					) : (
						<FormattedMessage id={'store/shelf.buy-together.title'} />
					)}
				</span>
			</div>
			{!loading && (
				<div className="flex flex-column flex-row-l">
					<ProductListProvider listName={trackingId}>
						<div className={`w-100 w-20-l ${handles.firstCard}`}>
							<div className={handles.productSummary} />
							<div>
								<ExtensionPoint
									id="product-summary"
									product={normalizedBaseProduct}
									actionOnClick={() => onProductClick(normalizedBaseProduct)}
								/>
							</div>
						</div>
						{suggestedLists?.map(
							(suggestedList: SuggestedList, index: number) => {
								const { products, current } = suggestedList
								return (
									<Fragment key={`${index}`}>
										<div className="self-center ma5">
											<IconPlusLines size={20} />
										</div>
										<ProductSummaryWithActions
											onDeleteOrAdd={onDeleteOrAdd}
											index={index}
											hideChangeAction={products.length < 1}
											hidden={suggestedList.hidden}
											product={products[current]}
											onProductClick={onProductClick}
										/>
									</Fragment>
								)
							},
						)}
						<div className="self-center ma5">
							<IconEqual />
						</div>
						<div className="w-100 mh2 mh6-l w-20-l self-center">
							<div className={`mb5 ${handles.totalLabel}`}>
								<FormattedMessage
									id={'store/shelf.buy-together.total-products.label'}
									values={{ total: totalProducts }}
								/>
							</div>
							{cartItems.length > 1 && discount && (
								<div className={handles.priceWithoutDiscount}>
									<FormattedCurrency value={priceWithoutDiscount} />
								</div>
							)}
							<div className={`mb5 ${handles.priceWithtDiscount}`}>
								<FormattedCurrency
									value={cartItems.length > 1 && !isNaN(priceWithoutDiscount) ? priceWithoutDiscount + (discount || 0) : totalPrice}
								/>
							</div>
							<BuyButton skuItems={cartItems} disabled={loadingDiscountData} />
						</div>
					</ProductListProvider>
				</div>
			)}
		</div>
	)
}

const EnhancedBuyTogether: StorefrontFunctionComponent<Props> = (props) => {
	return (
		<ProductGroupProvider>
			<BuyTogether {...props} />
		</ProductGroupProvider>
	)
}

EnhancedBuyTogether.schema = {
	title: 'admin/editor.buy-together.title',
}

export default EnhancedBuyTogether
