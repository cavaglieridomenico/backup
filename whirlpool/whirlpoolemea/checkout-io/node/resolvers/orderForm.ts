import { CustomLogger } from "../utils/CustomLogger"
import { WorldpayIframeCustomLogger } from "../utils/WorldpayIframeCustomLogger"

export const queries = {
  checkoutOrder: async (
    _: unknown,
    args: { orderFormId: string },
    ctx: any,
  ): Promise<any> => {
    const { clients, vtex, cookies } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const CheckoutOrderFormOwnershipCookie = cookies.get("CheckoutOrderFormOwnership") as string
    const data = await clients.checkout.orderForm(orderFormId ?? undefined, CheckoutOrderFormOwnershipCookie)
    return data
  },
}

export const mutations = {
  changeToAnonymousUser: async (
    _: unknown,
    args: { orderFormId: string },
    ctx: any,
  ): Promise<any> => {
    const { clients, vtex } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const response = await clients.checkout
      .changeToAnonymousUser(orderFormId ?? undefined)
      .then(() => true)
      .catch((err: { response: { data: any } }) => {
        new CustomLogger(ctx).error(
          err?.response?.data ? JSON.stringify(err?.response?.data) : err,
        )
        // console.error(
        // 	err?.response?.data ? JSON.stringify(err?.response?.data) : err,
        // )
        return false
      })
    return response
  },
  setProfileData: async (
    _: unknown,
    args: { orderFormId: string; profileData: any },
    ctx: any,
  ): Promise<any> => {
    const { clients, vtex, cookies } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const CheckoutOrderFormOwnershipCookie = cookies.get("CheckoutOrderFormOwnership") as string
    const response = await clients.checkout
      .updateOrderFormProfile(orderFormId ?? undefined, args.profileData, CheckoutOrderFormOwnershipCookie)
      .then(() => true)
      .catch((err: { response: { data: any } }) => {
        new CustomLogger(ctx).error({
          method: "setProfileData",
          error: err?.response?.data
            ? JSON.stringify(err?.response?.data)
            : err,
          orderFormId: orderFormId,
          data: args.profileData,
        })
        // console.error(
        // 	err?.response?.data ? JSON.stringify(err?.response?.data) : err,
        // )
        return false
      })
    return response
  },
  setClientPreferencesData: async (
    _: unknown,
    args: {
      orderFormId: string
      clientPreferencesData: OrderFormClientPreferencesData
    },
    ctx: any,
  ): Promise<any> => {
    const { clients, vtex, cookies } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const CheckoutOrderFormOwnershipCookie = cookies.get("CheckoutOrderFormOwnership") as string
    const response = await clients.checkout
      .updateOrderFormClientPreferencesData(
        orderFormId ?? undefined,
        args.clientPreferencesData,
        CheckoutOrderFormOwnershipCookie
      )
      .then(() => true)
      .catch((err: { response: { data: any } }) => {
        new CustomLogger(ctx).error({
          method: "setClientPreferencesData",
          error: err?.response?.data
            ? JSON.stringify(err?.response?.data)
            : err,
          orderFormId: orderFormId,
          data: args.clientPreferencesData,
        })
        // console.error(
        // 	err?.response?.data ? JSON.stringify(err?.response?.data) : err,
        // )
        return false
      })
    return response
  },
  setInvoiceData: async (
    _: unknown,
    args: { orderFormId: string; data: any },
    ctx: any,
  ): Promise<any> => {
    const { clients, vtex, cookies } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const CheckoutOrderFormOwnershipCookie = cookies.get("CheckoutOrderFormOwnership") as string
    const response = await clients.checkout
      .updateOrderFormInvoice(orderFormId ?? undefined, args.data, CheckoutOrderFormOwnershipCookie)
      .then(() => true)
      .catch((err: { response: { data: any } }) => {
        new CustomLogger(ctx).error({
          method: "setInvoiceData",
          error: err?.response?.data
            ? JSON.stringify(err?.response?.data)
            : err,
          orderFormId: orderFormId,
          data: args.data,
        })
        // console.error(
        // 	err?.response?.data ? JSON.stringify(err?.response?.data) : err,
        // )
        return false
      })
    return response
  },
  setCustomData: async (
    _: unknown,
    args: { orderFormId: string; appId: string; data: string },
    ctx: any,
  ): Promise<any> => {
    const { clients, vtex, cookies } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const CheckoutOrderFormOwnershipCookie = cookies.get("CheckoutOrderFormOwnership") as string
    let logger = new CustomLogger(ctx)
    logger.info({
      method: "setCustomData",
      orderFormId: orderFormId,
      cookies: ctx.headers["cookie"],
    })
    const response = await clients.checkout
      .setOrderFormCustomData(orderFormId ?? undefined, args.appId, args.data, CheckoutOrderFormOwnershipCookie)
      .then((res: { customData: any }) => {
        logger.info({
          method: "setCustomData",
          res: res,
          storedCustomData: JSON.stringify(res.customData),
          orderFormId: orderFormId,
          appId: args.appId,
          data: args.data,
        })
        return true
      })
      .catch((err: { response: { data: any } }) => {
        logger.error({
          method: "setCustomData",
          error: err?.response?.data
            ? JSON.stringify(err?.response?.data)
            : err,
          orderFormId: orderFormId,
          appId: args.appId,
          data: args.data,
        })
        // console.error(
        // 	err?.response?.data ? JSON.stringify(err?.response?.data) : err,
        // )
        return false
      })
    return response
  },
  saveWorldpayResponse: async (
    _: unknown,
    args: { order: string; status: string, error: string },
    ctx: any,
  ): Promise<any> => {
    new WorldpayIframeCustomLogger(ctx).info(args)
    return true
  },
  saveLogsFromFEcalls: async (
    _: unknown,
    args: { message: string },
    ctx: any,
  ): Promise<any> => {
    new CustomLogger(ctx).info(args.message)
    return true
  }
}
