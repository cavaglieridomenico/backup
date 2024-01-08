import React from "react"
import { useItemContext } from "./ItemContext"
import style from "./productList.css"

// import { useIntl, defineMessages } from 'react-intl'

// const messages = defineMessages({
//   subTextProductName: {
//     defaultMessage: 'Sold and shipped by Whirlpool',
//     id: 'checkout-io.cart.sub-text-product-name',
//   },
// })

interface ProductTitleProps {
	showLeadTime: boolean
}

const ProductTitle: StorefrontFunctionComponent<ProductTitleProps> = ({
	showLeadTime,
}) => {
	const { item, leadtime } = useItemContext()

	// const intl = useIntl()

	return (
		<>
			<a className={style.imageAndNameLink} href={item.detailUrl}>
				<div className={`${style.nameAndSubText} c-action-primary`}>
					<span className={style.productName}>{item.name}</span>
					<span className={style.subText}>
						{/* {intl.formatMessage(messages.subTextProductName)} */}
						{item?.additionalInfo?.brandName}
					</span>
					{showLeadTime && leadtime && (
						<span className={style.subText2}>{leadtime}</span>
					)}
				</div>
			</a>
		</>
	)
}

export default ProductTitle

ProductTitle.schema = {
	title: "Product title Properties",
	description: "Here you can set Product title Properties",
	type: "object",
	properties: {
		showLeadTime: {
			title: "Lead Time",
			description: "Choose if you want to show the Lead Time",
			default: true,
			type: "boolean",
		},
	},
}
