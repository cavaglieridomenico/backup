
import { CustomLogger } from "../utils/CustomLogger";
import { fixCartSellersAndStock, stringify } from "../utils/functions";


export const cartFix_resolver = async (_: any, orderFormId: any, ctx: Context) => {
  const logger = new CustomLogger(ctx);
  try {
    const res = await fixCartSellersAndStock(ctx, orderFormId.orderFormId, true);
    return {
      cartItemNumber: res.initialItems,
      itemsRemoved: res.removedItems
    };
  } catch (err) {
    //console.error(err);
    logger.error(`fix cart (order form: ${orderFormId}) --err: ${stringify(err)}`)
    throw new Error(err);
  }
}
