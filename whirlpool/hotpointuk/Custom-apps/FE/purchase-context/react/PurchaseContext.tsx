import React, { useEffect } from 'react'
import { useOrderGroup } from 'hotpointuk.order-placed/OrderGroupContext'
import { usePixel } from 'vtex.pixel-manager'

interface PurchaseContextProps {}

const PurchaseContext: StorefrontFunctionComponent<
	PurchaseContextProps
> = ({}) => {
	const order = useOrderGroup()
	const { push } = usePixel()

	useEffect(() => {
		if (order.analyticsData) {
			let { transactionProducts } = order?.analyticsData[0]
			order?.orders[0]?.items.map((order: any) => {
				order.bundleItems.map((bundleItem: any) => {
					bundleItem.type = 'additionalService'
					transactionProducts.push(bundleItem)
				})
			})
			//Check if transactionId already present in localStorage to prevent
			//servicesPurchase firing at page reload (to have only one eec.purchase event)
			//If localStorage doesn't exist create it
			const localStorageTrIds = localStorage.getItem('__order_ids')
			let transactionIds: string[] = []
			if (!localStorageTrIds) {
				transactionIds.push(order?.analyticsData[0]?.transactionId)
				localStorage.setItem('__order_ids', JSON.stringify(transactionIds))
				push({ event: 'servicesPurchase', data: order.analyticsData[0] })
			} else {
				transactionIds = JSON.parse(localStorageTrIds)
				if (
					!transactionIds.some(
						(item: string) => item == order.analyticsData[0].transactionId,
					)
				) {
					transactionIds.push(order?.analyticsData[0]?.transactionId)
					localStorage.setItem('__order_ids', JSON.stringify(transactionIds))
					push({ event: 'servicesPurchase', data: order.analyticsData[0] })
				}
			}
		}
	}, [])

	return <></>
}

PurchaseContext.schema = {
	title: 'editor.context.title',
	description: 'editor.context.description',
	type: 'object',
	properties: {},
}

export default PurchaseContext
