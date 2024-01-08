export const setAnalyticCustomError = (errors: any, push: any): void => {
  const ga4Data = {
    event: 'ga4-custom_error',
    type: 'error message',
    description: '',
  }

  const errorMessages = {
    noAllFieldsCorrectMessage:
      'Some mandatory fields are not filled in correctly',
    noReasonMessage: 'Reason not entered',
    noNameMessage: 'Name not entered',
    noSurnameMessage: 'Surname not entered',
    noAddressMessage: 'Address not entered',
    noZipCodeMessage: 'Zip code not entered',
    noCityMessage: 'City not entered',
    noEmailMessage: 'Email not entered',
    invalidEmailMessage: 'Invalid email format',
    noUserTextMessage: 'User message not entered',
  }

  if (Object.keys(errors).length !== 0) {
    ga4Data.description = errorMessages.noAllFieldsCorrectMessage
    push({ ...ga4Data })

    if (errors.Reason) {
      ga4Data.description = errorMessages.noReasonMessage
      push({ ...ga4Data })
    }
    if (errors.Name) {
      ga4Data.description = errorMessages.noNameMessage
      push({ ...ga4Data })
    }
    if (errors.Surname) {
      ga4Data.description = errorMessages.noSurnameMessage
      push({ ...ga4Data })
    }
    if (errors.Address) {
      ga4Data.description = errorMessages.noAddressMessage
      push({ ...ga4Data })
    }
    if (errors.ZipCode) {
      ga4Data.description = errorMessages.noZipCodeMessage
      push({ ...ga4Data })
    }
    if (errors.City) {
      ga4Data.description = errorMessages.noCityMessage
      push({ ...ga4Data })
    }
    if (
      errors.Email &&
      errors.Email.props.id !== 'store/contact-us-form.emailCorrect'
    ) {
      ga4Data.description = errorMessages.noEmailMessage
      push({ ...ga4Data })
    }
    if (
      errors.Email &&
      errors.Email.props.id === 'store/contact-us-form.emailCorrect'
    ) {
      ga4Data.description = errorMessages.invalidEmailMessage
      push({ ...ga4Data })
    }
    if (errors.UserMessage) {
      ga4Data.description = errorMessages.noUserTextMessage
      push({ ...ga4Data })
    }
  }
}
