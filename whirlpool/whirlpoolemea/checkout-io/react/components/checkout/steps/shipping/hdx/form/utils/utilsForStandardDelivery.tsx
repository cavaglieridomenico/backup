export type NextDayDeliveryProps = {
    orderForm: any,
    onStandardDeliveryChanged: any
    customAccessoriesShippingLabel: string
}


export const cartProductsStatus = (products:any) => {
    let cartStatus = {
       hasFg: false,
       hasSpare: false,
       hasAccessory: false
    }

    let productCategoriesFlat;

    products.map((product:any) => {

        productCategoriesFlat = Object.values(product.productCategories);

        if(productCategoriesFlat.includes("accessories")){
            cartStatus.hasAccessory = true;
        } else if(productCategoriesFlat.includes("Spare Parts")){
            cartStatus.hasSpare = true;
        } else {
            cartStatus.hasFg = true;
        }

    })

    return cartStatus;

}

export const getStandardDeliverySlas = (logistics:any) => {

    let delivery = {
      slas: [],
      selected: ""
    }


    logistics.map((logistic:any) => {
        if(logistic.selectedSla === "Standard free" || logistic.selectedSla === "Standard charged" || logistic.selectedSla === "Second day delivery" || logistic.selectedSla === "Next day delivery"){
          delivery.slas = logistic.slas;
          delivery.selected = logistic.selectedSla
        }
    })

    return delivery;
}

export const CSS_HANDLES = [
    "shiptext",
    "deliveryText",
    "deliveryRadioGroup",
    "deliveryRadio",
    "deliveryRadioWrapper",
    "deliveryRadioInfo",
    "deliveryRadioInfoEstimate",
    "deliveryRadioInfoPrice",
    ] as const