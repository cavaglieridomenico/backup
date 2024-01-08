import React from "react"
import { useItemContext } from "./ItemContext"
import style from "./productList.css"

// interface Props {}

const ProductImage: React.FC = () => {
	const { item } = useItemContext()

	return (
		<a className={style.imageAndNameLink} href={item.detailUrl}>
			<img
				className={style.productImage}
				src={item.imageUrl}
				alt="Product Image"
			/>
		</a>
	)
}

export default ProductImage
