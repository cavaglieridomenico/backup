export {}

declare global {
  interface UserErrors {
    name: boolean
    surname: boolean
    email: boolean
    optIn: boolean
  }

  type Status =
    | 'LOADING'
    | 'LOGIN_ERROR'
    | 'REGISTERED_ERROR'
    | 'SUCCESS'
    | 'GENERIC_ERROR'

  type Method = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE'

  interface CheckboxProps {
    checkboxTitle?: string
    checkboxRequired?: boolean
    checkboxNewsLetter?: boolean
  }

  interface MutationVariables {
    acronym: string
    document: {
      fields: Array<{
        key: string
        value?: string | boolean | null
      }>
    }
  }

  export interface AppSettings {
    sessionApi: string
    userInfoApi: string
    postUserApi: string
    newsletteroptinApi: string
  }
}
