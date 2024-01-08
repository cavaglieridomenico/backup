import { json } from "co-body"
import { UserInputError } from "@vtex/api"

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/cart-attachments#addshippingaddress
 */
export async function updateOrderFormShipping(
	ctx: Context,
	next: () => Promise<any>,
) {
	const {
		clients: { checkout: checkoutClient },
	} = ctx

	const { orderFormId, shipping, userCookie } = await json(ctx.req)

	// console.log("userCookie: ", userCookie)
	// console.log("ctx: ", ctx)
	// console.log(
	// 	"ctx.cookies.get('VtexIdclientAutCookie_ukccwhirlpool'): ",
	// 	ctx.cookies.get("VtexIdclientAutCookie_ukccwhirlpool"),
	// )
	// console.log("ctx.vtex.account: ", ctx.vtex.account)

	if (!orderFormId) {
		throw new UserInputError("orderFormId is required")
	}

	if (!shipping) {
		throw new UserInputError("shipping is required")
	}

	try {
		const response = await checkoutClient.updateOrderFormShipping(
			orderFormId,
			shipping,
			userCookie,
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
