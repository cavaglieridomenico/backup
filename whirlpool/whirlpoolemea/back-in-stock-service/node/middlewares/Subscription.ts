import { json } from "co-body"
import { Subscription, SubscriptionPayload } from "../typings/Subscription"
import { IsSubscribed, SaveSubscription } from "../utils/SubscriptionHandler"

//check if user is already a subscriber on BS for a specific skuId
export async function CheckSubscription(ctx: Context, next: () => Promise<any>) {
  const payload: SubscriptionPayload = await json(ctx.req)

  //true if already subscriber else false
  const isAlreadySubscribed = await IsSubscribed(ctx, payload)

  if (isAlreadySubscribed) {
    ctx.status = 304
  } else {
    ctx.state.SubscriptionPayload = payload
    await next()
  }
}

//if previews false, subscribe an user in a BS
export async function Subscribe(ctx: Context, next: () => Promise<any>) {
  const payload = ctx.state.SubscriptionPayload
  const entityFields: Subscription = {
    email: payload.email,
    emailSent: false,
    isBackInStock: false,
    isOutOfStock: false,
    refId: payload.refId
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
