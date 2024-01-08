//@ts-nocheck
import React from 'react'
import style from './style.css'
import { useProduct, SpecificationGroup } from 'vtex.product-context'

const ProductReview: StorefrontFunctionComponent = () => {
	const { product } = useProduct()

	return (
		<reevoo-embeddable
			type="product"
			product-id={product.items?.[0].name}
			per-page="3"
			locale="en-GB"
			className="reevoo-badge"
		></reevoo-embeddable>
	)
}

ProductReview.schema = {
	title: 'editor.basicblock.title',
	description: 'editor.basicblock.description',
	type: 'object',
}

export default ProductReview
