export interface UserErrors {
  name: boolean
  surname: boolean
  email: boolean
}

export type StatusNewsLetter =
  | 'LOADING'
  | 'REGISTERED_ERROR'
  | 'SUCCESS'
  | 'GENERIC_ERROR'
  | 'LOGIN_ERROR'

export type StatusComparison = 'SUCCESS' | 'ERROR' | 'LOADING'

export type Method = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE'
