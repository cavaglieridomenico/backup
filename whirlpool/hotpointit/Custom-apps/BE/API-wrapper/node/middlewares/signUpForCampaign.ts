import { isValid, sendEventWithRetry } from "../utils/functions";
import { NewsletterSubscriptionData, SignUpForCampaignReq, SignUpForCampaignReq2 } from "../typings/signUpForCampaignReq";
import { CLEntityFields, CLEntityName } from "../utils/constants";
import { TradePolicy } from "../typings/TradePolicy";
import CoBody from "co-body";

export async function SignUpForCampaign(ctx: Context, next: () => Promise<any>) {
  try {
    let req: SignUpForCampaignReq | SignUpForCampaignReq2 = await CoBody(ctx.req);
    await checkRequest(req);
    let customer: any = (await ctx.clients.masterdata.searchDocuments({ dataEntity: CLEntityName, fields: CLEntityFields, where: "email=" + req.email, pagination: { page: 1, pageSize: 100 } }))[0];
    if (isValid(customer)) {
      await ctx.clients.masterdata.updatePartialDocument({
        dataEntity: CLEntityName, id: customer.id, fields: {
          isNewsletterOptIn: (req as SignUpForCampaignReq).optin ?? (req as SignUpForCampaignReq2).isNewsletterOptIn,
          campaign: (req as SignUpForCampaignReq).sourceCampaign ?? (req as SignUpForCampaignReq2).campaign
        }
      })
    }
    else {
      let eventPayload: NewsletterSubscriptionData = {
        firstName: (req as SignUpForCampaignReq).name ?? (req as SignUpForCampaignReq2).firstName,
        lastName: (req as SignUpForCampaignReq).surname ?? (req as SignUpForCampaignReq2).lastName,
        email: req.email,
        isNewsletterOptIn: (req as SignUpForCampaignReq).optin ?? (req as SignUpForCampaignReq2).isNewsletterOptIn,
        campaign: (req as SignUpForCampaignReq).sourceCampaign! ?? (req as SignUpForCampaignReq2).campaign,
        userType: TradePolicy.O2P,
        eventId: "Newsletter subscription: "
      }
      await sendEventWithRetry(ctx, ctx.vtex.account + ".crm-async-integration", "crm-newsletter-subscription", eventPayload)
    }
    ctx.status = 200;
    ctx.body = "OK";
  } catch (err) {
    console.error(err)
    ctx.body = err.msg ? err.msg : "Internal Server Error";
    ctx.status = err.code ? err.code : 500;
  }
  await next();
}

async function checkRequest(req: SignUpForCampaignReq | SignUpForCampaignReq2): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {

    if (
      (isValid((req as SignUpForCampaignReq).name) && isValid((req as SignUpForCampaignReq).surname) && isValid(req.email) && (req as SignUpForCampaignReq).optin) ||
      (isValid((req as SignUpForCampaignReq2).firstName) && isValid((req as SignUpForCampaignReq2).lastName) && isValid(req.email) && (req as SignUpForCampaignReq2).isNewsletterOptIn)
    ) {
      resolve(true);
    } else {
      reject({ code: 400, msg: "Bad Request" });
    }
  })
}
