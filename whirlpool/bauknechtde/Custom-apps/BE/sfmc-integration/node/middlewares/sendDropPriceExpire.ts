import { MasterData } from "@vtex/api"
import { ACCOUNT, WORKSPACE } from "@vtex/api";
import { CustomLogger } from "../utils/Logger"
import { GenerateID } from "../utils/functions";
import { RequestQueue, RequestWithRetry } from "../utils/RequestHandler"
import { Subscription } from "../typings/DropPriceSubscription"
import { SearchWithPaginationResponse } from "../typings/MasterData"
import { DROP_PRICE_ENTITY_FIELDS, DROP_PRICE_MASTER_DATA_ENTITY, DROP_PRICE_MAX_RESULTS } from "../utils/constants"
import { Product } from "../typings/types";
import { json } from "co-body"

//get product's details
export async function GetProductDetailsREF(ctx: Context , next: () => Promise<any>) {
    ctx.vtex.logger = new CustomLogger(ctx)
    const data = await json(ctx.req)
    ctx.state.dpEmailUser = data.email
    const refId = data.refId
    ctx.state.requestId = GenerateID()    
    ctx.vtex.logger.info("[Price drop expire] - incoming req: " + ctx.state.requestId + "- for:"  + ctx.state.dpEmailUser + " - refID: " + refId);   
    
    try{       
      const productInfo = await ctx.clients.SearchGraphQL.ProductInfo({
        field: "reference",
        value: refId
      })  
  
      if (productInfo.errors){
        ctx.vtex.logger.error(productInfo.errors)
        ctx.status = 500;
        ctx.body = "Internal Server Error";
      } else if (productInfo.data) {
        ctx.state.product = productInfo.data.product        
        await next()
      }
    } catch (err) {
      ctx.vtex.logger.error(`[Price drop expire] - ${ctx.state.requestId} - error getting product details`)
      ctx.vtex.logger.debug(err?.response || err)
      ctx.status = 500;
      ctx.body = "Internal Server Error";
    }
}

//notify all subscribers that have that fit the following:
//refId=${refid} AND emailSent=false
export async function NotifyDPExpire(ctx: Context , next: () => Promise<any>) {
    const refId = ctx.state.product.productReference 
    ctx.state.NotificationsToSend = await GetNotificationsToSend(ctx.clients.masterdata, refId, ctx.state.dpEmailUser)
    //avoid repeating email address
    const emails = UniqueArray(ctx.state.NotificationsToSend.map(item => item.email))   
     
    if(emails.length > 0) {
        try {
            const { appSettings, accessToken , product } = ctx.state
            const ProductDetails = BuildProductDetails(product)
            let errors = 0
            const requestQueue = new RequestQueue(() => {
              ctx.vtex.logger.info(`[Price drop expire] - ${ctx.state.requestId} - Notification flow completed with ${errors} errors`)
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
                appSettings.o2p?.dropPriceExpireKey,
                accessToken
              ],
              callback: (res, err) => {
                if (res) {
                  ctx.vtex.logger.info("[Price drop expire] - req: " + ctx.state.requestId + "- response message :"  + res.message);
                  return
                }
                errors++
                let msg = err.message!=undefined?err.message:JSON.stringify(err);
                ctx.vtex.logger.error("[Price drop expire] - req: " + ctx.state.requestId + "- error message :" + msg);                 
              }
            }))
        
            requestQueue.Stop()
            next();

          } catch (err) {
            ctx.status = 500                
            ctx.vtex.logger.error(`[Price drop expire] - ${ctx.state.requestId} - Unexpected error`)
            ctx.vtex.logger.debug(err)
          }
    }else{
        ctx.vtex.logger.info(`[Price drop expire] - ${ctx.state.requestId} - no one need to be notified for the product ${refId}.`)
        return
    }
}


export async function UpdateSubscriptionsExpireAlert({ state, vtex: { logger }, clients: { masterdata } }: Context, next: () => Promise<any>) {
    const toUpdate = state.NotificationsToSend
    const requestQueue = new RequestQueue(() => {
      logger.info(`[Price drop expire] - UpdateSubscriptions: update completed with ${errors} errors`)
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

  const UniqueArray = (array: any[]) => [...new Set(array)]

  const BuildProductDetails = (product: Product) => ({
    ProductName: product.productName,
    ProductCode: product.properties.find(spec => spec.originalName == "CommercialCode_field")?.values[0] || '',
    ProductImage: product.items[0].images[0].imageUrl,
    URL: ACCOUNT == 'bauknechtdeqa' ? `https://${WORKSPACE}--${ACCOUNT}.myvtex.com/${product.linkText}/p` : `https://www.bauknecht.de/${product.linkText}/p`,    
  })
  