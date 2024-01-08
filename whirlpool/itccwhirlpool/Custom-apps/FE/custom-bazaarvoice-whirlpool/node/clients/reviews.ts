import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

import { BazaarVoiceReviews } from '../typings/reviews'

interface GetReviewArgs {
  appKey: string
  fieldProductId: string
  sort: string | null
  offset: string
  filter: string
  quantity: number
  contentLocale: string
  include?: string | null
  stats?: string | null
  search?: string | null
}

export default class Reviews extends ExternalClient {
  env: any = ''

  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, options)
  }

  public async getReviews({
    appKey,
    fieldProductId,
    sort,
    offset,
    filter,
    quantity,
    contentLocale,
    include,
    stats,
    search,
  }: GetReviewArgs): Promise<BazaarVoiceReviews> {
    /*const endpoint =
      this.env +
      `/data/reviews.json?apiversion=5.4&passkey=${appKey}&Filter=ProductId:eq:${fieldProductId}&Sort=${sort}&Limit=${quantity}&Offset=${offset}&Include=Products,Comments&Stats=Reviews&Filter=${
        filter ? `Rating:eq:${filter}` : 'IsRatingsOnly:eq:false'
      }${
        contentLocale ? `&Filter=ContentLocale:eq:${contentLocale}` : ``
      }&IncentivizedStats=true`*/

    // static locale parameter to de_DE
    let endpoint =
      this.env +
      `/data/reviews.json?apiversion=5.4&locale=it_IT&passkey=${appKey}&Filter=ProductId:eq:${fieldProductId}&Limit=${quantity}&Offset=${offset}&Filter=${
        filter ? `Rating:eq:${filter}` : 'IsRatingsOnly:eq:false'
      }${
        contentLocale ? `&Filter=ContentLocale:eq:${contentLocale}` : ``
      }&IncentivizedStats=true`

    // manage default parameters
    if (include !== null) {
      endpoint += `&Include=${include}`
    }

    if (stats !== null) {
      endpoint += `&Stats=${stats}`
    }

    if (search !== null) {
      endpoint += `&Search=${search}`
    }

    if (sort !== null) {
      endpoint += `&Sort=${sort}`
    }

    return this.http.get(endpoint, {
      metric: 'bazaarvoice-get-reviews',
    })
  }

  public async getReview({ reviewId, appKey }: any) {
    const endpoint =
      this.env +
      `/data/reviews.json?apiversion=5.4&passkey=${appKey}&filter=id:${reviewId}&IncentivizedStats=true`

    return this.http.get(endpoint, {
      metric: 'bazaarvoice-get-reviews',
    })
  }
}
