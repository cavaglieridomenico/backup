import React from "react"
import { useQuery } from "react-apollo"
import { useIntl } from "react-intl"
import { ButtonPlain } from "vtex.styleguide"
import getProductsProperties from "../../../graphql/productsProperties.graphql"
import { useItemContext } from "./ItemContext"
import style from "./productList.css"

const ProductEnergyAndSheet = () => {
	const intl = useIntl()

	const { item } = useItemContext()
	const { data } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: item.id,
		},
	})


	const propertiesList = data?.productsByIdentifier
	propertiesList?.map((itemWithProps: any) => {
		if (itemWithProps.productId == item.productId) {
			let EnergyLogoImage = itemWithProps?.properties?.filter(
				(e: any) => e.name == "EnergyLogo_image",
			)

			let newEnergyLabel = itemWithProps?.properties?.filter(
				(e: any) => e.name == "new-energy-label",
			)

			let energyLabel = itemWithProps?.properties?.filter(
				(e: any) => e.name == "energy-label",
			)

			let productDataSheet = itemWithProps?.properties?.filter(
				(e: any) => e.name == "nel-data-sheet" || e.name === "product-data-sheet",
			)

			if(newEnergyLabel.length)
				item.energyLabel = newEnergyLabel[0]?.values[0]
			else
				item.energyLabel = energyLabel[0]?.values[0]
			item.EnergyLogoImage = EnergyLogoImage[0]?.values[0]
			item.productDataSheet = productDataSheet[0]?.values[0]

			return item
		}
	})

	return (
		<div className={`${style.energyAndSheetContainer} ml5 flex`}>
			{item.energyLabel && (
				<a target="_blank" href={item.energyLabel} className={`mr3 ${!item.energyLabel} pt2`}>
					<img src={item.EnergyLogoImage} alt="" />
				</a>
			)}
			{item.productDataSheet && (
				<ButtonPlain href={item.productDataSheet} target="_blank" size="small">
					{intl.formatMessage({ id: "checkout-io.dataSheet" })}
				</ButtonPlain>
			)}
		</div>
	)
}

export default ProductEnergyAndSheet
