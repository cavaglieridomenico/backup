import { CLRecord } from "../typings/MasterData";
import { TradePolicy } from "../typings/TradePolicy";
import { CLEntityName } from "../utils/constants";
import { scrollDocuments } from "../utils/documentCRUD";

export async function ExtractCorrectRegistrations(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  try {
    const userType = ctx.query?.userType as string || TradePolicy.EPP;
    const startDate = (ctx.query?.startDate as string)?.split(".")[0] || (new Date()).toISOString().split("T")[0];
    const endDate = (ctx.query?.endDate as string)?.split(".")[0] || (new Date()).toISOString().split(".")[0];
    const patterns = ctx.state.appSettings.llLoggerConstants?.patternsToExcludeExport?.split(",")?.map(p => `email<>*${p}*`).join(" AND ") ?? [];
    const searchCondition = `email is not null AND userType is not null AND ${patterns.length > 0 ? `${patterns} AND ` : ``}(createdIn between ${startDate} AND ${endDate})`;
    const users = (await scrollDocuments(ctx, CLEntityName, ["email", "userType"], searchCondition))
      ?.filter((r: CLRecord) => r.userType == userType)
      ?.map((r: CLRecord) => r.email);
    ctx.status = 200
    ctx.body = users;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}
