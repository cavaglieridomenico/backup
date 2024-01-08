export interface SignUpForCampaignReq {
  surname: string,
  name: string,
  email: string,
  optin: boolean,
  isProfilingOptIn: boolean,
  sourceCampaign?: string
}

export interface SignUpForCampaignReq2 {
  lastName: string,
  firstName: string,
  email: string,
  isNewsletterOptIn: boolean,
  isProfilingOptIn: boolean,
  campaign?: string
}

export interface NewsletterSubscriptionData {
  firstName: string,
  lastName: string,
  email: string,
  isNewsletterOptIn: boolean,
  isProfilingOptIn: boolean,
  campaign: string,
  userType: string,
  partnerCode?: string,
  eventId: string
}
