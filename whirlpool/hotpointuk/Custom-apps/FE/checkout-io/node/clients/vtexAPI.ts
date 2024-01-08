import { JanusClient, InstanceOptions, IOContext, CacheLayer } from '@vtex/api'
import { simulationBody, UpdateCartPayload } from '../typings/cartFix'

export default class VtexAPI extends JanusClient {

  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken,
      }
    })

    this.cache = options && options?.memoryCache
  }

  public getProductSpecifications = async (productId: string) => {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("spec-" + productId)) {
        resolve(this.cache?.get("spec-" + productId));
        console.log("cache hit");
      } else {
        try {
          let res = await this.http.get(`/api/catalog_system/pvt/products/${productId}/specification`);
          this.cache?.set("spec-" + productId, res);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      }
    })
  }

  public removeOffering = async (orderFormId: string, itemIndex: number, offeringId: string, CheckoutOrderFormOwnershipCookie: string) => {
    try {
      this.addCookie(CheckoutOrderFormOwnershipCookie)
      let orderFormIdUpdated: any = await this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/offerings/${offeringId}/remove`, {}, this.options);
      return orderFormIdUpdated.orderFormId;

    } catch (err) {
      console.log("ERROR -> ", err);
      return err

    }
  }

  public addOffering = async (orderFormId: string, itemIndex: number, offeringId: any, CheckoutOrderFormOwnershipCookie: string) => {
    try {
      this.addCookie(CheckoutOrderFormOwnershipCookie)
      let orderFormIdUpdated: any = await this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/offerings`,
        {
          id: offeringId
        }
      )
      return orderFormIdUpdated;

    } catch (err) {
      console.log("ERROR -> ", err.response.data.error);
      return err

    }
  }

  public cartSimulation = async (payload: simulationBody, CheckoutOrderFormOwnershipCookie: string) => {
    try {
      this.addCookie(CheckoutOrderFormOwnershipCookie)
      let response: any = await this.http.post(`/api/checkout/pub/orderForms/simulation`, payload, this.options);
      return response;

    } catch (err) {
      console.log("ERROR -> ", err);
      return err

    }
  }



  public getOrderForm = async (ctx: Context, orderFormId: string, CheckoutOrderFormOwnershipCookie: string) => {

    try {
      this.addCookie(CheckoutOrderFormOwnershipCookie)
      let response: any = await this.http.get(`/api/checkout/pub/orderForm/${orderFormId}`, this.setHeaders(ctx));
      console.log(this.options?.headers, "headders");


      return response;

    } catch (err) {
      console.log("ERROR -> ", err);
      return err

    }
  }

  private setHeaders(ctx: Context): any {
    console.log(ctx.state.AppSettings?.auth.appKey, ctx.state.AppSettings?.auth.appToken, " SECURITS");

    return {
      headers: {
        ...this.options?.headers,
        ...{

          "X-VTEX-API-AppKey": `${ctx.state.AppSettings?.auth.appKey}`,

          "X-VTEX-API-AppToken": `${ctx.state.AppSettings?.auth.appToken}`

        }
      }
    }
  }

  public updateCartItem = async (ctx: Context, orderFormId: string, payload: UpdateCartPayload, CheckoutOrderFormOwnershipCookie: string) => {

    try {
      this.addCookie(CheckoutOrderFormOwnershipCookie)
      ctx = ctx

      let response: any = await this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/items/update?allowedOutdatedData=paymentData`, payload, this.options);
      return response;
    } catch (error) {
      console.log("err ", error);

      return error;
    }

  }

  private addCookie(CheckoutOrderFormOwnershipCookie: string) {
    ((this.options!).headers!).Cookie = this.options?.headers?.Cookie ? `${((this.options!).headers!).Cookie};CheckoutOrderFormOwnership=${CheckoutOrderFormOwnershipCookie}` : "CheckoutOrderFormOwnership=" + CheckoutOrderFormOwnershipCookie
  }

}

