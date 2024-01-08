import React from 'react'
import  useItemContext  from "ukccwhirlpool.checkout-container-custom/ItemContext"
import  useOrder  from "ukccwhirlpool.checkout-container-custom/OrderForm"
import AdditionalServicesWrapper from "./components/AdditionalServicesWrapper"
import {AdditionalServicesProps} from "./utils/interfaces"
import {workspaceUrl} from "./utils/utils"


const AdditionalServices: StorefrontFunctionComponent<AdditionalServicesProps> = ({
  showInstallationTooltip = true,
  showRemovalTooltip = true,
  installationTooltipLabel = "",
  removalTooltipLabel = ""
}) => {
  
  const orderForm = useOrder()
  const {offerings, itemIndex, item} = useItemContext()

  const tradePolicy =
  (orderForm?.orderForm?.salesChannel == 1 || window.location?.href?.includes(workspaceUrl))
  ? "EPP"
  : orderForm?.orderForm?.salesChannel == 2
  ? "FF"
  : orderForm?.orderForm?.salesChannel == 3
  ? "VIP"
  : "O2P"
  
  const availableServices = offerings?.filter((offering:any) => {
    // o2p services are the ones without "_" sign, others have tradePolicy name inside them
    if(tradePolicy == "O2P")
      return !offering.name.includes("_")
    else
      return offering.name.includes(tradePolicy)
  })

  const props = {
    showInstallationTooltip: showInstallationTooltip,
    showRemovalTooltip: showRemovalTooltip,
    installationTooltipLabel: installationTooltipLabel,
    removalTooltipLabel: removalTooltipLabel,
  }
  
  return (
    <>
      <AdditionalServicesWrapper services={availableServices} installationModal={true} itemIndex={itemIndex} item={item} tooltipProps={props}/>
    </>
  )
}

AdditionalServices.schema = {
	title: "Additional services app",
	description: "Here you can show/hide and customize your additional services tooltip text",
	type: "object",
	properties: {
		showInstallationTooltip: {
			title: "Installation tooltip",
			description: "Do you want to show installation tooltip?",
			default: true,
			type: "boolean",
		},
    showRemovalTooltip: {
			title: "Removal tooltip",
			description: "Do you want to show removal tooltip?",
			default: true,
			type: "boolean",
		},
    installationTooltipLabel: {
			title: "Installation tooltip",
			description: "Installation tooltip text",
			default: "",
			type: "string",
		},
    removalTooltipLabel: {
			title: "Removal tooltip",
			description: "Removal tooltip text",
			default: "",
			type: "string",
		},
	},
}

export default AdditionalServices
