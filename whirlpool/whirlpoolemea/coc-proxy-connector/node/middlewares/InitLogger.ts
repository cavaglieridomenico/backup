import { CustomLogger } from "../utils/Logger";

export async function InitLogger(ctx: Context, next: () => Promise<any>) {
  ctx.state.logger = new CustomLogger(ctx)
  await next()
}