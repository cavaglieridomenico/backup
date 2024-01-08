
import { CCEntityFields, PAEntityFields, maxRetry, NLEntityFields } from "../utils/constants";
import { ADRecord, CCRecord, CLRecord, NLRecord, PARecord } from "../typings/md";
import { searchDocuments } from "../utils/documentCRUD";
import { isDefined, isValid, stringify } from "../utils/commons";
import { buildReqForCreateConsumer, mapADInfo, mapCLInfo } from "../utils/mapper";
import { NotificationType } from "../typings/GCP";
import { getCCRecordFromVBase } from "../utils/CC-VBase";

export async function getUserDataFromVtex(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-cache');
  try {
    await isDefined(ctx.query.id, "Bad Request", 400);
    let customer: CCRecord | NLRecord | undefined = undefined;
    if ((ctx.query.event as string) != NotificationType.GUEST) {
      customer = await getCCRecordFromVBase(ctx, ctx.query.id as string) ?? (await searchDocuments(ctx, ctx.state.appSettings.crmEntityName, CCEntityFields, `vtexUserId=${ctx.query.id}`, { page: 1, pageSize: 10 }, false, maxRetry))[0];
    } else {
      customer = (await searchDocuments(ctx, ctx.state.appSettings.newsletterMDEntity, NLEntityFields, `id=${ctx.query.id}`, { page: 1, pageSize: 10 }, false, maxRetry))[0];
      customer = {
        ...mapCLInfo(ctx, customer as CLRecord),
        ...mapADInfo(ctx, customer as ADRecord)
      }
      customer.webId = null;
    }
    let vipInfo: PARecord = isValid(customer?.partnerCode) ?
      (await searchDocuments(ctx, ctx.state.appSettings.vip?.mdEntityName!, PAEntityFields, `accessCode=${customer!.partnerCode}`, { page: 1, pageSize: 10 }, false, maxRetry))[0]
      : null;
    let response = await buildReqForCreateConsumer(ctx, customer as CCRecord, vipInfo);
    ctx.res.setHeader("Content-Type", (typeof response == "string" ? "text/xml" : "application/json"));
    ctx.body = response;
    ctx.status = 200;
    ctx.state.logger.info(`get user ${ctx.query.id} from Vtex: OK --data: ${stringify(response)}`);
  } catch (err) {
    console.error(err);
    ctx.body = err.message ? err.message : "Internal Server Error";
    ctx.status = err.code ? err.code : 500;
    if (err?.code != 400) {
      ctx.state.logger.error(`get user ${ctx.query.id} from Vtex: KO --err: ${stringify(err.message ? err.message : err)}`);
    }
  }
  await next();
}
