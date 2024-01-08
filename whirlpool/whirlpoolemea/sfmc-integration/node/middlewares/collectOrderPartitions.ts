import { TotalIds } from "../typings/order";
import { OrderInfo } from "../typings/vbase";
import { ordersBucket } from "../utils/constants";
import { routeToLabel, sendAlert, stringify } from "../utils/functions";
import { deleteObjFromVbase, getObjFromVbase, saveObjInVbase } from "../utils/vbase";

export async function collectOrderPartitions(ctx: Context | StatusChangeContext, next: () => Promise<any>) {
  let label = routeToLabel(ctx);
  try {
    ctx.state.orderData = (await ctx.clients.VtexMP.getOrder(ctx.state.orderId)).data;
    let totalPayed = 0;
    ctx.state.orderData!.paymentData.transactions.forEach(t => t.payments.forEach(p => totalPayed += p.value));
    if (ctx.state.orderData!.value < totalPayed) {
      let orderInfo: OrderInfo | null = await getObjFromVbase(ctx, ordersBucket, ctx.state.orderData!.orderGroup);
      orderInfo = orderInfo ? orderInfo : { totalAmount: totalPayed, partitions: [] };
      orderInfo.partitions.push(ctx.state.orderData!);
      let sum = 0;
      orderInfo.partitions?.forEach(p => sum += p.value);
      if (orderInfo.totalAmount == sum) {
        deleteObjFromVbase(ctx, ordersBucket, ctx.state.orderData!.orderGroup);
        console.info(`New order - ${ctx.state.orderId}: partitions collected`);
        let items: any[] = [];
        let logistics: any[] = [];
        let sellers: any[] = [];
        let totalItems: number = 0;
        let totalDiscount: number = 0;
        let totalShipping: number = 0;
        let totalTax: number = 0;
        orderInfo.partitions.forEach(p => {
          p.items.forEach(i => items.push(i));
          p.shippingData.logisticsInfo.forEach(i => logistics.push(i));
          p.sellers.forEach(s => sellers.push(s));
          totalItems += p.totals.find(t => t.id.toLowerCase()==TotalIds.ITEMS)?.value || 0;
          totalDiscount += p.totals.find(t => t.id.toLowerCase()==TotalIds.DISCOUNTS)?.value || 0;
          totalShipping += p.totals.find(t => t.id.toLowerCase()==TotalIds.SHIPPING)?.value || 0;
          totalTax += p.totals.find(t => t.id.toLowerCase()==TotalIds.TAX)?.value || 0;
        });
        ctx.state.orderData!.value = orderInfo.totalAmount;
        ctx.state.orderData!.items = items;
        ctx.state.orderData!.shippingData.logisticsInfo = logistics;
        ctx.state.orderData!.shippingData.logisticsInfo.forEach((l, index) => l.itemIndex = index);
        ctx.state.orderData!.sellers = sellers;
        ctx.state.orderData!.totals.forEach(i => {
          switch(i.id.toLowerCase()){
            case TotalIds.ITEMS:
              i.value = totalItems;
              break;
            case TotalIds.DISCOUNTS:
              i.value = totalDiscount;
              break;
            case TotalIds.SHIPPING:
              i.value = totalShipping;
              break;
            case TotalIds.TAX:
              i.value = totalTax;
              break;
          }
        })

        await next();
      } else {
        await saveObjInVbase(ctx, ordersBucket, ctx.state.orderData!.orderGroup, orderInfo);
        console.info(`New order - ${ctx.state.orderId}: collecting order partitions`);
        (ctx as Context).status = 200;
        (ctx as Context).body = "OK";
      }

    } else {

      await next();
    }
  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(label + msg);
    sendAlert(ctx);
    (ctx as Context).status = 500;
    (ctx as Context).body = "Internal Server Error";
  }
}
