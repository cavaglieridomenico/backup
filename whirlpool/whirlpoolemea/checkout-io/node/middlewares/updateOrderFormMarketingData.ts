import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/cart-attachments#addmarketingdata
 */
export async function updateOrderFormMarketingData(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId, marketingData } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('orderFormId is required')
  }

  if (!marketingData) {
    throw new UserInputError('marketingData is required')
  }

  try {
    const response = await checkoutClient.updateOrderFormMarketingData(
      orderFormId,
      marketingData,
      ctx.state.CheckoutOrderFormOwnershipCookie
    )

    ctx.status = 200
    ctx.body = {
      orderForm: response,
    }

    await next()
  } catch (error) {
    throw new Error(error)
  }
}
