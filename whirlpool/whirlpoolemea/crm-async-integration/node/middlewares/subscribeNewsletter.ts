import { CCRecord, PARecord, TradePolicy } from "../typings/md";
import { mapCLInfo, buildReqForCreateConsumer, readCreateConsumerRes } from "../utils/mapper";
import { PAEntityFields, maxRetry, NLEntityFields } from "../utils/constants";
import { createOrUpdateDocument, searchDocuments } from "../utils/documentCRUD";
import { isValid, stringify, wait } from "../utils/commons";
import { GCPPayload, NotificationType } from "../typings/GCP";

export async function initNLSubscription(ctx: NewsletterSubscription, next: () => Promise<any>) {
  if (ctx.state.appSettings.newsletterAsGuest || ctx.state.appSettings.newsletterAsGuestThroughGCP) {
    try {
      ctx.body.email = ctx.body.email.toLowerCase();
      await next();
    }
    catch (err) {
      console.error(err);
      let msg = err.message ? err.message : stringify(err);
      ctx.state.logger.error(`Newsletter subscription: failed --err: ${msg}`);
    }
  }
}

export async function subscribeNewsletterThroughGCP(ctx: NewsletterSubscription, next: () => Promise<any>) {
  try {
    if (ctx.state.appSettings.newsletterAsGuestThroughGCP) {
      let id: string = await createOrUpdateDocument(ctx, ctx.state.appSettings.newsletterMDEntity, NLEntityFields, `email=${ctx.body.email}`, ctx.body);
      let gcpPayload: GCPPayload = {
        event: NotificationType.GUEST,
        userId: id
      }
      await wait(5 * 1000);
      ctx.clients.GCP.sendNotification(gcpPayload)
        .then(() => ctx.state.logger.info(`Newsletter subscription: sent request for the user ${ctx.body.email} --data: ${stringify(ctx.body)} --notification: ${stringify(gcpPayload)}`))
        .catch(err => ctx.state.logger.error(`Newsletter subscription: failed for the user ${ctx.body.email} --err: ${stringify(err)} --data: ${stringify(ctx.body)}`))
    } else {
      await next();
    }
  } catch (err) {
    console.error(err);
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(`Newsletter subscription: failed --err: ${msg}`);
  }
}

export async function subscribeNewsletterThroughCRM(ctx: NewsletterSubscription, next: () => Promise<any>) {
  try {
    let clData: CCRecord = mapCLInfo(ctx, ctx.body);
    clData.webId = null;
    let vipInfo: PARecord | undefined = isValid(clData?.partnerCode) && clData?.userType == TradePolicy.VIP ?
      (await searchDocuments(ctx, ctx.state.appSettings.vip?.mdEntityName!, PAEntityFields, "accessCode=" + clData.partnerCode, { page: 1, pageSize: 100 }, false, maxRetry))[0] :
      undefined;
    let req = await buildReqForCreateConsumer(ctx, clData, vipInfo);
    ctx.clients.CRM.createUpdateAccountAPI(req)
      .then(res => {
        let crmResp = readCreateConsumerRes(ctx, res);
        ctx.state.logger.info(`Newsletter subscription: successful for the user ${ctx.body.email} --res: ${stringify(crmResp)} --data: ${stringify(req)}`)
      })
      .catch(err => ctx.state.logger.error(`Newsletter subscription: failed for the user ${ctx.body.email} --err: ${stringify(err)} --data: ${stringify(req)}`))
  } catch (err) {
    console.error(err);
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(`Newsletter subscription: failed --err: ${msg}`);
  }
  await next();
}
