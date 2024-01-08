import CoBody from "co-body";
import { PARecord } from "../typings/md";
import { ProductRegistrationReq } from "../typings/ProductRegistration";
import { isValid, stringify } from "../utils/commons";
import { PAEntityFields } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { buildReqForProductregistration } from "../utils/mapper";

export async function registerProduct(ctx: Context, next: () => Promise<any>) {
  let req: ProductRegistrationReq | undefined = undefined;
  try {
    req = (await CoBody(ctx.req)) as ProductRegistrationReq;
    let vipInfo: PARecord | undefined = undefined;
    if (isValid(req.person_data.accessCode)) {
      vipInfo = (await searchDocuments(ctx, ctx.state.appSettings.vip!.mdEntityName, PAEntityFields, `accessCode=${req.person_data.accessCode}`))[0];
    }
    let crmReq = buildReqForProductregistration(ctx, req, vipInfo);
    let res = await ctx.clients.CRM.registerProduct(crmReq)
    ctx.state.logger.info(`Product Registration: request sent for the user ${req.address_data.email} --data: ${stringify(crmReq)} --res: ${stringify(res)}`)
    ctx.status = 200;
    ctx.body = "OK";
  } catch (err) {
    ctx.state.logger.error(`Product Registration: request failed for the user ${req!.address_data!.email} --data: ${stringify(req)} --err: ${stringify(err)}`)
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}
