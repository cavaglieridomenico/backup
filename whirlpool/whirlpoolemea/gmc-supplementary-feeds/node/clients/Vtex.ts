import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";
// import { SkuContext } from "../typings/types";
import { stringify, wait } from "../utils/functions";
import { getSkuIdsByCategoryId } from "../typings/vtexResponse";

export default class Vtex extends JanusClient {

  private MAX_TIME: number;
  private MAX_RETRY: number;

  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = { ...options?.headers, ...{ VtexIdclientAutCookie: context.authToken } }
    super(context, options);
    this.MAX_TIME = 250;
    this.MAX_RETRY = 5;
  }

  public async getSkuIdsByCategoryId(categoryId: string, from: number = 0, to: number = 249, skuList: any[] = [], retry: number = 0): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.http.get(`/api/catalog_system/pvt/products/GetProductAndSkuIds?_from=${from}&_to=${to}&categoryId=${categoryId}`)
        .then((res: getSkuIdsByCategoryId) => {
          skuList = skuList.concat(Object.entries(res.data).map(entry => entry[1][0].toString()))
          if (to >= res.range.total) {
            resolve(skuList);
          } else {
            this.getSkuIdsByCategoryId(categoryId, from + 250, to + 250, skuList, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          }
        })
        .catch(async (err) => {
          if (retry < this.MAX_RETRY) {
            await wait(this.MAX_TIME);
            return this.getSkuIdsByCategoryId(categoryId, from, to, skuList, retry++).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            reject({ msg: `Error while retrieving sku list (categoryId: ${categoryId}) --details: ${stringify(err)}` })
          }
        })
    })
  }

  public async hasPriceInSalesChannel(account: string, skuId: any, salesChannel: any, retry: number = 0): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.http.getRaw("/" + account + "/pricing/prices/" + skuId + "/fixed/" + salesChannel)
        .then(() => resolve(true))
        .catch(async () => {
          if (retry < this.MAX_RETRY) {
            await wait(this.MAX_TIME);
            return this.hasPriceInSalesChannel(account, skuId, salesChannel, retry + 1).then(res0 => resolve(res0)).catch(() => resolve(false));
          } else {
            resolve(false);
          }
        })
    });
  }
}
