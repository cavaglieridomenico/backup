export interface NewsletterSubscriptionData {
  firstName: string
  lastName: string
  email: string
  isNewsletterOptIn: boolean
  campaign?: string | null
  userType: string | null
  partnerCode?: string | null
  eventId: string
}
