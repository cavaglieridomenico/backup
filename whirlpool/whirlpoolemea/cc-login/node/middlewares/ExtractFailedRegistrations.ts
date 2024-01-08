import { CLRecord } from "../typings/MasterData";
import { TradePolicy } from "../typings/TradePolicy";
import { CLEntityName, LoginLogsEntity } from "../utils/constants";
import { scrollDocuments } from "../utils/documentCRUD";

export async function ExtractFailedRegistrations(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  try {
    const userType = ctx.query?.userType as string || TradePolicy.EPP;
    const startDate = (ctx.query?.startDate as string)?.split(".")[0] || (new Date()).toISOString().split("T")[0];
    const endDate = (ctx.query?.endDate as string)?.split(".")[0] || (new Date()).toISOString().split(".")[0];
    const signUpEvent = ctx.state.appSettings.llLoggerConstants?.signupEvent;
    const setPswEvent = ctx.state.appSettings.llLoggerConstants?.setPasswordEvent;
    const patterns = ctx.state.appSettings.llLoggerConstants?.patternsToExcludeExport?.split(",")?.map(p => `email<>*${p}*`).join(" AND ") ?? [];
    const searchCondition = `logType=error AND email is not null AND userType is not null AND ${patterns.length > 0 ? `${patterns} AND ` : ``}(timestamp between ${startDate} AND
       ${endDate}) AND (event=${signUpEvent} OR event=${setPswEvent})`;
    const data = await Promise.all([
      scrollDocuments(ctx, LoginLogsEntity, ["email", "userType"], searchCondition),
      scrollDocuments(ctx, CLEntityName, ["email", "userType"], `createdIn between ${startDate} AND ${endDate}`)
    ])
    const logs = data[0];
    const emails = data[1];
    const emailsWithErros = Array.from(new Set(logs?.filter((l: any) => l.userType == userType)?.map((l: any) => l.email)));
    const notRegisteredEmails = emailsWithErros.filter(e => !emails.find((r: CLRecord) => r.email == e));
    ctx.status = 200
    ctx.body = notRegisteredEmails;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}
