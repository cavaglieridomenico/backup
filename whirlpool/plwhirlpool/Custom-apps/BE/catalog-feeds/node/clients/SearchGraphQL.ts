import { AppGraphQLClient, GraphQLResponse, InstanceOptions, IOContext } from '@vtex/api'
import { Product, ProductDetailsResponse, ProductIdentifier } from '../typings/productDetails'
import { deafultLocale, productCommercialOfferQuery, productDetailsQuery, filteredSearch } from '../utils/constants'
import { readFileSync } from 'fs'
import { join } from 'path'

const MAX_PRODUCTS = 100
export default class SearchGraphQL extends AppGraphQLClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    context.locale = context.locale || deafultLocale
    if (!context.tenant?.locale) {
      context.tenant = {
        ...context.tenant,
        locale: deafultLocale
      }
    }
    super(`vtex.search-resolver@1.x`, context, options)
  }

  public async Productdetails(productIdentifier: ProductIdentifier, salesChannel: number): Promise<GraphQLResponse<ProductDetailsResponse>> {
    return this.graphql.query<ProductDetailsResponse, any>({
      query: readFileSync(join(__dirname, '..', 'graphql', productDetailsQuery), 'utf-8'),
      variables: {
        identifier: productIdentifier,
        salesChannel: salesChannel
      }
    })
  }

  public async ProductCommercialOffer(productIdentifier: ProductIdentifier, salesChannel: number): Promise<GraphQLResponse<ProductDetailsResponse>> {
    return this.graphql.query<ProductDetailsResponse, any>({
      query: productCommercialOfferQuery,
      variables: {
        identifier: productIdentifier,
        salesChannel: salesChannel
      }
    })
  }

  public async ProductsByCollection(collectionIdentifier?: String, salesChannel: string = "1", from: number = 0, to: number = MAX_PRODUCTS - 1): Promise<Product[]> {
    const { data: searchResult, errors } = await this.graphql.query<{ products: Product[] }, any>({
      query: readFileSync(join(__dirname, '..', 'graphql', filteredSearch), 'utf-8'),
      variables: {
        collectionId: collectionIdentifier,
        salesChannel: salesChannel,
        from: from,
        to: to
      }
    }, {
      validateStatus: () => true
    })
    if (errors) throw new Error(JSON.stringify(errors))
    if (searchResult?.products == undefined) throw new Error('Search failed')
    if (searchResult.products.length < MAX_PRODUCTS) return searchResult.products
    return searchResult.products.concat(await this.ProductsByCollection(collectionIdentifier, salesChannel, to + 1, to + MAX_PRODUCTS - 1))
  }

}
