import { ACCOUNT, WORKSPACE, LINKED } from "@vtex/api";
import { AppSettings } from "../typings/config";
import { ProductSearchGQL } from "../typings/types";
import { FormatPrice, GenerateID } from "../utils/functions";
import { RequestQueue } from "../utils/RequestHandler";

export async function Init(ctx: BackInStockContext | Context , next: () => Promise<any>) {
  const { emails, refId, isOutOfStock } = (ctx as BackInStockContext).body
  const requestId = GenerateID()
  const emailsToNotify = UniqueArray(emails)
  let label = isOutOfStock ? "[Out of stock]" : "[Back In stock]"
  if (!emailsToNotify || emailsToNotify.length == 0) {
    ctx.state.logger.info(`${label} - ${requestId} - received event for product ${refId}. No emails to send`)
    return
  }
  ctx.state.logger.info(`${label} - ${requestId} - received event for product ${refId}. Recipients: ${emailsToNotify.join(',')}`)
  ctx.state.requestId = requestId;
  (ctx as BackInStockContext).body.emails = emailsToNotify
  next();
}

export async function GetProductDetails(ctx: BackInStockContext | Context , next: () => Promise<any>) {
  const { refId , isOutOfStock } = (ctx as BackInStockContext).body
  let label = isOutOfStock ? "[Out of stock]" : "[Back In stock]"
  await ctx.clients.SearchGraphQL.ProductInfo({
    field: "reference",
    value: refId
  }).then(res => {
    if (res.errors) ctx.state.logger.error(res.errors)
    else if (res.data) {
      ctx.state.productSearchGQL = res.data.product
      next()
    }
  }).catch(err => {
    ctx.state.logger.error(`${label} - ${ctx.state.requestId} - error getting product details`)
    ctx.state.logger.debug(err?.response || err)
  })
}

export async function NotifyBackInStock(ctx: BackInStockContext | Context , next: () => Promise<any>) {
  const { emails, isOutOfStock } = (ctx as BackInStockContext).body
  let label = isOutOfStock ? "[Out of stock]" : "[Back In stock]"

  try {

    const { appSettings, accessToken, productSearchGQL } = ctx.state
    const key = isOutOfStock ? appSettings.o2p?.outOfStockKey?.find( e => e.key?.toLowerCase() == appSettings.vtex.defaultLocale5C.toLowerCase())?.value : appSettings.o2p?.backInStockKey?.find( e => e.key?.toLowerCase() == appSettings.vtex.defaultLocale5C.toLowerCase())?.value
    let ProductDetails : any
    let sellerIndex = productSearchGQL.items[0].sellers.findIndex( s => s.sellerId == appSettings.vtex.sellerAccount?.name)

    //check the seller
    if(sellerIndex != undefined &&  sellerIndex >= 0 ){
      ProductDetails = BuildProductDetails(appSettings ,productSearchGQL,sellerIndex)
    }else{
      ctx.state.logger.error(`${label} - ${ctx.state.requestId} - No available quantity for the current Seller selected`)
      return
    }

    let errors = 0
    const requestQueue = new RequestQueue(() => {
      ctx.state.logger.info(`${label} - ${ctx.state.requestId} - Notification flow completed with ${errors} errors`)
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
        key,
        accessToken
      ],
      callback: (res , err) => {
        if (res) {
          ctx.state.logger.info(`${label} - ${res.message}`)
          return
        }
        errors++
        ctx.state.logger.error(`${label} - ${err.message}`)
        ctx.state.logger.debug(res || err?.message || err || "Unexpected error")
      }
    }))

    requestQueue.Stop()

    next();
  } catch (err) {
    ctx.state.logger.error(`${label} - ${ctx.state.requestId} - Unexpected error`)
    ctx.state.logger.debug(err)
  }
}

const UniqueArray = (array: any[]) => [...new Set(array)]

const BuildProductDetails = ( appSettings: AppSettings ,product: ProductSearchGQL, sellerIndex: number) => ({
  ProductName: product.productName,
  ProductCode: product.properties.find(spec => spec.originalName == "CommercialCode_field")?.values[0] || '',
  Availability: IsAvailable(product, sellerIndex) ? "True" : "False",
  ProductImage: product.items[0].images[0].imageUrl,
  URL: LINKED ? `https://${WORKSPACE}--${ACCOUNT}.myvtex.com/${product.linkText}/p` : `https://${appSettings.o2p?.hostname}/${product.linkText}/p`,
  RegPrice: FormatPrice(product.items[0].sellers[sellerIndex].commertialOffer.ListPrice),
  RedPrice: FormatPrice(product.items[0].sellers[sellerIndex].commertialOffer.Price)
})

const IsAvailable = (product: ProductSearchGQL, sellerIndex: number) =>
  product.properties.some(spec => spec.originalName == "sellable" && spec.values[0]?.toLowerCase() == 'true') &&
  product.properties.some(spec => spec.originalName == "isDiscontinued" && spec.values[0]?.toLowerCase() == 'false') &&
  product.items[0].sellers[sellerIndex].commertialOffer.AvailableQuantity > 0



