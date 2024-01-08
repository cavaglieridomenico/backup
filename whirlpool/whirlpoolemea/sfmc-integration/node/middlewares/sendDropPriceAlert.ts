import { MasterData } from "@vtex/api"
import { BuildProductDetails, GenerateID, UniqueArray } from "../utils/functions";
import { RequestQueue, RequestWithRetry } from "../utils/RequestHandler"
import { Subscription } from "../typings/DropPriceSubscription"
import { SearchWithPaginationResponse } from "../typings/MasterData"
import { DROP_PRICE_ENTITY_FIELDS, DROP_PRICE_MASTER_DATA_ENTITY, DROP_PRICE_MAX_RESULTS } from "../utils/constants"

export async function InitDPAlert(ctx: DropPriceAlertContext | Context, next: () => Promise<any>) {
  let sku = (ctx as DropPriceAlertContext).body.IdSku;
  ctx.state.dropPriceRequirements = {
    skuId: sku,
    requestId: GenerateID()
  }
  const skuId = ctx.state.dropPriceRequirements!.skuId
  const priceModified = (ctx as DropPriceAlertContext).body.PriceModified
  if (priceModified) {
    ctx.state.logger.info(`[Price drop alert] - Init - ${ctx.state.dropPriceRequirements.requestId} - received event change price for the skuId: ${skuId}.`)
    next()
  }
}

//get product's details
export async function GetProductDetailsSKU(ctx: Context | DropPriceAlertContext, next: () => Promise<any>) {

  const requestId = ctx.state.dropPriceRequirements!.requestId;
  const skuId = ctx.state.dropPriceRequirements!.skuId!;

  try {

    const productInfo = await ctx.clients.SearchGraphQL.ProductInfo({
      field: "sku",
      value: skuId
    })

    const prodPrice = await ctx.clients.VtexMP.getPrice(ctx, skuId, 1)

    ctx.state.dropPriceRequirements!.product = productInfo.data!.product

    ctx.state.dropPriceRequirements!.product!.items[0].sellers[0].commertialOffer.Price = prodPrice.data[0].value
    await next()

  } catch (err) {
    ctx.state.logger.error(`[Price drop alert] - GetProductDetails - ${requestId} - error getting product details`)
    ctx.state.logger.debug(err?.response || err)
  }
}

//notify all subscribers that have that fit the following:
//refId=${refid} AND emailSent=false AND priceSubscription>currentPrice
export async function NotifyDPAlert(ctx: Context | DropPriceAlertContext, next: () => Promise<any>) {
  const refId = ctx.state.dropPriceRequirements!.product!.productReference;
  const requestId = ctx.state.dropPriceRequirements!.requestId
  const currentPrice = ctx.state.dropPriceRequirements!.product!.items[0].sellers[0].commertialOffer.Price

  ctx.state.dropPriceRequirements!.notificationToSend = await GetNotificationsToSend(ctx.clients.masterdata, refId, currentPrice)

  //avoid repeating email address
  const emails = UniqueArray(ctx.state.dropPriceRequirements!.notificationToSend.map(item => item.email))

  ctx.state.logger.info(`[Price drop alert] - ${ctx.state.dropPriceRequirements!.requestId} - number of emails before ${ctx.state.dropPriceRequirements!.notificationToSend.length} and after ${emails.length} - price: ${currentPrice}.`)

  if (emails.length > 0) {
    try {
      const { appSettings, accessToken, dropPriceRequirements } = ctx.state;
      const ProductDetails = BuildProductDetails(dropPriceRequirements?.product!, ctx.state.appSettings.o2p!.hostname);
      let errors = 0;
      const requestQueue = new RequestQueue(() => {
        ctx.state.logger.info(`[Price drop alert] - NotifyUsersDPAlert - ${requestId} - Notification flow completed with ${errors} errors`);
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
          appSettings.o2p?.dropPrice?.dropPriceAlertKey,
          accessToken
        ],
        callback: (res, err) => {
          if (res) {
            ctx.state.logger.info("[Price drop alert] - NotifyUsersDPAlert - req: " + requestId + "- response message :" + res.message);
            return
          }
          errors++
          let msg = err.message != undefined ? err.message : JSON.stringify(err);
          ctx.state.logger.error("[Price drop alert] - NotifyUsersDPAlert - req: " + requestId + "- error message :" + msg);
        }
      }))

      requestQueue.Stop()

      next();

    } catch (err) {
      ctx.state.logger.error(`[Price drop alert] - ${requestId} - Unexpected error`)
      ctx.state.logger.debug(err)
    }
  } else {
    ctx.state.logger.info(`[Price drop alert] - ${requestId} - no one need to be notified for the product ${refId}.`)
    return
  }
}

export async function UpdateSubscriptionsDPAlert({ state, vtex: { logger }, clients: { masterdata } }: Context | DropPriceAlertContext, next: () => Promise<any>) {
  const toUpdate = state.dropPriceRequirements!.notificationToSend;
  const requestQueue = new RequestQueue(() => {
    logger.info(`[Price drop alert] - UpdateSubscriptions: update completed with ${errors} errors`)
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
        isDropPriceAlert: true
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

const GetNotificationsToSend = async (masterdata: MasterData, refid: string, currentPrice: number, page = 1, results: Subscription[] = []): Promise<Subscription[]> => {
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
        where: `refId=${refid} AND emailSent=false AND subscriptionPrice > ${currentPrice}`
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
  return await GetNotificationsToSend(masterdata, refid, currentPrice, page + 1, results)
}
