import { CLEntityFields, CLEntityName } from "../utils/constants";
import { searchDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { CLRecord } from "../typings/md";
import { stringify } from "../utils/commons";
import { CustomAppIds, ProfileCustomFields } from "../typings/Order";

export async function profilingOptinManagement(ctx: OrderEvent | Context, next: () => Promise<any>) {
  let userData: CLRecord | undefined = undefined;
  try {
    if (ctx.state.appSettings.profilingOptin) {
      ctx.state.orderId = ctx.vtex?.route?.params?.orderId ? ctx.vtex.route.params.orderId as string : (ctx as OrderEvent).body.orderId;
      ctx.state.order = (await ctx.clients.Vtex.getOrder(ctx.state.orderId)).data;
      let optin: boolean | undefined = ctx.state.order.clientPreferencesData?.optinNewsLetter;
      let profilingOptin: string | boolean | undefined = ctx.state.order.customData?.customApps?.find((f: any) => f.id == CustomAppIds.FISCALDATA)?.fields[ProfileCustomFields.profilingOptIn as any]?.toLowerCase();
      profilingOptin = profilingOptin && profilingOptin == "true" ? true : false;
      userData = (await searchDocuments(ctx, CLEntityName, CLEntityFields, `userId=${ctx.state.order.clientProfileData.userProfileId}`, { page: 1, pageSize: 10 }, true))[0];
      await updatePartialDocument(ctx as Context, CLEntityName, userData!.id!, { isNewsletterOptIn: optin, isProfilingOptIn: optin ? profilingOptin : false });
    }
    (ctx as Context).status = 200;
  } catch (err) {
    console.error(err);
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(`Add profiling optin to user ${userData!.email} : failed --err: ${msg}`);
  }
  await next();
}
