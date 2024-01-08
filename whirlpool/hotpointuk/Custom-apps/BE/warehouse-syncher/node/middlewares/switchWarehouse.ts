import { ProductSpecification } from "../typings/productSpecification";
import { routeToLabel, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function switchWarehouse(ctx: Context | OrderEvent, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    if (ctx.state.appSettings.vtex.switchWarehouse) {
      let stockAvailability = ctx.state.order?.salesChannel ?
        ctx.state.appSettings.vtex.stockAvailability.find(s => s.salesChannel == ctx.state.order.salesChannel) :
        ctx.state.appSettings.vtex.stockAvailability[0];
      stockAvailability = stockAvailability ? stockAvailability : ctx.state.appSettings.vtex.stockAvailability[0]; // for order placed on CC and flowing to O2P
      let specName = stockAvailability?.specificationName;
      let specValue = stockAvailability?.specificationValue?.split(":")[1];
      ctx.state.skus?.filter(s => s.warehouseSwitch)?.forEach(s => {
        ctx.clients.VtexSeller.updateStock(s.skuId, ctx.state.appSettings.vtex.outOfStockWarehouse, { unlimitedQuantity: true })
          .catch(err => ctx.vtex.logger.error(label + stringify(err.msg ? err.msg : err)))
        if (s.inStockWarehouseUpdate) {
          ctx.clients.VtexSeller.updateStock(s.skuId, ctx.state.appSettings.vtex.inStockWarehouse, { unlimitedQuantity: false, quantity: 0 })
            .catch(err => ctx.vtex.logger.error(label + stringify(err.msg ? err.msg : err)))
        }
        let prodSpec: ProductSpecification = {
          Name: specName,
          Value: [specValue]
        }
        ctx.clients.VtexSeller.updateProductSpecification(s.productId, [prodSpec])
          .catch(err => ctx.vtex.logger.error(label + stringify(err.msg ? err.msg : err)))
      })
      if (ctx.state.skus?.filter(s => s.warehouseSwitch)?.length == 0) {
        console.info("warehouse switch skipped")
      }
    } else {
      console.info("warehouse switch skipped --details: feature not enabled")
    }
  } catch (err) {
    console.error(err)
    let msg = err.msg ? err.msg : err;
    ctx.vtex.logger.error(label + stringify(msg));
  }
  await next();
}
