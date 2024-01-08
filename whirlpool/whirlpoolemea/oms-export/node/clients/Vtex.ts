import { InstanceOptions, IOContext, JanusClient, CacheLayer } from "@vtex/api";
import { AuthenticatedUser } from "../types/authentication";
import { VIPRecord } from "../types/md";
import { Order, OrderList, OrderListElement } from "../types/order";
import { maxRetries, maxTime, pageLimit, vipFields } from "../utils/constants";
import { stringify, wait } from "../utils/functions";


export default class VtexMP extends JanusClient {

  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options);
    this.options!.headers = {
      ...this.options?.headers,
      ...{
        VtexIdclientAutCookie: context.authToken
      }
    }
    this.cache = options && options?.memoryCache;
  }

  public orderList = async (creationDateFrom: string, creationDateTo: string, page: number = 1, orderList: OrderListElement[] = [], per_page: number = 100, retry: number = 0): Promise<OrderListElement[]> => {
    return new Promise<OrderListElement[]>((resolve, reject) => {
      this.http.get<OrderList>(`/api/oms/pvt/orders?page=${page}&per_page=${per_page}&f_creationDate=creationDate:[${creationDateFrom} TO ${creationDateTo}]`, this.options)
        .then(async (res) => {
          orderList = orderList.concat(res.list?.filter(r => !orderList.find(o => o.orderId == r.orderId)) ?? []);
          if (res.paging.currentPage < res.paging.pages) {
            await wait(maxTime / 4);
            if (res.paging.currentPage < pageLimit) {
              return this.orderList(creationDateFrom, creationDateTo, page + 1, orderList, per_page, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              return this.orderList(creationDateFrom, `${res.list[res.list.length - 1].creationDate.split(".")[0]}.000Z`, 1, orderList, per_page, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            }
          } else {
            resolve(orderList);
          }
        })
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.orderList(creationDateFrom, creationDateTo, page, orderList, per_page, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `Error while retrieving the order list --details: ${stringify(err)}` });
          }
        })
    })
  }

  public order = async (orderId: string, retry: number = 0): Promise<Order> => {
    return new Promise<Order>((resolve, reject) => {
      if (this.cache?.has(orderId)) {
        resolve(this.cache.get(orderId));
      } else {
        this.http.get(`/api/oms/pvt/orders/${orderId}`, this.options)
          .then(res => {
            this.cache?.set(orderId, res);
            resolve(res)
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.order(orderId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ msg: `Error while retrieving data for the order ${orderId} --details: ${stringify(err)}` });
            }
          })
      }
    })
  }

  public authenticatedUser = (cookie: string, retry: number = 0): Promise<AuthenticatedUser> => {
    return new Promise<AuthenticatedUser>((resolve, reject) => {
      this.http.get(`/api/vtexid/pub/authenticated/user?authToken=${cookie}`, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.authenticatedUser(cookie, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `Error while retrieving authentication data --details: ${stringify(err)}` });
          }
        })
    })
  }

  public searchVIPCompany = (ctx: Context, accessCode: string, retry: number = 0): Promise<VIPRecord> => {
    return new Promise<VIPRecord>((resolve, reject) => {
      let key = `${ctx.state.appSettings.vipEntity}-${accessCode}`;
      if (this.cache?.has(key)) {
        resolve(this.cache.get(key))
      } else {
        ctx.clients.masterdata.searchDocuments<VIPRecord>({ dataEntity: ctx.state.appSettings.vipEntity, fields: vipFields, where: `accessCode=${accessCode}`, pagination: { page: 1, pageSize: 10 } })
          .then(res => {
            if (res.length > 0) {
              this.cache?.set(key, res[0]);
              resolve(res[0]);
            } else {
              reject({ msg: `No match found for the access code "${accessCode}"` });
            }
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.searchVIPCompany(ctx, accessCode, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ msg: `Error while retrieving info for the access code "${accessCode}" --details: ${stringify(err)}` });
            }
          })
      }
    })
  }

  public listCompanies = async (ctx: Context, data: VIPRecord[] = [], token: string | undefined = undefined, size: number = 100, retry: number = 0): Promise<VIPRecord[]> => {
    return new Promise<VIPRecord[]>((resolve, reject) => {
      const key = `vip-companies-${this.context.account}`;
      if (this.cache?.has(key)) {
        resolve(this.cache.get(key))
      } else {
        ctx.clients.masterdata.scrollDocuments({ dataEntity: ctx.state.appSettings.vipEntity, fields: vipFields, mdToken: token, size: size })
          .then((res: any) => {
            data = data.concat(res.data);
            if (res.data!.length < size) {
              this.cache?.set(key, data);
              resolve(data);
            } else {
              return this.listCompanies(ctx, data, res.mdToken, size, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            }
            return;
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.listCompanies(ctx, data, token, size, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ msg: `Error while retrieving companies data --details: ${stringify(err)}` });
            }
          })
      }
    })
  }

  public getAccessCodeFromCL = (ctx: Context, userId: string, retry: number = 0): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      let key = `${ctx.vtex.account}-${userId}`;
      if (this.cache?.has(key)) {
        resolve(this.cache.get(key))
      } else {
        ctx.clients.masterdata.searchDocuments<{ partnerCode: string }>({ dataEntity: "CL", fields: ['partnerCode'], where: `userId=${userId}`, pagination: { page: 1, pageSize: 10 } })
          .then(res => {
            if (res.length > 0) {
              this.cache?.set(key, res[0].partnerCode);
              resolve(res[0].partnerCode);
            } else {
              resolve(undefined)
            }
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getAccessCodeFromCL(ctx, userId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ msg: `Error while retrieving info for userId "${userId}" --details: ${stringify(err)}` });
            }
          })
      }
    })
  }

}
