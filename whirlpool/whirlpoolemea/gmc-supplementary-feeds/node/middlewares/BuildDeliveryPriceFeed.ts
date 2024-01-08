import { Builder } from "xml2js"
import { stringify } from "../utils/functions";

export async function buildDeliveryPriceXMLFeed(ctx: Context, next: () => any) {
  try {
    const feed = {
      "rss": {
        "$": {
          "xmlns:g": "http://base.google.com/ns/1.0",
          "version": "2.0"
        },
        "channel": {
          "title": ctx.state.feedSettings!.xmlFeedTitle ?? "",
          "description": ctx.state.feedSettings!.xmlFeedDescription ?? "",
          "link": ctx.state.feedSettings!.xmlFeedLink ?? "",
          "item": ctx.state.eligibleSkusContext.map(skuContext => ({
            "g:id": `${skuContext.ProductId}_${skuContext.Id}`,
            "g:shipping": {
              "g:country": "GB",
              "g:service": "Standard",
              "g:price": `${((skuContext.Services as any).find(((service: any) => service.Name === ctx.state.feedSettings!.deliveryServiceName))?.Options?.[0]?.Price)?.toFixed(2) ?? "0.00"} GBP`
            }
          }))
        }
      }
    }

    let builder = new Builder({ cdata: true })

    ctx.body = builder.buildObject(feed)
    ctx.set('content-type', 'text/xml')
    ctx.status = 200;

    await next()
  } catch (err) {
    ctx.state.logger.error(`[BUILD DELIVERY PRICE XML FEED] - ${stringify(err)}`);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}