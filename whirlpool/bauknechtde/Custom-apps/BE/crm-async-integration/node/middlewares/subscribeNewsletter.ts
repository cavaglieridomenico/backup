//@ts-nocheck

import { CCRecord } from "../typings/types";
import { CustomLogger } from "../utils/Logger";
import { json2XmlCRM, json2XmlSAPPO, mapCLInfo } from "../utils/mapper";
import { parse } from "../utils/XMLParser";

export async function subscribeNewsletter(ctx: NewsletterSubscription, next: () => Promise<any>){
  if(ctx.state.appSettings.newsletterAsGuest){
    ctx.vtex.logger = new CustomLogger(ctx);
    ctx.body.email = ctx.body.email.toLowerCase();
    let clData: CCRecord = mapCLInfo(ctx, ctx.body);
    clData.webId = null;
    let payload = ctx.state.appSettings.useSapPo ? json2XmlSAPPO(ctx, clData) : json2XmlCRM(ctx, clData);
    ctx.clients.CRM.createUpdateAccount(payload)
    .then(async(res) => {
      let crmResp = (await parse(res))["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_CREACON_MYACC.Response"]["ET_RETURN"];
      ctx.vtex.logger.info("Newsletter subscription: successful for the user "+ctx.body.email+" --res: "+JSON.stringify(crmResp)+" --data: "+JSON.stringify(payload))
    })
    .catch(err => ctx.vtex.logger.error("Newsletter subscription: failed for the user "+ctx.body.email+" --err: "+JSON.stringify(err)+" --data: "+JSON.stringify(payload)))
  }
  await next();
}
