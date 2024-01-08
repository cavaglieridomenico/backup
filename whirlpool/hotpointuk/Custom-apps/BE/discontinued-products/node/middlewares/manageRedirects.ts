import { RequestRedirect } from "../typings/request"
import { Route } from "../typings/Rewriter"
import { Authentication } from "../utils/Authentication"
import { DECLARER, RedirectType, TYPE } from "../utils/constants"
import { getRequestPayload, wait } from "../utils/functions"
import { CustomLogger } from "../utils/Logger"

export async function ManageRedirects(ctx: Context, next: () => Promise<any>) {
  await Authentication(ctx);
  let request: RequestRedirect[] = await getRequestPayload(ctx);
  ManageRequest(ctx, request);
  ctx.status = 200;
  await next();
}

const ManageRequest = async (ctx: Context, request: RequestRedirect[]) => {
  let logger = new CustomLogger(ctx)
  for(let i=0; i < request.length; i++){
    let product = request[i];
    product.productLink = product.productLink.toLowerCase();
    product.productLink = product.productLink.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
        disableSitemapEntry: product.type == "discontinued"
      }
      ctx.clients.Rewriter.CreateInternal(route)
      .catch(err => {
        logger.error("Error creating internal for product: " + product.productId)
        logger.debug(err)
      });
    }else{
      ctx.clients.Rewriter.DeleteInternal("/" + product.productLink + "/p")
      .catch(err => {
        logger.error("Error deleting internal for product: " + product.productId)
        logger.debug(err)
      });
    }
    await wait(10);
  }
  let DNR = request.filter(r => r.type=="discontinued" && r.createRedirect).length;
  let DOR = request.filter(r => r.type=="discontinued" && !r.createRedirect).length;
  let UNR = request.filter(r => r.type=="unsellable" && r.createRedirect).length;
  let UOR = request.filter(r => r.type=="unsellable" && !r.createRedirect).length;
  logger.info("Delta update processed --details: DNR: "+DNR+", DOR: "+DOR+", UNR: "+UNR+", UOR: "+UOR);
}
