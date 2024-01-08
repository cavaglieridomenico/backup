export async function orderFormRaw(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  try {
    const response = await checkoutClient.orderFormRaw(ctx.state.CheckoutOrderFormOwnershipCookie)

    ctx.status = 200
    ctx.body = {
      orderForm: response.data,
    }

    await next()
  } catch (error) {
    throw new Error(error)
  }
}
