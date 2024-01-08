import { ProviderManifest } from "../utils/constants"

export async function GetPaymentMethods(ctx: Context, next: () => Promise<any>) {
  let paymentmethods: string[] = []
  ProviderManifest.paymentMethods.forEach(method => {
    paymentmethods.push(method.name)
  })
  ctx.body = { paymentMethods: paymentmethods }
  ctx.status = 200;
  await next()
}