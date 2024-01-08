import React from "react"
import useItemContext from "../../../../ItemContext"
import { FgasContainerProps } from "./FgasContainer"
import { useFgas } from "../context/FgasContext"

const FgasItemContainer: React.FC<FgasContainerProps> = ({
	children,
	alternativeChildren = [],
}) => {
	const { checkIsItemFgas, itemsFgasError } = useFgas()
	const { item } = useItemContext()

	const isItemFgas = (item && checkIsItemFgas(item.productId)) || false


	const childrenIfFgas = children.filter(
		(child: { props: { id: string } }) =>
			!alternativeChildren.includes(child?.props?.id) || false,
	)
	const childrenIfNotFgas = children.filter(
		(child: { props: { id: string } }) =>
			alternativeChildren.includes(child?.props?.id) || false,
	)

	return itemsFgasError ? (
		<p>Sorry, could not load fgas specifications</p>
	) : isItemFgas ? (
		childrenIfFgas
	) : (
		childrenIfNotFgas
	)
}

export default FgasItemContainer
