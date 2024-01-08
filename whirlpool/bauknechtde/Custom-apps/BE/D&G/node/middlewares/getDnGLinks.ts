//@ts-nocheck

import { DnGLink, DnGLinks } from "../typings/dngLink";

export async function getDnGLinks(ctx: Context, next: () => Promise<any>){
  try{
    let order = await ctx.clients.Vtex.getOrder(ctx.vtex.route.params.orderId);
    let res: DnGLinks = {
      orderId: order.orderId,
      items: []
    }
    order.items.forEach(i => {
      let hasStandardWarr = i.bundleItems?.find(b => b.additionalInfo.offeringTypeId==ctx.state.appSettings.vtex.legalWarrantyId);
      hasStandardWarr = hasStandardWarr ? true : false;
      let hasExtendedWarr = i.bundleItems?.find(b => b.additionalInfo.offeringTypeId==ctx.state.appSettings.vtex.extendedWarrantyId);
      hasExtendedWarr = hasExtendedWarr ? true : false;
      let item: DnGLink = {
        id: i.id,
        productId: i.productId,
        uniqueId: i.uniqueId,
        dngLinkStandardWarr: hasStandardWarr ? "/app/dng/redirect/"+order.orderId+"/"+i.uniqueId+"/"+ctx.state.appSettings.vtex.legalWarrantyId : undefined,
        dngLinkExtendedWarr: hasExtendedWarr ? "/app/dng/redirect/"+order.orderId+"/"+i.uniqueId+"/"+ctx.state.appSettings.vtex.extendedWarrantyId : undefined,
      }
      res.items.push(item);
    })
    ctx.status = 200;
    ctx.body = res;
  }catch(err){
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}
