import { ClientsConfig, LRUCache, ServiceContext, Service } from '@vtex/api'
import { Clients } from './clients'
import { GetAssociationResolver } from './middlewares/GetAssociation'
import { GetDiscountDataResolver } from './middlewares/GetDiscountData'

const TIMEOUT_MS = 5000

const memoryCache = new LRUCache<string, any>({ max: 500, maxAge: 1000 * 60 * 10, stale: false })

const clients: ClientsConfig<Clients> = {
	implementation: Clients,
	options: {
		default: {
			retries: 2,
			timeout: TIMEOUT_MS,
			memoryCache: memoryCache
		},
	},
}

declare global {
	type Context = ServiceContext<Clients>
}

export default new Service({
	clients,
	graphql: {
		resolvers: {
			Query: {
				retrieveAssociation: GetAssociationResolver,
			},
			Mutation: {
				discountData: GetDiscountDataResolver
			},
		}
	}
})
