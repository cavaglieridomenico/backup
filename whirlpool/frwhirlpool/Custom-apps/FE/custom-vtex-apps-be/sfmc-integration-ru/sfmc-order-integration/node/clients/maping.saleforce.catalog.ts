export function catalogSalesforce(sku: any, price: any, inventory:any[], category: any, ctx: Context, imageSingle: any):Promise<{}> {
    const image = sku.Images.find((i: any) => i.ImageName === imageSingle.Label)?.ImageUrl
    let returnObject = {}
    let object = {
        item_type: "product",
        unique_id: sku.AlternateIds.RefId,
        item: sku.ProductSpecifications.find((f: any) => f.FieldName === 'CommercialCode_field')?.FieldValues[0],
        productCategory: category.AdWordsRemarketingCode,
        name: sku.ProductName,
        url: ('https://' + ctx.vtex.host + sku.DetailUrl),
        image_url: image,
        price: 0,
        sale_price: 0,
        quantity: 1,
        available: 'N',
        product_availability: null,
        productDescription: sku.ProductName,
        brandName: sku.BrandName,
        a1_price: null,
        a1_sale_price: null,
        a1_quantity: null,
        ge_price: null,
        ge_sale_price: null,
        ge_quantity: null,
        a2_price: null,
        a2_sale_price: null,
        a2_quantity: null,
        locale_ru_ru_name: sku.ProductName,
        locale_ru_ru_url: ('https://' + ctx.vtex.host + sku.DetailUrl),
        locale_ru_ru_image_url: image,
        locale_ru_ru_productDescription: sku.ProductDescription,
        locale_ru_ru_brandName: sku.BrandName,
    }
console.log('Product')
    return new Promise<{}>((resolve) => {
        let cont=0
        console.log(cont)
        if (inventory.length===0){
            console.log(inventory)
            resolve(object)
        }
        inventory.forEach((inventor: { inventoryCode: string, data: {} }) => {
            cont++;
            switch (inventor.inventoryCode) {
                case '1_1': {
                    returnObject = getProductCatalogOanRegion(price, inventor.data, inventor.inventoryCode, object)
                    break
                }
                case '1_2': {
                    returnObject = getProductCatalogSecondRegion( price, inventor.data, inventor.inventoryCode, object)
                    break
                }
                case '1_3': {
                    returnObject = getProductCatalogFreeRegion( price, inventor.data, inventor.inventoryCode, object)
                    break
                }


            }
            console.log(inventory)
            console.log(cont)
            console.log('inventory.length')
            if (cont===inventory.length) {
                console.log('resolve')
                resolve(returnObject)
            }
        })
    })
}


function getProductCatalogOanRegion(price: any, inventory: any, isoCode: any, object: { a1_sale_price: null; ge_price: null; item_type: string; ge_quantity: null; available: string; productCategory: any; a2_quantity: null; price: number; product_availability: any; productDescription: string; item: any; brandName: any; unique_id: any; quantity: number; a1_price: null; image_url: any; sale_price: number; a2_sale_price: null; url: string; locale_ru_ru_image_url: any; locale_ru_ru_url: string; name: any; a1_quantity: null; ge_sale_price: null; locale_ru_ru_productDescription: any; locale_ru_ru_brandName: any; a2_price: null; locale_ru_ru_name: any }) {
    console.log(object)
    console.info(inventory.availableQuantity)
    const check = object.available
    object.a1_price = price[0]?.value
    object.a1_sale_price = price[0]?.value
    object.a1_quantity = inventory.availableQuantity > 0 ? inventory.availableQuantity : 0
    object.available = object.available == 'N' ? inventory.availableQuantity > 0 ? 'Y' : 'N' : 'N'
    object.product_availability = check === 'N' && object.available === 'Y' ? isoCode + 'ru_a1' : object.product_availability
    return object
}

function getProductCatalogSecondRegion( price: any, inventory: any, isoCode: any, object: { a1_sale_price: null; ge_price: null; item_type: string; ge_quantity: null; available: any; productCategory: any; a2_quantity: null; price: number; product_availability: any; productDescription: any; item: any; brandName: any; unique_id: any; quantity: number; a1_price: null; image_url: any; sale_price: number; a2_sale_price: null; url: string; locale_ru_ru_image_url: any; locale_ru_ru_url: string; name: any; a1_quantity: null; ge_sale_price: null; locale_ru_ru_productDescription: any; locale_ru_ru_brandName: any; a2_price: null; locale_ru_ru_name: any }) {
    const check = object?.available
    object.ge_price = price[0]?.value
    object.ge_sale_price = price[0]?.value
    object.ge_quantity = inventory.availableQuantity > 0 ? inventory.availableQuantity : object.ge_quantity
    object.available = object.available === null || object.available == 'N' ? inventory.availableQuantity > 0  ? 'Y' : 'N' : 'N'
    object.product_availability = (check == 'N' && object.available == 'Y') ? isoCode + ' ru_ge' : object.product_availability
    return object
}

function getProductCatalogFreeRegion( price: any, inventory: any, isoCode: any, object: { a1_sale_price: null; ge_price: null; item_type: string; ge_quantity: null; available: any; productCategory: any; a2_quantity: null; price: number; product_availability: any; productDescription: any; item: any; brandName: any; unique_id: any; quantity: number; a1_price: null; image_url: any; sale_price: number; a2_sale_price: null; url: string; locale_ru_ru_image_url: any; locale_ru_ru_url: string; name: any; a1_quantity: null; ge_sale_price: null; locale_ru_ru_productDescription: any; locale_ru_ru_brandName: any; a2_price: null; locale_ru_ru_name: any }) {
    const check = object.available
    object.a2_price = price[0].value
    object.a2_sale_price = price[0].value
    object.a2_quantity = inventory.availableQuantity > 0 ? inventory.availableQuantity : object.a2_quantity
    object.available = object.available == 'N' ? inventory.availableQuantity > 0 ? 'Y' : 'N' : 'N'
    object.product_availability = check === 'N' && object.available === 'Y' ? isoCode + 'ru_a2' : object.product_availability
    return object
}
