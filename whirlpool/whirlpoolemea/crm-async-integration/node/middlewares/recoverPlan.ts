
import { GCPPayload, NotificationType } from "../typings/GCP";
import { CLEntityFields, CLEntityName } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { stringify } from "../utils/commons";
import { MDNotification } from "../typings/md";
const fetch = require('node-fetch');

export async function recoverPlan(ctx: LoggedUser, next: () => Promise<any>) {
  if (ctx.state.appSettings.crmRecoverPlan) {
    ctx.clients.masterdata.searchDocuments({ dataEntity: ctx.state.appSettings.crmEntityName, fields: ["vtexUserId", "userType", "email"], where: `crmBpId is null AND createdIn>${ctx.state.appSettings.crmRecoverPlanStartDate} AND email<>*@fake*`, pagination: { page: 1, pageSize: 5 }, sort: "createdIn DESC" })
      .then((records: any[]) => {
        console.info(ctx.state.appSettings.crmEntityName, records.length)
        if (records.length > 0) {
          records?.forEach(r => {
            let gcpNotififaction: GCPPayload = {
              event: NotificationType.NEW,
              userId: r.vtexUserId
            }
            ctx.clients.GCP.sendNotification(gcpNotififaction)
              .then(() => ctx.state.logger.info(`Recover plan: notification "new" sent to GCP for the user ${r.email}`))
              .catch(err => ctx.state.logger.error(`Recover plan: error while sending the notification "new" to GCP for the user ${r.email} --err: ${stringify(err.message ? err.message : err)}`))
          })
        }
      })
      .catch(err => ctx.state.logger.error(`Recover plan: error while retrieving CC records --err: ${stringify(err.message ? err.message : err)}`))
    ctx.clients.masterdata.searchDocuments({ dataEntity: CLEntityName, fields: CLEntityFields, where: `crmBpId is null AND firstName is not null AND lastName is not null AND createdIn>${ctx.state.appSettings.crmRecoverPlanStartDate} AND email<>*@fake*`, pagination: { page: 1, pageSize: 5 }, sort: "createdIn DESC" })
      .then((records: any[]) => {
        console.info(CLEntityName, records.length)
        records?.forEach(r => {
          let obj = {
            method: "POST",
            body: JSON.stringify({ ...r, ... { notification: MDNotification.USER_CREATED } }),
            headers: {
              "Content-Type": "application/json",
              "Accept": "*/*",
              "app-key": AES256Decode(ctx.state.appSettings.MDKey)
            }
          }
          fetch("http://" + ctx.vtex.workspace + "--" + ctx.vtex.account + ".myvtex.com/app/crm-async-integration/notify", obj)
            .then((res: any) => res.status == 200 ?
              ctx.state.logger.info(`Recover plan: triggered the CRM app for the user ${r.email}`) :
              ctx.state.logger.error(`Recover plan: error while trigger the CRM app for the user ${r.email} --err: ${stringify(res.message ? res.message : res)}`)
            )
            .catch((err: any) => ctx.state.logger.error(`Recover plan: error while trigger the CRM app for the user ${r.email} --err: ${stringify(err.message ? err.message : err)}`));
        })
      })
      .catch((err: any) => ctx.state.logger.error(`Recover plan: error while retrieving CL records --err: ${stringify(err.message ? err.message : err)}`))
  }
  await next();
}
