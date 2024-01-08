import React, {useEffect, useState} from 'react'
import  useItemContext  from "itccwhirlpool.checkout-container-custom/ItemContext"
import  useOrder  from "itccwhirlpool.checkout-container-custom/OrderForm"
import AdditionalServicesWrapper from "./components/AdditionalServicesWrapper"
import {AdditionalServicesProps} from "./utils/interfaces"


const AdditionalServices: StorefrontFunctionComponent<AdditionalServicesProps> = ({ additionalServicesInfos, installationModal = false, tradepolicyWorkspace = 0, fixedServiceTypeIds
}) => {
  const orderForm = useOrder()
  const {offerings, itemIndex, item} = useItemContext()
  const [multilanguageOfferings, setMultilanguageOfferings] = useState<any>(undefined)

  console.log(fixedServiceTypeIds, "__ fixedServiceTypeIds add serv")

  const tradePolicy =
  (orderForm?.orderForm?.salesChannel == 1 || tradepolicyWorkspace == 1)
  ? "EPP"
  : (orderForm?.orderForm?.salesChannel == 2 || tradepolicyWorkspace == 2)
  ? "FF"
  : (orderForm?.orderForm?.salesChannel == 3|| tradepolicyWorkspace == 3)
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
    additionalServicesInfos
  }

  useEffect(()=>{
    let locale = orderForm?.clientPreferencesData?.locale || "it-IT"
    let productId = item?.id
    fetch(`/_v/wrapper/api/product/${productId}/customAdditionalServices?sc=${orderForm?.orderForm?.salesChannel}&locale=${locale}`)
    .then((response: any) => response.json())
          .then((data: any) => {
            setMultilanguageOfferings(data)})
    .catch((err)=>{
      setMultilanguageOfferings(null)
      console.error(err)
    })
    
  },[])
  
  return (
    <>
      <AdditionalServicesWrapper services={availableServices} installationModal={installationModal} itemIndex={itemIndex} item={item} tooltipProps={props} multilanguageOfferings={multilanguageOfferings} fixedServiceTypeIds={fixedServiceTypeIds} currency={orderForm?.orderForm?.storePreferencesData?.currencySymbol}/>
    </>
  )
}

AdditionalServices.schema = {
	title: "Additional services app",
	description: "Here you can show/hide and customize your additional services tooltip text",
	type: "object",
	properties: {
    additionalServicesInfos: {
      title: "AS INFOS",
      description: "DESCRIPTION for AS INFOS",
      type: "array",
            items: {                
            title: "TITLE",
              properties: {
                filterName: {
                  title: "AS filter NAME DO NOT EDIT THIS FIELD!",
                  description: "DO NOT EDIT THIS FIELD! used on code side to filter the correct service",
                  type: "string",
                  default: "",
                },
                asName: {
                  title: "AS NAME",
                  description: "Enter the AS NAME",
                  type: "string",
                  default: "",
                },
                asDescription: {
                  title: "AS Description",
                  description: "Enter the AS DESCRIPTION",
                  type: "string",
                  default: "",
                },
                asTooltip: {
                  title: "AS Tooltip",
                  description: "Check if you want to show the tooltip for this AS",
                  type: "boolean",
                  default: false,
                },
              }
            }
          }
        }
	}

export default AdditionalServices
