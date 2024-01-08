import { Route } from "../typings/Rewriter"
import { Authentication } from "../utils/Authentication"
import { DECLARER, discontinuedSpecification, RedirectType, regexSlug, sellableSpecification, TYPE } from "../utils/constants"
import { CustomLogger } from "../utils/Logger"

export async function FullUpdate(ctx: Context, next: () => Promise<any>) {

  ctx.vtex.logger = new CustomLogger(ctx)

  await Authentication(ctx)

  ManageRequest(ctx).then(() => {
    //console.log("completed")
    ctx.vtex.logger.info("Discontinued - full update completed")
  },
    err => {
      //console.log(err)
      ctx.vtex.logger.error("Discontinued - full update ended with an error")
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

  //console.log(products.length)

  products = products.filter(p => p != undefined)

  await Promise.all(products.map(async (p: any) => {
    try {
      p.DetailUrl = p.DetailUrl.toLowerCase()
      if (p.ProductSpecifications.some((ps: any) => ps.FieldName == discontinuedSpecification && ps.FieldValues.includes('true'))) {
        if(ctx.query.param==undefined || ctx.query.param=="discontinued"){
          CreateRedirect(ctx, p, RedirectType.discontinued)
        }
      } else if (p.ProductSpecifications.some((ps: any) => ps.FieldName == sellableSpecification && ps.FieldValues.includes('false'))) {
        if(ctx.query.param==undefined || ctx.query.param=="unsellable"){
          CreateRedirect(ctx, p, RedirectType.unsellable)
        }
      } else {
        //console.log("Deleting internal " + p.ProductId)
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
    id: (redirectType == RedirectType.discontinued ? "discontinued" : "unsellable") + "-product-" + product.ProductId,
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
