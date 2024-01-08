import { BinaryValue, CsvColumnId, CsvColumnTitle, CsvHeader, CSVRow } from "../types/csv";
import { CustomAppIds, Order } from "../types/order";
import { isValid, resolvePromises, stringify } from "../utils/functions";

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

export async function exportOrders(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  try {
    let additionalServices = ctx.state.appSettings.addServices.map(a => a.name);
    let headers: CsvHeader[] = [
      { id: CsvColumnId.orderId, title: CsvColumnTitle.orderId },
      { id: CsvColumnId.creationDate, title: CsvColumnTitle.creationDate },
      { id: CsvColumnId.store, title: CsvColumnTitle.store },
      { id: CsvColumnId.accessCode, title: CsvColumnTitle.accessCode },
      { id: CsvColumnId.companyName, title: CsvColumnTitle.companyName },
      { id: CsvColumnId.paymentMethod, title: CsvColumnTitle.paymentMethod },
      { id: CsvColumnId.transactionId, title: CsvColumnTitle.transactionId },
      { id: CsvColumnId.itemModel, title: CsvColumnTitle.itemModel },
      { id: CsvColumnId.itemQty, title: CsvColumnTitle.itemQty },
      { id: CsvColumnId.itemSalePrice, title: CsvColumnTitle.itemSalePrice },
      { id: CsvColumnId.itemDiscountedPrice, title: CsvColumnTitle.itemDiscountedPrice },
      { id: CsvColumnId.deliveryDate, title: CsvColumnTitle.deliveryDate }
    ];
    additionalServices.forEach(a => {
      headers.push({ id: a, title: a })
      headers.push({ id: a + " - Value", title: a + " - Value" })
    })
    const csvStringifier = createCsvStringifier({
      header: headers,
      fieldDelimiter: ";"
    });
    let rows: CSVRow[] = [];
    let orderList = await ctx.clients.Vtex.orderList(ctx.query.from as string, ctx.query.to as string);
    let promises: Promise<any>[] = [];
    orderList?.forEach(o => promises.push(ctx.clients.Vtex.order(o.orderId)));
    let orders: Order[] = await resolvePromises(promises);
    let companyInfo = await ctx.clients.Vtex.listCompanies(ctx);
    for (const o of orders) {
      let store = ctx.state.appSettings.tradePolicyToStore?.find(f => f.tp == o.salesChannel)?.storeRef;
      let accessCode = o.customData?.customApps?.find(f => f.id == CustomAppIds.PROFILE)?.fields?.accessCode;
      accessCode = isValid(accessCode) ? accessCode : await ctx.clients.Vtex.getAccessCodeFromCL(ctx, o.clientProfileData?.userProfileId) ?? "";
      let companyName: string = "";
      if (isValid(accessCode)) {
        companyName = companyInfo.find(c => c.accessCode == accessCode)?.name ?? "";
      }
      o.items.forEach((i, index: any) => {
        let deliveryDate = o.shippingData.logisticsInfo[index]?.deliveryWindow ?
          o.shippingData.logisticsInfo[index]?.deliveryWindow?.startDateUtc?.split("T")[0] :
          o.shippingData.logisticsInfo[index]?.shippingEstimateDate?.split("T")[0];
        deliveryDate = deliveryDate ?? "";
        let row: CSVRow = {
          orderId: o.orderId,
          creationDate: o.creationDate.split("T")[0],
          store: store ?? o.salesChannel,
          accessCode: accessCode,
          companyName: companyName,
          paymentMethod: o.paymentData.transactions[0]?.payments[0]?.paymentSystemName,
          transactionId: o.paymentData.transactions[0]?.payments[0]?.tid,
          itemModel: i.refId,
          itemQty: i.quantity,
          itemSalePrice: i.listPrice / 100,
          itemDiscountedPrice: i.sellingPrice / 100,
          deliveryDate: deliveryDate
        }
        ctx.state.appSettings.addServices?.forEach(a => {
          let service = i.bundleItems.find(b => a.ids.split(",").includes(b.additionalInfo.offeringTypeId + ""));
          if (service) {
            row[a.name] = BinaryValue.YES;
            row[a.name + " - Value"] = service.sellingPrice / 100;
          } else {
            row[a.name] = BinaryValue.NO;
            row[a.name + " - Value"] = "";
          }
        })
        rows.push(row);
      })
    }
    let timestamp = new Date().toISOString().replace(/-/g, "").split(".")[0].replace(/:/g, "");
    ctx.status = 200;
    ctx.res.setHeader("Content-Type", "text/csv");
    ctx.res.setHeader("Content-Disposition", "attachment;filename=OMS-export-" + timestamp + ".csv");
    ctx.body = csvStringifier.getHeaderString().concat(csvStringifier.stringifyRecords(rows))
  } catch (err) {
    console.error(err);
    ctx.body = `Error while building the export --details: ${stringify(err)}`;
    ctx.status = 500;
  }

  await next();

}
