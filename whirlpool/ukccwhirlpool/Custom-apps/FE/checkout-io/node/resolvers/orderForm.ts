export const queries = {
  checkoutOrder: async (
    _: unknown,
    args: { orderFormId: string },
    ctx: any
  ): Promise<any> => {
    const { clients, vtex } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const data = await clients.checkout.orderForm(orderFormId ?? undefined)
    return data
  },
}

export const mutations = {
  changeToAnonymousUser: async (
    _: unknown,
    args: { orderFormId: string },
    ctx: any
  ): Promise<any> => {
    const { clients, vtex } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const response = await clients.checkout.changeToAnonymousUser(orderFormId ?? undefined).then(() => true).catch((err: { response: { data: any } }) => {
      console.error(err?.response?.data ? JSON.stringify(err?.response?.data) : err)
      return false
    })
    return response
  },
  setProfileData: async (
    _: unknown,
    args: { orderFormId: string, profileData: any },
    ctx: any
  ): Promise<any> => {
    const { clients, vtex } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const response = await clients.checkout.updateOrderFormProfile(orderFormId ?? undefined, args.profileData).then(() => true).catch((err: { response: { data: any } }) => {
      console.error(err?.response?.data ? JSON.stringify(err?.response?.data) : err)
      return false
    })
    return response
  },
  setClientPreferencesData: async (
    _: unknown,
    args: { orderFormId: string, clientPreferencesData: OrderFormClientPreferencesData },
    ctx: any
  ): Promise<any> => {
    const { clients, vtex } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const response = await clients.checkout.updateOrderFormClientPreferencesData(orderFormId ?? undefined, args.clientPreferencesData).then(() => true).catch((err: { response: { data: any } }) => {
      console.error(err?.response?.data ? JSON.stringify(err?.response?.data) : err)
      return false
    })
    return response
  },
  setInvoiceData: async (
    _: unknown,
    args: { orderFormId: string, data: any },
    ctx: any
  ): Promise<any> => {
    const { clients, vtex } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const response = await clients.checkout.updateOrderFormInvoice(orderFormId ?? undefined, args.data).then(() => true).catch((err: { response: { data: any } }) => {
      console.error(err?.response?.data ? JSON.stringify(err?.response?.data) : err)
      return false
    })
    return response
  },
  setCustomData: async (
    _: unknown,
    args: { orderFormId: string, appId: string, data: string },
    ctx: any
  ): Promise<any> => {
    const { clients, vtex } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const response = await clients.checkout.setOrderFormCustomData(orderFormId ?? undefined, args.appId, args.data).then(() => true).catch((err: { response: { data: any } }) => {
      console.error(err?.response?.data ? JSON.stringify(err?.response?.data) : err)
      return false
    })
    return response
  }

}
