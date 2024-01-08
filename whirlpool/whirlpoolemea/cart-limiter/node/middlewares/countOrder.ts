import { AppSettings } from "../typings/config";
import { CustomError } from "../typings/exceptions";
import { CLRecord } from "../typings/md";
import { CLEntity, CLFields } from "../utils/constants";
import { searchDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { routeToLabel, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function countOrder(ctx: Context | OrderEvent, next: () => Promise<any>) {
  const logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    checkLimitAndCounterStatus(ctx.state.appSettings);
    let orderId = (ctx as OrderEvent).body?.orderId ? (ctx as OrderEvent).body.orderId : ctx.vtex.route.params.orderId as string;
    let order = await ctx.clients.Vtex.getOrder(orderId);
    let saleschannels = ctx.state.appSettings.limitOrders.salesChannels?.split(",");
    if (saleschannels?.includes(order.salesChannel)) {
      let consumer: any[] = await searchDocuments(ctx, CLEntity, CLFields.concat([ctx.state.appSettings.limitOrders.fieldNameCounter as string]), `userId=${order.clientProfileData.userProfileId}`, { page: 1, pageSize: 10 }, true);
      let placedOrders = consumer[0][ctx.state.appSettings.limitOrders.fieldNameCounter as string];
      placedOrders = placedOrders ? placedOrders : 0;
      let counter: any = {};
      counter[ctx.state.appSettings.limitOrders.fieldNameCounter as string] = placedOrders + 1;
      counter[ctx.state.appSettings.limitOrders.fieldNameDate as string] = order.creationDate;
      await updatePartialDocument(ctx, CLEntity, (consumer[0] as CLRecord).id, counter);
    } else {
      console.info("order skipped --details: unknown sales channel");
    }
    (ctx as Context).status = 200;
    (ctx as Context).body = "OK";
  } catch (err) {
    console.error(err);
    let msg = err.msg ? err.msg : stringify(err);
    msg = label + msg;
    err.message != CustomError.FEATURE_NOT_ENABLED ? logger.error(msg) : console.info("order counting skipped --details: limit or counter disabled");
    (ctx as Context).status = 500;
    (ctx as Context).body = "Internal Server Error";
  }
  await next();
}

function checkLimitAndCounterStatus(appSettings: AppSettings): void {
  if (!appSettings.limitOrders.status || !appSettings.limitOrders.counter) {
    throw new Error(CustomError.FEATURE_NOT_ENABLED);
  }
}
