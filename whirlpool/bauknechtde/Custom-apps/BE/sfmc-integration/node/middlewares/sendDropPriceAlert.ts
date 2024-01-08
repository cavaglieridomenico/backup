import { MasterData } from "@vtex/api"
import { ACCOUNT, WORKSPACE } from "@vtex/api";
import { CustomLogger } from "../utils/Logger"
import { GenerateID } from "../utils/functions";
import { RequestQueue, RequestWithRetry } from "../utils/RequestHandler"
import { Subscription } from "../typings/DropPriceSubscription"
import { SearchWithPaginationResponse } from "../typings/MasterData"
import { DROP_PRICE_ENTITY_FIELDS, DROP_PRICE_MASTER_DATA_ENTITY, DROP_PRICE_MAX_RESULTS } from "../utils/constants"
import { Product } from "../typings/types";

export async function InitDPAlert(ctx: DropPriceAlertContext, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx)

  const skuId = ctx.body.IdSku
  const priceModified = ctx.body.PriceModified
  const requestId = GenerateID()

  if (priceModified) {
    ctx.state.skuID = skuId
    ctx.state.requestId = requestId
    //ctx.status = 200
    ctx.vtex.logger.info(`[Price drop alert] - Init - ${requestId} - received event change price for the skuId: ${skuId}.`)
    next()
  } else {
    return
  }
}

//get product's details
export async function GetProductDetailsSKU(ctx: Context, next: () => Promise<any>) {

  try {
    const skuId = ctx.state.skuID

    const productInfo = ctx.clients.SearchGraphQL.ProductInfo({
      field: "sku",
      value: skuId
    })

    const prodPrice = ctx.clients.VtexMP.getPrice(ctx, skuId, 1)

    const [productInfoResult, productPriceResult] = await Promise.all([productInfo, prodPrice])


    if (productInfoResult.errors) ctx.vtex.logger.error(productInfoResult.errors)
    else if (productInfoResult.data) {
      ctx.state.product = productInfoResult.data.product
      ctx.state.product.items[0].sellers[0].commertialOffer.Price = productPriceResult.data[0].value
      await next()
    }
  } catch (err) {
    ctx.vtex.logger.error(`[Price drop alert] - GetProductDetails - ${ctx.state.requestId} - error getting product details`)
    ctx.vtex.logger.debug(err?.response || err)
  }
}

//notify all subscribers that have that fit the following:
//refId=${refid} AND emailSent=false AND priceSubscription>currentPrice
export async function NotifyDPAlert(ctx: Context, next: () => Promise<any>) {
  const refId = ctx.state.product.productReference
  const currentPrice = ctx.state.product.items[0].sellers[0].commertialOffer.Price
  ctx.state.NotificationsToSend = await GetNotificationsToSend(ctx.clients.masterdata, refId, currentPrice)

  //avoid repeating email address
  const emails = UniqueArray(ctx.state.NotificationsToSend.map(item => item.email))

  ctx.vtex.logger.info(`[Price drop alert] - ${ctx.state.requestId} - number of emails before ${ctx.state.NotificationsToSend.length} and after ${emails.length} - price: ${currentPrice}.`)

  if (emails.length > 0) {
    try {
      const { appSettings, accessToken, product } = ctx.state
      const ProductDetails = BuildProductDetails(product)
      let errors = 0
      const requestQueue = new RequestQueue(() => {
        ctx.vtex.logger.info(`[Price drop alert] - NotifyUsersDPAlert - ${ctx.state.requestId} - Notification flow completed with ${errors} errors`)
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
          appSettings.o2p?.dropPriceAlertKey,
          accessToken
        ],
        callback: (res, err) => {
          if (res) {
            ctx.vtex.logger.info("[Price drop alert] - NotifyUsersDPAlert - req: " + ctx.state.requestId + "- response message :" + res.message);
            return
          }
          errors++
          let msg = err.message != undefined ? err.message : JSON.stringify(err);
          ctx.vtex.logger.error("[Price drop alert] - NotifyUsersDPAlert - req: " + ctx.state.requestId + "- error message :" + msg);
        }
      }))

      requestQueue.Stop()

      next();

    } catch (err) {
      ctx.vtex.logger.error(`[Price drop alert] - ${ctx.state.requestId} - Unexpected error`)
      ctx.vtex.logger.debug(err)
    }
  } else {
    ctx.vtex.logger.info(`[Price drop alert] - ${ctx.state.requestId} - no one need to be notified for the product ${refId}.`)
    return
  }
}

export async function UpdateSubscriptionsDPAlert({ state, vtex: { logger }, clients: { masterdata } }: Context, next: () => Promise<any>) {
  const toUpdate = state.NotificationsToSend
  const requestQueue = new RequestQueue(() => {
    logger.info(`[Price drop alert] - UpdateSubscriptions: update completed with ${errors} errors`)
  }, 50)

  let errors = 0

  toUpdate.forEach(sub => requestQueue.PushRequest({
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

const UniqueArray = (array: any[]) => [...new Set(array)]

const BuildProductDetails = (product: Product) => ({
  ProductName: product.productName,
  ProductCode: product.properties.find(spec => spec.originalName == "CommercialCode_field")?.values[0] || '',
  ProductImage: product.items[0].images[0].imageUrl,
  URL: ACCOUNT == 'bauknechtdeqa' ? `https://${WORKSPACE}--${ACCOUNT}.myvtex.com/${product.linkText}/p` : `https://www.bauknecht.de/${product.linkText}/p`,
})
