import React, { useEffect, useState } from "react"
import { useItemContext } from "./ItemContext"
import style from "./productList.css"
import { useQuery } from "react-apollo"
import getProductsProperties from "../../../graphql/productsProperties.graphql"
import { useOrder } from "../../../providers/orderform"


// import { useIntl, defineMessages } from 'react-intl'

// const messages = defineMessages({
//   subTextProductName: {
//     defaultMessage: 'Sold and shipped by Whirlpool',
//     id: 'checkout-io.cart.sub-text-product-name',
//   },
// })

interface ProductTitleWithStockProps {
  showLeadTime: boolean
  props: any,
  applyTradePlaceLogic: boolean,
  showBrand: boolean
}

const ProductTitleWithStock: StorefrontFunctionComponent<ProductTitleWithStockProps> = ({
  showLeadTime,
  applyTradePlaceLogic = false,
  showBrand = true
}) => {
  const { item, leadtime } = useItemContext()
  const { data, error, loading } = useQuery(getProductsProperties, {
    variables: {
      field: "sku",
      values: item?.id,
    },
  })
  const { orderForm } = useOrder()
  const [specificationSellable, setSpecificationSellable] = useState<string>("")
  const [specificationStock, setSpecificationStock] = useState<string>("")
  const [labelToShow, setLabelToShow] = useState<string>("")


  const tradePolicy =
    orderForm?.salesChannel == "1"
      ? "EPP"
      : orderForm?.salesChannel == "2"
        ? "FF"
        : orderForm?.salesChannel == "3"
          ? "VIP"
          : "O2P"

  const setProperLabel = () => {
    if (specificationStock && specificationSellable) {
      if (specificationSellable == "true") {
        if (specificationStock.toLowerCase() == "out of stock")
          setLabelToShow(leadtime)
        else if (specificationStock.toLowerCase() == "show in stock products only")
          setLabelToShow("✓ In stock")
      }

    }
  }

  useEffect(() => {
    if (data) {
      const propertiesList = data?.productsByIdentifier[0]?.properties.filter((item: any) => item.name.includes("stockavailability") || item.name.includes("stockAvailability") || item.name.includes("sellable"))
      if (applyTradePlaceLogic) {
        setSpecificationSellable(propertiesList.filter((item: any) => item.name.includes(tradePolicy) && item.name.includes("sellable"))[0]?.values[0])
        setSpecificationStock(propertiesList.filter((item: any) => item.name.includes(tradePolicy) && item.name.includes("stockavailability") || item.name.includes("stockAvailability"))[0]?.values[0])
      } else {
        setSpecificationSellable(propertiesList.filter((item: any) =>  item.name.includes("sellable"))[0]?.values[0])
        setSpecificationStock(propertiesList.filter((item: any) =>  item.name.includes("stockavailability") || item.name.includes("stockAvailability"))[0]?.values[0])

      }
    }
  }, [data, error, loading])

  useEffect(() => {
    if (specificationSellable && specificationStock) {
      setProperLabel()
    }
  }, [specificationSellable, specificationStock])

  // const intl = useIntl()

  return (
    <>
      <a className={style.imageAndNameLink} href={item.detailUrl}>
        <div className={`${style.nameAndSubText}`}>
          <span className={[style.productName, "c-action-terriary"].join(" ")}>{item.name}</span>
          {showBrand && (
         <span className={style.subText}>
            {/* {intl.formatMessage(messages.subTextProductName)} */}

              {item?.additionalInfo?.brandName}

          </span>
            )}
          {showLeadTime && labelToShow &&
            <span className={[style.subText,"c-action-terriary", "t-bold"].join(" ")}>{labelToShow}</span>
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
    showBrand: {
      title: "Show Brand",
      description: "Choose if you want to show the Brand",
      default: true,
      type: "boolean",
    },
  },
}






