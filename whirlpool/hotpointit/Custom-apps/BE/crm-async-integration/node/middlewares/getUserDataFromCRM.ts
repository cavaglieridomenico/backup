//@ts-nocheck

import CoBody = require("co-body");
import { ccFields } from "../utils/constants";
import { CCInfoAreEqual, mapCLInfo, mapCRMInfoToCC, mapCCToCL, mapCCToAD, ADInfoAreEqual, CLInfoAreEqual, wait, isValid } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { parse } from "../utils/XMLParser";
import { APP } from "@vtex/api";

export async function getUserDataFromCRM(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  let ccCustomer = undefined;
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    process.env.CRM = JSON.stringify(await ctx.clients.apps.getAppSettings(APP.ID));
    let authToken = ctx.cookies.get(JSON.parse(process.env.CRM).authCookie);
    let email = authToken ? (await ctx.clients.Vtex.getAuthenticatedUser(authToken)).data.user : ctx.query.email;
    ccCustomer = (await ctx.clients.masterdata.searchDocuments({ dataEntity: "CC", fields: ccFields, where: "email=" + email, pagination: { page: 1, pageSize: 100 } }))[0];
    let customer = await ctx.clients.CRM.getAccount(ccCustomer.crmBpId);
    customer = await parse(customer);
    customer = mapCRMInfoToCC(ctx, customer);
    if (!CCInfoAreEqual(customer, ccCustomer)) {
      await ctx.clients.masterdata.updatePartialDocument({ dataEntity: "CC", id: ccCustomer.id, fields: customer });
      let user = mapCCToCL(customer);
      if (!CLInfoAreEqual(user, ccCustomer)) {
        await ctx.clients.masterdata.updatePartialDocument({ dataEntity: "CL", id: ccCustomer.vtexUserId, fields: user });
      }
      let address = mapCCToAD(customer);
      if (!ADInfoAreEqual(address, ccCustomer) && isValid(addres.postalCode)) {
        if (ccCustomer.addressId != null) {
          await ctx.clients.masterdata.updatePartialDocument({ dataEntity: "AD", id: ccCustomer.addressId, fields: address });
        } else {
          address["addressType"] = "residential";
          address["userId"] = ccCustomer.vtexUserId;
          address["backflow"] = true;
          await ctx.clients.masterdata.createDocument({ dataEntity: "AD", fields: address });
        }
      }
    }
    ctx.body = "OK";
    ctx.status = 200;
    ctx.vtex.logger.info("get customer " + ccCustomer?.vtexUserId + " from CRM: OK -- data: " + JSON.stringify(customer));
  } catch (err) {
    console.log(err)
    ctx.body = "Internal error";
    ctx.status = 500;
    ctx.vtex.logger.error("get customer " + ccCustomer?.vtexUserId + " from CRM: failed -- err: " + JSON.stringify(err));
  }
  await next();
}
