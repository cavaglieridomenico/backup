import { APP } from "@vtex/api"
import {
	CouponLogStatus,
	InsertCouponOutput,
} from "../typings/insertCouponWithLogs"
import { CouponsCustomLogger } from "../utils/CouponsCustomLogger"

export const insertCouponWithLogs_resolver = async (
	_: unknown,
	args: { orderFormId: string; coupon: string },
	ctx: any,
): Promise<any> => {
	const { clients, vtex } = ctx
	const appSettings = await clients.apps.getAppSettings(APP.ID)
	process.env.DEFAULT_LOCALE = appSettings.defaultLocale

	const couponLogger = new CouponsCustomLogger(ctx)

	const { orderFormId = vtex.orderFormId, coupon } = args
	const response: InsertCouponOutput = await clients.checkoutGraphQL
		.insertCoupon(orderFormId ?? undefined, coupon)
		.then((res: { data: { insertCoupon: any } }) => res?.data?.insertCoupon)
		.catch((err: any) => {
			couponLogger.error({
				coupon: coupon,
				status: CouponLogStatus.serviceError,
				message: err?.response?.data,
				code: err.status,
			})
		})

	if (response) {
		const responseMessages = [
			...response.messages.couponMessages,
			...response.messages.generalMessages,
		]
		if (responseMessages.length == 0) {
			couponLogger.info({ coupon: coupon, status: CouponLogStatus.accepted })
		} else {
			responseMessages.forEach(message => {
				couponLogger.error({
					coupon: coupon,
					status: CouponLogStatus.refused,
					message: message.text,
					code: message.code,
				})
			})
		}
	}
	return response
}
