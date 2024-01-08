import React, { useEffect, useState } from "react"
import { useItemContext } from "./ItemContext"
import style from "./productList.css"
import { useQuery } from "react-apollo"
import getProductsProperties from "../../../graphql/productsProperties.graphql"
import {useOrder} from "../../../providers/orderform"
import { useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
	inStock: {
		defaultMessage: "In stock",
		id: "checkout-io.inStock-label",
	},
})

interface ProductTitleWithStockProps {
	showLeadTime: boolean
    props: any
	showInStockAndLeadtime: boolean
	salesChannelData?: Array<SalesChannel> | []
}
interface SalesChannel {
	salesChannel: number
	prefix: string
}

const ProductTitleWithStock: StorefrontFunctionComponent<ProductTitleWithStockProps> = ({
	showLeadTime,
	showInStockAndLeadtime,
	salesChannelData = []
}) => {
	const { item, leadtime  } = useItemContext()
    const { data, error, loading } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: item?.id,
		},
	})
    const {orderForm} = useOrder()
	const intl = useIntl()
	const [specificationSellable, setSpecificationSellable] = useState<string>("")
	const [specificationStock, setSpecificationStock] = useState<string>("")
	const [labelToShow, setLabelToShow] = useState<string>("")

	
	
    const tradePolicy = salesChannelData?.filter((data:any) => data?.salesChannel == orderForm?.salesChannel)[0]?.prefix

	const setProperLabel = () => {
		if(specificationStock && specificationSellable){
			if(specificationSellable == "true"){
				if(specificationStock.toLowerCase() == "out of stock")
					setLabelToShow(leadtime)
				else if(specificationStock.toLowerCase() == "show in stock products only")
					setLabelToShow(intl.formatMessage(messages.inStock))
			}

		}
	}
	
    useEffect(()=>{
        if(data){
            const propertiesList = data?.productsByIdentifier[0]?.properties.filter((item: any) => item.name.includes("stockavailability") || item.name.includes("sellable"))
			if(tradePolicy){
				setSpecificationSellable(propertiesList.filter((item: any)=> item.name.includes(tradePolicy) && item.name.includes("sellable"))[0]?.values[0])
				setSpecificationStock(propertiesList.filter((item: any)=> item.name.includes(tradePolicy) && item.name.includes("stockavailability"))[0]?.values[0])
			}
        }
    }, [data, error, loading])

	useEffect(()=>{
		if(specificationSellable && specificationStock){
			setProperLabel()
		}
    }, [specificationSellable, specificationStock, data])

	// const intl = useIntl()

	return (
		<>
			<a className={style.imageAndNameLink} href={item.detailUrl}>
				<div className={`${style.nameAndSubText}`}>
					<span className={style.productName}>{item.name}</span>
					<span className={style.subText}>
						{/* {intl.formatMessage(messages.subTextProductName)} */}
						{item?.additionalInfo?.brandName}
					</span>
					{showLeadTime ?					
							(<span className={style.subText2}>{leadtime}</span>) : (
								showInStockAndLeadtime && labelToShow ? (
									<div className={style.leadTimeWrapper}>
										<img src="arquivos/check-solid.svg" alt="tick-icon" className={style.leadTimeImg}/>
										<span className={style.subText2}>{labelToShow}</span>
									</div>
								) : <></>
							)
					}
				</div>
			</a>
		</>
	)
}

export default ProductTitleWithStock

ProductTitleWithStock.schema = {
	title: "Product title Properties",
	description: "Here you can set Product title Properties",
	type: "object",
	properties: {
		showLeadTime: {
			title: "Lead Time",
			description: "Choose if you want to show the Lead Time",
			default: true,
			type: "boolean",
		},
	},
}






