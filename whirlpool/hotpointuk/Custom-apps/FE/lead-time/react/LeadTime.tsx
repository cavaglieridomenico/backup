import React from 'react'
import { useProduct } from "vtex.product-context";
import style from "./style.css";

interface LeadTimeProps {
  inStockLabel: string,
  outOfStockLabel: string,
  limitedLabel: string,
  obsoleteLabel: string,
  limitedIcon: string,
  outOfStockIcon: string,
  obsoleteIcon: string,
  inStockIcon:string,
  colorCodeObsolete: string,
  colorCodeLimited: string,
  colorCodeOutOfStock: string,
  customProduct: any,
  isPlp: boolean
}

const LeadTime: StorefrontFunctionComponent<LeadTimeProps> = ({inStockIcon, isPlp, customProduct, colorCodeObsolete, colorCodeLimited, colorCodeOutOfStock, inStockLabel = "In stock", outOfStockLabel = "Out of stock", limitedLabel = "Limited availability", obsoleteLabel = "Obsolete", limitedIcon, obsoleteIcon, outOfStockIcon }) => {
  const productContext = customProduct || useProduct()
  // console.log("productContext",productContext)
  const isOutOfStock = productContext?.product?.properties?.filter((e: any) => e.name == "stockavailability")[0]?.values[0]
  let isLeadTimeValue = productContext?.product?.properties?.filter((e: any) => e.name == "leadtime")[0]?.values[0]
  const isSellable = productContext?.product?.properties?.filter((e: any) => e.name == "sellable")[0]?.values[0]
  const availableProductQuantity = productContext?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity
  const obsolete = productContext?.product?.properties?.filter((e: any) => e.name == "status")[0]?.values[0]
  const isSparePart = productContext?.product?.properties?.filter((e: any) => e.name == "isSparePart")[0]?.values[0]
  const isAccessory = productContext?.product?.properties?.filter((e: any) => e.name == "constructionType")[0]?.values[0]
  // console.log("available quantity: ",availableProductQuantity)
  // console.log("is Sellable: ",isSellable)

  //bound lead time to 4+ weeks if the value is higher
  const leadTimeNumber = isLeadTimeValue ? isLeadTimeValue.replace(/[^0-9+]/g,'') : ""
  if(leadTimeNumber.includes('+') && parseInt(leadTimeNumber) > 4) isLeadTimeValue = "Due 4+ Weeks"


  const stringOutOfStock = "out of stock"
  // Sometimes "inStock" arrives undefined (don't know why), so we need to make sure it is defined in any case:
  if (inStockLabel === undefined || inStockLabel === "") {
    inStockLabel = "In Stock"
  }

  return (
    <>
      {isSparePart !== "true" && isAccessory !== "Accessory" && (
        <>

          {isSellable === "true" && availableProductQuantity > 0 ? (
            isOutOfStock && stringOutOfStock && (isOutOfStock.toUpperCase() === stringOutOfStock.toUpperCase()) ?
              <div className={style.instock}>
                <p className={style.leadtime}>{isLeadTimeValue}</p>
              </div>
              :
              <div className={style.instock}>
                <div className={style.tick}></div>
                <p className={style.instockText}>{inStockLabel}</p>
              </div>
          )
            :
            (
              <div className={style.instock}>
                <p className={style.leadtime}><br></br></p>
              </div>
            )}
        </>
      )}
      {(isSparePart === "true" || isAccessory == "Accessory") &&  (
        <>

          {obsolete  === "obsolete" && (
            <div className={[style.status, style.obsolete, isPlp ? style.plp : ""].join(" ")} style={{backgroundColor: isPlp ? colorCodeObsolete : "inherit"}}>
              <img src={obsoleteIcon} className={style.icon}/>
              <p className={style.obsoleteText} style={{color: colorCodeObsolete}}>{obsoleteLabel}</p>
            </div>
          )}
          {obsolete !== "obsolete" && availableProductQuantity <= 0 && (
            <div className={[style.status, style.out_of_stock, isPlp ? style.plp : ""].join(" ")} style={{backgroundColor: isPlp ? colorCodeOutOfStock : "inherit"}}>
              <img src={outOfStockIcon} className={style.icon}/>
              <p className={style.outOfStockText} style={{color: colorCodeOutOfStock}}>{outOfStockLabel}</p>
            </div>
          )}
          {obsolete !== "obsolete" && (availableProductQuantity >= 1 && availableProductQuantity <= 5) && (
            <div className={[style.status, style.limited, isPlp ? style.plp : ""].join(" ")} style={{backgroundColor: isPlp ? colorCodeLimited : "inherit"}}>
              <img src={limitedIcon} className={style.icon}/>
              <p className={style.limitedText} style={{color: colorCodeLimited}}>{limitedLabel}</p>
            </div>
          )}
          {obsolete !== "obsolete" && availableProductQuantity > 5 && (
            <div className={[style.status,  isPlp ? style.plp : ""].join(" ")} style={{backgroundColor: isPlp ? "#97C969": "inherit"}}>
              <img src={inStockIcon} className={style.icon}/>
              <p className={style.instockText} >{inStockLabel}</p>
            </div>
          )}
        </>
      )}
    </>
  )
}

LeadTime.schema = {
  title: 'Lead Time Label',
  description: 'editor.leadtime.description',
  type: 'object',
  properties: {
    inStockLabel: {
      title: 'In Stock label',
      description: 'This is the label visible for in stock products',
      type: 'string',
      default: 'In Stock',
    },
    outOfStockLabel: {
      title: 'Out of  Stock label',
      description: 'This is the label visible for in out of stock products',
      type: 'string',
      default: 'Out of stock',
    },
    limitedLabel: {
      title: 'Limited label',
      description: 'This is the label visible for in limited stock products',
      type: 'string',
      default: 'Limited availability',
    },
    obsoleteLabel: {
      title: 'Obsolete label',
      description: 'This is the label visible for in obsolete products',
      type: 'string',
      default: 'Obsolete',
    },
    limitedIcon: {
      title: "Icon limited",
      description: "Icon limited",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    obsoleteIcon: {
      title: "Icon obsolete",
      description: "Icon obsolete",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    outOfStockIcon: {
      title: "Icon out of stock",
      description: "Icon out of stock",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    inStockIcon: {
      title: "Icon in stock",
      description: "Icon in stock",
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      }
    },
    colorCodeLimited: {
      title: 'Color code limited',
      description: 'Color code limited',
      type: 'string',
      default: '#000',
    },
    colorCodeOutOfStock: {
      title: 'Color code out of stock',
      description: 'Color code out of stock',
      type: 'string',
      default: '#000',
    },
    colorCodeObsolete: {
      title: 'Color code obsolete',
      description: 'Color code obsolete',
      type: 'string',
      default: '#000',
    },
  },
}

export default LeadTime

