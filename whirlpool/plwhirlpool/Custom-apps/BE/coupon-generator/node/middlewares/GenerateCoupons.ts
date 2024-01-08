import { json } from "co-body"
import { RequestBody } from "../typings/requestBody"
import { FormatDate } from "../utils/DateFormatter"
import { CustomLogger } from "../utils/Logger"

export async function GenerateCoupon(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx)
  let reqBody: RequestBody = await json(ctx.req)

  await ctx.clients.Vtex.GenerateCoupons(reqBody.quantity, {
    utmCampaign: reqBody.utmCampaign,
    utmSource: reqBody.utmSource,
    isArchived: false,
    maxItemsPerClient: 0,
    couponCode: reqBody.couponCode.toLocaleUpperCase()
  }).then(res => {
    ctx.set('Content-type', 'application/json')
    ctx.vtex.logger.info("Generated " + reqBody.quantity + " coupons " + JSON.stringify(reqBody.email ? ("for: " + reqBody.email) : ""))
    ctx.body = { couponlist: res }
    ctx.status = 200
  }, (err) => {
    ctx.status = 500
    ctx.body = { message: "Error while generating coupons, please contact the development team for further details", couponlist: [] }
    ctx.vtex.logger.error("Error while generating coupons --err: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err))
  })

  if (ctx.status == 200) {
    if (reqBody.email) {
      await ctx.clients.masterdata.createDocument({
        dataEntity: "CG",
        fields: {
          email: reqBody.email,
          subject: "Generated coupons - " + FormatDate()
        }
      }).then(res => {
        ctx.clients.Vtex.UploadFile(res.DocumentId, 'file', `generated_coupons_${FormatDate().replace(/\//g, '-').replace(/\./g, '-')}.csv`, (ctx.body as any)?.couponlist.toString())
      }, (err) => {
        ctx.body = { message: "Coupon generated but an error occured while saving the file with the coupon list, please copy them from the box below", couponlist: (ctx.body as any)?.couponlist ?? [] }
        ctx.vtex.logger.error("Error saving coupons list --err: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err))
        ctx.vtex.logger.debug("Coupon code generated: " + JSON.stringify((ctx.body as any)?.couponlist ?? []))
        ctx.status = 500
      })
    }
  }

  await next()
}
