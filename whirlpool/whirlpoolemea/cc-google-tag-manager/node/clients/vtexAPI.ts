import { CacheLayer, InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { getCacheKey } from '../utils/CommonFunctions'

interface LoggedUser {
  user: string,
  userId: string,
  userType?: string
}
export default class vtex extends JanusClient {

  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken
      }
    })

    this.cache = options && options?.memoryCache
  }

  public async GetCategoryTree(levels: number): Promise<any> {
    const cacheKey = getCacheKey(this.context.account, "categorytree", levels)
    if (await this.cache?.has(cacheKey)) {
      return await this.cache?.get(cacheKey)
    }
    const categoryTree = await this.http.get('/api/catalog_system/pub/category/tree/' + levels)
    this.cache?.set(cacheKey, categoryTree)
    return categoryTree
  }

  public async GetCategory(categoryid: string | number): Promise<any> {
    const cacheKey = getCacheKey(this.context.account, "category", categoryid)
    if (await this.cache?.has(cacheKey)) {
      return await this.cache?.get(cacheKey)
    }
    const category = await this.http.get('/api/catalog/pvt/category/' + categoryid)
    this.cache?.set(cacheKey, category)
    return category
  }

  public async GetLoggedUser(token: string): Promise<LoggedUser> {
    return this.http.get("/api/vtexid/pub/authenticated/user?authToken=" + token, {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  public async GetUserOrders(userEmail: string, page = 1, perPage = 1): Promise<any> {
    return this.http.get(`/api/oms/pvt/orders?q=${userEmail}&page=${page}&per_page=${perPage}&orderBy=creationDate,desc&f_status=ready-for-handling,handling,invoiced`)
  }
}



