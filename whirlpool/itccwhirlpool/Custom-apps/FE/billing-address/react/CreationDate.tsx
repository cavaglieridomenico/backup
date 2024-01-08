import React from 'react'
import { useOrder } from 'itccwhirlpool.order-placed-custom/OrderContext'
import { getCreationDate } from './utils/formatDate'
import { FormattedMessage } from 'react-intl'
import style from './style.css'

interface billingProps {}

const Delivery: StorefrontFunctionComponent<billingProps> = ({}) => {
	const order = useOrder()
	return (
		<>
			<div className={style.creationDate}>
				<span className={style.smallDate}>
					<FormattedMessage id="store/billing-address-date-order" />
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
