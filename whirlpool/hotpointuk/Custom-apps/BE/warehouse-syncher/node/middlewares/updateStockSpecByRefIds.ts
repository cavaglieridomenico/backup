import { MPNotification } from "../typings/mp";
import { ProductSpecification } from "../typings/productSpecification";
import { Sku, SkuNotFound } from "../typings/sku";
import { StockStatus } from "../typings/stock";
import { getRequestPayload, resolvePromises, routeToLabel, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function updateStockSpecByRefIds(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    let request: MPNotification[] = await getRequestPayload(ctx);
    let promises: Promise<any>[] = [];
    request?.forEach(s => promises.push(ctx.clients.VtexSeller.getSkuByRefId(s.refId)));
    let skus: (Sku | SkuNotFound)[] = await resolvePromises(promises);
    skus?.filter(s => s.NotFound)?.forEach(sku => ctx.vtex.logger.warn(label + "sku " + sku.RefId + " not found"));
    request?.filter(s => skus.find(sku => sku.RefId == s.refId && !sku.NotFound))?.forEach(s => {
      let productId = (skus.find(e => e.RefId == s.refId) as Sku)?.ProductId;
      ctx.state.appSettings.vtex.stockAvailability.forEach(sa => {
        let specValues = sa.specificationValue.split(":");
        let specValue = s.status == StockStatus.OUT_OF_STOCK ? specValues[1] : specValues[0];
        let prodSpec: ProductSpecification = {
          Name: sa.specificationName,
          Value: [specValue]
        }
        ctx.clients.VtexSeller.updateProductSpecification(productId, [prodSpec])
          .catch(err => ctx.vtex.logger.error(label + stringify(err.msg ? err.msg : err)))
      })
    })
    ctx.status = 200;
    ctx.body = "OK";
  } catch (err) {
    console.error(err)
    let msg = err.msg ? err.msg : err;
    ctx.vtex.logger.error(label + stringify(msg));
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}
