import { Logger, LINKED } from "@vtex/api"

export class CouponsCustomLogger extends Logger {
	private ctx: Context

	constructor(ctx: any) {
		super(ctx)
		this.ctx = ctx
		this.info = (message: any) => this.customLog("info", message)
		this.error = (message: any) => this.customLog("error", message)
	}

	private customLog(logType: "info" | "error", couponLog: any) {
		if (!couponLog) return

		LINKED
			? console[logType](couponLog)
			: this.ctx.clients.masterdata.createDocument({
					dataEntity: "CP",
					fields: {
						...couponLog,
						logType: logType,
						timestamp: new Date().toISOString(),
					},
			  })
	}

	// private formatMessage = (message: any) =>
	// 	typeof message == "object"
	// 		? JSON.stringify(message, this.getCircularReplacer())
	// 		: message

	// private getCircularReplacer = () => {
	// 	const seen = new WeakSet()
	// 	return ({}, value: object | null) => {
	// 		if (typeof value === "object" && value !== null) {
	// 			if (seen.has(value)) {
	// 				return
	// 			}
	// 			seen.add(value)
	// 		}
	// 		return value
	// 	}
	// }
}
