import { checkCart } from "../middlewares/checkCart";
import { getAppSettings } from "../middlewares/getAppSettings";

export const checkCartGQL = async (
  _: any,
  { orderFormId }: { orderFormId: string },
  ctx: Context
) => {
  ctx.state.orderFormId = orderFormId;
  await getAppSettings(ctx, async () => { });
  await checkCart(ctx, async () => { });
  return ctx.state.cart;
}
