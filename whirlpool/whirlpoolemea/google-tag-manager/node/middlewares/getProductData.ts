import { APP } from '@vtex/api'
import { GraphQLResolveInfo, FieldNode } from 'graphql'
import { ProductUniqueIdentifier } from "../typings/product"
import { Settings } from "../typings/settings"
import { REVIEW_FIELDS } from "../utils/constants"
import { CustomLogger } from "../utils/Logger"
import { getMacroCategory } from "../utils/macroCategoryMapping"



export async function getProductDataMid(ctx: Context, next: () => Promise<any>) {
  const slug: ProductUniqueIdentifier = { field: ctx.query.field as ProductUniqueIdentifier['field'], value: ctx.query.key };
  const sc = ctx.query.sc || '1'
  const product = await getProductData(ctx, slug, +sc)
  ctx.status = product == null ? 500 : 200
  ctx.body = product

  await next()
}

export const getProductDataResolver = (
  _: any,
  { identifier, salesChannel }: { identifier: ProductUniqueIdentifier, salesChannel: number },
  ctx: Context,
  info: GraphQLResolveInfo
) => {
  const withReviews = info.fieldNodes.some(node => node.selectionSet?.selections.some(sel => REVIEW_FIELDS.includes((sel as FieldNode).name?.value)))
  return getProductData(ctx, identifier, salesChannel, withReviews)
}

const getProductData = async (ctx: Context, identifier: ProductUniqueIdentifier, salesChannel: number = 1, withReviews = true) => {
  const logger = new CustomLogger(ctx)
  try {
    const segment = await ctx.clients.segment.getSegment()
    const [settings, { data: productRes, errors }] = await Promise.all([
      ctx.clients.apps.getAppSettings(APP.ID) as Promise<Settings>,
      ctx.clients.searchGraphQL.ProductByIdentifier(identifier, +(segment?.channel) || salesChannel),
    ])
    const product = productRes?.product
    const productIdentifier = {
      linkText: product?.linkText,
      productId: product?.productId,
      productReference: product?.items?.[0]?.referenceId?.find((ref: { Key: string }) => ref.Key == "RefId")?.Value || product?.productReference,
    }

    if (product == null) throw new Error(JSON.stringify(errors))
    //get attributes and category
    const [category, dataAttributes] = await Promise.all([
      ctx.clients.vtex.GetCategory(product.categoryId),
      settings.reviewSource == "bazaarvoice" && withReviews ? ctx.clients.bazaarvoice.GetReviewStats(
        "Helpfulness:desc,SubmissionTime:desc",
        0,
        0,
        JSON.stringify(productIdentifier),
        1
      ) : null
    ])
    // saving all the value of the category in the product
    product.category = category.AdWordsRemarketingCode
    product.macroCategory = getMacroCategory(product, settings)
    const productReviewStats = dataAttributes?.data?.productReviews?.Includes?.Products[0]?.ReviewStatistics
    product.totalReviews = productReviewStats?.TotalReviewCount
    product.averageOverallRating = productReviewStats?.AverageOverallRating
    product.secondaryRatingsAverages = productReviewStats?.SecondaryRatingsAverages
    return product
  } catch (err) {
    logger.error(`[getProductData] - Failed to get product data`)
    logger.debug(err?.response?.data || err?.response || err)
    return null
  }
}
