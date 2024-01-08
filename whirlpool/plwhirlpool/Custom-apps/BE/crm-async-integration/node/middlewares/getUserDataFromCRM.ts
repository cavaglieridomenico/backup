//@ts-nocheck

import { CUSTOMERS_BUCKET, ccFields } from "../utils/constants";
import { CCInfoAreEqual, mapCRMInfoToCC, mapCCToCL, mapCCToAD, ADInfoAreEqual, CLInfoAreEqual, isValid, stringify } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { parse } from "../utils/XMLParser";
import { updatePartialObjInVbase } from "../utils/Vbase";

export async function getUserDataFromCRM(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  process.env.CRM = JSON.stringify(await ctx.clients.apps.getAppSettings(process.env.VTEX_APP_ID + ""));
  let ccCustomer = undefined;
  let customer = undefined;
  let useSap = JSON.parse(process.env.CRM).server === 'sap-po' ? true : false
  let system = useSap ? 'SAP PO' : "CRM";
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    let authToken = ctx.cookies.get(JSON.parse(process.env.CRM).authCookie);
    let email = authToken ? (await ctx.clients.Vtex.getAuthenticatedUser(authToken))?.data?.user : ctx.query.email;
    ccCustomer = (await ctx.clients.masterdata.searchDocuments({ dataEntity: "CC", fields: ccFields, where: "email=" + email, pagination: { page: 1, pageSize: 100 } }))[0];
    if (!useSap) {
      customer = await ctx.clients.CRM.getAccount(ccCustomer?.crmBpId);
    } else {
      customer = await ctx.clients.SAPPO.getAccount(ccCustomer?.crmBpId);
    }
    customer = await parse(customer);
    customer = mapCRMInfoToCC(ctx, customer, ccCustomer?.userType);
    if (!CCInfoAreEqual(customer, ccCustomer)) {
      await ctx.clients.masterdata.updatePartialDocument({ dataEntity: "CC", id: ccCustomer.id, fields: customer });
      await updatePartialObjInVbase(ctx, CUSTOMERS_BUCKET, ccCustomer.vtexUserId, customer)
      let user = mapCCToCL(customer);
      if (!CLInfoAreEqual(user, ccCustomer)) {
        await ctx.clients.masterdata.updatePartialDocument({ dataEntity: "CL", id: ccCustomer.vtexUserId, fields: user });
      }
      let address = mapCCToAD(customer);
      if (!ADInfoAreEqual(address, ccCustomer) && isValid(address.postalCode)) {
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
    ctx.vtex.logger.info("get customer " + ccCustomer?.vtexUserId + " from " + system + ": OK -- data: " + JSON.stringify(customer));
  } catch (err) {
    console.log(err)
    ctx.body = "Internal Server Error";
    ctx.status = 500;
    ctx.vtex.logger.error("get customer " + ccCustomer?.vtexUserId + " from " + system + ": failed -- err: " + stringify(err));
  }
  await next();
}
