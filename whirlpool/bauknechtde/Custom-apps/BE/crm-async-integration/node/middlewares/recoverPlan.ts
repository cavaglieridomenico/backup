//@ts-nocheck

import { GoogleAuth } from "google-auth-library";
import { getGCPAuthToken, getGCPClient } from "../clients/GCP";
import { CCRecord, CLRecord } from "../typings/types";
import { CCEntityName, CLEntityFields, CLEntityName } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { CustomLogger } from "../utils/Logger";
const fetch = require('node-fetch');

export async function recoverPlan(ctx: Context, next: () => Promise<any>){
  if(ctx.state.appSettings.crmRecoverPlan){
    ctx.vtex.logger = new CustomLogger(ctx);
    ctx.clients.masterdata.searchDocuments({dataEntity: CCEntityName, fields: ["vtexUserId", "userType", "email"], where: "crmBpId is null AND createdIn>"+ctx.state.appSettings.crmRecoverPlanStartDate, pagination: {page: 1, pageSize: 5}, sort: "createdIn DESC"})
    .then(async(records: CCRecord[]) => {
      if(records.length>0){
        const gcpAuth = new GoogleAuth({
          projectId: ctx.state.appSettings.gcpProjectId,
          credentials: {
            client_email: ctx.state.appSettings.gcpClientEmail,
            private_key: AES256Decode(ctx.state.appSettings.gcpPrivateKey)
          }
        });
        const gcpClient = await getGCPClient(gcpAuth);
        const token = await getGCPAuthToken(ctx, gcpClient);
        records/*?.filter(f => f.email!=ctx.body?.email)*/?.forEach(r => {
          let gcpNotififaction: GCPPayload = {
            event: "NEW",
            userId: userData.userId,
            brand: ctx.state.appSettings.gcpBrand,
            country: ctx.state.appSettings.gcpCountry
          }
          ctx.clients.GCP.notify(gcpNotififaction, token)
          .then(res =>ctx.vtex.logger.info("Recover plan: notification 'new' sent to GCP for the user "+r.email))
          .catch(err => ctx.vtex.logger.error("Recover plan: error while sending the notification 'new' to GCP for the user "+r.email+" --err: "+(err.message!=undefined?err.message:JSON.stringify(err))))
        })
      }
    })
    .catch(err => ctx.vtex.logger.error("Recover plan: error while retrieving CC records --err: "+(err.message!=undefined?err.message:JSON.stringify(err))))
    ctx.clients.masterdata.searchDocuments({dataEntity: CLEntityName, fields: CLEntityFields, where: "crmBpId is null AND createdIn>"+ctx.state.appSettings.crmRecoverPlanStartDate, pagination: {page: 1, pageSize: 5}, sort: "createdIn DESC"})
    .then((records: CLRecord[]) => {
      records/*?.filter(f => f.email!=ctx.body?.email)*/?.forEach(r => {
        let obj = {
          method: "POST",
          body: JSON.stringify({...r,... {notification: "user created"}}),
          headers: {
            "app-key": AES256Decode(ctx.state.appSettings.MDKey)
          }
        }
        fetch("http://"+(ctx.host?ctx.host:(ctx.vtex.account+".myvtex.com"))+"/app/crm-async-integration/notify", obj)
        .then(res => res.status==200?ctx.vtex.logger.info("Recover plan: triggered the CRM app for the user "+r.email):
                      ctx.vtex.logger.error("Recover plan: error while trigger the CRM app for the user "+r.email+" --err: "+(res.message!=undefined?res.message:JSON.stringify(res)))
              )
        .catch(err => ctx.vtex.logger.error("Recover plan: error while trigger the CRM app for the user "+r.email+" --err: "+(err.message!=undefined?err.message:JSON.stringify(err))));
      })
    })
    .catch(err => ctx.vtex.logger.error("Recover plan: error while retrieving CL records --err: "+(err.message!=undefined?err.message:JSON.stringify(err))))
  }
  await next();
}
