import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { OrderForm } from "../typings/orderForm";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { stringify, wait } from "../utils/functions";

export default class OrderFormClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = { ...options?.headers, ...{ VtexIdclientAutCookie: context.authToken } }
    super(`http://${context.host}`, context, options)
  }


  public async getOrderForm(ordeformid?: string, CheckoutOrderFormOwnershipCookie?: string, retry: number = 0): Promise<OrderForm> {
    return new Promise<OrderForm>((resolve, reject) => {
      this.http.get(`/api/checkout/pub/orderForm/${ordeformid}`, {
        ...this.options,
        headers: {
          ...this.options?.headers,
          Cookie: this.options?.headers?.Cookie ? `${this.options?.headers?.Cookie};CheckoutOrderFormOwnership=${CheckoutOrderFormOwnershipCookie}` : `CheckoutOrderFormOwnership=${CheckoutOrderFormOwnershipCookie}`
        }
      })
        .then(res => {
          resolve(res);
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.getOrderForm(ordeformid, CheckoutOrderFormOwnershipCookie, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `error while retrieving the order form --details: ${stringify(err)}` });
          }
        })
    })
  }

  public async fillInCustomdata(orderFormId: string, customAppId: string, data: any, CheckoutOrderFormOwnershipCookie: string, retry: number = 0): Promise<OrderForm> {
    return new Promise<OrderForm>((resolve, reject) => {
      this.http.put(`/api/checkout/pub/orderForm/${orderFormId}/customData/${customAppId}`, data, {
        ...this.options,
        headers: {
          ...this.options?.headers,
          Cookie: this.options?.headers?.Cookie ? `${this.options?.headers?.Cookie};CheckoutOrderFormOwnership=${CheckoutOrderFormOwnershipCookie}` : `CheckoutOrderFormOwnership=${CheckoutOrderFormOwnershipCookie}`
        }
      })
        .then((res: any) => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.fillInCustomdata(orderFormId, customAppId, data, CheckoutOrderFormOwnershipCookie, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `error while updating the order form --details: ${stringify(err)}` });
          }
        })
    })
  }

  public async deleteCustomdata(orderFormId: string, customAppId: string, customField: string, CheckoutOrderFormOwnershipCookie: string, retry: number = 0): Promise<OrderForm> {
    return new Promise<OrderForm>((resolve, reject) => {
      this.http.delete(`/api/checkout/pub/orderForm/${orderFormId}/customData/${customAppId}/${customField}`, {
        ...this.options,
        headers: {
          ...this.options?.headers,
          Cookie: this.options?.headers?.Cookie ? `${this.options?.headers?.Cookie};CheckoutOrderFormOwnership=${CheckoutOrderFormOwnershipCookie}` : `CheckoutOrderFormOwnership=${CheckoutOrderFormOwnershipCookie}`
        }
      })
        .then((res: any) => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.deleteCustomdata(orderFormId, customAppId, customField, CheckoutOrderFormOwnershipCookie, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `error while deleting ${customField} in the order form --details: ${stringify(err)}` });
          }
        })
    })
  }

}
