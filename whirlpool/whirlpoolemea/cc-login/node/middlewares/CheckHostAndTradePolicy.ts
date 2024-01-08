import { LINKED } from "@vtex/api";
import { json } from "co-body";
import { AppSettings } from "../typings/configs";
import { TradePolicy, TradePolicyInfo } from "../typings/TradePolicy";
import { UserAuthentication } from "../typings/UserAuthentication";
import { /*isNotUndefined,*/ isValid } from "../utils/functions";

export async function CheckHostAndTradePolicy(ctx: Context, next: () => Promise<any>) {
  try {
    let req: UserAuthentication = await json(ctx.req);
    req.email = req.email?.toLowerCase()?.trim();
    req.name = req.name?.trim();
    req.surname = req.surname?.trim();
    req.id = req.id?.trim();
    req.password = req.password?.trim();
    req.accessCode = req.accessCode?.trim();
    req.accessKey = req.accessKey?.trim();
    let grantAccess = false;
    ctx.state.tradePolicyInfo = {};
    if (ctx.host.includes(ctx.vtex.account)) { // => TEST env
      ctx.state.tradePolicyInfo = /*LINKED ?*/ getSiteInfoByHostname(ctx.state.appSettings, ctx.query.host as string) //: getSiteInfoByHostname(ctx.state.appSettings, ctx.state.appSettings.VIP!.hostname); // "else instruction" is needed for the site editor
      ctx.state.trustVIP = !LINKED; // needed for the site editor
      // await isNotUndefined(ctx.state.tradePolicyInfo?.name);
      if (!ctx.state.tradePolicyInfo?.name) throw new Error(`Unable to get trade policy info for host ${LINKED ? ctx.query.host : ctx.state.appSettings.VIP!.hostname}`)
      grantAccess = true;
    } else {
      let siteInfo = getSiteInfoByHostname(ctx.state.appSettings, ctx.host);

      if (isValid(siteInfo) && (siteInfo?.id == req?.tradePolicy || ctx.req.method == "GET")) {
        ctx.state.tradePolicyInfo = siteInfo;
        grantAccess = true;
      }
    }
    if (grantAccess) {
      ctx.state.req = req;
      await next();
    } else {
      ctx.status = 500;
      ctx.body = "Internal Server Error";
    }
  } catch (err) {
    // console.log(err, 'err')
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

function getSiteInfoByHostname(appSettings: AppSettings, reqHost: string): TradePolicyInfo | undefined {
  let result: TradePolicyInfo | undefined = undefined;
  reqHost = reqHost.toLowerCase();
  if (!appSettings.isCCProject) {
    if (reqHost == appSettings.O2P?.hostname?.toLowerCase()) {
      result = {
        id: appSettings.O2P.tradePolicyId,
        name: TradePolicy.O2P
      }
    }
  } else {
    switch (reqHost) {
      case appSettings.EPP?.hostname?.toLowerCase():
        result = {
          id: appSettings.EPP!.tradePolicyId,
          name: TradePolicy.EPP,
          ordersLimitNumber: appSettings.EPP!.ordersLimitNumber,
          ordersLimitDays: appSettings.EPP!.ordersLimitDays
        }
        break;
      case appSettings.FF?.hostname?.toLowerCase():
        result = {
          id: appSettings.FF!.tradePolicyId,
          name: TradePolicy.FF,
          ordersLimitNumber: appSettings.FF!.ordersLimitNumber,
          ordersLimitDays: appSettings.FF!.ordersLimitDays
        }
        break;
      case appSettings.VIP?.hostname?.toLowerCase():
        result = {
          id: appSettings.VIP!.tradePolicyId,
          name: TradePolicy.VIP,
          ordersLimitNumber: appSettings.VIP!.ordersLimitNumber,
          ordersLimitDays: appSettings.VIP!.ordersLimitDays
        }

        break;
    }
  }
  return result;
}
