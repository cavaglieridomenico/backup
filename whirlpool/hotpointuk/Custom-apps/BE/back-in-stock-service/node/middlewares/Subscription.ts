import { json } from "co-body"
import { Subscription, SubscriptionPayload } from "../typings/Subscription"
import { IsSubscribed, SaveSubscription } from "../utils/SubscriptionHandler"
import { CustomLogger } from "../utils/Logger"

//check if user is already a subscriber on BS for a specific skuId
export async function CheckSubscription(ctx: Context, next: () => Promise<any>) {
  const payload: SubscriptionPayload = await json(ctx.req)
  ctx.state.RefID = payload.refId

  //true if already subscriber else false
  const isAlreadySubscribed = await IsSubscribed(ctx, payload)

  if (isAlreadySubscribed) {
    ctx.status = 304
    ctx.body = {
      message: "User already subscribed"
    }
  } else {
    ctx.state.SubscriptionPayload = payload
    await next()
  }
}


export async function GetProductDetails_Subscription(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx)

  try{

    const refId = ctx.state.RefID

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
    ctx.vtex.logger.error(`[Back-in-stock-service] - error getting product details`)
    ctx.vtex.logger.debug(err?.response || err)
    ctx.status = 500
  }
}

//if previews false, subscribe an user in a BS
export async function Subscribe(ctx: Context, next: () => Promise<any>) {
  const payload = ctx.state.SubscriptionPayload
  const product = ctx.state.product
  const entityFields: Subscription = {
    email: payload.email,
    emailSent: false,
    isBackInStock: false,
    isOutOfStock: false,
    refId: payload.refId,
    language: payload.language,
    productName: product.productName,
    userName: payload.userName,
    linkText: product.linkText
  }

  const subscribed = await SaveSubscription(ctx, entityFields)

  if (subscribed) {
    ctx.body = {
      message: "Successfully subscribed"
    }
    ctx.status = 201
  } else {
    ctx.body = {
      message: "Subscription failed"
    }
    ctx.status = 500
  }
  await next()
}
