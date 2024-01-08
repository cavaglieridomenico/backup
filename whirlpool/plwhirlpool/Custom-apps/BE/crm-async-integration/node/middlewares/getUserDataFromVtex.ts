//@ts-nocheck

import { getCCdataByUserId, isValid, json2XmlCrm, json2XmlSap, stringify } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";

export async function getUserDataFromVtex(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  let useSap = JSON.parse(process.env.CRM).server === 'sap-po' ? true : false
  ctx.vtex.logger = new CustomLogger(ctx);
  if (isValid(ctx.query.id as string)) {
    try {
      let customer = await getCCdataByUserId(ctx, ctx.query.id as string)
      let response = {}
      Object.keys(customer).forEach(k => {
        if (k != "addressId" && k != "id" && k != "vtexUserId" && k != "crmBpId") {
          response[k] = customer[k];
        }
      })
      if (useSap) {
        response = json2XmlSap(ctx, response);
      } else {
        response = json2XmlCrm(ctx, response);
      }

      ctx.res.setHeader("Content-Type", "text/xml");
      ctx.body = response;
      ctx.status = 200;
      ctx.vtex.logger.info("get user " + ctx.query.id + " from Vtex: OK -- data: " + JSON.stringify(response));
    } catch (err) {
      console.log(err)
      ctx.body = "Internal Server Error";
      ctx.status = 500;
      ctx.vtex.logger.error("get user " + ctx.query.id + " from Vtex: failed -- err: " + stringify(err));
    }
  } else {
    ctx.body = "Bad Request";
    ctx.status = 400;
  }
  await next();
}
