import { ForbiddenError, ResolverError } from "@vtex/api"
import { PromoResourceKey, vbaseBucket } from "../utils/constants"

export async function GetCouponFile(ctx: Context, next: () => Promise<any>) {

  ctx.set('cache-control', 'no-store')
  ctx.status = 200
  if (ctx.vtex.adminUserAuthToken && await ctx.clients.licenseManager.canAccessResource(ctx.vtex.adminUserAuthToken, PromoResourceKey)) {
    await ctx.clients.vbase.getJSON(vbaseBucket, ctx.vtex.route.params.fileid as string).then((res: any) => {
      ctx.body = res.toString()
      ctx.set("Content-Type", "text/csv")
      ctx.set("Content-Disposition", 'attachment;filename="coupons.csv"')
    }, err => {
      console.error(err)
      throw new ResolverError("Failed to retrieve coupon list")
    })
  } else {
    throw new ForbiddenError("You don't have permission to access this file")
  }
  await next()
}
