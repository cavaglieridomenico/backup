import { APP } from "@vtex/api"
import { PageViewData, UserType } from "../typings/pageViewData"
import { Settings } from "../typings/settings"
import { convertToMillis, getCacheKey, getLoggedUserEmail } from "../utils/CommonFunctions"
import { VBaseBucket } from "../utils/constants"
import { getContentGroupingSecond } from "../utils/macroCategoryMapping"

const regexSlug = /(?<=\/)([\w-]*)(?=\/p)/

export async function GetPageViewDataMiddleware(ctx: Context, next: () => Promise<any>) {
  // ctx.set("Cache-Control", "no-store")
  ctx.body = await GetPageViewData(ctx, ctx.query.path.toString())
  ctx.status = 200
  await next()
}

// resolver graphql
export const GetPageViewDataResolver = async (
  _: any,
  { path }: { path: string },
  ctx: Context
) => GetPageViewData(ctx, path)


const GetPageViewData = async (ctx: Context, path: string) => {
  const response: PageViewData = {
    pageType: "other",
    userType: 'prospect',
    isAuthenticated: false,
    isNewsletterOptIn: false
  }

  await Promise.all([
    GetUserData(ctx, response),
    GetPageData(ctx, path, response)
  ]).catch(() => { })

  return response
}


const GetUserData = async (ctx: Context, output: PageViewData) => {
  const email = await getLoggedUserEmail(ctx)
  if (email) {
    output.isAuthenticated = true
    const [userData, userType] = await Promise.all<any>([
      ctx.clients.masterdata.searchDocuments({
        dataEntity: "CL",
        fields: ['isNewsletterOptIn'],
        pagination: {
          page: 1,
          pageSize: 1
        },
        where: `email=${email}`
      }).then(res => res[0]),
      getUserType(ctx, email)
    ]).catch(() => {
      return [null, 'prospect']
    })

    output.isNewsletterOptIn = (userData?.length && userData[0].isNewsletterOptIn) || false
    output.userType = userType
  }
}


const GetPageData = async (ctx: Context, path: string, output: PageViewData) => {
  const { pageTypes }: Settings = await ctx.clients.apps.getAppSettings(APP.ID)
  const pagetype = pageTypes?.find(pageType => new RegExp(pageType.regex, 's').test(path))
  
  output.pageType = pagetype?.value || 'other'
  output.contentGrouping = pagetype?.contentGrouping || '(Other)'
  switch (output.pageType) {
    case 'detail':
      let slug = path.match(regexSlug)?.[0] || ""
      const segment = await ctx.clients.segment.getSegment()
      const { data: { product } } = await ctx.clients.searchGraphQL.ProductByIdentifier({
        field: "slug",
        value: slug
      }, +segment?.channel).catch((err) => { console.error(err); return { data: { product: {} } } })
      const category = product.categoryId ? await ctx.clients.vtex.GetCategory(product.categoryId) : undefined
      output.productCode = product.productReference
      output.productName = product.productName
      output.category = category?.AdWordsRemarketingCode
      break
    case 'category':
      const cacheKey = getCacheKey(ctx.vtex.account, 'categories')
      let categoryMapping = await ctx.clients.vbase.getJSON<{ [index: string]: { expiration: string, value: string } }>(VBaseBucket, cacheKey, true).catch(() => null)
      output.category = IsValidCache(categoryMapping?.[path]) ? categoryMapping![path].value : undefined
      if (!output.category) {
        const [categoryTree, originalPath] = await Promise.all([
          ctx.clients.vtex.GetCategoryTree(5).catch(() => undefined),
          ctx.clients.rewriter.Get(path).then((res) => res.data?.internal?.get?.resolveAs).catch(() => undefined)
        ])
        let pathToSearch = originalPath || path
        let categoryId = FindCategory(categoryTree, pathToSearch)?.id
        if (categoryId) {
          let category = await ctx.clients.vtex.GetCategory(categoryId)
          output.category = category.AdWordsRemarketingCode
          if (!categoryMapping) {
            categoryMapping = {}
          }
          categoryMapping[path] = {
            expiration: new Date(Date.now() + convertToMillis(2, 'hours')).toISOString(),
            value: category.AdWordsRemarketingCode,
          }
          ctx.clients.vbase.saveJSON(VBaseBucket, cacheKey, categoryMapping).catch(err => console.error(err))
        }
      }
      break
  }
  
  output.contentGroupingSecond = getContentGroupingSecond(output.category)
}

const IsValidCache = (cached?: any) => {
  if (!cached?.expiration) return false

  const now = new Date()
  const expiration = new Date(cached.expiration)
  return expiration.getTime() > now.getTime()
}


const FindCategory = (categoryTree: any[], path: string): any => {
  if (!categoryTree)
    return undefined

  const currentCat = categoryTree.find(cat => {
    const catLink = GetEndpoint(cat.url)
    return path == catLink || path.startsWith(catLink)
  })

  if (GetEndpoint(currentCat?.url) == path)
    return currentCat

  return FindCategory(currentCat?.children, path)
}


const GetEndpoint = (url: string) => url && decodeURIComponent(new URL(url).pathname)

const getUserType = async (ctx: Context, email: string): Promise<UserType> => {
  try {
    if (!email) return 'prospect'

    const orders = await ctx.clients.vtex.GetUserOrders(email)
    if (!orders?.list?.length) return 'prospect'

    const diff = new Date().getTime() - new Date(orders.list[0].creationDate).getTime()
    if (Math.ceil(diff / convertToMillis(1, 'days')) <= 365) return 'hot-customer'

    return 'cold-customer'
  } catch {
    return 'prospect'
  }
}

