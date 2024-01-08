import { json } from "co-body"
import { UserInputError } from "@vtex/api"
import { fixCartSellersAndStock, stringify } from "../utils/functions"
import { CustomLogger } from "../utils/CustomLogger"

export async function checkItemStock(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache")
  const logger = new CustomLogger(ctx);
  const { orderFormId } = await json(ctx.req)
  if (!orderFormId) {
    throw new UserInputError("orderFormId is required")
  }
  try {
    const res = await fixCartSellersAndStock(ctx, orderFormId, false);
    ctx.status = 200;
    ctx.body = {
      messages: res.messages.length > 0 ? { arrayMessages: res.messages } : [],
      text: res.initialItems > 0 ? (res.messages.length > 0 ? undefined : "No errors found") : "No items in cart"
    }
    await next();
  } catch (err) {
    //console.error(err);
    logger.error(`check items stock (order form: ${orderFormId}) --err: ${stringify(err)}`)
    throw new Error(err);
  }
}
