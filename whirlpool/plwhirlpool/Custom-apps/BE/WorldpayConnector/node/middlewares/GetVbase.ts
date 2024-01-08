import { VBaseBucket } from "../utils/constants"


export async function GetVbase(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  let orderid = ctx.vtex.route.params.orderid as string
  console.log("[Get Vbase] order:" + orderid)
  let existingPayment: any = undefined
  try {
    existingPayment = await ctx.clients.vbase.getJSON(VBaseBucket, orderid, true).catch(() => undefined) 
    ctx.clients.vbase.deleteFile(VBaseBucket, orderid )   
  } catch (err) {
    console.log("[Get Vbase] order:" + orderid + " - Error retrieving payment on Vbase")
    console.log(err)
  }
  if (existingPayment== undefined) {
    console.log("[Get Vbase] order:" + orderid + " - Order payment not found in Vbase")
    ctx.status = 400
  } else {
    console.log("[Get Vbase] order:" + orderid + " - Order payment found in Vbase")
    ctx.status = 200
    ctx.body = JSON.stringify(existingPayment)
  }

  await next()
}