import { POStockNotification } from "../typings/sap-po";
import { SkuData, Stock } from "../typings/stock";
import { maxPONotificationRetries, maxPONotificationWaitTime } from "../utils/constants";
import { normalizeQuantity, resolvePromises, routeToLabel, stringify, wait } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function sendNotificationToCNET(ctx: Context | OrderEvent, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    if (ctx.state.appSettings.sappo.enableNotification) {
      let notification: POStockNotification = { stock: [] };
      ctx.state.skus
        ?.filter(s => s.physicalQuantity <= ctx.state.appSettings.sappo.notificationThreshold && !s.excludeFromBackNotification)
        ?.forEach(s => notification.stock.push({ productCode: s.refId, stock: s.physicalQuantity, reserved: s.reservedQuantity }));
      if (notification.stock.length > 0) {
        sendNotificationToCNETWithDelayedRetry(ctx, notification)
          .then(() => ctx.vtex.logger.info(label + "notification to PO sent --data: " + JSON.stringify(notification)))
          .catch(err => ctx.vtex.logger.error(label + stringify(err?.msg ? err.msg : err)))
      } else {
        console.info("notification to PO skipped");
      }
    } else {
      console.info("notification to PO skipped --details: feature not enabled");
    }
  } catch (err) {
    console.error(err)
    let msg = err.msg ? err.msg : err;
    ctx.vtex.logger.error(label + stringify(msg));
  }
  await next();
}

async function sendNotificationToCNETWithDelayedRetry(ctx: Context | OrderEvent, notification: POStockNotification, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.SAPPO.callCNETWebApplication(notification)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxPONotificationRetries) {
          let promises: Promise<Stock>[] = [];
          ctx.state.skus
            .filter(sku => !sku.excludeFromBackNotification && notification.stock.find(e => e.productCode == sku.refId))
            .forEach(sku => promises.push(ctx.clients.VtexSeller.getStock(sku.skuId, ctx.state.appSettings.vtex.inStockWarehouse)));
          let stockData = await resolvePromises(promises);
          let freshData: SkuData[] = [];
          (stockData as Stock[]).forEach(s => {
            let totalReservations = 0;
            s.balance.forEach(b => totalReservations += b.reservedQuantity);
            let inStockInfo = s.balance.find(b => b.warehouseId == ctx.state.appSettings.vtex.inStockWarehouse);
            let inStockReservations = inStockInfo!.reservedQuantity;
            let physicalQuantity = inStockInfo!.totalQuantity;
            let availableQuantity = physicalQuantity - totalReservations;
            let outOfStockWarehouseEnabled = s.balance.find(b => b.warehouseId == ctx.state.appSettings.vtex.outOfStockWarehouse)?.hasUnlimitedQuantity;
            let oldData = ctx.state.skus.find(sku => sku.skuId == s.skuId);
            freshData.push({
              refId: oldData!.refId,
              skuId: oldData!.skuId,
              productId: oldData!.productId,
              physicalQuantity: normalizeQuantity(physicalQuantity),
              reservedQuantity: normalizeQuantity(inStockReservations),
              warehouseSwitch: availableQuantity <= 0 && !outOfStockWarehouseEnabled,
              inStockWarehouseUpdate: ((physicalQuantity - inStockReservations) > 0) && (availableQuantity <= 0)
            })
          })
          let freshNotification: POStockNotification = {
            stock: []
          }
          freshData?.forEach(fd => freshNotification.stock.push({ productCode: fd.refId, stock: fd.physicalQuantity, reserved: fd.reservedQuantity }));
          if (freshNotification.stock.length > 0) {
            await wait(maxPONotificationWaitTime);
            return sendNotificationToCNETWithDelayedRetry(ctx, freshNotification, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          }
        } else {
          reject(err);
        }
      })
  })
}
