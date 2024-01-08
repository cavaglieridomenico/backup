
import { getHDXPayload } from "../typings/hdx";
import { POInterfaces } from "../typings/sap-po";
import { fillInInterfaceName, fillInStandardParams } from "../utils/functions";

export async function getServerStatus(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  ctx.set("Content-Type", "text/xml");
  try {
    let payload = getHDXPayload();
    payload = fillInInterfaceName(payload, POInterfaces.HEALTH_CHECK)
    let data = fillInStandardParams(payload, ctx.state.appSettings.hdx);
    let res = await ctx.clients.SAPPO.callHDXWebApplication(data.payload, data.referenceCode);
    ctx.status = 200;
    ctx.body = res;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
  await next();
}
