import { AppGraphQLClient, CacheLayer, InstanceOptions, IOContext } from "@vtex/api"
import { Product } from "../typing/product"
import { productbyIdentifier } from "../utils/query"

const DEFAULT_LOCALE = 'en-dv'
export default class SearchGraphQL extends AppGraphQLClient {
	cache?: CacheLayer<string, any>
	constructor(context: IOContext, options?: InstanceOptions) {
		context.locale = context.locale || DEFAULT_LOCALE
		if (!context.tenant?.locale) {
			context.tenant = {
				...context.tenant,
				locale: DEFAULT_LOCALE
			}
		}
		super(`vtex.search-resolver@1.x`, context, options)
		this.cache = options && options?.memoryCache
	}

	public async productsBySkuId(skuid: number[], salesChannel = "1") {
		return await this.graphql.query<{ productsByIdentifier: Product[] }, any>({
			query: productbyIdentifier,
			variables: {
				identifiers: skuid,
				salesChannel: salesChannel
			}
		})
	}

}
