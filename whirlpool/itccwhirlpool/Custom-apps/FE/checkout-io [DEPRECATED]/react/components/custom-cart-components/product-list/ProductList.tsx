import { ReactNode, useEffect, useState } from "react"
import React, { useMemo, memo } from "react"
import type { Item } from "vtex.checkout-graphql"
import { useQuery } from "react-apollo"
import getProductsProperties from "../../../graphql/productsProperties.graphql"
import { ItemContextProvider } from "./ItemContext"
import { useOrder } from "../../../providers/orderform"
import style from "./productList.css"
import { ProductListSkeleton } from "../../skeleton/ContentLoaders"
import { defineMessages } from "react-intl"
import { useIntl } from "react-intl"

interface Props {
	items: ItemWithIndex[]
	loading: boolean
	children: ReactNode
}

// interface Property {
// 	name: string
// 	value: string
// }
interface ItemWithIndex extends Item {
	index: number
	id: string
}

interface ItemWrapperProps {
	item: ItemWithIndex
	itemIndex: number
	loading: boolean
	children: ReactNode
	offerings: any
	leadtime: string
}
const ItemContextWrapper = memo<ItemWrapperProps>(function ItemContextWrapper({
	item,
	itemIndex,
	loading,
	children,
	offerings,
	leadtime,
}) {
	const context = useMemo(
		() => ({
			item,
			itemIndex,
			loading,
			offerings,
			leadtime,
		}),
		[item, itemIndex, loading, leadtime],
	)

	return <ItemContextProvider value={context}>{children}</ItemContextProvider>
})

const ProductList = memo<Props>(function ProductList(props) {
	const { orderForm, orderLoading } = useOrder()
	const { children } = props
	const [items, setItems] = useState([] as any)
	const [itemIds, setItemsIds] = useState([] as any)
  const intl = useIntl()

	const { data } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: itemIds,
		},
	})
	const propertiesList = data?.productsByIdentifier
	//prendo il lead time e lo passo al contesto
	items?.map((item: any) => {
		propertiesList?.map((itemWithProps: any) => {
			if (itemWithProps.productId == item.productId) {
				let leadtime = itemWithProps.properties.filter(
					(e: any) => e.name == "leadtime",
				)
				item.leadtime = leadtime[0]?.values[0]
			}
		})
		return item
	})

	useEffect(() => {
		if (orderForm && orderForm.orderFormId) {
			fetch("/checkout-io/checkItemStock", {
				method: "POST", // or 'PUT'
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderFormId: orderForm?.orderFormId,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					let cartItems = orderForm.items.map((item: any) => {
						let newItem = { ...item }
						if (
							data.messages &&
							data.messages.arrayMessages &&
							data.messages.arrayMessages.length > 0
						) {
							data.messages.arrayMessages.map((message: any) => {
								if (message.fields.skuName === newItem.skuName) {
									newItem.toBeRemoved = true
								}
							})
						}
						return newItem
					})
					setItems(cartItems)
					setItemsIds(cartItems?.map((item: any) => item?.id))
				})
				.catch((error) => {
					console.error("Error:", error)
				})
		}
	}, [orderForm])

	return (
		/* Replacing the outer div by a Fragment may break the layout. See PR #39. */
		<div className={style.productListContainer}>
			{!orderLoading ? (
				<>
					{items?.map((item: any, index: number) => {
						return (
							<ItemContextWrapper
								key={index}
								item={item}
								offerings={item.offerings}
								itemIndex={index}
								leadtime={item.leadtime}
								{...props}
							>
								<div
									className={[
										style.itemWrap,
										item.toBeRemoved
											? "bg-checkout " + style.itemWrapToBeRemoved
											: "",
									].join(" ")}
								>
									{item.toBeRemoved && (
										<div className={["bg-action-primary c-on-action-primary", style.itemToBeRemovedText].join(" ")}>{intl.formatMessage(messages.outOfStock)}</div>
									)}
									{children}
								</div>
							</ItemContextWrapper>
						)
					})}
				</>
			) : (
				<ProductListSkeleton></ProductListSkeleton>
			)}
		</div>
	)
})

const messages = defineMessages({
	outOfStock: {
		defaultMessage: "This product is no longer available and will be removed from your order.",
		id: "checkout-io.product-list.out-of-stock",
	}
})

export default ProductList
