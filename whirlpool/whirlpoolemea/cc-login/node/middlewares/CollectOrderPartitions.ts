import { OrderInfo } from "../typings/vbase";
import { ordersBucket } from "../utils/constants";
import { isValid } from "../utils/functions";

export async function CollectOrderPartitions(ctx: Context | NewOrder, next: () => Promise<any>) {
  try {
    let orderId = isValid((ctx as NewOrder).body?.orderId) ? (ctx as NewOrder).body.orderId : ctx.vtex.route.params.orderId as string;
    ctx.state.order = await ctx.clients.vtexAPI.GetOrder(orderId);
    let totalPaied = 0;
    ctx.state.order.paymentData.transactions.forEach(t => t.payments.forEach(p => totalPaied += p.value));
    if (ctx.state.order.value < totalPaied) {
      let orderInfo: OrderInfo | null = await ctx.clients.vbase.getJSON(ordersBucket, ctx.state.order.orderGroup, true);
      orderInfo = orderInfo ? orderInfo : { totalAmount: totalPaied, partitions: [] };
      orderInfo.partitions.push(
        {
          orderId: ctx.state.order.orderId,
          value: ctx.state.order.value
        }
      );
      let sum = 0;
      orderInfo.partitions?.forEach(p => sum += p.value);
      if (orderInfo.totalAmount == sum) {
        ctx.clients.vbase.deleteFile(ordersBucket, ctx.state.order.orderGroup);
        console.info(`New order - ${orderId}: partitions collected`);
        await next();
      } else {
        await ctx.clients.vbase.saveJSON(ordersBucket, ctx.state.order.orderGroup, orderInfo);
        console.info(`New order - ${orderId}: collecting order partitions`);
        (ctx as Context).status = 200;
        (ctx as Context).body = "OK";
      }
    } else {
      await next();
    }
  } catch (err) {
    console.error(err);
    (ctx as Context).status = 500;
    (ctx as Context).body = "Internal Server Error";
  }
}
