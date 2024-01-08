import { MPNotification } from "../typings/mp";
import { StockStatus } from "../typings/stock";
import { maxMPNotificationRetries, maxMPNotificationWaitTime } from "../utils/constants";
import { routeToLabel, stringify, wait } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function sendNotificationtoMP(ctx: Context | OrderEvent, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    if (ctx.state.appSettings.vtex.switchWarehouse && ctx.state.appSettings.vtex.mp.enableNotification) {
      let request: MPNotification[] = []
      ctx.state.skus?.filter(s => s.warehouseSwitch)?.forEach(s => {
        request.push({
          refId: s.refId,
          status: StockStatus.OUT_OF_STOCK
        })
      })
      if (request.length > 0) {
        sendNotificationToMPWithDelayedRetry(ctx, request)
          .then(() => ctx.vtex.logger.info(label + "notification to MP sent --data: " + JSON.stringify(request)))
          .catch(err => ctx.vtex.logger.error(label + stringify(err.msg ? err.msg : err)))
      } else {
        console.info("notification to MP skipped")
      }
    } else {
      console.info("notification to MP skipped --details: feature not enabled or warehouse switch disabled")
    }
    (ctx as Context).status = 200;
    ctx.body = "OK";
  } catch (err) {
    console.error(err)
    let msg = err.msg ? err.msg : err;
    ctx.vtex.logger.error(label + stringify(msg));
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}

async function sendNotificationToMPWithDelayedRetry(ctx: Context | OrderEvent, notification: MPNotification[], retry: number = 0): Promise<any> {
  return new Promise((resolve, reject) => {
    ctx.clients.VtexMP.sentNotification(notification)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxMPNotificationRetries) {
          await wait(maxMPNotificationWaitTime);
          return sendNotificationToMPWithDelayedRetry(ctx, notification, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
        } else {
          reject(err);
        }
      })
  })
}
