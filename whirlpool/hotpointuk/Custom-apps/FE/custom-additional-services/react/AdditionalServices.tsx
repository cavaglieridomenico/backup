import useItemContext from "hotpointuk.checkout-container-custom/ItemContext"
import React from 'react'
import AdditionalServicesWrapper from "./components/AdditionalServicesWrapper"


interface AdditionalServicesProps {
  tooltipTexts: Array<any>
}

const AdditionalServices: StorefrontFunctionComponent<AdditionalServicesProps> = ({tooltipTexts}) => {


  const {offerings, itemIndex, item} = useItemContext()

  const availableServicesWithInfos = offerings.filter((offering:any) => !offering.name.includes("_")).map((item: any) => {
  const matchingTooltip = tooltipTexts?.find((tooltip) => tooltip.addServiceName.toLowerCase() === item.name.toLowerCase());
  const description = matchingTooltip ? matchingTooltip.tooltipText : "";
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    description: description,
  };
});
  return (
    <>
      <AdditionalServicesWrapper services={availableServicesWithInfos} installationModal={true} itemIndex={itemIndex} item={item}/>
    </>
  )
}

AdditionalServices.schema = {
  title: "Checkout Additional services",
  description: "Checkout Additional services custom app",
  type: 'object',
  properties: {
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
