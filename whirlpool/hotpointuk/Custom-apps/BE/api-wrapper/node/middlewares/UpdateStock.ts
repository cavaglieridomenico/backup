//@ts-nocheck

import { LogisticsInfo, Order } from "../typings/order";
import { Stock, StockAvailability, StockUpdate } from "../typings/types";
import { stockAvailabilitySpec } from "../utils/constants";
import { CustomLogger } from "../utils/customLogger";

export async function updateStock(ctx: NewOrder, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  try{
    if(ctx.state.appSettings.stockUpdate){
      let order: Order = await ctx.clients.vtexAPI.GetOrder(ctx.body.orderId);
      let distinctItems: LogisticsInfo[] = order.shippingData.logisticsInfo.filter(i => i.deliveryIds[0].warehouseId==ctx.state.appSettings.inStockWarId);
      let promises: Promise<Stock>[] =[];
      distinctItems?.forEach(i => {
        promises.push(ctx.clients.vtexAPI.getStock(order.items[i.itemIndex].id))
      })
      let skusStock = await Promise.all(promises);
      skusStock?.forEach(async(s)=> {
        let inStockBalance = s.balance.find(w => w.warehouseId==ctx.state.appSettings.inStockWarId);
        let availableStock = inStockBalance?.totalQuantity - inStockBalance?.reservedQuantity;
        availableStock = availableStock > 0 ? availableStock : 0;
        if(availableStock==0){
          let payload: StockUpdate = {
            unlimitedQuantity: true
          }
          ctx.clients.vtexAPI.updateStock(s.skuId, ctx.state.appSettings.outOfStockWarId, payload).catch(err => ctx.vtex.logger.error("New Order / Stock Update: "+err.msg))
          let prodId = order.items.find(f => f.id==s.skuId)?.productId;
          ctx.clients.vtexAPI.updateProductSpecification(prodId, [{Name: stockAvailabilitySpec, Value: [StockAvailability.OUTOFSTOCK]}]).catch(err => ctx.vtex.logger.error("New Order / Stock Update: "+err.msg))
        }
      })
    }
  }catch(err){
    //console.log(err)
    let msg = err.msg ? err.msg : JSON.stringify(err.response?.data ? err.response.data : err)
    ctx.vtex.logger.error("New Order / Stock Update: "+msg);
  }
  await next();
}
