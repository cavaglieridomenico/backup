import { getOrderIdByCtx } from "../utils/functions";

export async function checkBlackList(ctx: Context | StatusChangeContext, next: () => Promise<any>) {
  ctx.state.orderId = getOrderIdByCtx(ctx);
  let blackList = ctx.state.appSettings.vtex.mpOrderBlackList?.split(";");
  blackList = blackList ? blackList : [];
  let orderBelongsToBL = false;
  for (let i = 0; i < blackList?.length && !orderBelongsToBL; i++) {
    if (ctx.state.orderId.includes(blackList[i])) {
      orderBelongsToBL = true;
    }
  }
  if (!orderBelongsToBL) {
    await next();
  }else{
    console.info(`Order ${ctx.state.orderId} skipped because it belongs to the black list`);
    (ctx as Context).status = 403;
    (ctx as Context).body = "Forbidden Access";
  }
}
