import { json } from "co-body"
import { AppSettings } from "../typings/AppSettings"
import { MASTER_DATA_ENTITY , ENTITY_FIELDS , MAX_RESULTS, SFMC_EVENT } from "../utils/constants"
import { CustomLogger } from "../utils/Logger"
import { RequestQueue, RequestWithRetry } from "../utils/RequestHandler"
import { SearchWithPaginationResponse } from "../typings/MasterData"
import { Subscription } from "../typings/Subscription"
import { MasterData } from "@vtex/api"
import { TradePolicy } from "../typings/types";

export async function SendOutNotifications(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx)
  const data = (await json(ctx.req))
  const refId = data.refId
  const email = data.email
  const appSettings: AppSettings = ctx.state.AppSettings
  const notificationsToSend = await GetNotificationsToSend (ctx.clients.masterdata, refId, email) //[data]
  if (notificationsToSend.length <= 0) return
  ctx.state.NotificationsToSend = notificationsToSend
  if (appSettings.sfmcEnabled) { 
    
    await RequestWithRetry(ctx.clients.events, 'sendEvent', [
      '',
      SFMC_EVENT,
      {
        refId,
        isOutOfStock: true,
        emails: notificationsToSend.map(notification => notification.email),
        eventId: SFMC_EVENT,
        cluster: TradePolicy.O2P
      }
    ]).then(() => {      
      ctx.status = 200
      next()
    }).catch(err => {
      ctx.status = 500
      ctx.vtex.logger.error("[SendOutNotifications] - Error sending event to sfmc")
      ctx.vtex.logger.debug(err?.response || err)
    })
  } else {
    next()
  }
}

export async function UpdateOutSubscriptions({ state, vtex: { logger }, clients: { masterdata } }: Context, next: () => Promise<any>) {
  const toUpdate = state.NotificationsToSend
  const requestQueue = new RequestQueue(() => {
    logger.info(`[SendOutNotifications] - Update subscriptions completed with ${errors} errors`)
  }, 50)

  let errors = 0

  toUpdate.forEach(sub => requestQueue.PushRequest({
    client: masterdata,
    request: masterdata.updatePartialDocument.name,
    args: [{
      dataEntity: MASTER_DATA_ENTITY,
      id: sub.id,
      fields: {
        emailSent: true,
        isOutOfStock: true
      }
    }],
    callback: (_, err) => {
      if (err) {
        errors++
        logger.error(`[SendOutNotifications] - Error updating subscription: ${JSON.stringify(sub)}`)
      }
    }
  }))

  requestQueue.Stop()
  next()
}

//in case of multiply subscription of the same user
const GetNotificationsToSend = async (masterdata: MasterData, refid: string, email: string, page = 1, results: Subscription[] = []): Promise<Subscription[]> => {
  const res = await RequestWithRetry<SearchWithPaginationResponse<Subscription>>(
    masterdata,
    masterdata.searchDocumentsWithPaginationInfo.name,
    [
      {
        dataEntity: MASTER_DATA_ENTITY,
        fields: ENTITY_FIELDS,
        pagination: {
          page,
          pageSize: MAX_RESULTS
        },
        where: `refId=${refid} AND email=${email} AND emailSent=false`
      }
    ]
  ).catch(() => ({
    data: [] as Subscription[],
    pagination: {
      pageSize: 0,
      total: 0
    }
  }))

  results = results.concat(res.data)
  if (results.length >= res.pagination.total) return results
  return await GetNotificationsToSend(masterdata, refid, email, page + 1, results)
}



