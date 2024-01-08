import { ACCOUNT, WORKSPACE } from "@vtex/api";
import { MessageResponseBody , Product } from "../typing/types";
import { FormatPrice, GenerateID } from "../utils/function";
import { CustomLogger } from "../utils/Logger";
import { RequestQueue } from "../utils/RequestHandler";

export async function Init(ctx: BackInStockContext | Context , next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx)
  const { emails, refId, isOutOfStock } = (ctx as BackInStockContext).body
  const requestId = GenerateID()
  let label = isOutOfStock ? "[Out of stock]" : "[Back In stock]"
  const emailsToNotify = UniqueArray(emails)
  if (!emailsToNotify || emailsToNotify.length == 0) {
    ctx.vtex.logger.info(`${label} - ${requestId} - received event for product ${refId}. No emails to send`)
    return
  }
  ctx.vtex.logger.info(`${label} - ${requestId} - received event for product ${refId}. Recipients: ${emailsToNotify.join(',')}`)
  ctx.state.settings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  ctx.state.requestId = requestId;
  (ctx as BackInStockContext).body.emails = emailsToNotify
  next();
}

export async function GetProductDetails(ctx: BackInStockContext | Context, next: () => Promise<any>) {
  const { refId, isOutOfStock } = (ctx as BackInStockContext).body
  let label = isOutOfStock ? "[Out of stock]" : "[Back In stock]"
  await ctx.clients.SearchGraphQL.ProductInfo({
    field: "reference",
    value: refId
  }).then(res => {
    if (res.errors) ctx.vtex.logger.error(res.errors)
    else if (res.data) {
      ctx.state.product = res.data.product
      next()
    }
  }).catch(err => {
    ctx.vtex.logger.error(`${label} - ${ctx.state.requestId} - error getting product details`)
    ctx.vtex.logger.debug(err?.response || err)
  })
}

export async function NotifyBackInStock(ctx: BackInStockContext | Context, next: () => Promise<any>) {
  const { emails, refId, isOutOfStock } = (ctx as BackInStockContext).body
  let label = isOutOfStock ? "[Out of stock]" : "[Back In stock]"

  try {
    
    const { settings, sfmcToken, product } = ctx.state
    const key = isOutOfStock ? settings.keyOutOfStock : settings.keyBackInStock
    let ProductDetails : any 
    let sellerIndex : number

    //sellerAccount exist if there is stock (check alredy perfomed by back-in-stock-service app). If not, we take the default one for get the prices in the BuildProductDetails
    if(!isOutOfStock){
      sellerIndex = product.items[0].sellers.findIndex( s => s.sellerId == settings.sellerAccount.name)
    }else{
      sellerIndex = product.items[0].sellers.findIndex( s => s.sellerId == "1")
    }      

    if( sellerIndex != undefined ){
      ProductDetails = BuildProductDetails(product, sellerIndex, !isOutOfStock)  
    } else{
      ctx.vtex.logger.error(`${label} - ${ctx.state.requestId} - Seller error`);    
      return
    }        
    
    let errors = 0
    const requestQueue = new RequestQueue(() => {
      ctx.vtex.logger.info(`${label} - ${ctx.state.requestId} - Notification flow completed with ${errors} errors`)
    }, 50)

    emails.forEach(email => requestQueue.PushRequest({
      client: ctx.clients.SfmcAPI,
      request: ctx.clients.SfmcAPI.SendMessage.name,
      args: [
        settings,
        {
          To: {
            Address: email,
            SubscriberKey: email,
            ContactAttributes: {
              SubscriberAttributes: ProductDetails
            }
          }
        },
        key,
        sfmcToken
      ],
      callback: (res: MessageResponseBody, err) => {
        if (res && !res.responses[0].hasErrors) {
          ctx.vtex.logger.info(`${label} - ${ctx.state.requestId} - Notification sent to ${email} for product ${refId} - response: ${JSON.stringify(res)}`)
          return
        }
        errors++
        ctx.vtex.logger.error(`${label} - ${ctx.state.requestId} - Error sending notification to ${email} for product ${refId}`)
        ctx.vtex.logger.debug(res || err?.response || err || "Unexpected error")
      }
    }))

    requestQueue.Stop()

    next();
  } catch (err) {
    ctx.vtex.logger.error(`[Back In stock] - ${ctx.state.requestId} - Unexpected error`)
    ctx.vtex.logger.debug(err)
  }
}

const UniqueArray = (array: any[]) => [...new Set(array)]

const BuildProductDetails = (product: Product, sellerIndex : number, available : boolean) => ({
  ProductName: product.productName,
  ProductCode: product.properties.find(spec => spec.originalName == "CommercialCode_field")?.values[0] || '',
  Availability: available ? "True" : "False",
  ProductImage: product.items[0].images[0].imageUrl,
  URL: ACCOUNT == 'hotpointitqa' ? `https://${WORKSPACE}--${ACCOUNT}.myvtex.com/${product.linkText}/p` : `https://www.hotpoint.it/${product.linkText}/p`,
  RegPrice: FormatPrice(product.items[0].sellers[sellerIndex].commertialOffer.ListPrice),
  RedPrice: FormatPrice(product.items[0].sellers[sellerIndex].commertialOffer.Price)
})


  
  
  
  