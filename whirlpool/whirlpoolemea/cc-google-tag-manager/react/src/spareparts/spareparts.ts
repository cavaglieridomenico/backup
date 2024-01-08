

import { PixelMessage } from '../../typings/events' //SearchPageInfoData
import push from '../utils/push'
import { getProduct } from '../utils/product-utils'
import { Product } from '../../typings/ProductTypes'


export async function sendSparePartsEvents(e: PixelMessage) {
  const productQuery: any = await getProduct()
  const product: Product = productQuery?.data?.productData

  const getCategoryFromId = (id: string) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
  
    return fetch("/_v/wrapper/api/catalog/category/" + id, options).then(
      (response) => response.json()).then((res: any) => {
      return res?.AdWordsRemarketingCode
    });
  };

  switch (e.data.eventName) {
    case "vtex:funnelStepSpareUK": {

        push({
          event: "funnelStepUK",
          eventCategory: "Spare Parts LP Funnel",
          eventLabel: e.data.eventLabel,
          eventAction: e.data.eventAction
        })
  
        break;
      }
      case "vtex:menuFooter": {
  
        let eventLabel = window.location.origin + e.data.props[0]["eventLabel"];
  
        push({
          event: "menuFooter",
          eventCategory: "Menu and Footer Clicks",
          eventLabel,
          eventAction: e.data.props[0]["eventAction"]
        })
  
        break;
      }
      case  "vtex:secondaryLevelMenuUk": {
        let eventAction = window.location.origin + e.data.props?.[0]?.eventAction;
  
        push({
          event: "secondaryLevelMenuUk",
          eventCategory: "Search by FG Category",
          eventLabel:  e.data.props?.[0]?.eventLabel,
          eventAction
        })
        break;
      }
      case  "vtex:drawingZoomUkSpare": {
        push({
          event: "drawingZoomUk",
          eventCategory: "Technical Drawing",
          eventAction: "Zoom",
          eventLabel: e.data.eventLabel
        })
        break;
      }
      case  "vtex:searchZoomUkSpare": {
        push({
          event: "searchZoomUk",
          eventCategory: "Technical Drawing",
          eventLabel: e.data.eventLabel,
          eventAction: e.data.eventAction
        })
        break;
      }
      case "vtex:myModelNumberUkSpare" :{
        let url = window.location.href;
        let category;

        //CASE 1 - Spare parts PLP
        if(e.data.props[0].isPlp === true){
          const categoryID = window?.dataLayer?.find(data => data.event == "categoryView")?.categoryId
          category = await getCategoryFromId(categoryID)
        //CASE 2 - Spare parts PDP o Landing
        } else{
          if(url?.includes("/p")){
            category = product?.category
          } else {
            category = ''
          }
        } 
        push({
          event: "myModelNumberUk",
          eventCategory: "Where do I Find my Model Number",
          eventAction: category,
          eventLabel: `Accessories & Spare Parts - ${url}`
        })
  
        break;
      }

      case  "vtex:seeSubstituteUkSpare": {
  
        push({
          event: "seeSubstituteUk",
          eventCategory: "See Substitute",
          eventAction: e.data.eventAction
        })
        break
      }
      //FUNREQSPARE15
      case  "vtex:barCodeSpare": {

        let contactArea = ''
        const url = window.location.pathname
        const pdpRegex = /^\/[^\/]+\/p$/
        const HpRegex = /^(\/ersatzteile|\/spare-parts)$/

        if(pdpRegex.test(url)){
          contactArea = "Product page"
        } else if(HpRegex.test(url)) {
          contactArea = "Homepage"
        } else {
          contactArea = "Menu"
        }

        push({
          event: "barCode",
          eventCategory: 'Barcode Model ID',
          eventAction: e.data.eventAction || '',
          eventLabel: e.data.eventLabel || `${contactArea} - ${e.data.url}`
        })
        break
      }
      //FUNREQ67
      case  "vtex:emailMeWhenAvailableSpare": {

        const product = e.data.product

        push({
          event: "emailMeWhenAvailableSpare",
          eventCategory: 'Email Me When Available',
          eventAction: product?.productReference + " - " + product?.productName
        })
        break
      }
    }
}