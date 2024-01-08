import { useOrder } from 'itccwhirlpool.order-placed-custom/OrderContext'

import productCategory from './graphql/productCategory.graphql'
import { useQuery } from 'react-apollo'
import * as React from 'react'

interface RichTextWProProps {}
const RichTextWPro: StorefrontFunctionComponent<RichTextWProProps> = ({}) => {
	const orderGroup = useOrder()
	let orderProductsType: Array<string> = []
	if (orderGroup.items.length > 0) {
		orderGroup.items.map((order) => {
			const { data, loading, error } = useQuery(productCategory, {
				variables: { field: 'id', values: order.id },
			})
			if (data && !loading && !error) {
				let productType: string =
					data.productsByIdentifier[0].categoryTree[0].name
				orderProductsType.push(productType)
			}
			return orderProductsType
		})
	}
	const hasAccessory = orderProductsType.indexOf('accessori') != -1
	const allEqualAccessory = (orderProductsType) =>
		orderProductsType.every((v) => v === orderProductsType[0])

	const textToRender =
		hasAccessory && !allEqualAccessory(orderProductsType) ? (
			<div>
				Gli accessori WPRO omaggio potrebbero venire consegnati in momenti
				diversi.
			</div>
		) : null

	return <>{textToRender}</>
}
RichTextWPro.schema = {
	title: 'editor.richTextWPro.title',
	description: 'editor.richTextWPro.description',
	type: 'object',
}
export default RichTextWPro
