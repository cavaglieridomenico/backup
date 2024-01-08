import { json } from "co-body"
import {MASTER_DATA_ENTITY} from "../utils/constants"
import { RequestQueue} from "../utils/RequestHandler"

//requested payload: id of subscription (BS entity)
export async function ManualNotifications(ctx: Context, next: () => Promise<any>) {

  const payload = await json(ctx.req)


  let id:any = await ctx.clients.masterdata.searchDocuments({

    dataEntity: MASTER_DATA_ENTITY,
    fields: ["id"],
    pagination: {
      page: 1,
      pageSize: 1
    },
  where: `email=${payload.email} AND refId=${payload.refId} AND emailSent=false`
  });

  if(id.length == 0){
    ctx.status = 304
    ctx.body = {
      message: " Subscription non existent "
    }
  }else{

  UpdateSubscriptions(ctx, id[0].id)

  ctx.status = 200
  await next()
  }
}

function UpdateSubscriptions({vtex: { logger }, clients: { masterdata } }: Context, id: string) {

  const requestQueue = new RequestQueue(() => {
    logger.info(`[UpdateSubscriptions] - Update completed with ${errors} errors`)
  }, 50)

  let errors = 0





  requestQueue.PushRequest({
    client: masterdata,
    request: masterdata.updatePartialDocument.name,
    args: [{
      dataEntity: MASTER_DATA_ENTITY,
      id: id,
      fields: {
        emailSent: true,
        isBackInStock: true,

      }
    }],
    callback: (_, err) => {
      if (err) {
        errors++
        logger.error(`[UpdateSubscriptions] - Error updating subscription: ${JSON.stringify(id)}`)
      }
    }
  })

  requestQueue.Stop()

}

