import React from 'react'
import { useOrder } from 'hotpointit.order-placed/OrderContext'
import { getCreationDate} from './utils/formatDate'
import style from './style.css'


interface billingProps {}


const Delivery: StorefrontFunctionComponent<billingProps> = ({}) => {
	const order = useOrder()
	return (
		<>
			<div className={style.creationDate}>
				<span className={style.smallDate}>Data dell'ordine</span>
				<span>{getCreationDate(order.creationDate)}</span>
			</div>
		</>
	)
}

Delivery.schema = {
	title: 'editor.delivery.title',
	description: 'editor.delivery.description',
	type: 'object',
	properties: {},
}

export default Delivery
