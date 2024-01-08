export interface NewsletterSubscriptionData {
  firstName: string
  lastName: string
  email: string
  isNewsletterOptIn: boolean  
  campaign: string
  eventId: string
  isProfilingOptIn?: boolean
  [key: string]: any // => workaround to mute typescript validation alerts in the mapper (mapCLInfo)
}
