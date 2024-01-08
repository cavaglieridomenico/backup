export interface Validate {
  isEmailRequired: boolean
  isFirstNameRequired: boolean
  isLastNameRequired: boolean
  isDocumentRequired: boolean
  isDocumentTypeRequired: boolean
  isPhoneRequired: boolean
}

export interface ValidateAddress {
  isAddressRequired: boolean
  isComplementRequired: boolean
  isCityRequired: boolean
  isStateRequired: boolean
  isPostalCodeRequired: boolean
  isNumberRequired: boolean
  isCountryRequired: boolean
}

export interface ValidateDelivery {
  isReceiverRequired: boolean
  isDeliveryTypeRequired: boolean
}
