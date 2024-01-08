import { addOrderId, searchGaOrder } from '../utils/functions'

export async function GaOrderIsAlreadyPushed(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-store")
  const orderId = ctx.vtex.route.params.orderId as string
  const addIfNotPresent = ctx.query.addIfNotPresent as string || "false"

  const results = await searchGaOrder(ctx.clients.masterdata, orderId, addIfNotPresent)

  ctx.status = 200
  ctx.body = {
    orderIsAlreadyBeenPushed: results ? true : false
  }

  await next()
}

export async function PushOrderId(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-store")
  const orderId = ctx.vtex.route.params.orderId as string

  const results = await addOrderId(ctx.clients.masterdata, orderId)

  ctx.status = 200
  ctx.body = {
    orderHasBeenPushed: results ? true : false
  }

  await next();
}
