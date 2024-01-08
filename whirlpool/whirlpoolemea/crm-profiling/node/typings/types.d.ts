export interface ProfilingRequest {
  firstName: string
  lastName: string
  email: string
  profilingOptin: boolean
  dig: string
}

export interface CLRecord {
  id: string,
  userId?: string,
  email: string,
  firstName: string,
  lastName: string,
  isNewsletterOptIn: boolean,
  isProfilingOptIn: boolean,
  campaign?: string,
  userType?: string|null,  
  partnerCode?: string|null,  
}

export interface NewsletterSubscriptionData {
  firstName: string,
  lastName: string,
  email: string,
  isNewsletterOptIn: boolean,
  isProfilingOptIn: boolean,
  campaign: string|null,
  userType?: string|null,
  partnerCode?: string|null,
  eventId: string
}