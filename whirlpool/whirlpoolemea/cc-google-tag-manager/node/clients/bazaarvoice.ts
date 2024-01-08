import { CacheLayer, ExternalClient, GraphQLResponse, InstanceOptions, IOContext } from '@vtex/api'
import { getCacheKey } from '../utils/CommonFunctions'

export default class bazaarvoice extends ExternalClient {

  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.workspace ? context.workspace + '--' : ''}${context.account}.myvtex.com`, context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken
      }
    })

    this.cache = options && options?.memoryCache
  }

  public async GetReviewStats(sort: string, filter: number, offset: number, pageId: string, quantity: number): Promise<any> {
    const cacheKey = getCacheKey(this.context.account, sort, filter, offset, pageId, quantity)
    if (await this.cache?.has(cacheKey)) {
      return { data: await this.cache?.get(cacheKey), errors: null }
    }
    const data = {
      query: `query ($sort: String!, $filter: Int, $offset: Int, $pageId: String, $quantity: Int) {
      productReviews(sort: $sort, filter: $filter, offset: $offset, pageId: $pageId, quantity: $quantity) {
        Includes {
          Products {
            ReviewStatistics {
              TotalReviewCount
              AverageOverallRating
              SecondaryRatingsAverages {
                Id
                AverageRating
              }
            }
          }
        }
      }
    }`,
      variables: { sort: sort, filter: filter, offset: offset, pageId: pageId, quantity: quantity }
    }

    const reviewData = await this.http.post<GraphQLResponse<any>>(`/_v/private/graphql/v1`, data)
    reviewData.data && this.cache?.set(cacheKey, reviewData.data)
    return reviewData
  }
}

