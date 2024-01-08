import { CLRecord } from "../typings/MasterData";
import { CLEntityFields, CLEntityName } from "../utils/constants";
import { searchDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { isNotUndefined, isValid } from "../utils/functions";
import { MapOrderCustomLogger } from "./InitLLCustomLoggers";

export async function IncreaseUserNumberOfOrders(ctx: Context | NewOrder, next: () => Promise<any>) {
  try {
    let userData: CLRecord = (await searchDocuments(ctx, CLEntityName, CLEntityFields, `userId=${ctx.state.order.clientProfileData.userProfileId}`))[0]
    await isNotUndefined(userData);
    userData.totalNumberOfPlacedOrders = isValid(userData.totalNumberOfPlacedOrders!) ? userData.totalNumberOfPlacedOrders! + 1 : 1;
    MapOrderCustomLogger(ctx, userData);
    await updatePartialDocument(ctx, CLEntityName, userData.id!, { totalNumberOfPlacedOrders: userData.totalNumberOfPlacedOrders });
    ctx.state.llLogger.info({ status: 200, message: "New order placed for user: " + userData!.email });
    ctx.state.llLogger.info({ status: 200, message: "Updated number of total placed orders, new value: " + (userData.totalNumberOfPlacedOrders) });
    (ctx as Context).status = 200;
    (ctx as Context).body = "OK";
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    (ctx as Context).status = 500;
    (ctx as Context).body = "Internal Server Error";
  }
  await next();
}
