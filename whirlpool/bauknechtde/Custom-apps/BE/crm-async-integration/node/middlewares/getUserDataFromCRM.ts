//@ts-nocheck

import { ADEntityName, CCEntityName, CCEntityFields, CLEntityName, maxRetry } from "../utils/constants";
import { CCInfoAreEqual, mapCRMInfoToCC, mapCCToCL, mapCCToAD, ADInfoAreEqual, CLInfoAreEqual, isValid, mapSAPPOInfoToCC, stringify } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { parse } from "../utils/XMLParser";
import { CCRecord } from "../typings/types";
import { createDocument, searchDocuments, updatePartialDocument } from "../utils/documentCRUD";

export async function getUserDataFromCRM(ctx: Context | LoggedUser, next: () => Promise<any>) {
  let authToken = undefined;
  let ccCustomer: CCRecord = undefined;
  ctx.vtex.logger = new CustomLogger(ctx);
  // (ctx as Context).request.
  if (!isValid(ctx.body?.eventId)) {
    ctx.set('Cache-Control', 'no-store');
    authToken = ctx.cookies.get(ctx.state.appSettings.authCookie);
  }
  try {
    let email = isValid(ctx.body?.eventId) ? ctx.body?.email : authToken ? (await ctx.clients.Vtex.getAuthenticatedUser(authToken))?.data?.user : (ctx as Context).query?.email;
    ccCustomer = (await searchDocuments(ctx, CCEntityName, CCEntityFields, "email=" + email, { page: 1, pageSize: 100 }, false, maxRetry))[0];
    let customer = await ctx.clients.CRM.getAccount(ccCustomer?.crmBpId);
    customer = await parse(customer);
    customer = ctx.state.appSettings.useSapPo ? mapSAPPOInfoToCC(ctx, customer, ccCustomer?.userType) : mapCRMInfoToCC(ctx, customer, ccCustomer?.userType);
    ctx.vtex.logger.debug(`customer: ${ccCustomer}`)
    if (!CCInfoAreEqual(customer, ccCustomer)) {
      await updatePartialDocument(ctx, CCEntityName, ccCustomer.id, customer, maxRetry);
      let user = mapCCToCL(customer);
      if (!CLInfoAreEqual(user, ccCustomer)) {
        await updatePartialDocument(ctx, CLEntityName, ccCustomer.vtexUserId, user, maxRetry);
      }
      let address = mapCCToAD(customer);
      if (!ADInfoAreEqual(address, ccCustomer) && isValid(address.postalCode)) {
        if (ccCustomer.addressId != null) {
          await updatePartialDocument(ctx, ADEntityName, ccCustomer.addressId, address, maxRetry);
        } else {
          address["addressType"] = "residential";
          address["userId"] = ccCustomer.vtexUserId;
          address["backflow"] = true;
          await createDocument(ctx, ADEntityName, address, maxRetry);
        }
      }
    }
    ctx.body = "OK";
    ctx.status = 200;
    ctx.vtex.logger.info("get customer " + ccCustomer?.vtexUserId + " from CRM: OK --data: " + stringify(customer));
  } catch (err) {
    console.error(err)
    ctx.body = "Internal Server Error";
    ctx.status = 500;
    let msg = err.message ? err.message : err;
    ctx.vtex.logger.error("get customer " + ccCustomer?.vtexUserId + " from CRM: failed --err: " + stringify(msg) + " --cookies " + (ctx as Context)?.get("cookie"));
  }
  await next();
}
