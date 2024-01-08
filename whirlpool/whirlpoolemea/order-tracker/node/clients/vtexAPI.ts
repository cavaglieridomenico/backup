import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { LoggedUser } from '../typings/LoggedUser';
export default class VtexAPI extends JanusClient {


  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken
      }
    })
  }

  public async GetPendingOrderList(userEmail: string): Promise<OrderListPayload> {
    return new Promise<OrderListPayload>((resolve, reject) => {
      this.http.get(`/api/oms/pvt/orders?page=1&per_page=1&q=${userEmail}&orderBy=creationDate,desc`)
        .then(res => resolve(res))
        .catch(res => reject(res))
    })
  }

  public async GetLoggedUser(token: string): Promise<LoggedUser> {
    if (this.options?.headers != undefined) {
      this.options.headers["Content-Type"] = "application/json";
    }
    return this.http.get("/api/vtexid/pub/authenticated/user?authToken=" + token);
  }
  //   public async GetOrder(orderId: string): Promise<any> {
  //     return new Promise<any>((resolve, reject) => {
  //       this.http.get('/api/oms/pvt/orders/' + orderId)
  //         .then(res => resolve(res))
  //         .catch(res => reject(res))
  //     })
  // }

}
