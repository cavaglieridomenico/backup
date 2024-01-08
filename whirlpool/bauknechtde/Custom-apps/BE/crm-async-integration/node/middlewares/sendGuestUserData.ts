//@ts-nocheck

import { CLEntityFields, CLEntityName } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { CustomLogger } from "../utils/Logger"
import { CLRecord, CCRecord, CustomApp, ProfileCustomFields } from "../typings/types"
import { isValid, json2XmlCRM, json2XmlSAPPO, mapADInfo, mapCLInfo } from "../utils/mapper";
import { parse } from "../utils/XMLParser";

// case: easy checkout disabled && guest user not registered on MD

export async function sendGuestUserData(ctx: Context | OrderEvent, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    if (ctx.state.appSettings.checkoutAsGuest) {
      let orderId = ctx.vtex?.route?.params?.orderId ? ctx.vtex.route.params.orderId : ctx.body.orderId;
      let order = (await ctx.clients.Vtex.getOrder(orderId)).data;
      let optin = order.customData?.customApps?.find(f => f.id == CustomApp.PROFILE)?.fields[ProfileCustomFields.optin];
      let userData: CLRecord = (await searchDocuments(ctx, CLEntityName, CLEntityFields, "userId=" + order.clientProfileData.userProfileId, { page: 1, pageSize: 10 }, true))[0];
      optin = optin ? (optin == "true" ? true : false) : false;

      if (!isValid(userData.firstName) && !isValid(userData.lastName) && !isValid(userData.crmBpId) && optin) {
        order.clientProfileData = {
          ...order.clientProfileData,
          ...{
            email: userData.email,
            isNewsletterOptIn: optin
          }
        }
        let clData = mapCLInfo(ctx, order.clientProfileData);
        let adData = mapADInfo(ctx, order.shippingData.address);
        let payload: CCRecord = {
          ...clData,
          ...adData
        }
        payload.webId = null;
        payload = ctx.state.appSettings.useSapPo ? json2XmlSAPPO(ctx, payload) : json2XmlCRM(ctx, payload);
        ctx.clients.CRM.createUpdateAccount(payload)
          .then(async (res) => {
            let crmResp = (await parse(res))["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_CREACON_MYACC.Response"]["ET_RETURN"];
            console.log(crmResp)
            ctx.vtex.logger.info("Guest user registration (order id: " + orderId + "): successful --res: " + JSON.stringify(crmResp) + " --data: " + JSON.stringify(payload))
          })
          .catch(err =>
            ctx.vtex.logger.error("Guest user registration (order id: " + orderId + "): failed --err: " + JSON.stringify(err) + " --data: " + JSON.stringify(payload))
          )
      }
    }
    ctx.status = 200;
    ctx.body = "OK"
  } catch (err) {
    //console.log(err)
    let msg = err.message ? err.message : JSON.stringify(err);
    ctx.vtex.logger.error("Guest user registration (order id: " + orderId + "): failed -- err: " + msg);
  }
  await next();
}
