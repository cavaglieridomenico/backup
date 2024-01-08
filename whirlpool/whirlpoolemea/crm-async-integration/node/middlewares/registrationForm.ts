import { CLRecord } from "../typings/md";
import CoBody from "co-body";
import { searchDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { CLEntityFields, CLEntityName } from "../utils/constants";
import { sendEventWithRetry, stringify } from "../utils/commons";
import { APP } from "@vtex/api"
import { CRMAppEvents } from "../typings/config";

export async function registerUser(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.reqRF = await CoBody(ctx.req);
    Object.keys(ctx.state.reqRF).filter(k => k != "NewsLetterOptIn" && k != "processed")?.forEach((k: any) => (ctx.state.reqRF as any)[k] = (ctx.state.reqRF as any)[k].trim());
    ctx.state.reqRF.Email = ctx.state.reqRF.Email.toLowerCase();
    ctx.state.userId = (await searchDocuments(ctx, CLEntityName, CLEntityFields, `email=${ctx.state.reqRF.Email}`))[0]?.id;
    await next();
  } catch (err) {
    console.error(err);
    ctx.body = {
      success: false
    }
    ctx.status = 500;
    ctx.state.logger.error(`Registration form: error while registering the user ${ctx.state.reqRF?.Email} -- err: ${stringify(err.message ? err.message : err)}`);
  }
}

export async function registerUserOnCL(ctx: Context, next: () => Promise<any>) {
  try {
    if (ctx.state.userId) {
      let payload: CLRecord = {
        isNewsletterOptIn: ctx.state.reqRF.NewsLetterOptIn,
        campaign: ctx.state.reqRF.Campaign
      }
      updatePartialDocument(ctx, CLEntityName, ctx.state.userId, payload)
        .then(() => ctx.state.logger.info(`Registration form: user ${ctx.state.reqRF.Email} updated --data: ${stringify(payload)}`))
        .catch(err => ctx.state.logger.error(`Registration form: user ${ctx.state.reqRF.Email} not updated --err: ${stringify(err)} --data: ${stringify(payload)}`))
      ctx.status = 200;
      ctx.body = {
        success: true
      }
    } else {
      await next()
    }
  } catch (err) {
    console.error(err);
    ctx.body = {
      success: false
    }
    ctx.status = 500;
    ctx.state.logger.error(`Registration form: error while registering the user ${ctx.state.reqRF?.Email} -- err: ${stringify(err.message ? err.message : err)}`);
  }
}

export async function sendNLSubscriptionEvent(ctx: Context, next: () => Promise<any>) {
  try {
    let payload: CLRecord = {
      email: ctx.state.reqRF.Email,
      firstName: ctx.state.reqRF.Name,
      lastName: ctx.state.reqRF.Surname,
      isNewsletterOptIn: ctx.state.reqRF.NewsLetterOptIn,
      campaign: ctx.state.reqRF.Campaign
    }
    sendEventWithRetry(ctx, APP.ID, CRMAppEvents.NLSubscription, payload)
      .then(() => ctx.state.logger.info(`Registration form: sent event "${CRMAppEvents.NLSubscription}" for the user ${ctx.state.reqRF.Email} --data: ${stringify(payload)}`))
      .catch(err => ctx.state.logger.error(`Registration form: event "${CRMAppEvents.NLSubscription}" not sent for the user ${ctx.state.reqRF.Email} --err: ${stringify(err)} --data: ${stringify(payload)}`))
    ctx.status = 200;
    ctx.body = {
      success: true
    }
  } catch (err) {
    console.error(err);
    ctx.body = {
      success: false
    }
    ctx.status = 500;
    ctx.state.logger.error(`Registration form: error while registering the user ${ctx.state.reqRF?.Email} -- err: ${stringify(err.message ? err.message : err)}`);
  }
  await next();
}
