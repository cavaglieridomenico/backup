import { deleteDocument, searchDocuments } from "../utils/documentCRUD";
import { CCEntityFields } from "../utils/constants";
import { deleteCCRecordFromVBase } from "../utils/CC-VBase";
import { stringify } from "../utils/commons";
import { CCRecord } from "../typings/md";

export async function deleteUserDataFromVtex(ctx: Context, next: () => Promise<any>) {
  try {
    let cc: CCRecord = (await searchDocuments(ctx, ctx.state.appSettings.crmEntityName, CCEntityFields, `vtexUserId=${ctx.vtex.route.params.id}`))[0];
    if (cc) {
      deleteDocument(ctx, ctx.state.appSettings.crmEntityName, cc.id!)
        .then(() => ctx.state.logger.info(`User ${ctx.vtex.route.params.id} successfully deleted from CC`))
        .catch(err => ctx.state.logger.error(`Error while deleting the user ${ctx.vtex.route.params.id} from CC --err ${err.message ? err.message : stringify(err)}`))
    } else {
      ctx.state.logger.warn(`User ${ctx.vtex.route.params.id} not found in CC`);
    }
    deleteCCRecordFromVBase(ctx, ctx.vtex.route.params.id as string)
      .then((res) => !res.notFound ?
        ctx.state.logger.info(`User ${ctx.vtex.route.params.id} successfully deleted from VBase`) :
        ctx.state.logger.warn(`User ${ctx.vtex.route.params.id} not found in VBase`))
      .catch(err => ctx.state.logger.error(`Error while deleting the user ${ctx.vtex.route.params.id} from VBase --err ${err.message ? err.message : stringify(err)}`))
    ctx.status = 200;
    ctx.body = "OK";
  } catch (err) {
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}
