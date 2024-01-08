import { LoggedUser } from "../typings/LoggedUser";
import { CustomLogger } from "../utils/Logger";
import { defaultCookie } from "../utils/constants";

export const getLastOrder = async (
  _: any,
  { },
  ctx: any
): Promise<any> => {
  const logger = new CustomLogger(ctx);
  try {
    const { vtex: { account }, cookies } = ctx
    const { user: userEmail }: LoggedUser = await ctx.clients.vtexAPI.GetLoggedUser(cookies.get(`${defaultCookie}_${account}`) as string)
    const { list }: OrderListPayload = await ctx.clients.vtexAPI.GetPendingOrderList(userEmail)
    // console.log("****************\n", "LIST", list, "\n*********************");
    return list
  } catch (err) {
    logger.error(err)
  }
}

