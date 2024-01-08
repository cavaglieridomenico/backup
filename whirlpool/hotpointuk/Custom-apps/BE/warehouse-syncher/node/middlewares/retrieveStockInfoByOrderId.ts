import { CategoryKeyword } from "../typings/category";
import { Order } from "../typings/order";
import { Stock } from "../typings/stock";
import { isValid, normalizeQuantity, resolvePromises, routeToLabel, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function retrieveStockInfoByOrderId(ctx: Context | OrderEvent, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    console.info("order data: ", isValid(ctx.vtex.eventInfo?.sender) ? { orderId: (ctx as OrderEvent).body.orderId, event: (ctx as OrderEvent).body.currentState } : { orderId: ctx.vtex.route.params.orderId, event: "manual-sending" });
    let orderId = isValid(ctx.vtex.eventInfo?.sender) ? (ctx as OrderEvent).body.orderId : ctx.vtex.route.params.orderId as string;
    ctx.state.order = flagItems(ctx, await ctx.clients.VtexSeller.getOrder(orderId));
    console.info("order items: ", ctx.state.order.items.length)
    ctx.state.order.items = ctx.state.order.items.filter(i => !i.ignore);
    console.info("valid items: ", ctx.state.order.items.length);
    let distinctSkus = new Set(ctx.state.order.items?.map((i) => i.id));
    let promises: Promise<Stock>[] = [];
    distinctSkus?.forEach(s => promises.push(ctx.clients.VtexSeller.getStock(s, ctx.state.appSettings.vtex.inStockWarehouse)));
    let stockInfo = await resolvePromises(promises);
    ctx.state.skus = [];
    (stockInfo as Stock[])?.forEach(si => {
      let totalReservations = 0;
      si.balance.forEach(r => totalReservations += r.reservedQuantity);
      let inStockInfo = si.balance.find(sku => sku.warehouseId == ctx.state.appSettings.vtex.inStockWarehouse);
      let inStockReservations = inStockInfo!.reservedQuantity;
      let physicalQuantity = inStockInfo!.totalQuantity;
      let availableQuantity = physicalQuantity - totalReservations;
      let outOfStockWarehouseEnabled = si.balance.find(b => b.warehouseId == ctx.state.appSettings.vtex.outOfStockWarehouse)?.hasUnlimitedQuantity;
      let item = ctx.state.order.items.find(i => i.id == si.skuId);
      ctx.state.skus.push({
        refId: item!.refId,
        skuId: item!.id,
        productId: item!.productId,
        physicalQuantity: normalizeQuantity(physicalQuantity),
        reservedQuantity: normalizeQuantity(inStockReservations), // in stock reservations
        warehouseSwitch: availableQuantity <= 0 && !outOfStockWarehouseEnabled,
        inStockWarehouseUpdate: ((physicalQuantity - inStockReservations) > 0) && (availableQuantity <= 0)
      });
    })
    console.info("computed stock data: ", ctx.state.skus);
    await next();
  } catch (err) {
    console.error(err);
    let msg = err.msg ? err.msg : err;
    ctx.vtex.logger.error(label + stringify(msg));
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}

function flagItems(ctx: Context | OrderEvent, order: Order): Order {
  let productsId = ctx.state.appSettings.vtex.categories.find(c => c.keyword == CategoryKeyword.PRODUCTS)?.id;
  for (let i = 0; i < order.items.length; i++) {
    let isFG = order.items[i].additionalInfo.categories.find(c => (c.id + "") == productsId) ? true : false;
    let isInStock = order.shippingData.logisticsInfo[i].deliveryIds[0].warehouseId == ctx.state.appSettings.vtex.inStockWarehouse;
    order.items[i].ignore = !isFG || !isInStock;
  }
  return order;
}
