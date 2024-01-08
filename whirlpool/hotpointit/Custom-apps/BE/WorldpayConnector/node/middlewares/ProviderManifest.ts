import { ProviderManifest } from "../utils/constants"

export async function GetProviderManifest(ctx: Context, next: () => Promise<any>) {
    ctx.body = ProviderManifest
    ctx.status = 200;
    await next()
  }