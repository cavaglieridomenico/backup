import React from 'react' //, { useState }
import { useOrderGroup } from 'itwhirlpool.order-placed/OrderGroupContext'
import { getDeliveryDate} from './utils/formatDate'
import style from './style.css'


interface billingProps {}


const Delivery: StorefrontFunctionComponent<billingProps> = ({}) => {
	const orderGroup = useOrderGroup()
	let delivery;
	orderGroup.totalDeliveryParcels[0].deliveryWindow == null || new Date(orderGroup.totalDeliveryParcels[0].deliveryWindow.endDateUtc).getHours().toString() === '3' && new Date(orderGroup.totalDeliveryParcels[0].deliveryWindow.startDateUtc).getHours().toString() === '3' ? delivery = false : delivery = true;
	let deliveryTitle = delivery ? 'Consegna programmata' : 'Consegna'

	return (
		<>
			<div className={style.dateContainer}>
				<div>
					<p className={style.deliveryTitle}>{deliveryTitle}</p>
				</div>
				<div className={style.delivery}>
					{
						delivery ?
						<div>{getDeliveryDate(orderGroup.totalDeliveryParcels[0].deliveryWindow.startDateUtc, orderGroup.totalDeliveryParcels[0].deliveryWindow.endDateUtc )}</div>
					: <div> Verrai contattato dal fornitore </div>
					}
				</div>
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
