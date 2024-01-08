import { MasterData } from "@vtex/api"
import { BuildProductDetails, GenerateID, UniqueArray } from "../utils/functions";
import { RequestQueue, RequestWithRetry } from "../utils/RequestHandler"
import { Subscription } from "../typings/DropPriceSubscription"
import { SearchWithPaginationResponse } from "../typings/MasterData"
import { DROP_PRICE_ENTITY_FIELDS, DROP_PRICE_MASTER_DATA_ENTITY, DROP_PRICE_MAX_RESULTS } from "../utils/constants"
import { json } from "co-body"

//get product's details
export async function GetProductDetailsREF(ctx: Context , next: () => Promise<any>) {
    const data = await json(ctx.req)

    ctx.state.dropPriceRequirements = {
      expireEmail: data.email,
      requestId: GenerateID()
    }
    const refId = data.refId
    const requestId = ctx.state.dropPriceRequirements!.requestId;



    ctx.state.logger.info("[Price drop expire] - incoming req: " + requestId + "- for:"  + ctx.state.dropPriceRequirements!.expireEmail + " - refID: " + refId);

    try{
      const productInfo = await ctx.clients.SearchGraphQL.ProductInfo({
        field: "reference",
        value: refId
      })

      if (productInfo.errors){
        ctx.state.logger.error(productInfo.errors)
        ctx.status = 500;
        ctx.body = "Internal Server Error";
      } else if (productInfo.data) {
        ctx.state.dropPriceRequirements!.product = productInfo.data.product
        await next()
      }
    } catch (err) {
      ctx.state.logger.error(`[Price drop expire] - ${requestId} - error getting product details`)
      ctx.state.logger.debug(err?.response || err)
      ctx.status = 500;
      ctx.body = "Internal Server Error";
    }
}

//notify all subscribers that have that fit the following:
//refId=${refid} AND emailSent=false
export async function NotifyDPExpire(ctx: Context , next: () => Promise<any>) {

    const refId = ctx.state.dropPriceRequirements!.product!.productReference;
    const requestId = ctx.state.dropPriceRequirements!.requestId;
    ctx.state.dropPriceRequirements!.notificationToSend = await GetNotificationsToSend(ctx.clients.masterdata, refId, ctx.state.dropPriceRequirements!.expireEmail!)

    //avoid repeating email address
    const emails = UniqueArray(ctx.state.dropPriceRequirements!.notificationToSend.map(item => item.email))

    if(emails.length > 0) {
        try {
            const { appSettings, accessToken , dropPriceRequirements } = ctx.state
            const ProductDetails = BuildProductDetails(dropPriceRequirements?.product!, ctx.state.appSettings.o2p!.hostname);
            let errors = 0
            const requestQueue = new RequestQueue(() => {
              ctx.state.logger.info(`[Price drop expire] - ${ctx.state.dropPriceRequirements!.notificationToSend} - Notification flow completed with ${errors} errors`)
            }, 50)

            emails.forEach(email => requestQueue.PushRequest({
              client: ctx.clients.SFMCRest,
              request: ctx.clients.SFMCRest.triggerEmail.name,
              args: [
                {
                  To: {
                    Address: email,
                    SubscriberKey: email,
                    ContactAttributes: {
                      SubscriberAttributes: ProductDetails
                    }
                  }
                },
              appSettings.o2p?.dropPrice?.dropPriceExpireKey,
                accessToken
              ],
              callback: (res, err) => {
                if (res) {
                  ctx.state.logger.info("[Price drop expire] - req: " + requestId + "- response message :"  + res.message);
                  return
                }
                errors++
                let msg = err.message!=undefined?err.message:JSON.stringify(err);
                ctx.state.logger.error("[Price drop expire] - req: " + requestId + "- error message :" + msg);
              }
            }))

            requestQueue.Stop()
            next();

          } catch (err) {
            ctx.status = 500
            ctx.state.logger.error(`[Price drop expire] - ${requestId} - Unexpected error`)
            ctx.state.logger.debug(err)
          }
    }else{
        ctx.state.logger.info(`[Price drop expire] - ${requestId} - no one need to be notified for the product ${refId}.`)
        return
    }
}


export async function UpdateSubscriptionsExpireAlert({ state, vtex: { logger }, clients: { masterdata } }: Context, next: () => Promise<any>) {
    const toUpdate = state.dropPriceRequirements!.notificationToSend;
    const requestQueue = new RequestQueue(() => {
      logger.info(`[Price drop expire] - UpdateSubscriptions: update completed with ${errors} errors`)
    }, 50)

    let errors = 0

    toUpdate!.forEach(sub => requestQueue.PushRequest({
      client: masterdata,
      request: masterdata.updatePartialDocument.name,
      args: [{
        dataEntity: DROP_PRICE_MASTER_DATA_ENTITY,
        id: sub.id,
        fields: {
          emailSent: true,
          isDropPriceExpire: true
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


const GetNotificationsToSend = async (masterdata: MasterData, refid: string, email: string, page = 1, results: Subscription[] = []): Promise<Subscription[]> => {
    const res = await RequestWithRetry<SearchWithPaginationResponse<Subscription>>(
      masterdata,
      masterdata.searchDocumentsWithPaginationInfo.name,
      [
        {
          dataEntity: DROP_PRICE_MASTER_DATA_ENTITY,
          fields: DROP_PRICE_ENTITY_FIELDS,
          pagination: {
            page,
            pageSize: DROP_PRICE_MAX_RESULTS
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


