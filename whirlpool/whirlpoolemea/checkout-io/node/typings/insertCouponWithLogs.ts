export interface InsertCouponOutput {
	id: string
	value: number
	marketingData: MarketingData
	messages: CouponMessages
}

interface MarketingData {
	utmSource: string
	utmMedium: string
	utmCampaign: string
	utmiPage: string
	utmiPart: string
	utmiCampaign: string
	coupon: string
	marketingTags: string[]
}

interface CouponMessages {
	couponMessages: Message[]
	generalMessages: Message[]
}

interface Message {
	code: string
	text: string
	status: string
	fields: MessageField
}

interface MessageField {
	value: string
}

export enum CouponLogStatus {
	accepted = "Coupon accepted",
	refused = "Coupon refused",
	serviceError = "Service error",
}
