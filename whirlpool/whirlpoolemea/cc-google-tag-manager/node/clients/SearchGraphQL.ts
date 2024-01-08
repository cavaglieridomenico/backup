import { AppGraphQLClient, CacheLayer, InstanceOptions, IOContext } from '@vtex/api'
import { Product, ProductUniqueIdentifier } from '../typings/product'
import { getCacheKey } from '../utils/CommonFunctions'
import { PRODUCT_QUERY } from '../utils/constants'

const DEFAULT_LOCALE = 'en-dv'

export default class searchGraphQL extends AppGraphQLClient {

  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    context.locale = context.locale || DEFAULT_LOCALE
    if (!context.tenant?.locale) {
      context.tenant = {
        ...context.tenant,
        locale: DEFAULT_LOCALE,
      }
    }
    super(`vtex.search-resolver@1.x`, context, options)
    this.cache = options && options?.memoryCache
  }

  public async ProductByIdentifier(identifier: ProductUniqueIdentifier, salesChannel: number = 1) {
    const cacheKey = getCacheKey(this.context.account, 'product', identifier.field.toString(), identifier.value.toString(), salesChannel)
    if (await this.cache?.has(cacheKey)) {
      return { data: await this.cache?.get(cacheKey), errors: null }
    }
    const productRes = await this.graphql.query<{ product: Product }, any>({
      query: PRODUCT_QUERY,
      variables: {
        identifier: identifier,
        salesChannel: salesChannel,
      }
    })
    productRes.data && this.cache?.set(cacheKey, productRes.data)
    return productRes
  }

}
