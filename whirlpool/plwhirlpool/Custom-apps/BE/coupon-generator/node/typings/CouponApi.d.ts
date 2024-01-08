export interface CouponRequest {
  utmSource?: string,
  utmCampaign?: string,
  couponCode: string,
  isArchived: boolean,
  maxItemsPerClient: number,
  expirationIntervalPerUse?: string
}
