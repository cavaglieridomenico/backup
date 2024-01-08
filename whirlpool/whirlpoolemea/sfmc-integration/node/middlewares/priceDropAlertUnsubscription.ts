import { stringify } from "../utils/functions";
import { searchDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { DROP_PRICE_MASTER_DATA_ENTITY } from "../utils/constants";

export async function unsubscriptionDPA(ctx: Context | StatusChangeContext, next: () => Promise<any>) {

  try {
    let subscriptionsIds: { id: string }[] = [];
    let email = ctx.state.userInfo?.email;
    //collect for each order item the id of DA user subscription
    let promises: Promise<{ id: string }[]>[] = [];
    ctx.state.orderData.items.map((item: any) => {
      promises.push(searchDocuments(ctx as Context, DROP_PRICE_MASTER_DATA_ENTITY, ["id"], `email=${email} AND refId=${item.refId} AND emailSent=false`, { page: 1, pageSize: 1000 }, false));
    });
    (await Promise.all(promises)).forEach(p => subscriptionsIds = subscriptionsIds.concat(p));
    //logic delete of each active DA subscription
    if (subscriptionsIds.length > 0) {
      subscriptionsIds.forEach((s: any) => {
        updatePartialDocument(ctx as Context, DROP_PRICE_MASTER_DATA_ENTITY, `${s.id}`, { emailSent: true })
          .then(() => ctx.state.logger.info(`[Price Drop Alert Unsubscription] - unsubscription ${s.id} performed`))
          .catch(err => ctx.state.logger.error(`[Price Drop Alert Unsubscription] -  unsubscription ${s.id} failed --err: ${err.message ? err.message : stringify(err)}`))
      });
      ctx.state.logger.info(`[Price Drop Alert Unsubscription] - ${subscriptionsIds.length} unsubscriptions triggered for the user ${email}`);
    } else {
      ctx.state.logger.info(`[Price Drop Alert Unsubscription] - no subscriptions found for the user ${email}`);
    }
    (ctx as Context).status = 200;
    ctx.body = "OK";
    await next();

  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error("[Price Drop Alert Unsubscription] - " + msg);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}
