import React from 'react' //, { useState }
import { useOrder } from "itwhirlpool.order-placed/OrderContext";
import { useOrderGroup } from 'itwhirlpool.order-placed/OrderGroupContext';
import { FormattedMessage } from 'react-intl';
import { getDeliveryDate} from './utils/formatDate';
import style from './style.css';


interface billingProps {}


const Delivery: StorefrontFunctionComponent<billingProps> = ({}) => {
	const orderGroup = useOrderGroup()
	const order = useOrder()
	//if the retrieve slots request or the reserve one to FarEye, during the order, failed, then we selected a default and NOT REAL deliveryWindow. Now here in TYP we must check if we have a valid reservation code.
	const fareyeData = order?.customData?.customApps?.find((app) => app.id === "fareye");
	const isReservationCode = fareyeData?.fields?.reservationCode ?? false;
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
						delivery && isReservationCode ?
						<div>{getDeliveryDate(orderGroup.totalDeliveryParcels[0].deliveryWindow.startDateUtc, orderGroup.totalDeliveryParcels[0].deliveryWindow.endDateUtc )}</div>
						: <div><FormattedMessage id="store/billing-address-delivery-description" /></div>
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
