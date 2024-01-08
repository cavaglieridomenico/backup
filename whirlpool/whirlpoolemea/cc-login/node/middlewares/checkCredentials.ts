import { adminCookie } from "../utils/constants";
import { sha256 } from "../utils/cryptography";

export async function checkCredentials(ctx: Context, next: () => Promise<any>) {
  try {
    let enabledCredentials = ctx.state.appSettings.inboundCredentials?.split(";");
    if (enabledCredentials) {
      let found = enabledCredentials.find(f => f.split(":")[0] == sha256(ctx.get("X-VTEX-API-AppKey")) && f.split(":")[1] == sha256(ctx.get('X-VTEX-API-AppToken')));
      let cookie = ctx.cookies.get(adminCookie);
      if (found || cookie) {
        await next();
      } else {
        ctx.status = 401;
        ctx.body = "Invalid Credentials";
      }
    } else {
      ctx.status = 403;
      ctx.body = "Forbidden Access";
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
