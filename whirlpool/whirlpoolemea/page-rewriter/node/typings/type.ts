
export interface AllowedPageItem {
  fromPath: string,
  resolveAsPath: [string]
}

export interface CheckResponse {
  isExistent: boolean
  from: string
}


export interface ListInternalResponse {
  next: string
  routes: any[]
}
