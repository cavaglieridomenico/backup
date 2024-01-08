import { AppGraphQLClient, GraphQLResponse, InstanceOptions, IOContext } from '@vtex/api'
import { ProductDetailsResponse, ProductIdentifier } from '../typings/Product'
import { ProductInfo } from '../utils/GraphqlQueries'


const DEFAULT_LOCALE = 'it-IT'

export default class SearchGraphQL extends AppGraphQLClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    context.locale = context.locale || DEFAULT_LOCALE
    if (!context.tenant?.locale) {
      context.tenant = {
        ...context.tenant,
        locale: DEFAULT_LOCALE
      }
    }
    super(`vtex.search-resolver@1.x`, context, options)
  }

  public async ProductInfo(productIdentifier: ProductIdentifier, salesChannel: number = 1): Promise<GraphQLResponse<ProductDetailsResponse>> {
    return this.graphql.query<ProductDetailsResponse, any>({
      query: ProductInfo,
      variables: {
        identifier: productIdentifier,
        salesChannel: salesChannel
      }
    })
  }
}
