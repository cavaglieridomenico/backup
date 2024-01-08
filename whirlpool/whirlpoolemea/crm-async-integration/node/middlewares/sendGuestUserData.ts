import { CLEntityFields, CLEntityName, PAEntityFields, maxRetry, NLEntityFields } from "../utils/constants";
import { createOrUpdateDocument, searchDocuments } from "../utils/documentCRUD";
import { CLRecord, CCRecord, PARecord, TradePolicy } from "../typings/md"
import { buildReqForCreateConsumer, mapADInfo, mapCLInfo, readCreateConsumerRes } from "../utils/mapper";
import { getTradePolicyById, isValid, stringify, wait } from "../utils/commons";
import { CustomAppIds, ProfileCustomFields } from "../typings/Order";
import { GCPPayload, NotificationType } from "../typings/GCP";

export async function readOrderData(ctx: OrderEvent | Context, next: () => Promise<any>) {
  try {
    if (ctx.state.appSettings.checkoutAsGuest) {
      ctx.state.orderId = ctx.state.orderId ?? (ctx.vtex?.route?.params?.orderId ? ctx.vtex.route.params.orderId as string : (ctx as OrderEvent).body.orderId);
      ctx.state.order = ctx.state.order ?? (await ctx.clients.Vtex.getOrder(ctx.state.orderId)).data;
      let email: string | undefined = ctx.state.order.customData?.customApps?.find((f: any) => f.id == CustomAppIds.PROFILE)?.fields[ProfileCustomFields.email as any]?.toLowerCase();
      let optin: string | boolean | undefined = ctx.state.order.customData?.customApps?.find((f: any) => f.id == CustomAppIds.PROFILE)?.fields[ProfileCustomFields.optin as any]?.toLowerCase();
      let profilingOptin: string | boolean | undefined = ctx.state.order.customData?.customApps?.find((f: any) => f.id == CustomAppIds.FISCALDATA)?.fields[ProfileCustomFields.profilingOptIn as any]?.toLowerCase();
      let partnerCode = ctx.state.order.customData?.customApps?.find((f: any) => f.id == CustomAppIds.PROFILE)?.fields[ProfileCustomFields.accessCode as any];
      let userData: CLRecord = (await searchDocuments(ctx, CLEntityName, CLEntityFields, `userId=${ctx.state.order.clientProfileData.userProfileId}`, { page: 1, pageSize: 10 }, true))[0];
      ctx.state.tradePolicy = getTradePolicyById(ctx, ctx.state.order.salesChannel);
      optin = optin && optin == "true" ? true : false;
      profilingOptin = profilingOptin && profilingOptin == "true" ? true : false;
      if (
        (
          (isValid(email) && userData?.email?.toLowerCase() != email) || // => ITCC - UKCC
          (!isValid(email) && isValid(userData?.email) && !isValid(userData?.firstName) && !isValid(userData?.lastName) && !isValid(userData?.crmBpId)) // => BK DE
        )
        && optin
      ) {
        ctx.state.order.clientProfileData = {
          ...ctx.state.order.clientProfileData,
          ...{
            email: email ?? userData?.email, // the second option is used only on BK DE, as the original email address is not saved in the custom data
            isNewsletterOptIn: optin,
            isProfilingOptIn: profilingOptin,
            userType: ctx.state.appSettings.isCCProject ? ctx.state.tradePolicy : undefined,
            partnerCode: ctx.state.appSettings.isCCProject ? partnerCode : undefined
          }
        }
        await next();
      } else {
        (ctx as Context).status = 200;
        (ctx as Context).body = "OK";
      }
    }
  } catch (err) {
    console.error(err);
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(`Guest user registration: failed --err: ${msg}`);
  }
}

export async function sendOrderDataToGCP(ctx: OrderEvent | Context, next: () => Promise<any>) {
  try {
    if (ctx.state.appSettings.newsletterAsGuestThroughGCP) {
      delete ctx.state.order.clientProfileData.id;
      let payload = {
        ...ctx.state.order.clientProfileData,
        ...ctx.state.order.shippingData.address
      }
      let id: string = await createOrUpdateDocument(ctx, ctx.state.appSettings.newsletterMDEntity, NLEntityFields, `email=${payload.email}`, payload);
      let gcpPayload: GCPPayload = {
        event: NotificationType.GUEST,
        userId: id
      }
      await wait(5 * 1000);
      ctx.clients.GCP.sendNotification(gcpPayload)
        .then(() => ctx.state.logger.info(`Guest user registration (order id: ${ctx.state.orderId}): OK --data: ${stringify(payload)} --notification: ${stringify(gcpPayload)}`))
        .catch(err => `Guest user registration (order id: ${ctx.state.orderId}): KO --err: ${stringify(err)} --data: ${stringify(payload)}`);
      (ctx as Context).body = "OK";
      (ctx as Context).status = 200;
    } else {
      await next();
    }
  } catch (err) {
    console.error(err);
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(`Guest user registration: failed --err: ${msg}`);
  }
}


export async function sendOrderDataToCRM(ctx: OrderEvent | Context, next: () => Promise<any>) {
  try {
    let clData = mapCLInfo(ctx, ctx.state.order.clientProfileData);
    let adData = mapADInfo(ctx, ctx.state.order.shippingData.address);
    clData.webId = null;
    let payload: CCRecord = {
      ...clData,
      ...adData
    }
    let vipInfo: PARecord | undefined = isValid(payload.partnerCode) && ctx.state.tradePolicy == TradePolicy.VIP ?
      (await searchDocuments(ctx, ctx.state.appSettings.vip?.mdEntityName!, PAEntityFields, `accessCode=${payload.partnerCode}`, { page: 1, pageSize: 10 }, false, maxRetry))[0] :
      undefined;
    let req = await buildReqForCreateConsumer(ctx, payload, vipInfo);
    ctx.clients.CRM.createUpdateAccountAPI(req)
      .then(res => {
        let crmResp = readCreateConsumerRes(ctx, res);
        ctx.state.logger.info(`Guest user registration (order id: ${ctx.state.orderId}): OK --res: ${stringify(crmResp)} --data: ${stringify(req)}`);
      })
      .catch((err: any) => ctx.state.logger.error(`Guest user registration (order id: ${ctx.state.orderId}): KO --err: ${stringify(err)} --data: ${stringify(req)}`));
    (ctx as Context).body = "OK";
    (ctx as Context).status = 200;
  } catch (err) {
    console.error(err);
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(`Guest user registration: failed --err: ${msg}`);
  }
  await next();
}
