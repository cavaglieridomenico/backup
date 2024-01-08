export interface InvitedUser {
  email: string,
  expirationDate?: string
}

export interface InvitationMyAccount {
  email: string,
  remainingDays?: number
}

export interface InvitationsPerAccount {
  active: InvitationMyAccount [],
  expired: InvitationMyAccount[],
  totalActiveUsers: number,
  totalExpiredUsers: number
}
