import { MasterData } from "@vtex/api"
import { json } from "co-body"
import { AppSettings } from "../typings/AppSettings"
import { SearchWithPaginationResponse } from "../typings/MasterData"
import { Subscription } from "../typings/Subscription"
import { ENTITY_FIELDS, MASTER_DATA_ENTITY, MAX_RESULTS, SFMC_EVENT } from "../utils/constants"
import { CustomLogger } from "../utils/Logger"
import { RequestQueue, RequestWithRetry } from "../utils/RequestHandler"
import { Product } from "../typings/Product";
import { TradePolicy } from "../typings/types";

export async function GetProductDetails(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx)

  try{
    const refId = (await json(ctx.req)).refId
    ctx.state.RefID = refId

    const productInfo = await ctx.clients.SearchGraphQL.ProductInfo({
      field: "reference",
      value: refId
    })   

    if (productInfo.errors) ctx.vtex.logger.error(productInfo.errors)
    else if (productInfo.data) {
      ctx.state.product = productInfo.data.product
      ctx.status = 200
      await next()
    }
  } catch (err) {
    ctx.vtex.logger.error(`[SendBackNotification] - error getting product details`)
    ctx.vtex.logger.debug(err?.response || err)
  }
}

export async function GetUserToNotify(ctx: Context, next: () => Promise<any>) {
  const refId = ctx.state.RefID
  const product = ctx.state.product
  const settings = ctx.state.AppSettings
  const seller = settings.sellerAccount   
  let sellerIndex = product.items[0].sellers.findIndex( s => s.sellerId == seller)  

  
  //check the seller
  if( sellerIndex == undefined || sellerIndex < 0 ){
    ctx.vtex.logger.error(`[SendBackNotification] - No available quantity of product ${refId} for the current Seller ${seller} selected`)
    return    
  }else{
    if(IsProdAvailable(product, sellerIndex)){
      ctx.state.NotificationsToSend = await GetNotificationsToSend(ctx.clients.masterdata, refId)
      await next()
    }else{
      ctx.vtex.logger.error(`[SendBackNotification] - product ${refId} not available`);    
      return
    }
  }     
}

export async function SendNotifications(ctx: Context, next: () => Promise<any>) {
  const refId = ctx.state.RefID
  const appSettings: AppSettings = ctx.state.AppSettings
  const notificationsToSend = ctx.state.NotificationsToSend
  if (notificationsToSend.length <= 0) return
  ctx.state.NotificationsToSend = notificationsToSend
  if (appSettings.sfmcEnabled) {
    RequestWithRetry(ctx.clients.events, 'sendEvent', [
      '',
      SFMC_EVENT,
      {
        refId,
        isOutOfStock: false,
        emails: notificationsToSend.map(notification => notification.email),
        eventId: SFMC_EVENT,
        cluster: TradePolicy.O2P
      }
    ]).then(() => next()).catch(err => {
      ctx.status = 500
      ctx.vtex.logger.error("[SendBackNotification] - Error sending event to sfmc")
      ctx.vtex.logger.debug(err?.response || err)
    })
  } else {
    next()
  }
}

export async function UpdateSubscriptions({ state, vtex: { logger }, clients: { masterdata } }: Context, next: () => Promise<any>) {
  const toUpdate = state.NotificationsToSend
  const requestQueue = new RequestQueue(() => {
    logger.info(`[SendBackNotification] -  update subscriptions completed with ${errors} errors`)    
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
        isBackInStock: true
      }
    }],
    callback: (_, err) => {
      if (err) {
        errors++
        logger.error(`[SendBackNotification] - Error updating subscription: ${JSON.stringify(sub)}`)
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

const IsProdAvailable = (product: Product, sellerIndex : number) =>
  product.properties.some(spec => spec.originalName == "sellable" && spec.values[0]?.toLowerCase() == 'true') &&
  product.properties.some(spec => spec.originalName == "isDiscontinued" && spec.values[0]?.toLowerCase() == 'false') &&
  product.items[0].sellers[sellerIndex].commertialOffer.AvailableQuantity > 0
