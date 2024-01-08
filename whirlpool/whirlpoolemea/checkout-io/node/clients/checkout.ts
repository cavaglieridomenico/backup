import {
  InstanceOptions,
  RequestConfig,
  IOResponse,
  IOContext,
  CacheType,
} from '@vtex/api'
import { JanusClient } from '@vtex/api'
import type { AxiosError } from 'axios'

import { checkoutCookieFormat, statusToError } from '../utils'

export class Checkout extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      baseURL: `https://${ctx.account}.vtexcommercebeta.com.br/`, //only for testing purpose
      headers: {
        ...options?.headers,
        ...(ctx.storeUserAuthToken
          ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
          : null),
        'x-vtex-user-agent': ctx.userAgent,
      },
    })
  }

  private getCommonHeaders = (CheckoutOrderFormOwnershipCookie: string) => {
    const { orderFormId, segmentToken, sessionToken } = this
      .context as CustomIOContext

    const checkoutCookie = orderFormId ? checkoutCookieFormat(orderFormId) : ''
    const segmentTokenCookie = segmentToken
      ? `vtex_segment=${segmentToken};`
      : ''

    const sessionTokenCookie = sessionToken
      ? `vtex_session=${sessionToken};`
      : ''

    const checkoutOrderFormOwnershipCookie = CheckoutOrderFormOwnershipCookie ?? ""
    return {
      Cookie: `${checkoutCookie}${segmentTokenCookie}${sessionTokenCookie}${checkoutOrderFormOwnershipCookie}`,
    }
  }


  private getChannelQueryString = () => {
    const { segment } = this.context as CustomIOContext
    const channel = segment?.channel
    const queryString = channel ? `?sc=${channel}` : ''

    return queryString
  }

  public getProfile = (email: string) => {
    return this.get<CheckoutProfile>(this.routes.profiles(email))
  }

  public getAddress = (countryCode: string, postalCode: string) =>
    this.get<CheckoutAddress>(
      this.routes.getAddress(countryCode, postalCode)
    )


  public addItem = (orderFormId: string, orderItems: any, CheckoutOrderFormOwnershipCookie: string) =>
    this.post<OrderForm>(
      this.routes.addItem(orderFormId, this.getChannelQueryString()),
      { orderItems }, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
    )


  public cancelOrder = (orderFormId: string, reason: string) =>
    this.post(this.routes.cancelOrder(orderFormId), { reason })

  public setOrderFormCustomDataField = (
    orderFormId: string,
    appId: string,
    field: string,
    value: any,
    CheckoutOrderFormOwnershipCookie: string
    // eslint-disable-next-line max-params
  ) => this.put(this.routes.orderFormCustomData(orderFormId, appId, field), {
    value,
  }, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } })


  public setOrderFormCustomData = (
    orderFormId: string,
    appId: string,
    fields: any,
    CheckoutOrderFormOwnershipCookie: string
    // eslint-disable-next-line max-params
  ) => this.put(this.routes.orderFormCustomData(orderFormId, appId), fields, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } })


  public updateItems = (orderFormId: string, orderItems: any, CheckoutOrderFormOwnershipCookie: string) =>
    this.post(this.routes.updateItems(orderFormId), { orderItems }, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } })


  public updateOrderFormIgnoreProfile = (
    orderFormId: string,
    ignoreProfileData: boolean,
    CheckoutOrderFormOwnershipCookie: string
  ) => this.patch(this.routes.profile(orderFormId), { ignoreProfileData }, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } })


  public updateOrderFormPayment = (orderFormId: string, payments: any, CheckoutOrderFormOwnershipCookie: string) =>
    this.post(this.routes.attachmentsData(orderFormId, 'paymentData'), {
      payments,
    }, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } })


  public updateOrderFormProfile = (orderFormId: string, fields: any, CheckoutOrderFormOwnershipCookie: string) =>
    this.post(
      this.routes.attachmentsData(orderFormId, 'clientProfileData'),
      fields,
      { metric: 'checkout-updateOrderFormProfile', headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
    )


  public updateOrderFormInvoice = (orderFormId: string, fields: any, CheckoutOrderFormOwnershipCookie: string) =>
    this.post(
      this.routes.attachmentsData(orderFormId, 'invoiceData'),
      fields,
      { metric: 'checkout-updateOrderFormProfile', headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
    )


    //@ts-nocheck
  public updateOrderFormShipping = (orderFormId: string, shipping: any, userCookie: any, CheckoutOrderFormOwnershipCookie: string) => {
    const cookieHeader = {
      Cookie: `VtexIdclientAutCookie_${this.context.account}=${userCookie};${this.addCookie(CheckoutOrderFormOwnershipCookie)}`
    }

    return this.post2(
      this.routes.attachmentsData(orderFormId, 'shippingData'),
      shipping,
      userCookie ? { headers: cookieHeader } : {}
    )
  }

  public updateOrderFormMarketingData = (
    orderFormId: string,
    marketingData: any,
    CheckoutOrderFormOwnershipCookie: string
  ) => this.post(
    this.routes.attachmentsData(orderFormId, 'marketingData'),
    marketingData, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
  )


  public updateOrderFormClientPreferencesData = (
    orderFormId: string,
    clientPreferencesData: OrderFormClientPreferencesData,
    CheckoutOrderFormOwnershipCookie: string
  ) => {
    // The API default value of `optinNewsLetter` is `null`, but it doesn't accept a POST with its value as `null`
    const filteredClientPreferencesData =
      clientPreferencesData.optinNewsLetter === null
        ? { locale: clientPreferencesData.locale }
        : clientPreferencesData

    return this.post(
      this.routes.attachmentsData(orderFormId, 'clientPreferencesData'),
      filteredClientPreferencesData,
      { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
    )
  }

  public updateOrderFormCheckin = (orderFormId: string, checkinPayload: any, CheckoutOrderFormOwnershipCookie: string) =>
    this.post(this.routes.checkin(orderFormId), checkinPayload, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } })


  public orderForm = (orderFormId?: string, CheckoutOrderFormOwnershipCookie?: string) => {
    const res = this.post<OrderForm>(
      this.routes.orderForm(orderFormId),
      {
        expectedOrderFormSections: ['items']
      },
      { ...this.options, ...{ cacheable: CacheType.None }, headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie!) } }
    )
    console.log({
      expectedOrderFormSections: ['items']
    },
      { ...this.options, ...{ cacheable: CacheType.None } });

    return res
  }

  public orderFormRaw = (CheckoutOrderFormOwnershipCookie: string) =>
    this.postRaw<OrderForm>(this.routes.orderForm(), {
      expectedOrderFormSections: ['items'],
    }, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } })


  public newOrderForm = (orderFormId?: string, CheckoutOrderFormOwnershipCookie?: string) => {
    return this.http
      .postRaw<OrderForm>(this.routes.orderForm(orderFormId), undefined, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie!) } })
      .catch(statusToError) as Promise<IOResponse<OrderForm>>
  }

  public changeToAnonymousUser = (orderFormId: string) => {
    return this.get(this.routes.changeToAnonymousUser(orderFormId)).catch(
      (err) => {
        // This endpoint is expected to return a redirect to
        // the user, so we can ignore the error if it is a 3xx
        if (!err.response || /^3..$/.test((err as AxiosError).code ?? '')) {
          throw err
        }
      }
    )
  }

  public orders = () => this.get(this.routes.orders)

  public simulation = (simulation: SimulationPayload, CheckoutOrderFormOwnershipCookie: string) =>
    this.post<SimulationOrderForm>(
      this.routes.simulation(this.getChannelQueryString()),
      simulation,
      { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
    )

  public simulationWithAppCookie = (simulation: SimulationPayload, CheckoutOrderFormOwnershipCookie: string) =>
    this.http.post<SimulationOrderForm>(
      this.routes.simulation(this.getChannelQueryString()),
      simulation,
      {
        ...this.options,
        ...{
          VtexIdclientAutCookie: this.context.authToken
        },
        headers: {
          Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie)
        }
      }
    )

  public clearMessages = (orderFormId: string, CheckoutOrderFormOwnershipCookie: string) => {
    return this.post(
      this.routes.clearMessages(orderFormId),
      {}, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
    )
  }

  public removeOffering = (orderFormId: string, itemIndex: any, offeringId: any, CheckoutOrderFormOwnershipCookie: string) =>
    this.post(
      this.routes.removeOffering(orderFormId, itemIndex, offeringId),
      { id: offeringId }, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
    )


  public addOffering = (orderFormId: string, itemIndex: any, offeringId: any, CheckoutOrderFormOwnershipCookie: string) =>
    this.post(
      this.routes.addOffering(orderFormId, itemIndex),
      { id: offeringId }, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
    )



  public removeAllItems = (orderFormId: string, CheckoutOrderFormOwnershipCookie: string) =>
    this.post(
      this.routes.removeAllItems(orderFormId),
      {}, { headers: { Cookie: this.addCookie(CheckoutOrderFormOwnershipCookie) } }
    )


  protected get = <T>(url: string, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(config.headers.Cookie),
    }

    return this.http.get<T>(url, config).catch(statusToError) as Promise<T>
  }

  private addCookie(CheckoutOrderFormOwnershipCookie: string) {
    return this.options?.headers?.Cookie ? `${((this.options!).headers!).Cookie};CheckoutOrderFormOwnership=${CheckoutOrderFormOwnershipCookie}` : `CheckoutOrderFormOwnership=${CheckoutOrderFormOwnershipCookie}`
  }

  protected post2 = <T>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ) => this.http
    .post<T>(url, data, config)
    .catch(statusToError) as Promise<T>

  protected post = <T>(url: string, data?: any, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(config.headers.Cookie),
    }

    return this.http
      .post<T>(url, data, config)
      .catch(statusToError) as Promise<T>
  }

  protected postRaw = async <T>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(config.headers.Cookie),
    }

    return this.http
      .postRaw<T>(url, data, config)
      .catch(statusToError) as Promise<IOResponse<T>>
  }

  protected delete = <T>(url: string, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(config.headers.Cookie),
    }

    return this.http.delete<T>(url, config).catch(statusToError) as Promise<
      IOResponse<T>
    >
  }

  protected patch = <T>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(config.headers.Cookie),
    }

    return this.http
      .patch<T>(url, data, config)
      .catch(statusToError) as Promise<T>
  }

  protected put = <T>(url: string, data?: any, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(config.headers.Cookie),
    }

    return this.http
      .put<T>(url, data, config)
      .catch(statusToError) as Promise<T>
  }

  private get routes() {
    const base = '/api/checkout/pub'

    return {
      addItem: (orderFormId: string, queryString: string) =>
        `${base}/orderForm/${orderFormId}/items${queryString}`,
      cancelOrder: (orderFormId: string) =>
        `${base}/orders/${orderFormId}/user-cancel-request`,
      orderFormCustomData: (
        orderFormId: string,
        appId: string,
        field?: string
      ) => `${base}/orderForm/${orderFormId}/customData/${appId}/${field || ''}`,
      updateItems: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/items/update`,
      profiles: (email: string) => `${base}/profiles/?email=${email}`,
      profile: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/profile`,
      attachmentsData: (orderFormId: string, field: string) =>
        `${base}/orderForm/${orderFormId}/attachments/${field}`,
      checkin: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/checkIn`,
      orderForm: (orderFormId?: string) =>
        `${base}/orderForm/${orderFormId ?? ''}`,
      orders: `${base}/orders`,
      simulation: (queryString: string) =>
        `${base}/orderForms/simulation${queryString}`,
      changeToAnonymousUser: (orderFormId: string) =>
        `/checkout/changeToAnonymousUser/${orderFormId}`,
      getAddress: (countryCode: string, postalCode: string) =>
        `${base}/postal-code/${countryCode}/${postalCode}`,
      clearMessages: (orderFormId: string) => `${base}/orderForm/${orderFormId}/messages/clear`,
      addOffering: (orderFormId: string, itemIndex: any) => `${base}/orderForm/${orderFormId}/items/${itemIndex}/offerings`,
      removeOffering: (orderFormId: string, itemIndex: any, offeringId: any) => `${base}/orderForm/${orderFormId}/items/${itemIndex}/offerings/${offeringId}/remove`,
      removeAllItems: (orderFormId: string) => `${base}/orderForm/${orderFormId}/items/removeAll`
    }
  }
}
