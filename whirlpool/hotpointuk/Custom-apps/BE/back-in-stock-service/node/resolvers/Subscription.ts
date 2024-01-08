import { SubscriptionPayload } from "../typings/Subscription"
import { IsSubscribed, SaveSubscription } from "../utils/SubscriptionHandler"

export const Subscribe = async (
  _: any,
  subscription: SubscriptionPayload,
  ctx: any
) => await IsSubscribed(ctx, subscription) || await SaveSubscription(ctx, {
  email: subscription.email,
  emailSent: false,
  isBackInStock: false,
  isOutOfStock: false,
  refId: subscription.refId,
  language: subscription.language,
  productName: subscription.productName,
  userName: subscription.userName,
  linkText: subscription.linkText
})
