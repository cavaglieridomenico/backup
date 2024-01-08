import { Route } from "../typings/Rewriter"
import { Authentication } from "../utils/Authentication"
import { DECLARER, discontinuedSpecification, RedirectType, regexSlug, sellableSpecification, TYPE } from "../utils/constants"
import { CustomLogger } from "../utils/Logger"

export async function FullUpdate(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx)
  await Authentication(ctx)
  ManageRequest(ctx).then(() => {
    ctx.vtex.logger.info("Discontinued - full update completed")
  },
    err => {
      ctx.vtex.logger.error("Discontinued - full update ended with errors")
      ctx.vtex.logger.debug(err)
  })
  ctx.status = 200
  await next()
}

const ManageRequest = async (ctx: Context) => {
  ctx.vtex.logger.info("Full update started")
  let skuList = await ctx.clients.vtexAPI.GetSkuList()
  let promises: Promise<any>[] = []
  skuList.forEach(sku => {
    promises.push(new Promise(async (resolve) => {
      try {
        resolve(await ctx.clients.vtexAPI.GetSKU(sku))
      } catch (err) {
        ctx.vtex.logger.warn("GetSKU request error for ID: " + sku)
        resolve(undefined)
      }
    }))
  })
  let products = await Promise.all(promises)
  products = products.filter(p => p != undefined)
  await Promise.all(products.map(async (p: any) => {
    try {
      p.DetailUrl = p.DetailUrl.toLowerCase();
      if(ctx.query.param=="delete"){
        ctx.clients.Rewriter.DeleteInternal(p.DetailUrl).catch(err => {
          ctx.vtex.logger.error("Error deleting internal for product: " + p.ProductId)
          ctx.vtex.logger.debug(err)
        })
      }
      else if (p.ProductSpecifications.some((ps: any) => ps.FieldName == discontinuedSpecification && ps.FieldValues.includes('true')) && (!ctx.query.param || ctx.query.param == "discontinued")) {
        CreateRedirect(ctx, p, RedirectType.discontinued)
      } else if (p.ProductSpecifications.some((ps: any) => ps.FieldName == sellableSpecification && ps.FieldValues.includes('false')) && (!ctx.query.param || ctx.query.param == "unsellable")) {
        CreateRedirectUnsellable(ctx, p, RedirectType.unsellable)
      } else {
        ctx.clients.Rewriter.DeleteInternal(p.DetailUrl).catch(err => {
          ctx.vtex.logger.error("Error deleting internal for product: " + p.ProductId)
          ctx.vtex.logger.debug(err)
        })
      }
    } catch {
      ctx.vtex.logger.warn("Discontinued - error updating product " + p.ProductId)
    }
  }))
}

const CreateRedirect = async (ctx: Context, product: any, redirectType: RedirectType) => {
  let route: Route = {
    from: product.DetailUrl,
    resolveAs: redirectType,
    declarer: DECLARER,
    type: TYPE,
    id: "discontinued" + "-product-" + product.ProductId,
    query: {
      id: product.ProductId,
      slug: product.DetailUrl.match(regexSlug)[1]
    },
    disableSitemapEntry: true
  }
  ctx.clients.Rewriter.CreateInternal(route).catch(err => {
    ctx.vtex.logger.error("Error creating internal for product: " + product.ProductId)
    ctx.vtex.logger.debug(err)
  })
}

const CreateRedirectUnsellable = async (ctx: Context, product: any, redirectType: RedirectType) => {
  let route: Route = {
    from: product.DetailUrl,
    resolveAs: redirectType,
    declarer: DECLARER,
    type: TYPE,
    id: "unsellable" + "-product-" + product.ProductId,
    query: {
      id: product.ProductId,
      slug: product.DetailUrl.match(regexSlug)[1]
    },
    disableSitemapEntry: false
  }
  ctx.clients.Rewriter.CreateInternal(route).catch(err => {
    ctx.vtex.logger.error("Error creating internal for product: " + product.ProductId)
    ctx.vtex.logger.debug(err)
  })
}
