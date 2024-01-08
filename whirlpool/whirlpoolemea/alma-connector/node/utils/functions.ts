import { CustomLogger } from "./Logger";
import { statesRefundable } from "./constants";
import { decrypt } from "./crypto";

export function paymentCanBeRefund(paymentState: string) {
  return statesRefundable.includes(paymentState)
}

export async function getKey(ctx: any, orderId: string, customLogger: CustomLogger, setting: any): Promise<string> {
  try {
    let data = await ctx.clients.vtexAPI.GetOrder(orderId)
    switch (data.salesChannel) {
      case setting?.Cluster?.[0].sc: //EPP & O2P
        return decrypt(setting?.Cluster?.[0].key + "")
      case setting?.Cluster?.[1].sc: //FF
        return decrypt(setting?.Cluster?.[1].key + "")
      case setting?.Cluster?.[2].sc: //VIP
        return decrypt(setting?.Cluster?.[2].key + "")
      case setting?.Cluster?.[4].sc: //myvtex
        customLogger.error("getKey() -- alma-connector --> Trade policy 4 --> myvtex domain cannot process the order")
        throw new Error("Missing tradePolicy in -- getKey() --> Trade policy 4 --> myvtex domain cannot process the order")
      default:
        customLogger.error("getKey() -- alma-connector --> Missing tradePolicy")
        throw new Error("Missing tradePolicy in -- getKey()")
    }
  } catch (e) {
    customLogger.error("getKey() -- alma-connector")
    customLogger.error(e)
    ctx.body = "Internal Server Error"
    ctx.status = 500;
    throw new Error(e)
  }
}