//@ts-nocheck

import { vbaseBucket } from "../utils/constants";
import { retrieveItemToken } from "../utils/functions";

export async function RedirectToDnG(ctx: Context, next: () => Promise<any>) {
  try{
    let orderId = ctx.vtex.route.params.orderId;
    let itemId = ctx.vtex.route.params.itemId;
    let warrantyId = ctx.vtex.route.params.warrantyId;
    let token: string = await retrieveItemToken(ctx, orderId, itemId, warrantyId);
    ctx.set("Location", ctx.state.appSettings.dng.redirectUrl+"?id="+token);
    ctx.status = 303;
  }catch(err){
    //console.log(err)
    ctx.set("Location", ctx.state.appSettings.dng.redirectUrl);
    ctx.status = 303;
  }
  await next()
}
