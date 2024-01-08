import { ListOrder, Order } from "../typings/order";
import { orderTimeInterval } from "../utils/ordersLogic";
import { CustomLogger } from '../utils/CustomLogger';

export async function handlePendingOrders(ctx: Context, next: () => Promise<any>) {
  let logger = new CustomLogger(ctx);
  ctx.vtex.logger = logger
  try {
    const { startTime } = ctx.state.appSettings
    const timeRange = orderTimeInterval(startTime)
    let orderLists: ListOrder[] = await ctx.clients.vtexAPI.AllOrdersInRangeOfTime(timeRange, "PayPal")

    let orders: Order[] = []
    orderLists.forEach((el: ListOrder) => orders = orders.concat(el.list))
    const cancelListPromise = [];
    for (const el of orders) {
      const { paymentData, value } = await ctx.clients.vtexAPI.GetOrder(el.orderId)
      const { status } = await ctx.clients.Payments.TransactionDetails(paymentData.transactions[0].transactionId)
      if (status != "Cancelled") {
        logger.info(`[handlePendingOrders] - cancelling transaction ${paymentData.transactions[0].transactionId} on order ${el.orderId}`)
        cancelListPromise.push(ctx.clients.Payments.CancelTransaction(paymentData.transactions[0].transactionId, value))
      }
    }
    let cancelledOrders = await Promise.all(cancelListPromise)
    ctx.vtex.logger.info(cancelledOrders.length > 0 ? "Cancelled:" + " " + JSON.stringify(cancelledOrders) : "No inquired orders in timerange" + " " + timeRange)

    ctx.status = 200;
    ctx.body = "ok"
    await next()
  } catch (e) {
    ctx.vtex.logger.error('[handlePendingOrders] - Job failed')
    ctx.vtex.logger.debug(e)
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}
