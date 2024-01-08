
export interface CreateRequest {
  from: string
  resolveAs: string
  query?: any
}

export interface DeleteRequest {
  from: string
}

export interface CheckRequest {
  from: string
}

export interface ListInternalRequest {
  next: string
}
