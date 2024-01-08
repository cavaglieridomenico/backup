//@ts-nocheck

import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient } from '@vtex/api'
import { isValid } from '../utils/functions'
import { getCacheKey } from '../utils/CommonFunctions'
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

	public async GetSKU(skuid: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, "sku", skuid)
			if (await this.cache?.has(cacheKey)) {
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			try {
				let sku = await this.http.get('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuid)
				this.cache?.set(cacheKey, sku)
				resolve(sku)
			} catch (err) {
				reject(err)
			}
		})
	}

	public async GetSKULogoSpecifications(ctx: Context, skuid: string): Promise<any> {

		return new Promise(async (resolve, reject) => {
			try {

				let sku = await ctx.clients.vtexAPI.GetSKU(skuid)
				let skuSpecifications = sku?.ProductSpecifications ? sku?.ProductSpecifications : []
				let skuLogoUrls = []
				for (let i = 0; i < skuSpecifications.length; i++) {
					let specification = skuSpecifications[i]
					// check for logo specification
					if (specification.FieldGroupName === 'Logo' && specification.FieldName === 'Logo_field') {

						// get the logo names
						let logoNames = specification?.FieldValues[0]?.split("|")

						if (logoNames && logoNames.length > 0) {

							// iterate over each logo to get the URL from the master data
							for (let j = 0; j < logoNames.length; j++) {

								let logoName = logoNames[j]

								// 1. request the url to the master data LU (LogoUrls)
								let url = ""
								let logoResult = await ctx.clients.masterdata.searchDocuments({
									dataEntity: "LT",
									fields: ["id", "name", "imageUrl"],
									where: "name=" + logoName,
									pagination: { page: 1, pageSize: 100 }
								})

								url = logoResult[0]?.imageUrl

								// 2. update the skuLogo array
								if (url && url.length > 0)
									skuLogoUrls.push(url)

							}

						}

					}

				}

				resolve(skuLogoUrls)

			} catch (err) {

				reject(err)

			}
		})

	}

	public async GetOrder(orderid: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, orderid)
			console.log(cacheKey);
			if (await this.cache?.has(cacheKey)) {
				console.log("cache-hit");
				const res = await this.cache?.get(cacheKey)
				resolve(res)
				try {
					let res = await this.http.get('/api/oms/pvt/orders/' + orderid)
					this.cache?.set(cacheKey, res)
					resolve(res)
				} catch (err) {
					reject(err)
				}
			}
		})
	}

	public async GetProductSpecifications(productid: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, "spec", productid)
			console.log(cacheKey);
			if (await this.cache?.has(cacheKey)) {
				console.log("cache-hit");
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			try {
				let res = await this.http.get(`/api/catalog_system/pvt/products/${productid}/specification`)
				this.cache?.set(cacheKey, res)
				resolve(res)
			} catch (err) {
				reject(err)
			}
		})
	}

	public async GetCategory(categoryid: string | number): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, "category", categoryid)
			if (await this.cache?.has(cacheKey)) {
				console.log("cache-hit");
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			try {
				let res = await this.http.get('/api/catalog/pvt/category/' + categoryid)
				this.cache?.set(cacheKey, res)
				resolve(res)
			} catch (err) {
				reject(err)
			}

		})
	}

	public async GetCateogryTree(levels: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, "categorylevels", levels)
			if (await this.cache?.has(cacheKey)) {
				console.log("cache-hit");
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			try {
				let res = await this.http.get('/api/catalog_system/pub/category/tree/' + levels)
				this.cache?.set(cacheKey, res)
				resolve(res)
			} catch (err) {
				reject(err)
			}

		})
	}

	public async GetUserOrders(userEmail: string, page = 1, perPage = 1): Promise<any> {
		const cacheKey = getCacheKey(this.context.account, "categorylevels", levels)
		if (await this.cache?.has(cacheKey)) {
			console.log("cache-hit");
			const res = await this.cache?.get(cacheKey)
			return res
		}
		let res = this.http.get(`/api/oms/pvt/orders?q=${userEmail}&page=${page}&per_page=${perPage}`)
		this.cache?.set(cacheKey, res)
		return res
	}

	public async GetProduct(productid: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, "product", productid)
			console.log(cacheKey);
			if (await this.cache?.has(cacheKey)) {
				console.log("cache-hit");
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			this.http.get(`/api/catalog/pvt/product/${productid}`)
				.then(res => {
					this.cache?.set(cacheKey, res);
					resolve(res);
				})
				.catch(err => {
					reject(err);
				})
		})
	}

	public async GetProductByRefId(refid: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, "product-by-refId", refid)
			console.log(cacheKey);
			if (await this.cache?.has(cacheKey)) {
				console.log("cache-hit");
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			this.http.get(`/api/catalog_system/pvt/products/productgetbyrefid/${refid}`)
				.then(res => {
					if (isValid(res)) {
						this.cache?.set(cacheKey, res)
						resolve(res);
					} else {
						if (!refid.includes("-WER")) {
							return this.GetProductByRefId(refid + "-WER").then(res0 => resolve(res0)).catch(err0 => reject(err0))
						} else {
							reject({ response: { status: 500, data: "No data found for the refid " + refid } })
						}
					}
				})
				.catch(err => reject(err))
		})
	}

	public async GetBrands(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, "brands")
			console.log(cacheKey);
			if (await this.cache?.has(cacheKey)) {
				console.log("cache-hit");
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			try {
				let res = await this.http.get(`/api/catalog_system/pvt/brand/list`)
				this.cache?.set(cacheKey, res, 6 * 1000 * 60 * 60)
				resolve(res)
			} catch (err) {
				reject(err)
			}
		})
	}

	public async GePromotions(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, "promotions")
			console.log(cacheKey);
			if (await this.cache?.has(cacheKey)) {
				console.log("cache-hit");
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			try {
				let res = await this.http.get(`/api/rnb/pvt/benefits/calculatorconfiguration`)
				this.cache?.set(cacheKey, res)
				resolve(res)
			} catch (err) {
				reject(err)
			}
		})
	}

	////////////////////////// dont'use cache for the following calls ///////////////////////////////////

	public async getAllPromotions(): Promise<IOResponse<any>> {
		return this.http.getRaw("/api/rnb/pvt/benefits/calculatorconfiguration");
	}

	public async getPromotionById(id: string): Promise<IOResponse<any>> {
		return this.http.getRaw("/api/rnb/pvt/calculatorconfiguration/" + id);
	}

	public async getProductsByCollectionId(collectionId: string, page: number): Promise<IOResponse<any>> {
		return this.http.getRaw("/api/catalog/pvt/collection/" + collectionId + "/products?pageSize=10000&page=" + page);
	}

	public async getStock(skuId: number | string): Promise<IOResponse<any>> {
		return this.http.getRaw("/api/logistics/pvt/inventory/skus/" + skuId);
	}

	public async getFixedPrice(ctx: Context, skuId: number | string, salesChannel: number = 1): Promise<IOResponse<any>> {
		return this.http.getRaw("/" + ctx.vtex.account + "/pricing/prices/" + skuId + "/fixed/" + salesChannel);
	}

	public async getPrices(ctx: Context, skuId: number | string): Promise<IOResponse<any>> {
		return this.http.getRaw("/" + ctx.vtex.account + "/pricing/prices/" + skuId);
	}

	public async getMarketPrice(skuId: number, salesChannel: number): Promise<IOResponse<any>> {
		return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId + "&sc=" + salesChannel);
	}

	public async getCoupons(): Promise<IOResponse<any>> {
		return this.http.getRaw("/api/rnb/pvt/coupon");
	}

	public async getOrdersByEmail(email: string, page: number, per_page: number): Promise<IOResponse<any>> {
		return this.http.getRaw("/api/oms/pvt/orders?q=" + email + "&page=" + page + "&per_page=" + per_page);
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////

	public async GetSpecificationFields(specId: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const cacheKey = getCacheKey(this.context.account, "spec-values", specId)
			console.log(cacheKey);
			if (await this.cache?.has(cacheKey)) {
				console.log("cache-hit");
				const res = await this.cache?.get(cacheKey)
				resolve(res)
			}
			try {
				let res = await this.http.get(`/api/catalog_system/pub/specification/fieldGet/${specId}`)
				this.cache?.set(cacheKey, res)
				resolve(res)
			} catch (err) {
				reject(err)
			}
		})
	}

	public async GetUserFidelity(userEmail: string, page = 1, perPage = 1): Promise<any> {
		return this.http.get(`/api/oms/pvt/orders?q=${userEmail}&f_status=invoiced&orderBy=creationDate,desc&page=${page}&per_page=${perPage}`)
	}
}



