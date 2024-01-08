import { GPS_Item, GetProductSpec_Response, SkuContext } from "../typings/types";
import { CONSTRUCTION_TYPE } from "../utils/constants";
import { isGasProduct, isSideBySide, routeToLabel, stringify } from "../utils/functions";

//useful to return items' info of the order, like isGas or category
export async function getItemsInfo(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  let label = routeToLabel(ctx);
  try {
    let orderItems = ctx.state.order.items;
    let itemInfo: GPS_Item[] = []
    let distinctSkuId = new Set(ctx.state.order!.items.map(element => element.id));
    let promises: Promise<any>[] = [];
    distinctSkuId.forEach(id => {
      promises.push(ctx.clients.Vtex.getSkuContext(id))
    })
    ctx.state.skus = await Promise.all(promises);
    let mapSkuCat: { sku: any, cat: any }[] = [];
    let distinctCategoryId = orderItems.map(el => {
      let sku = ctx.state.skus.find(s => (s.Id + "") == el.id);
      let candidateCategory1 = sku?.ProductCategoryIds?.split("/").filter(f => f != "");
      let candidateCategory2 = sku?.CategoriesFullPath?.find(f => f.split("/").filter(f => f != "").length > candidateCategory1!.length)?.split("/")?.filter(f => f != "");
      let catId = candidateCategory2 ? candidateCategory2[candidateCategory2.length - 1] : candidateCategory1![candidateCategory1!.length - 1];
      mapSkuCat.push({ sku: sku?.Id, cat: catId });
      return catId;
    })
    promises = [];
    distinctCategoryId.forEach(id => {
      promises.push(ctx.clients.Vtex.getCategory(id))
    })
    let categories = await Promise.all(promises);
    for (let index = 0; index < orderItems.length; index++) {
      let item = orderItems[index]
      let sku: SkuContext = ctx.state.skus.find(f => f.Id.toString() == item.id)!;
      let catId = mapSkuCat.find(m => m.sku == sku.Id)?.cat;
      let categorySpecs = categories.find(f => f.Id.toString() == catId);
      let constructionType = sku!.ProductSpecifications.find((f: any) =>
        f.FieldName.toLowerCase() == CONSTRUCTION_TYPE.toLowerCase()
      )?.FieldValues[0]!.replace(" ", "")!.toUpperCase()!
      let it: GPS_Item = {
        skuId: item.id,
        ean: item.ean,
        index: index,
        productId: item.productId,
        refId: item.refId,
        mepCategoryId: categorySpecs.AdWordsRemarketingCode.toUpperCase(),
        categoryName: categorySpecs.Name.toUpperCase(),
        constructionType: constructionType,
        vtexCategoryId: categorySpecs.Id,
        isGas: isGasProduct(sku!, ctx.state.appSettings.Vtex_Settings.Admin.GasSpecs),
        isSideBySide: isSideBySide(ctx, sku)
      }
      itemInfo.push(it);
    }
    let response: GetProductSpec_Response = {
      items: itemInfo,
      reservationCode: ctx.state.bookingInfo.reservationCode!
    }
    ctx.status = 200;
    ctx.body = response;
    ctx.state.logger.info(`${label} data returned: ${JSON.stringify(response)}`);
  } catch (error) {
    let msg = error.msg ? error.msg : stringify(error);
    ctx.state.logger.error(`${label} ${msg}`);
    ctx.status = 500;
  }
  await next();
}
