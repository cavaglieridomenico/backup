import { CatalogUpdateEvent } from ".."
import { saveEventRecord } from "../utils/functions";

export async function sendPriceToGCP(ctx: CatalogUpdateEvent, next: () => Promise<any>) {
  if (!isPriceUpdate(ctx.body.PriceModified)) return //has the price been modified?
  ctx.vtex.logger.warn(`**Event** skuId:${ctx.body.IdSku} Event: ${JSON.stringify(ctx.body)}`)
  try {
    //save in entity in order to trigger the http call to the other mid
    await saveEventRecord(ctx, ctx.body.IdSku)
    await next()
  } catch (e) {
    ctx.vtex.logger.debug("[sendPriceToGCP] - Price update event ened with an error - body: " + JSON.stringify(ctx.body))
    ctx.vtex.logger.error(e)
  }
}



const isPriceUpdate = (value: string | boolean) => {
  return value === true || value === "true"
}



