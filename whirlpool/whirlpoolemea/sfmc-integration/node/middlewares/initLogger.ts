import { CustomLogger } from "../utils/Logger";

export async function initLogger(ctx: Context | StatusChangeContext | Invitation | BackInStockContext | DropPriceAlertContext, next: () => Promise<any>) {
  ctx.state.logger = new CustomLogger(ctx);
  await next();
}
