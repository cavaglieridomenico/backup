import { MasterData } from "@vtex/api"
import { json } from "co-body"
import { SearchWithPaginationResponse } from "../typings/MasterData"
import { Subscription } from "../typings/Subscription"
import { ENTITY_FIELDS, MASTER_DATA_ENTITY, MAX_RESULTS} from "../utils/constants"
import { RequestQueue, RequestWithRetry } from "../utils/RequestHandler"




export async function GetUserToNotify(ctx: Context, next: () => Promise<any>) {

  const refId = (await json(ctx.req)).refId;

  ctx.state.NotificationsToSend = await GetNotificationsToSend(ctx.clients.masterdata, refId)

  ctx.status = 200;
  ctx.body = {
    message: " Emails sent "
  }

  await next()

}

export async function UpdateSubscriptions({ state, vtex: { logger }, clients: { masterdata } }: Context, next: () => Promise<any>) {
  const toUpdate = state.NotificationsToSend
  const requestQueue = new RequestQueue(() => {
    logger.info(`[UpdateSubscriptions] - Update completed with ${errors} errors`)
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
        isBackInStock: true,

      }
    }],
    callback: (_, err) => {
      if (err) {
        errors++
        logger.error(`[UpdateSubscriptions] - Error updating subscription: ${JSON.stringify(sub)}`)
      }
    }
  }))

  requestQueue.Stop()



  next()
}

const GetNotificationsToSend = async (masterdata: MasterData, refid: string, page = 1, results: Subscription[] = []): Promise<Subscription[]> => {
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
        where: `refId=${refid} AND emailSent=false`
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
  return await GetNotificationsToSend(masterdata, refid, page + 1, results)
}

