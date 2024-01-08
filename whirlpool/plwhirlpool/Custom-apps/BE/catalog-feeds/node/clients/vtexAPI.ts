import { CacheLayer, InstanceOptions, IOContext, JanusClient } from '@vtex/api'

export default class VtexAPI extends JanusClient {

  cache?: CacheLayer<string, any>
  currentSku = ""

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
      if (skuid != this.currentSku && this.cache && this.cache?.has(skuid)) {
        resolve(this.cache.get(skuid))
      } else {
        try {
          let res = await this.http.get('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuid)
          this.cache?.set(skuid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetSkuList(page = 1): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("sku-list")) {
        resolve(this.cache.get("sku-list"))
      } else {
        try {
          let res: any[] = await this.http.get(`/api/catalog_system/pvt/sku/stockkeepingunitids?page=${page}&pagesize=1000`)
          if (res.length >= 1000) {
            res = res.concat(await this.GetSkuList(page + 1))
          }
          if (page == 1) {
            this.cache?.set("sku-list", res)
          }
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async CategoryProducts(category: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("cat-" + category)) {
        resolve(this.cache.get("cat-" + category))
      } else {
        try {
          let res = await this.http.get(`/api/catalog_system/pvt/products/GetProductAndSkuIds?categoryId=${category}&_from=0&_to=1`)
          this.cache?.set("cat-" + category, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetCategories(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("categories")) {
        resolve(this.cache.get("categories"))
      } else {
        try {
          let res = await this.http.get('/api/catalog_system/pub/category/tree/5')
          this.cache?.set("categories", res, 1000 * 60 * 60 * 24)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetCategoryAdWordsRemarketingCode(id: string | number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has(`categoryAdWordsRemarketingCode-${id}`)) {
        resolve(this.cache.get(`categoryAdWordsRemarketingCode-${id}`))
      } else {
        try {
          let res = (await this.http.get(`/api/catalog/pvt/category/${id}`)).AdWordsRemarketingCode
          this.cache?.set(`categoryAdWordsRemarketingCode-${id}`, res, 1000 * 60 * 60 * 24)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetImages(skuid: string): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      if (skuid != this.currentSku && this.cache && this.cache?.has('images-' + skuid)) {
        resolve(this.cache.get('images-' + skuid))
      } else {
        try {
          let res = await this.http.get("/api/catalog/pvt/stockkeepingunit/" + skuid + "/file")
          this.cache?.set('images-' + skuid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }


  //no cache for the inventory to get latest
  public async GetInventory(skuid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (skuid != this.currentSku && this.cache && this.cache?.has('inventory-' + skuid)) {
        resolve(this.cache.get('inventory-' + skuid))
      } else {
        try {
          let res = await this.http.get("/api/logistics/pvt/inventory/skus/" + skuid)
          this.cache?.set('inventory-' + skuid, res, 1000 * 60 * 10)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetPrice(skuid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (skuid != this.currentSku && this.cache && this.cache?.has('price-' + skuid)) {
        resolve(this.cache.get('price-' + skuid))
      } else {
        try {
          let res = await this.http.get(`/${this.context.account}/pricing/prices/${skuid}`)
          this.cache?.set('price-' + skuid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async getProductByCollectionId(collectionId: string) {
    return this.http.get(`/api/catalog/pvt/collection/${collectionId}/products`)
  }
}
