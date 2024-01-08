import { LINKED } from "@vtex/api"
import { Builder } from "xml2js"
import { FormatPrice } from "../utils/commonFunctions"

export async function AwinFeed(ctx: Context, next: () => Promise<any>) {
  LINKED && ctx.set('cache-control', 'no-store') //no cache when the app is linked

  const { settings, products } = ctx.state
  const sellableProducts = products.filter(p => p.properties.some(spec => spec.name == "sellable" && spec.values[0] == "true"))
  let awinProducts = sellableProducts.map(prod => {
    const awinCategory = prod.categoryTree.find(cat => cat.id.toString() == prod.categoryId.toString())?.href?.slice(1).replace(/\//g, ' > ')
    const mainImageUrl = prod.items?.[0]?.images?.[0]?.imageUrl
    const commertialOffer = prod.items?.[0]?.sellers?.[0]?.commertialOffer
    const price = commertialOffer?.Price ? `EUR ${FormatPrice(commertialOffer?.Price)}` : null
    const hasStock = commertialOffer?.AvailableQuantity > 0 || false
    const newEnergyLabel = prod.properties?.find(f => f.originalName == "new-energy-label")?.values[0]

    return price != null && hasStock && mainImageUrl ? {
      "title": prod.productName,
      "g:id": prod.items?.[0]?.itemId,
      "description": prod.description,
      "g:product_type": awinCategory,
      "g:brand": prod.brand,
      "g:mpn": prod.productReference.split('-')[0],
      "g:gtin": prod.items[0].ean,
      "link": `${settings.publicUrl}/${prod.linkText}/p`,
      "g:image_link": mainImageUrl,
      "g:price": price,
      "g:condition": "new",
      "g:shipping": settings.shippingTime,
      "g:shipping_cost": settings.shippingCost,
      "g:energy_class": prod.properties?.find(f => f.originalName == "Energieeffizienzklasse")?.values[0] || "",
      "g:energy_class_range": prod.properties?.find(f => f.originalName == "EnergyLogo_description")?.values[0] || "",
      "g:label_version": newEnergyLabel ? "new" : "old",
      "g:label_image_URL": newEnergyLabel || prod.properties?.find(f => f.originalName == "energy-label")?.values[0] || "",
      "g:official_product_sheet_URL": prod.properties?.find(f => f.originalName == "product-information-sheet")?.values[0] || "",
    } : undefined
  })

  //console.log(awinProducts.filter(p => p != undefined).length, settings.collectionId)
  const feed = {
    "rss": {
      "$": {
        "xmlns:g": "http://base.google.com/ns/1.0",
        "version": "2.0"
      },
      "title": "bauknechtde",
      "description": "Bauknecht DE export for Awin",
      "link": settings.publicUrl,
      "channel": {
        "item": awinProducts.filter(p => p != undefined)
      }
    }
  }
  let builder = new Builder({ cdata: true })
  ctx.body = builder.buildObject(feed)
  ctx.set('content-type', 'text/xml')
  ctx.status = 200
  await next()
}
