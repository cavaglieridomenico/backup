import { APP } from "@vtex/api";
import { stringify } from "../utils/functions";

export async function getAppSettings(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.appSettings = await ctx.clients.apps.getAppSettings(APP.ID);
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = `Error while retrieving app settings --details: ${stringify(err)}`;
  }
}
