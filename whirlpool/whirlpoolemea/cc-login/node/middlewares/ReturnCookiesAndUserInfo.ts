import { PARecord } from "../typings/MasterData";
import { TradePolicy, TradePolicyInfo } from "../typings/TradePolicy";
import { AuthHash } from "../typings/UserAuthentication";
import { CLEntityName } from "../utils/constants";
import { updatePartialDocument } from "../utils/documentCRUD";
import { isValid, parseCookie } from "../utils/functions";

export async function ReturnCookiesAndUserInfo(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  try {
    (ctx.state.cookie as string[])?.forEach(c => {
      let parsedCookie = parseCookie(c, ctx);
      ctx.cookies.set(parsedCookie.name!, parsedCookie.value, {
        expires: parsedCookie.expiration,
        domain: ctx.host,//parsedCookie.domain,
        path: "/",//parsedCookie.path,
        /*secure: parsedCookie.secure,
        sameSite: parsedCookie.samesite,
        httpOnly: parsedCookie.httponly,*/
        overwrite: true
      });
    });
    ctx.status = 200;
    ctx.state.authFlow == AuthHash.SIGNUP ?
      ctx.state.llLogger.info({ status: 200, message: "User correctly registered and logged in" }) :
      ctx.state.authFlow == AuthHash.RESETPSW ?
        ctx.state.llLogger.info({ status: 200, message: "User correctly reset the password and logged in" }) :
        ctx.state.llLogger.info({ status: 200, message: "User correctly logged in" });
    let sid = isValid(ctx.state.partner?.accessCode) ? ctx.state.partner!.accessCode : "";
    let cluster = getUserCluster(ctx.state.tradePolicyInfo!, ctx.state.partner);
    let invitations = (cluster == TradePolicy.EPP || (cluster != TradePolicy.FF && sid != ctx.state.appSettings.VIP?.invitationToken)) ? true : false;
    let canPlaceOrders = true;
    if (isValid(ctx.state.tradePolicyInfo?.ordersLimitNumber)) {
      let placedOrders: number = isValid(ctx.state.userData?.orderLimitCounter) ? ctx.state.userData!.orderLimitCounter! : 0;
      canPlaceOrders = placedOrders < ctx.state.tradePolicyInfo?.ordersLimitNumber!;
      if (!canPlaceOrders) {
        let limit = Date.parse(ctx.state.userData?.lastPlacedOrderDate!) + ctx.state.tradePolicyInfo?.ordersLimitDays! * 24 * 60 * 60 * 1000;
        if (Date.now() >= limit) {
          await updatePartialDocument(ctx, CLEntityName, ctx.state.userData?.id!, { orderLimitCounter: 0 })
          canPlaceOrders = true;
        }
      }
    }
    ctx.body = {
      userId: ctx.state.userId,
      userCluster: cluster,
      canPlaceOrders: canPlaceOrders,
      sid: sid,
      invitations: invitations
    }
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}

function getUserCluster(tradePolicyInfo: TradePolicyInfo, paRecord: PARecord | undefined): string {
  let cluster: string = TradePolicy.O2P;
  switch (tradePolicyInfo.name) {
    case TradePolicy.EPP:
      cluster = TradePolicy.EPP;
      break;
    case TradePolicy.FF:
      cluster = TradePolicy.FF;
      break;
    case TradePolicy.VIP:
      cluster = paRecord!.name!;
  }
  return cluster;
}
