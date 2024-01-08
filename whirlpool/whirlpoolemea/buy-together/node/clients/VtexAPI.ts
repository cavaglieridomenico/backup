import { CacheLayer, InstanceOptions, IOContext, JanusClient } from "@vtex/api"
import { BodyDiscount, DiscountData, Product } from "../typing/product"
import { getCacheKey } from "../utils/CommonFunctions"
export default class VtexAPI extends JanusClient {

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


	public async productBySku(skuid: number): Promise<Product> {
		return new Promise(async (resolve, reject) => {
			let cacheKey = getCacheKey(this.context.account, "product", skuid)
			if (await this.cache?.has(cacheKey)) {
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			this.http.get(`/api/catalog/pvt/product/${skuid}`)
				.then(res => {
					this.cache?.set(cacheKey, res);
					resolve(res);
				})
				.catch(err => {
					reject(err);
				})
		})
	}

	public async discountData(items: DiscountData[], salesChannel = "1"): Promise<any> {
		let body: BodyDiscount = { items };
		return this.http.post(`/api/checkout/pub/orderForms/simulation?RnbBehavior=0&sc=${salesChannel}`, body)
	}

	public async skuIdByReferencedId(refId: Number): Promise<any> {
		return this.http.get(`/api/catalog_system/pvt/sku/stockkeepingunitidbyrefid/${refId}`);
	}
}
