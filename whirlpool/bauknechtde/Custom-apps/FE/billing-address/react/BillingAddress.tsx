import React, { useEffect, useState } from 'react'
import { useOrderGroup } from 'bauknechtde.order-placed/OrderGroupContext'
// import { OrderData } from './typings/orderData'
import fetchRequest from './utils/fetchRequest'
import style from './style.css'

interface invoiceData {
	pec: String
	address: BillingProps
	invoiceName: String
	fiscalCode: String
	phone: String
	requestInvoice: String
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
		address: {},
		invoiceName: '',
		fiscalCode: '',
		phone: '',
		requestInvoice: '',
	})
	const orderGroup = useOrderGroup()

	useEffect(() => {
		const { orderId } = orderGroup.orders[0]
		const email = orderGroup.orders[0].clientProfileData.email
		let requestArgs = {
			uri: `/_v/wrapper/api/oms/orders/billingaddress/${orderId}?email=${email}`,
		}
		fetchRequest(requestArgs).then((invoiceData: invoiceData) => {
			setInvoiceData(invoiceData)
		})
	}, [])

	const street = invoiceData?.address?.street?.split(',')?.[0]

	return (
		<>
			{invoiceData?.address?.postalCode ? (
				<div className={style.billingAddress}>
					<div className={style.billingInfo}>
						{orderGroup.orders[0].clientProfileData.firstName}{' '}
						{orderGroup.orders[0].clientProfileData.lastName}
					</div>
					<div className={style.billingInfo}>
						{street}, {invoiceData.address.number}
					</div>
					<div className={style.billingInfo}>
						{invoiceData.address.postalCode}, {invoiceData.address.city}
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	)
}

BillingAddress.schema = {
	title: 'editor.billing.title',
	description: 'editor.billing.description',
	type: 'object',
	properties: {},
}

export default BillingAddress
