export interface SignUpForCampaignReq {
  surname: string,
  name: string,
  email: string,
  optin: boolean,
  sourceCampaign: string
}

export interface NewsletterSubscriptionData {
  firstName: string,
  lastName: string,
  email: string,
  isNewsletterOptIn: string,
  campaign: string,
  eventId: string
}
