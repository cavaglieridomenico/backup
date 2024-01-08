import { Sku, SkuNotFound } from "../typings/sku";
import { Stock, StockComputation, StockReservationRes } from "../typings/stock";
import { reservationDefaultSalesChannelId } from "../utils/constants";
import { compairQuantity, normalizeQuantity, resolvePromises, routeToLabel, stringify, wait } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function syncStockAndReservations(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    let promises: Promise<any>[] = [];
    ctx.state.reqPayload.forEach(e => {
      e.stock = normalizeQuantity(e.stock);
      e.reserved = normalizeQuantity(e.reserved);
      promises.push(ctx.clients.VtexSeller.getSkuByRefId(e.productCode, true));
    })
    let skus: SkuNotFound | Sku[] = await resolvePromises(promises);
    (skus as SkuNotFound[]).filter(sku => sku.NotFound)?.forEach(sku => ctx.vtex.logger.warn(label + "sku " + sku.RefId + " not found"));
    skus = skus.filter(sku => !sku.NotFound);
    promises = [];
    (skus as Sku[])?.forEach(s => promises.push(ctx.clients.VtexSeller.getStock(s.Id, ctx.state.appSettings.vtex.inStockWarehouse)));
    let skusStock: Stock[] = await resolvePromises(promises);
    let vtexData: StockComputation[] = [];
    skusStock?.forEach(s => {
      let productData = (skus as Sku[]).find(sku => sku.Id == s.skuId);
      let inStockInfo = s.balance.find(b => b.warehouseId == ctx.state.appSettings.vtex.inStockWarehouse);
      let physicalQuantity = normalizeQuantity(inStockInfo!.totalQuantity);
      let inStockReservations = normalizeQuantity(inStockInfo!.reservedQuantity);
      let cnetData = ctx.state.reqPayload.find(prod => prod.productCode == productData?.RefId);
      vtexData.push({
        refId: productData!.RefId,
        PackagedHeight: productData!.PackagedHeight,
        PackagedLength: productData!.PackagedLength,
        PackagedWidth: productData!.PackagedWidth,
        PackagedWeightKg: productData!.PackagedWeightKg,
        vtex: {
          skuId: s.skuId,
          ModalType: productData!.ModalType,
          productId: productData!.ProductId,
          physicalQuantity: physicalQuantity,
          reservedQuantity: inStockReservations
        },
        cnet: {
          physicalQuantity: cnetData!.stock,
          reservedQuantity: cnetData!.reserved
        },
        result: {}
      })
    })
    vtexData?.forEach(data => data = computeStockAndReservations(data));
    promises = [];
    vtexData?.forEach(data => {
      for (let i = 0; i < data.result!.missingReservations!; i++) {
        promises.push(ctx.clients.VtexSeller.createStockReservation({
          salesChannel: reservationDefaultSalesChannelId,
          autorizationExpirationTTL: ctx.state.appSettings.vtex.resExpiration,
          deliveryItemOptions: [
            {
              item: {
                id: data.vtex.skuId,
                quantity: 1,
                dimension: {
                  weight: data.PackagedWeightKg,
                  height: data.PackagedHeight,
                  width: data.PackagedWidth,
                  length: data.PackagedLength
                }
              },
              location: {
                zipCode: ctx.state.appSettings.vtex.resDefaultZipCode,
                country: ctx.state.appSettings.vtex.resDefaultCountry
              },
              slaType: ctx.state.appSettings.vtex.shippingPolicyInStockMDA // no difference between MDAs and SDAs
            }
          ]
        }))
      }
      if (data.result!.reservationsToBeCanceled! > 0) {
        promises.push(ctx.clients.VtexSeller.getStockReservations(data.vtex.skuId, ctx.state.appSettings.vtex.inStockWarehouse));
      }
    })
    let reservations: StockReservationRes[] = (await resolvePromises(promises))?.filter(resp => resp?.reservationList);
    promises = [];
    vtexData?.forEach(data => {
      if (data.vtex.physicalQuantity != data.result?.physicalQuantity) {
        promises.push(ctx.clients.VtexSeller.updateStock(data.vtex.skuId, ctx.state.appSettings.vtex.inStockWarehouse, { quantity: data.result?.physicalQuantity, unlimitedQuantity: false }));
      }
      let skuReservations = reservations.find(r => r.skuId == data.vtex.skuId)?.reservationList?.filter(r => r.LockId.split("-").length > 3); // => fake reservations
      data.result!.sendBackNotification = data.result!.sendBackNotification ? data.result!.sendBackNotification : ((skuReservations?.length ?? 0) < data.result!.reservationsToBeCanceled!);
      for (let i = 0; i < Math.min((skuReservations?.length ?? 0), data.result!.reservationsToBeCanceled!); i++) {
        promises.push(ctx.clients.VtexSeller.cancelStockReservation(skuReservations![i].LockId));
      }
    })
    await resolvePromises(promises);
    console.info("computed stock data: ", vtexData);
    promises = [];
    await wait(2000);
    vtexData?.forEach(data => promises.push(ctx.clients.VtexSeller.getStock(data.vtex.skuId, ctx.state.appSettings.vtex.inStockWarehouse)));
    skusStock = await resolvePromises(promises);
    ctx.state.skus = [];
    skusStock?.forEach(s => {
      let totalReservations = 0;
      s.balance.forEach(r => totalReservations += r.reservedQuantity);
      let inStockInfo = s.balance.find(b => b.warehouseId == ctx.state.appSettings.vtex.inStockWarehouse);
      let inStockReservations = inStockInfo!.reservedQuantity;
      let physicalQuantity = inStockInfo!.totalQuantity;
      let availableQuantity = physicalQuantity - totalReservations;
      let outOfStockWarehouseEnabled = s.balance.find(b => b.warehouseId == ctx.state.appSettings.vtex.outOfStockWarehouse)?.hasUnlimitedQuantity;
      let item = vtexData.find(i => i.vtex.skuId == s.skuId);
      ctx.state.skus.push({
        refId: item!.refId,
        skuId: item!.vtex.skuId,
        productId: item!.vtex.productId,
        physicalQuantity: normalizeQuantity(physicalQuantity),
        reservedQuantity: normalizeQuantity(inStockReservations),
        warehouseSwitch: availableQuantity <= 0 && !outOfStockWarehouseEnabled,
        inStockWarehouseUpdate: ((physicalQuantity - inStockReservations) > 0) && (availableQuantity <= 0),
        excludeFromBackNotification: !item?.result?.sendBackNotification
      });
    })
    console.info("computed notifications / warehouse switch: ", ctx.state.skus);
    await next();
  } catch (err) {
    console.error(err)
    let msg = err.msg ? err.msg : err;
    ctx.vtex.logger.error(label + stringify(msg));
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

function computeStockAndReservations(data: StockComputation): StockComputation {
  switch (compairQuantity(data.cnet.physicalQuantity, data.vtex.physicalQuantity)) {
    case 1:
      data.result!.physicalQuantity = data.vtex.physicalQuantity;
      data.result!.sendBackNotification = true;
      break;
    case 0:
      data.result!.physicalQuantity = data.vtex.physicalQuantity;
      break;
    case -1:
      data.result!.physicalQuantity = data.cnet.physicalQuantity;
      break;
  }
  switch (compairQuantity(data.cnet.reservedQuantity, data.vtex.reservedQuantity)) {
    case 1:
      data.result!.missingReservations =
        ((data.vtex.physicalQuantity - data.cnet.reservedQuantity) >= 0) ?
          (data.cnet.reservedQuantity - data.vtex.reservedQuantity) :
          (data.vtex.physicalQuantity - data.vtex.reservedQuantity);
      data.result!.reservationsToBeCanceled = 0;
      data.result!.sendBackNotification = data.result?.sendBackNotification ? data.result.sendBackNotification : ((data.vtex.physicalQuantity - data.cnet.reservedQuantity) < 0);
      break;
    case 0:
      data.result!.missingReservations = 0;
      data.result!.reservationsToBeCanceled = 0;
      data.result!.sendBackNotification = data.result?.sendBackNotification ? data.result.sendBackNotification : false;
      break;
    case -1:
      data.result!.missingReservations = 0;
      data.result!.reservationsToBeCanceled = data.vtex.reservedQuantity - data.cnet.reservedQuantity;
      data.result!.sendBackNotification = data.result!.sendBackNotification ? data.result!.sendBackNotification : null;
      break
  }
  return data;
}

