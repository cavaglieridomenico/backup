import { CustomLogger } from "../utils/Logger";

export async function initLogger(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.logger = new CustomLogger(ctx);
    await next();
  } catch (err) {
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}
