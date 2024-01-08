import React from "react"
import { useItemContext } from "./ItemContext"
import { useQuery } from "react-apollo"
import getProductsProperties from "../../../graphql/productsProperties.graphql"
// import { ButtonPlain } from "vtex.styleguide"
import style from "./productList.css"
import { useIntl } from "react-intl"

interface ProductEnergyAndSheetProps {
energyImageProp: Array<string>
energyLabelProp: Array<string>
productDataSheetProp: Array<string>
}

// PROPS are used to handle all specifications for energy label and product sheet. If there are multiple to check put them inside the array from the 1st to consider up to the less important.

const ProductEnergyAndSheet: React.FC<ProductEnergyAndSheetProps> = ({
	energyImageProp,
	energyLabelProp,
	productDataSheetProp,
}) => {
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

			let productDataSheetSpec;
			let energyLabelSpec;
			let energyLabelImageSpec;

			for( let specificationName of productDataSheetProp){
				productDataSheetSpec = itemWithProps?.properties?.filter(
					(e: any) => e.name == specificationName,
				)
				if (productDataSheetSpec.length>0) break
			}

			for( let specificationName of energyLabelProp){
				energyLabelSpec = itemWithProps?.properties?.filter(
					(e: any) => e.name == specificationName,
				)
				if (energyLabelSpec.length>0) break
			}

			for( let specificationName of energyImageProp){
				energyLabelImageSpec = itemWithProps?.properties?.filter(
					(e: any) => e.name == specificationName,
				)
				if (energyLabelImageSpec.length>0) break
			}

			item.energyLabel = energyLabelSpec[0]?.values[0]			
			item.EnergyLogoImage = energyLabelImageSpec[0]?.values[0]
			item.productDataSheet = productDataSheetSpec[0]?.values[0]
			return item
		}
	})

	return (
		<div className={`${style.energyAndSheetContainer} ml5 flex items-center`}>
			{item.energyLabel && item.EnergyLogoImage && (
				<a href={item.energyLabel} target="_blank" className={`mr3 ${!item.energyLabel} pt2`}>
					<img src={item.EnergyLogoImage} alt="" />
				</a>
			)}
			{item.productDataSheet && (
				<a href={item.productDataSheet} target="_blank" className={`${style.PDSLabel} c-action-primary`}>
					{intl.formatMessage({ id: "checkout-io.dataSheet" })}
				</a>
			)}
		</div>
	)
}

export default ProductEnergyAndSheet
