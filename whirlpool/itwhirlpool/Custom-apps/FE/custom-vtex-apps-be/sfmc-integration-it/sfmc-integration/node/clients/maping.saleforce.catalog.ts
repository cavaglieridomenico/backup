export function catalogSalesforce(sku: any, price: any, inventory: any, category: any, ctx: Context, imageSingle: any) {
    const image = sku.Images.find((i: any) => i.ImageName === imageSingle.Label)?.ImageUrl
    return {
        item_type: "product",
        unique_id: sku.AlternateIds.RefId,
        item: sku.ProductSpecifications.find((f: any) => f.FieldName === 'CommercialCode_field')?.FieldValues[0],
        productCategory: category.AdWordsRemarketingCode,
        name: sku.ProductName,
        url: ('https://' + ctx.vtex.host + sku.DetailUrl),
        image_url: image,
        price: price[0].listPrice,
        sale_price: price[0].value,
        quantity: inventory.availableQuantity,
        available: inventory.availableQuantity > sku.ProductSpecifications.find((f: any) => f.FieldName === 'minimumQuantityThreshold')?.FieldValues[0] ? 'Y' : 'N',
        product_availability: "it_it",
        productDescription: sku.ProductName,
        brandName: sku.BrandName,
        // locale_it_it_name: null,
        // locale_it_it_url: null,
        // locale_it_it_image_url: null,
        // locale_it_it_price: null,
        // locale_it_it_sale_price: null,
        // locale_it_it_quantity:null,
        // locale_it_it_productDescription: null,
        // locale_it_it_brandName: null
    }

}

// function getUniqIdSplite(uniqueId: string): string {
//     return uniqueId.split('-')[0]
// }

