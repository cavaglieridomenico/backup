export interface PARecord {
  id: string,
  name?: string,
  partnerCode?: string,
  accessCode: string,
  status: boolean
}

export interface EMRecord {
  id: string,
  email: string,
  status: boolean
}

export interface FFRecord {
  id?: string,
  invitingUser: string,
  invitedUser: string,
  expirationDate: string,
  activationDate?: string
}

export interface CLRecord {
  id?: string,
  userId?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  isNewsletterOptIn?: boolean,
  campaign?: string,
  userType?: string,
  totalNumberOfPlacedOrders?: number,
  totalNumberOfBoughtFG?: number,
  partnerCode?: string
}
