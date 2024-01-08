import React from 'react'
import { useOrder } from 'bauknechtde.order-placed/OrderContext'
import { getCreationDate } from './utils/formatDate'
import style from './style.css'
import { useIntl } from 'react-intl'

interface billingProps {}

const Delivery: StorefrontFunctionComponent<billingProps> = ({}) => {
	const order = useOrder()
	const intl = useIntl()
	return (
		<>
			<div className={style.creationDate}>
				<span className={style.smallDate}>
					{intl.formatMessage({
						id: 'store/billing-address.orderDate',
					})}
				</span>
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
