import { CustomLogger } from "../utils/Logger";
export async function vtexPing(ctx: Context, next: () => Promise<any>) {
  let logger = new CustomLogger(ctx)
  try {
    ctx.set("Cache-Control", "no-store")
    ctx.body = "{1}"
    ctx.status = 200;
    await next()
  } catch (e) {
    logger.error(e)
    ctx.status = 500;
  }
}
