//@ts-nocheck
import { ACCOUNT } from "@vtex/api"
import { isValid } from "../utils/function"

export async function catalogSalesforce(sku: any, price: any, inventory: any, category: any, ctx: Context, imageSingle: any, marketPriceResponse: any, availability: boolean): Promise<Object> {
    let image = sku.Images.find((i: any) => i.ImageName === imageSingle?.Label)?.ImageUrl
    let marketPrice = price[0] != undefined ? price[0].value : 9999
    let salePrice = marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer.Price != undefined ? marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer.Price : 9999
    let promotion = 100 - (Math.round(100 * salePrice / marketPrice))
    let productType = category.FatherCategoryId != undefined ? await getProductType(ctx, category) : category.Id == 1 ? "Appliance" : category.Id == 2 ? "Accessory" : null
    let accessory_type = sku.ProductSpecifications.find((f: any) => f.FieldName === 'accessory_type')?.FieldValues[0]
    let complementaryProducts = await getComplementaryByType(ctx, sku.Id, 1)
    let similarProducts = await getComplementaryByType(ctx, sku.Id, 2)
    let accessories = await getComplementaryByType(ctx, sku.Id, 3)
    let productInfoSheet = sku.ProductSpecifications?.find(f => f.FieldName == "product-data-sheet")?.FieldValues[0];
    let energyLogo = sku.ProductSpecifications?.find(f => f.FieldName == "EnergyLogo_image")?.FieldValues[0];
    let commCode = sku.ProductSpecifications.find(f => f.FieldName == "CommercialCode_field")?.FieldValues[0];

    return new Promise<Object>((resolve, reject) => {
        resolve(
            [{
                item_type: "product",
                unique_id: sku.AlternateIds.RefId,
                item: sku.AlternateIds.RefId,
                productCategory: category.AdWordsRemarketingCode,
                name: sku.ProductName,
                url: ACCOUNT == "hotpointitqa" ? ('https://' + ctx.vtex.host + sku.DetailUrl) : ('https://www.hotpoint.it' + sku.DetailUrl),
                //url: ('https://' + ctx.vtex.host + sku.DetailUrl),
                image_url: image,
                price: marketPrice,
                sale_price: salePrice,
                EnergyLogo: isValid(energyLogo) ? energyLogo : "",
                "IT_InformationSheet": isValid(productInfoSheet) ? productInfoSheet : "",
                quantity: inventory,
                available: (inventory >= sku.ProductSpecifications.find((f: any) => f.FieldName === 'minimumQuantityThreshold')?.FieldValues[0]) && availability ? 'Y' : 'N',
                product_availability: "it_it",
                productDescription: sku.ProductDescription,
                brandName: sku.BrandName,
                "locale_it-it_name": sku.ProductName,
                "locale_it-it_ProductLink": ACCOUNT == "hotpointitqa" ? ('https://' + ctx.vtex.host + sku.DetailUrl) : ('https://www.hotpoint.it' + sku.DetailUrl),
                //"locale_it-it_ProductLink":('https://' + ctx.vtex.host + sku.DetailUrl) ,
                "locale_it-it_price": marketPrice,
                "locale_it-it_sale_price": salePrice,
                "IT_product_availability": true
            }, {
                item_type: "product",
                unique_id: sku.AlternateIds.RefId,
                item: sku.AlternateIds.RefId,
                productCategory: category.AdWordsRemarketingCode,
                name: sku.ProductName,
                url: ACCOUNT == "hotpointitqa" ? ('https://' + ctx.vtex.host + sku.DetailUrl) : ('https://www.hotpoint.it' + sku.DetailUrl),
                //url: ('https://' + ctx.vtex.host + sku.DetailUrl),
                image_url: image,
                price: marketPrice,
                sale_price: salePrice,
                EnergyLogo: isValid(energyLogo) ? energyLogo : "",
                "IT_InformationSheet": isValid(productInfoSheet) ? productInfoSheet : "",
                quantity: inventory,
                available: inventory >= sku.ProductSpecifications.find((f: any) => f.FieldName === 'minimumQuantityThreshold')?.FieldValues[0] && availability ? 'Y' : 'N',
                product_availability: "it_it",
                productDescription: sku.ProductDescription,
                brandName: sku.BrandName,
                commercial_code: commCode,
                Product_type: productType,
                Accessories_category: accessory_type != undefined ? accessory_type : "",
                Accessories: accessories,
                Similar_Product: similarProducts,
                Complementary_products: complementaryProducts,
                Manual_URL: sku.ProductSpecifications.find((f: any) => f.FieldName === 'daily-reference-guide')?.FieldValues[0] != undefined ? sku.ProductSpecifications.find((f: any) => f.FieldName === 'daily-reference-guide')?.FieldValues[0] : "",
                Promotion: promotion == 0 ? "" : promotion + "%"
            }]
        )
    })

}

async function getProductType(ctx: Context, category: any) {
    if (category.FatherCategoryId != undefined) {
        category = (await ctx.clients.Vtex.getCategory(category.FatherCategoryId)).data
        let productType: any = await getProductType(ctx, category)
        return productType
    } else {
        return category.Id == 1 ? "Appliance" : category.Id == 2 ? "Accessory" : null
    }
}

/**
 * 
 * @param ctx 
 * @param skuId 
 * @param complementaryType Type of the complement you are inserting on the SKU. The possible values are: 1 to assessor; 2 to suggestion; 3 to similar; 5 to show together.
 * @returns 
 */
async function getComplementaryByType(ctx: Context, skuId: string, complementaryType: number) {
    let complementaryProductsString = ""
    try {
        let complementaryProducts: any = (await ctx.clients.Vtex.getComplementsBySkuAndType(skuId, complementaryType)).data
        for (let i = 0; i < complementaryProducts?.ComplementSkuIds.length - 1; i++) {
            complementaryProductsString = complementaryProductsString + ((await ctx.clients.Vtex.getProductSkuAlternative(complementaryProducts?.ComplementSkuIds[i])).data)['ProductRefId'] + "|"
        }
        complementaryProductsString = complementaryProductsString + ((await ctx.clients.Vtex.getProductSkuAlternative(complementaryProducts?.ComplementSkuIds[complementaryProducts?.ComplementSkuIds.length - 1])).data)['ProductRefId']
        return complementaryProductsString
    } catch (err) {
        return complementaryProductsString
    }
}