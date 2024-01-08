import { sha256 } from "../utils/cryptography";
import { sha512 } from "../utils/cryptography";

export async function checkSellerCredential(ctx: Context, next: () => Promise<any>) {
  try {
    let hash = ctx.state.appSettings.Vtex_Settings.Admin.MarketPlace.BasicHash;
    let inboundCredential = sha256(ctx.get("Authorization").split("Basic ")[1]);
    if (hash == inboundCredential) {
      ctx
      await next()
    } else {
      ctx.status = 401;
      ctx.body = `Invalid credential`;
    }
  } catch (error) {
    ctx.status = 401;
    ctx.body = `Invalid credential`;
  }
}

export async function checkVtexCredentials(ctx: Context, next: () => Promise<any>) {
  try {
    let enabledCredentials = ctx.state.appSettings.Vtex_Settings.Auth.Credential.split(";");
    if (enabledCredentials) {
      let found = enabledCredentials.find(f => f.split(":")[0] == sha512(ctx.get("X-VTEX-API-AppKey")).substring(0, 64) && f.split(":")[1] == sha512(ctx.get('X-VTEX-API-AppToken')).substring(0, 64));
      if (found) {
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

