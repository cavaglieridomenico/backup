import { AppGraphQLClient, InstanceOptions, IOContext } from "@vtex/api"
import * as fs from "fs"
import { join } from "path"

export default class CheckoutGraphQL extends AppGraphQLClient {
	constructor(context: IOContext, options?: InstanceOptions) {
		context.locale = context.locale || process.env.DEFAULT_LOCALE
		if (!context.tenant?.locale) {
			context.tenant = {
				...context.tenant,
				locale: process.env.DEFAULT_LOCALE!,
			}
		}
		super("vtex.checkout-graphql@0.x", context, options)
	}

	public async insertCoupon(orderFormId: string, coupon: string): Promise<any> {
		console.log("orderFormId: ", orderFormId)
		console.log("coupon: ", coupon)
		return this.graphql.mutate({
			mutate: fs.readFileSync(
				join(__dirname, "..", "graphql", "insertCoupon.graphql"),
				"utf-8",
			),
			variables: {
				orderFormId: orderFormId,
				text: coupon,
			},
			throwOnError: true,
		})
	}
}
