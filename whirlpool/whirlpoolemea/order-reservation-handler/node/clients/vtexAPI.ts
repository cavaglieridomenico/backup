import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { ListOrder } from '../typings/order'
import { numberOfPages } from '../utils/ordersLogic'
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

  public async GetPendingOrderList(timeRange: string, paymentName: string, page: number = 1, pageSize: number = 100): Promise<ListOrder> {
    return new Promise<any>((resolve, reject) => {
      this.http.get(`api/oms/pvt/orders?page=${page}&per_page=${pageSize}&f_creationDate=creationDate:${timeRange}&f_paymentNames=${paymentName}&f_status="payment-pending`)
        .then(res => resolve(res))
        .catch(res => reject(res))
    })
  }

  public async GetIncompleteOrderList(timeRange: string, paymentName: string, page: number = 1, pageSize: number = 100): Promise<ListOrder> {
    return new Promise<any>((resolve, reject) => {
      this.http.get(`api/oms/pvt/orders?page=${page}&per_page=${pageSize}&f_creationDate=creationDate:${timeRange}&f_paymentNames=${paymentName}&incompleteOrders=true`)
        .then(res => resolve(res))
        .catch(res => reject(res))
    })
  }

  public async AllOrdersInRangeOfTime(timeRange: string, paymentName: string, page: number = 1, pageSize: number = 100) {
    let result: any[] = []
    let firstReqPending: ListOrder = await this.GetPendingOrderList(timeRange, paymentName, page, pageSize);
    let firstReqIncomplete: ListOrder = await this.GetIncompleteOrderList(timeRange, paymentName, page, pageSize);
    let callsPending = numberOfPages(firstReqPending.paging.total, pageSize)
    let callsIncomplete = numberOfPages(firstReqIncomplete.paging.total, pageSize)

    for (let i = 0; i < callsPending - 1; i++) {
      result.push(this.GetPendingOrderList(timeRange, paymentName, ++page, pageSize))
    }

    for (let i = 0; i < callsIncomplete - 1; i++) {
      result.push(this.GetPendingOrderList(timeRange, paymentName, ++page, pageSize))
    }


    let res = await Promise.all(result)


    res = res.concat(firstReqPending, firstReqIncomplete)
    return res
  }

  public async GetOrder(orderId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get('/api/oms/pvt/orders/' + orderId)
        .then(res => resolve(res))
        .catch(res => reject(res))
    })
  }

  public async CancelOrder(orderId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.post(`/api/oms/pvt/orders/${orderId}/cancel`)
        .then(res => resolve(res))
        .catch(res => reject(res))
    })
  }
}
