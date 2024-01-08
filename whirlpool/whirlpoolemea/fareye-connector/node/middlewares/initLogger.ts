import { CustomLogger } from "../utils/Logger";

//initialization of the logger
export async function initLogger(ctx: Context | OrderEvent, next: () => Promise<any>) {
  ctx.state.logger = new CustomLogger(ctx);
  await next()
}
