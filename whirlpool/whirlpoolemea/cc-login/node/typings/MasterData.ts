export interface PARecord {
  id: string
  name?: string | null
  partnerCode?: string | null
  accessCode: string
  status?: boolean,
  autologinEnabled: boolean,
  companyPassword?: string
}

export interface EMRecord {
  id: string
  clockNumber: string | null | undefined
  hrNumber: string | null | undefined
  integrityCode: string | null | undefined
  email?: string | null
  status: boolean
}

export interface FFRecord {
  id?: string
  invitingUser: string
  invitedUser: string
  expirationDate: string
  activationDate?: string | null
  cluster?: string | null | undefined
}

export interface CLRecord {
  id?: string
  userId?: string | null
  email?: string
  firstName?: string | null
  lastName?: string | null
  isNewsletterOptIn?: boolean
  campaign?: string | null
  userType?: string | null | undefined
  totalNumberOfPlacedOrders?: number | null | undefined
  totalNumberOfBoughtFG?: number | null | undefined
  partnerCode?: string | null | undefined
  loginCounter?: number | null | undefined
  clockNumber?: string | null | undefined
  hrNumber?: string | null | undefined
  invitingUser?: string | null | undefined
  activationDate?: string | null | undefined
  orderLimitCounter?: number | null | undefined
  lastPlacedOrderDate?: string | null | undefined
}
