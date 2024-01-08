import React, { useEffect, useState } from 'react'
import { useOrderGroup } from 'itwhirlpool.order-placed/OrderGroupContext'
// import { OrderData } from './typings/orderData'
import fetchRequest from './utils/fetchRequest'
import style from './style.css'

interface invoiceData {
	pec: String
	address: BillingProps
	invoiceName: String,
	fiscalCode: String,
	phone: String
}
interface BillingProps {
	postalCode?: String
	city?: String
	state?: String
	country?: String
	street?: String
	number?: String
	neighborhood?: String
	complement?: String
	reference?: String
}

const BillingAddress: StorefrontFunctionComponent<invoiceData> = ({}) => {

	const [invoiceData, setInvoiceData] = useState<invoiceData>({
		pec: '',
		address : {},
		invoiceName: '',
		fiscalCode: '',
		phone:''
	})
	const orderGroup = useOrderGroup()
	useEffect(() => {
		const { orderId } = orderGroup.orders[0]
		const email = orderGroup.orders[0].clientProfileData.email
		let requestArgs = {
			uri: `/_v/wrapper/api/oms/orders/billingaddress/${orderId}?email=${email.toLowerCase()}`
		}
		fetchRequest(requestArgs).then((invoiceData: invoiceData) => {
			setInvoiceData(invoiceData)
		})
	}, [])

	return (
		<div className={style.billingAddress}>
			{invoiceData.invoiceName && <div className={style.billingName}>{invoiceData.invoiceName}</div>}
			{invoiceData.address.street && <div className={style.billingInfo}>{invoiceData.address?.street}, {invoiceData.address?.number}</div>}
			{invoiceData.address.city && <div className={style.billingInfo}>{invoiceData.address?.city}, {invoiceData.address?.state} {invoiceData.address?.postalCode}, {invoiceData.address?.country}</div>}
			{invoiceData.pec && invoiceData.pec != "_" && <div className={style.billingInfo}>{invoiceData.pec}</div>}
			{invoiceData.phone && <div className={style.billingInfo}><span>t.</span><span>{invoiceData.phone}</span></div>}
			{invoiceData.fiscalCode && invoiceData.fiscalCode != "_" &&<div className={style.billingInfo}><span>Cod. fiscale:</span><span>{invoiceData.fiscalCode}</span></div>} 
		</div>
	)
}

BillingAddress.schema = {
	title: 'editor.billing.title',
	description: 'editor.billing.description',
	type: 'object',
	properties: {},
}

export default BillingAddress