import { Recommendation } from "../typings/types";
import { getSFMCDataByHostname, isValid, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function getProductRecommendations(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  let logger = new CustomLogger(ctx);
  try {
    let authToken = ctx.cookies.get(ctx.state.appSettings.vtex.mpAuthCookie);
    let email = (await ctx.clients.VtexMP.getAuthenticatedUser(authToken)).data?.user;
    let sfmcData = getSFMCDataByHostname(ctx);
    let locale = isValid(ctx.query.locale) ? ctx.query.locale as string : ctx.state.appSettings!.vtex.defaultLocale5C;
    let pathParam = isValid(ctx.query.page) ? ctx.query.page as string : undefined;
    let recommendations = await ctx.clients.SFMCRecommender.getEinsteinRecommendations(sfmcData!, email, locale, pathParam);
    let skuToReturn: number[] = [];
    let skuPromises: Promise<any>[] = [];
    recommendations[0]?.items?.forEach((r: Recommendation) => {
      if (r.image_link?.includes(ctx.vtex.account)) {
        skuPromises.push(new Promise<any>((resolve) => {
          ctx.clients.VtexMP.getSkuByRefId(r.sku_id)
            .then(res => {
              resolve(res.data);
            })
            .catch(() => {
              resolve(undefined);
            })
        }))
      }
    })
    let skuPromisesResponses = await Promise.all(skuPromises);
    skuPromisesResponses.forEach((s: { Id: number } | undefined) => {
      if (s) {
        skuToReturn.push(s.Id);
      }
    })
    ctx.status = 200;
    ctx.body = skuToReturn;
  } catch (err) {
    //console.error(err);
    ctx.host?.includes(ctx.vtex.account) ? null : logger.warn("Product recommendations: error --details: " + stringify(err));
    ctx.status = 500;
    ctx.body = "Internal Server Error"
  }
  await next()
}
