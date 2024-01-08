import { UserInputError } from "@vtex/api"

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/cart-attachments#getclientprofilebyemail
 */
export async function getProfile(ctx: Context, next: () => Promise<any>) {
	const {
		clients: { checkout: checkoutClient },
		query: { email },
	} = ctx

	let userEmail = email && Array.isArray(email) ? email[0] : email

	if (!userEmail) {
		throw new UserInputError("An email is required")
	}

	userEmail = userEmail as string

	try {
		const response = await checkoutClient.getProfile(userEmail)

		ctx.status = 200
		ctx.body = {
			profile: response,
		}

		await next()
	} catch (error) {
		throw new Error(error)
	}
}
