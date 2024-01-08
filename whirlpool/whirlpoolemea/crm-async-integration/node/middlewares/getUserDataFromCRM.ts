import { ADEntityName, CCEntityFields, CLEntityName, maxRetry } from "../utils/constants";
import { CCInfoAreEqual, mapCCToCL, mapCCToAD, ADInfoAreEqual, CLInfoAreEqual, buildReqForDisplayConsumer, readDisplayConsumerRes } from "../utils/mapper";
import { AddressType, CCRecord } from "../typings/md";
import { createDocument, searchDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { isDefined, isValid, stringify } from "../utils/commons";
import { DisplayConsumerCRM_Response } from "../typings/crm/CRM";
import { DisplayConsumerPO_Response } from "../typings/crm/SAPPO";

export async function getUserDataFromCRM(ctx: Context | LoggedUser, next: () => Promise<any>) {  
  let authToken = undefined;
  let ccCustomer: CCRecord | undefined = undefined;  
  if (!isValid((ctx as LoggedUser).body?.eventId)) {
    (ctx as Context).set('Cache-Control', 'no-cache');
    authToken = (ctx as Context).cookies.get(ctx.state.appSettings.authCookie);
  }
  try {
    const email = isValid((ctx as LoggedUser).body?.eventId) ?
      (ctx as LoggedUser).body?.email :
      (authToken ?
        (
          await ctx.clients.Vtex.getAuthenticatedUser(authToken))?.data?.user :
        (ctx as Context).query?.email
      );
    ccCustomer = (await searchDocuments(ctx, ctx.state.appSettings.crmEntityName, CCEntityFields, `email=${email}`, { page: 1, pageSize: 10 }, false, maxRetry))[0];
    await isDefined(ccCustomer?.crmBpId, "crmBpId is null");
    let payload = buildReqForDisplayConsumer(ctx, ccCustomer!.crmBpId!);
    let customer: DisplayConsumerCRM_Response | DisplayConsumerPO_Response | CCRecord = await ctx.clients.CRM.getAccountAPI(payload);        
    customer = readDisplayConsumerRes(ctx, customer, ccCustomer!.userType)   
    if (!CCInfoAreEqual(customer as CCRecord, ccCustomer!)) {      
      await updatePartialDocument(ctx, ctx.state.appSettings.crmEntityName, ccCustomer!.id!, customer, maxRetry);
      let user = mapCCToCL(customer);
      if (!CLInfoAreEqual(user, mapCCToCL(ccCustomer!))) {
        await updatePartialDocument(ctx, CLEntityName, ccCustomer!.vtexUserId!, user, maxRetry);
      }
      let address = mapCCToAD(customer, ctx);
      if (!ADInfoAreEqual(address, mapCCToAD(ccCustomer!, ctx)) && isValid(address.postalCode)) {
        if (ccCustomer!.addressId) {
          await updatePartialDocument(ctx, ADEntityName, ccCustomer!.addressId, address, maxRetry);
        } else {
          address.addressType = AddressType.RESIDENTIAL;
          address.userId = ccCustomer!.vtexUserId;
          address.backflow = true;
          await createDocument(ctx, ADEntityName, address, maxRetry);
        }
      }
    }
    ctx.body = "OK";
    (ctx as Context).status = 200;
    ctx.state.logger.info(`get customer ${ccCustomer?.vtexUserId} from CRM: OK -- data: ${stringify(customer)}`);
  } catch (err) {
    console.error(err);
    ctx.body = "Internal Server Error";
    (ctx as Context).status = 500;
    ctx.state.logger.error(`get customer ${ccCustomer?.vtexUserId} from CRM: KO -- err: ${stringify(err.message ? err.message : err)}`);
  }
  await next();
}
