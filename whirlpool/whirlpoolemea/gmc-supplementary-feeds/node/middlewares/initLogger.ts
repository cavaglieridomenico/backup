import { CustomLogger } from "../utils/Logger";

export async function initLogger(ctx: Context | InstalledContextEvent, next: () => Promise<any>) {
  ctx.state.logger = new CustomLogger(ctx);
  await next()
}
