import React, { useEffect } from "react"
import { useItemContext } from "./ItemContext"
import { useQuery } from "react-apollo"
import getProductsProperties from "../../../graphql/productsProperties.graphql"

interface Props {}

const Fgas: StorefrontFunctionComponent<Props> = ({ children }) => {
	const { item } = useItemContext()
	const { data } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: item.id,
		},
	})
	useEffect(() => {}, [data])
	return (
		<>
			{data &&
				data?.productsByIdentifier[0]?.properties.map((item: any) => {
					return item.name == "fgas" && item.values == "false" && children
				})}
		</>
	)
}

export default Fgas
