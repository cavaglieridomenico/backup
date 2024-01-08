import { sendEventWithRetry } from "../utils/functions";

export async function CallCRM(ctx: Context, next: () => Promise<any>) {
  try {
    sendEventWithRetry(ctx, ctx.vtex.account + ".crm-async-integration", "fetch-user-data-from-crm", { email: ctx.state.req?.email, eventId: "Fetch user data from CRM: " })
    await next();
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
