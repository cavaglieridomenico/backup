import React, { useEffect, useState } from "react"
import useItemContext from "../../../ItemContext"
import { useOrder } from "../../../providers/orderform"
import AdditionalServicesWrapper from "./AdditionalServicesWrapper"
import { AdditionalServicesProps, Service } from "./utils/interfaces"
import { useAppSettings } from "../../../providers/appSettings"

const AdditionalServices: StorefrontFunctionComponent<AdditionalServicesProps> = ({
	tooltipTexts,
	installationModal = false,
	tradepolicyWorkspace = 0,
	fixedServiceTypeIds = [],
	IncludedOfferings = [
		// {
		// 	OfferingName: "Consegna al piano",
		// 	TootltipText: "Consegna al piano gratuita e su appuntamento.",
		// }
	],
}) => {
	const { orderForm } = useOrder()
	const { offerings, itemIndex, item } = useItemContext()
	const [multilanguageOfferings, setMultilanguageOfferings] = useState<any>(
		undefined,
	)
	const {
		appSettings: { isMultilanguage },
	} = useAppSettings()

	const tradePolicy =
		orderForm?.salesChannel == "1" || tradepolicyWorkspace == 1
			? "EPP"
			: orderForm?.salesChannel == "2" || tradepolicyWorkspace == 2
			? "FF"
			: orderForm?.salesChannel == "3" || tradepolicyWorkspace == 3
			? "VIP"
			: "O2P"

	const availableServices: Service[] = offerings?.filter((offering: any) => {
		// o2p services are the ones without "_" sign, others have tradePolicy name inside them
		if (tradePolicy == "O2P") return !offering.name.includes("_")
		else return offering.name.includes(tradePolicy)
	})

	//Insert the IncludedOffering inside offerings array
	availableServices.unshift(...IncludedOfferings)

	const availableServicesWithInfos = availableServices.map(
		(service: any, index: number) =>
			!service.description
				? {
						...service,
						description:
							tooltipTexts?.find(tooltip =>
								service.name?.toLowerCase().includes(tooltip.addServiceName),
							)?.tooltipText || "",
						position: index,
				  }
				: service,
	)

	const lowercaseKeys = (obj: any) =>
		Object.keys(obj).reduce((acc: any, key: any) => {
			acc[key.toLowerCase()] = obj[key]
			return acc
		}, {})

	useEffect(() => {
		if (isMultilanguage) {
			const locale = orderForm?.clientPreferencesData?.locale || "it-IT"
			const productId = item?.id
			fetch(
				`/_v/wrapper/api/product/${productId}/customAdditionalServices?sc=${orderForm?.salesChannel}&locale=${locale}`,
			)
				.then((response: any) => response.json())
				.then((data: any) => {
					setMultilanguageOfferings(
						data.map((offering: any) => {
							offering.Price = offering.Price.toString().replace(".", "")
							offering.ListPrice = offering.ListPrice.toString().replace(
								".",
								"",
							)
							return lowercaseKeys(offering)
						}),
					)
				})
				.catch(err => {
					setMultilanguageOfferings(null)
					console.error(err)
				})
		}
	}, [offerings])

	return (
		<>
			<AdditionalServicesWrapper
				services={
					!isMultilanguage ? availableServicesWithInfos : multilanguageOfferings
				}
				installationModal={installationModal}
				itemIndex={itemIndex}
				item={item}
				fixedServiceTypeIds={fixedServiceTypeIds}
			/>
		</>
	)
}

AdditionalServices.schema = {
	title: "Additional services app",
	description:
		"Here you can show/hide and customize your additional services tooltip text",
	type: "object",
	properties: {
		installationId: {
			title: "Installation service Id",
			description: "Here you have to insert the installation service Id",
			type: "string",
		},
		tooltipTexts: {
			title: "Tooltip texts",
			description:
				"Here you can create an associacion between the Add. services Id and their tooltip text",
			type: "array",
			items: {
				title: "TITLE",
				properties: {
					addServiceName: {
						title: "Additional Service Name",
						description: "Insert the additional service name",
						type: "string",
						default: "",
					},
					tooltipText: {
						title: "Tooltip text",
						description: "Insert the additional service tooltip text",
						type: "string",
						default: "",
					},
				},
			},
		},
	},
}

export default AdditionalServices
