import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

export async function updateOrderFormCheckin(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId, checkinPayload } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('orderFormId is required')
  }

  if (!checkinPayload) {
    throw new UserInputError('checkinPayload is required')
  }

  try {
    const response = await checkoutClient.updateOrderFormCheckin(
      orderFormId,
      checkinPayload,
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
