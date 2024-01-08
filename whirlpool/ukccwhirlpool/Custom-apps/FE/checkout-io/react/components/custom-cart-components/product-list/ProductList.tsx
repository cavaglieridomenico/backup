import type { ReactNode } from "react"
import React, { useMemo, memo } from "react"
import type { Item } from "vtex.checkout-graphql"
import { useQuery } from "react-apollo"
import getProductsProperties from "../../../graphql/productsProperties.graphql"
import { ItemContextProvider } from "./ItemContext"
import { useCartOrder } from "../../../providers/cartOrderform"
import style from "./productList.css"
import { ProductListSkeleton } from "../../skeleton/ContentLoaders"

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
	const { cartOrderForm, cartOrderLoading } = useCartOrder()
	const { children } = props
	console.log(children, "children")
	const items = cartOrderForm?.items
	let itemIds = items?.map((item) => item.id)
	//pulisco da doppioni
	itemIds = [...new Set(itemIds)]
	//tiro giù le properties dei prodotti
	const { data } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: itemIds,
		},
	})
	const propertiesList = data?.productsByIdentifier
	//prendo il lead time e lo passo al contesto
	items?.map((item) => {
		propertiesList?.map((itemWithProps: any) => {
			if (itemWithProps.productId == item.productId) {
				let leadtime = itemWithProps.properties.filter(
					(e: any) => e.name == "leadtime",
				)
				item.leadtime = leadtime[0].values[0]
			}
		})
		return item
	})

	console.log(propertiesList, "items?")

	return (
		/* Replacing the outer div by a Fragment may break the layout. See PR #39. */
		<div className={style.productListContainer}>
			{!cartOrderLoading ? (
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
								{children}
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

export default ProductList
