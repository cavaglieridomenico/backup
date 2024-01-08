import React, { useContext, useEffect, useState } from 'react'
import { ProductContext, useProduct } from 'vtex.product-context'
import style from "./style.css"
import InfoTooltip from './utils/Tooltip'


interface SelectedItem {
	sellers: Array<{
		commertialOffer: {
			AvailableQuantity: number
		}
	}>
}
interface serviceProps {
	serviceTitle: string,
	serviceLabel1: string
	serviceLabel2: string
	serviceLabel3: string
	serviceLabel4: string
	serviceLabel5: string
}

const serviziAggiuntiviTable = {
	width: '100%',
	fontSize: '1rem',
	margin: '1rem 0',
	height: 'auto',
	overflow: 'visible'as 'visible',
	display:'flex',
	flexWrap:'wrap' as 'wrap'
}
const servAggTooltip ={
	marginLeft:'.5rem'
}
const servTitleStyle= {
	fontWeight: 700,
	fontFamily:'hotpointRegular',
	lineHeight: 1.5
}

const ServiziAggiuntiviPdp: StorefrontFunctionComponent<serviceProps> = ({serviceTitle, serviceLabel1, serviceLabel2,serviceLabel3,serviceLabel4,serviceLabel5}) => {
	const [tableRows, settableRows] = useState([])
	const [showTitle, setShowTitle] = useState(false)
	const { product } = useProduct()
	const serviceLabelList: string[] = []
	serviceLabelList.push(serviceLabel1,serviceLabel2,serviceLabel3,serviceLabel4,serviceLabel5)


	const valuesFromContext = useContext(ProductContext)
	// @ts-ignore
	const { selectedItem }: { selectedItem: SelectedItem } = valuesFromContext
	// @ts-ignore
	const { itemId: skuId } = selectedItem

	const consegnaPiano = {
    "Id": 0,
    "ServiceTypeId": 0,
    "Name": "Consegna al piano",
    "IsFile": false,
    "IsGiftCard": false,
    "IsRequired": false,
    "Options": [
        {
            "Id": 608,
            "Name": "Consegna al piano",
            "Description": "Consegna al piano",
            "PriceName": "INCLUSO",
            "ListPrice": 0,
            "Price": 0
        }
    ],
    "Attachments": []
}
	// @ts-ignore
	const isItAnAccessory = product.categories.some(path => path.includes("accessori"))
	if (isItAnAccessory) {
		return (null)
	}

	const isSellable = product.properties.filter((e: any) => e.name == "sellable")[0].values[0] == "true"
	if(!isSellable) {
		return null;
	}

	useEffect(() => {
		fetch(`/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${skuId}`, {
			method: 'GET',
		})
			.then((response) => response.json())
			.then((json) => {
				if (json.Services.length > 0) {
					json.Services.unshift(consegnaPiano)
					settableRows(json.Services)
					setShowTitle(true)
				}
			})

		return () => { }
	}, [])

	return (
		<>
			{showTitle ? <p className='service-title' style={servTitleStyle}>{serviceTitle}</p> : null}
			<div style={serviziAggiuntiviTable}>
				{tableRows.map((service: any) => (
					<div className={style.servAggRow + ' servizi-aggiuntivi-row'}>
						<div  className="servizi-aggiuntivi-key">
							{service.Options[0].Name}
						</div>
						<span style={servAggTooltip} className="servizi-aggiuntivi-tooltip">
							<InfoTooltip isOnLeft={false}  isOnTop={false}  description={serviceLabelList[service.ServiceTypeId]}/>
						</span>
						{/* <div className="servizi-aggiuntivi--value">
							{service.Options[0].Price != 0
								? `${service.Options[0].Price}${currency}`
								: 'INCLUSO'}
						</div> */}
					</div>

				))}

			</div>
		</>
	)
}

ServiziAggiuntiviPdp.schema = {
	title: 'editor.services.title',
	description: 'editor.services.description',
	type: 'object',
	properties: {
		serviceTitle: {
			title: 'Title',
			description: 'Title of the section',
			default: 'Servizi inclusi nel prezzo',
			type: 'string',
		},
		serviceLabel1: {
			title: 'Consegna',
			description: 'Label for service 1',
			default: 'Servizi 1',
			type: 'string',
		},
		serviceLabel2: {
			title: 'Installazione',
			description: 'Label for service 2',
			default: 'Servizi 2',
			type: 'string',
		},
		serviceLabel3: {
			title: 'Ritiro',
			description: 'Label for service 3',
			default: 'Servizio 3',
			type: 'string',
		},
		serviceLabel4: {
			title: 'Esperto',
			description: 'Label for service 4',
			default: 'Servizio 4',
			type: 'string',
		},
		serviceLabel5: {
			title: 'Consulenza',
			description: 'Label for service 5',
			default: 'Servizio 5',
			type: 'string',
		},
	},
}

export default ServiziAggiuntiviPdp
