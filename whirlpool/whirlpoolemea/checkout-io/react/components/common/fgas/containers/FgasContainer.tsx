import React from "react"
import { useFgas } from "../context/FgasContext"

export interface FgasContainerProps {
	children: any
	alternativeChildren?: string[]
}

const FgasContainer: React.FC<FgasContainerProps> = ({
	children,
	alternativeChildren = [],
}) => {
	const { checkIsCartWithFgas, itemsFgasError } = useFgas()
	const isCartWithFgas = checkIsCartWithFgas()

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
	) : isCartWithFgas ? (
		childrenIfFgas
	) : (
		childrenIfNotFgas
	)
}

export default FgasContainer
