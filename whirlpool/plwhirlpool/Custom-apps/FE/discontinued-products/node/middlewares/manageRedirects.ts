import { json } from "co-body"
import { RequestRedirect } from "../typings/request"
import { Route } from "../typings/Rewriter"
import { Authentication } from "../utils/Authentication"
import { DECLARER, RedirectType, TYPE } from "../utils/constants"
import { CustomLogger } from "../utils/Logger"

export async function ManageRedirects(ctx: Context, next: () => Promise<any>) {

  await Authentication(ctx)

  let request: RequestRedirect[] = await json(ctx.req)
  ManageRequest(ctx, request)
  ctx.status = 200
  await next()
}

const ManageRequest = async (ctx: Context, request: RequestRedirect[]) => {
  //console.log(JSON.stringify(request))


  ctx.vtex.logger = new CustomLogger(ctx)
  request.forEach(product => {
    //console.log((RedirectType as any)[product.type])
    product.productLink = product.productLink.toLowerCase()
    if (product.createRedirect == "true" || product.createRedirect == true) {
      let route: Route = {
        from: "/" + product.productLink + "/p",
        resolveAs: (RedirectType as any)[product.type],
        declarer: DECLARER,
        type: TYPE,
        id: product.type + "-product-" + product.productId,
        query: {
          id: product.productId,
          slug: product.productLink
        },
        disableSitemapEntry: true
      }
      //console.log("creating internal:" + JSON.stringify(route))
      ctx.clients.Rewriter.CreateInternal(route).catch(err => {
        ctx.vtex.logger.error("Error creating internal for product: " + product.productId)
        ctx.vtex.logger.debug(err)
      })
    } else {
      //console.log("deleting internal")
      ctx.clients.Rewriter.DeleteInternal("/" + product.productLink + "/p").catch(err => {
        ctx.vtex.logger.error("Error deleting internal for product: " + product.productId)
        ctx.vtex.logger.debug(err)
      })
    }
  })
}
