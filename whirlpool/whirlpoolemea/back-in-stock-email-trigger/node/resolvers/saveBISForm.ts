import { APP } from "@vtex/api";
import { AppSettings } from "../typing/config";
import { ASRecord, CLRecord, UserType } from "../typing/md";
import { NewsletterSubscriptionData } from "../typing/newsletter";
import { ASfields, CLEntity, CLFields, } from "../utils/constants";
import { createDocument, deleteDocument, searchDocuments, updatePartialDocument, } from "../utils/documentCRUD";
import { isValid, sendEventWithRetry, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export const saveBISForm = async (_: any, input: { args: ASRecord }, ctx: Context) => {
  try {
    ctx.vtex.logger = new CustomLogger(ctx);
    let appSettings: AppSettings = await ctx.clients.apps.getAppSettings(APP.ID);
    checkPayload(input.args);
    let [session, asRecords, clRecords] = await Promise.all([
      ctx.clients.Vtex.getSession(appSettings.sessionCookie, ctx.cookies.get(appSettings.sessionCookie)),
      searchDocuments(ctx, appSettings.mdEntity, ASfields, "email=" + input.args.email + " AND skuRefId=" + input.args.skuRefId, { page: 1, pageSize: 100 }) as Promise<ASRecord[]>,
      searchDocuments(ctx, CLEntity, CLFields, "email=" + input.args.email, { page: 1, pageSize: 1 }) as Promise<CLRecord[]>
    ])
    let isLoggedUser: boolean = session.namespaces?.profile?.isAuthenticated?.value == "true";
    let updateCL: boolean = false;
    let sendEvent: boolean = false;
    let userType = getUserTypeByHostname(ctx, input.args.host, appSettings);
    if (isValid(input.args.optin + "")) {
      if (userType == UserType.O2P || userType == UserType.VIP) {
        if (clRecords.length > 0) {
          updateCL = true;
        } else {
          sendEvent = true; // send event in both the caes optin = "true" and optin = "false" => needed for the transition true --> false
        }
      } else {
        if (!isLoggedUser || clRecords.length <= 0 || (isLoggedUser && clRecords.length > 0 && session.namespaces?.profile?.email?.value != clRecords[0].email)) {
          throw new Error("Access denied");
        } else {
          updateCL = true;
        }
      }
    }
    if (updateCL) {
      updatePartialDocument(ctx, CLEntity, clRecords[0].id!, { isNewsletterOptIn: input.args.optin })
        .catch(err => ctx.vtex.logger.error("New subscription for 'back in stock': error while updating optin consent --data: " + stringify(input) + " --err: " + stringify(err)))
    }
    if (sendEvent) {
      let crmData: NewsletterSubscriptionData = {
        firstName: input.args.name!,
        lastName: input.args.surname!,
        email: input.args.email!,
        isNewsletterOptIn: input.args.optin!,
        campaign: isValid(input.args.campaign) ? input.args.campaign! : null,
        userType: userType,
        partnerCode: isValid(session.namespaces?.public?.accessCode?.value) ? session.namespaces!.public!.accessCode!.value : null,
        eventId: "New subscription for 'back in stock': "
      }
      sendEventWithRetry(ctx, appSettings.crmEvent, crmData)
        .catch(err => ctx.vtex.logger.error("New subscription for 'back in stock': error while sending event to CRM app --data: " + stringify(input) + " --err: " + stringify(err)))
    }
    asRecords?.forEach(r =>
      deleteDocument(ctx, appSettings.mdEntity, r.id!)
        .catch(err => ctx.vtex.logger.error("New subscription for 'back in stock': error while deleting old subscriptions --data: " + stringify(input) + " --err: " + stringify(err)))
    );
    input.args.tradePolicy = getTradePolicyIdByHostname(ctx, input.args.host, appSettings);
    input.args.createdAt = new Date().toISOString();
    input.args.notificationSend = "false";
    await createDocument(ctx, appSettings.mdEntity, input.args);
    return true;
  } catch (err) {
    console.error(err);
    throw new Error(err.msg ? err.msg : err);
  }
}

function checkPayload(BISForm: ASRecord): void {
  let isValidPayload = isValid(BISForm.email) && isValid(BISForm.skuRefId) &&
    (
      !isValid(BISForm.optin)
      ||
      (
        isValid(BISForm.optin) && isValid(BISForm.name) && isValid(BISForm.surname)
      )
    )
  if (isValidPayload) {
    return;
  }
  throw new Error("Bad request");
}

function getUserTypeByHostname(ctx: Context, reqHost: string | undefined | null, appSettings: AppSettings): string {
  let host = ctx.host.includes(ctx.vtex.account) ? reqHost : ctx.host;
  let userType: string | undefined = undefined;
  if (appSettings.isCCProject) {
    switch (host) {
      case appSettings.eppInfo?.hostname:
        userType = UserType.EPP;
        break;
      case appSettings.ffInfo?.hostname:
        userType = UserType.FF;
        break;
      case appSettings.vipInfo?.hostname:
        userType = UserType.VIP;
        break;
    }
  } else {
    if (host == appSettings.o2pInfo?.hostname) {
      userType = UserType.O2P;
    }
  }
  if (!userType) {
    throw new Error("Unknown user cluster");
  }
  return userType;
}

function getTradePolicyIdByHostname(ctx: Context, reqHost: string | undefined | null, appSettings: AppSettings): string | null {
  let host = ctx.host.includes(ctx.vtex.account) ? reqHost : ctx.host;
  let tradePolicy: string | null = null;
  if (appSettings.isCCProject) {
    switch (host) {
      case appSettings.eppInfo?.hostname:
        tradePolicy = appSettings.eppInfo?.tradePolicyId!;
        break;
      case appSettings.ffInfo?.hostname:
        tradePolicy = appSettings.ffInfo?.tradePolicyId!;
        break;
      case appSettings.vipInfo?.hostname:
        tradePolicy = appSettings.vipInfo?.tradePolicyId!;
        break;
    }
  }
  if (appSettings.isCCProject && !tradePolicy) {
    throw new Error("Unknown hostname");
  }
  return tradePolicy;
}
