
/**
 * TODO: check!! doc => /api/oms/pvt/orders VS code => /api/checkout/pub
 * @link https://developers.vtex.com/vtex-rest-api/reference/orders#listorders
 */
export async function orders(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  try {
    const response = await checkoutClient.orders()

    ctx.status = 200
    ctx.body = {
      orderForm: response,
    }

    await next()
  } catch (error) {
    console.log('## error.response.data', error.response.data)
    throw new Error(error)
  }
}
