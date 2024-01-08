export interface CheckboxProps {
  checkboxLabel?: string,
  checkboxRequired?: boolean,
  checkboxNewsletter?: boolean,
  checkboxError?: string
}

export interface FormProps {
  title?: string,
  subtitles?: string[],
  namePlaceholder: string,
  surnamePlaceholder: string,
  emailPlaceholder: string,
  showInputLabels?: boolean,
  nameLabel?: string,
  surnameLabel?: string,
  emailLabel?: string,
  checkboxes?: CheckboxProps[],
  privacyPolicyTextArray?: string[],
  privacyPolicyTextArrayAfterCheckboxes?: string[],
  errorRequiredField: string,
  errorInvalidMail: string,
  campaign: string,
  submitButtonText?: string,
  successMessageInsideButton?: boolean,
  successMessageNewsletter: string,
  successMessageSubscriptionToBIS: string,
  errorMessageSubscriptionToBIS: string,
  registeredErrorMessage: string,
  shouldLogInErrorMessage: string,
  genericApiErrorMessage: string,
  available:boolean,
  skuId:string
}

export interface UserErrors {
  name: boolean
  surname: boolean
  email: boolean
}

export interface MutationVariables {
  acronym: string
  document: {
    fields: Array<{
      key: string
      value?: string | null
    }>
  }
}

export type StatusNewsLetter =
  | 'LOADING'
  | 'REGISTERED_ERROR'
  | 'SUCCESS'
  | 'GENERIC_ERROR'
  | 'LOGIN_ERROR'

export type StatusBackInStock = 'SUCCESS' | 'ERROR'

export type Method = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE'
