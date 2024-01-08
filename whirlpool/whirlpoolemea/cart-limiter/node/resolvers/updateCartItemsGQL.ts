import { checkCart } from "../middlewares/checkCart";
import { fetchRequest } from "../middlewares/fetchRequest";
import { getAppSettings } from "../middlewares/getAppSettings";
import { updateCartItems } from "../middlewares/updateCartItems";
import { UpdateCartItemsReq } from "../typings/cart";

export const updateCartItemsQL = async (
  _: any,
  { orderFormId, cartData }: { orderFormId: string, cartData: UpdateCartItemsReq },
  ctx: Context
) => {
  ctx.state.req = cartData;
  ctx.state.orderFormId = orderFormId;
  await getAppSettings(ctx, async () => { })
  await fetchRequest(ctx, async () => { });
  await checkCart(ctx, async () => { });
  await updateCartItems(ctx, async () => { });
  return ctx.state.cart;
}
