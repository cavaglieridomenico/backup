import React, { Children, cloneElement } from "react"
import { useOrder } from "../../providers/orderform"

interface OrderformWrapperProps {
	children: any
}

const OrderformWrapper: React.FC<OrderformWrapperProps> = ({ children }) => {
	const order = useOrder()

	return (
		<>{Children.map(children, child => cloneElement(child, { ...order }))}</>
	)
}

export default OrderformWrapper
