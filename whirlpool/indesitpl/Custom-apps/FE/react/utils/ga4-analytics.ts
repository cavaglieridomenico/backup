export const setAnalyticCustomError = (errors: any, push: any): void => {
  const ga4Data = {
    event: "ga4-custom_error",
    type: "error message",
    description: "",
  };

  const errorMessages = {
    noAllFieldsCorrectMessage:
      "Some mandatory fields are not filled in correctly",
    noReasonMessage: "Reason not entered",
    noNameMessage: "Name not entered",
    noSurnameMessage: "Surname not entered",
    noAddressMessage: "Address not entered",
    noZipCodeMessage: "Zip code not entered",
    noCityMessage: "City not entered",
    invalidEmailMessage: "Email is invalid",
    noUserTextMessage: "User message not entered",
    noModelMessage: "Model not entered",
    invalidDate: "Date is invalid",
  };

  if (errors.nome) {
    ga4Data.description = errorMessages.noNameMessage;
    push({ ...ga4Data });
  }
  if (errors.cognome) {
    ga4Data.description = errorMessages.noSurnameMessage;
    push({ ...ga4Data });
  }
  if (errors.indirizzo) {
    ga4Data.description = errorMessages.noAddressMessage;
    push({ ...ga4Data });
  }
  if (errors.cap) {
    ga4Data.description = errorMessages.noZipCodeMessage;
    push({ ...ga4Data });
  }
  if (errors.città) {
    ga4Data.description = errorMessages.noCityMessage;
    push({ ...ga4Data });
  }
  if (errors.email) {
    ga4Data.description = errorMessages.invalidEmailMessage;
    push({ ...ga4Data });
  }
  if (errors.testoSegnalazione) {
    ga4Data.description = errorMessages.noUserTextMessage;
    push({ ...ga4Data });
  }
  if (errors.modello) {
    ga4Data.description = errorMessages.noModelMessage;
    push({ ...ga4Data });
  }
  if (errors.dataDacquisto) {
    ga4Data.description = errorMessages.invalidDate;
    push({ ...ga4Data });
  }
};
