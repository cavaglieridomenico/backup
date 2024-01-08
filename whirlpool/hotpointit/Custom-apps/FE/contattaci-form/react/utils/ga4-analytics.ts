export const setAnalyticCustomError = (errors: any, push: any): void => {
  const ga4Data = {
    event: "ga4-custom_error",
    type: "error message",
    description: "",
  };

  const errorMessages = {
    noReasonMessage: "Reason not entered",
    noNameMessage: "Name not entered",
    noSurnameMessage: "Surname not entered",
    noAddressMessage: "Address not entered",
    noZipCodeMessage: "Zip code not entered",
    noCityMessage: "City not entered",
    noDistrictMessage: "District not entered",
    invalidEmailMessage: "Invalid email format",
    noUserTextMessage: "User message not entered",
    noModelMessage: "Model not entered",
    invalidPurchaseDateMessage: "Invalid purchase date format",
    noWarrantyExtensionMessage: "No warrant extension infos",
    invalidWarrantyEndDateMessage: "Invalid warranty end date format",
  };

  if (Object.keys(errors).length !== 0) {
    if (errors.Reason) {
      ga4Data.description = errorMessages.noReasonMessage;
      push({ ...ga4Data });
    }
    if (errors.Nome) {
      ga4Data.description = errorMessages.noNameMessage;
      push({ ...ga4Data });
    }
    if (errors.Cognome) {
      ga4Data.description = errorMessages.noSurnameMessage;
      push({ ...ga4Data });
    }
    if (errors.Indirizzo) {
      ga4Data.description = errorMessages.noAddressMessage;
      push({ ...ga4Data });
    }
    if (errors.Cap) {
      ga4Data.description = errorMessages.noZipCodeMessage;
      push({ ...ga4Data });
    }
    if (errors.Citta) {
      ga4Data.description = errorMessages.noCityMessage;
      push({ ...ga4Data });
    }
    if (errors.Provincia) {
      ga4Data.description = errorMessages.noDistrictMessage;
      push({ ...ga4Data });
    }
    if (errors.Email) {
      ga4Data.description = errorMessages.invalidEmailMessage;
      push({ ...ga4Data });
    }
    if (errors.Segnalazione) {
      ga4Data.description = errorMessages.noUserTextMessage;
      push({ ...ga4Data });
    }
    if (errors.Modello) {
      ga4Data.description = errorMessages.noModelMessage;
      push({ ...ga4Data });
    }
    if (errors.DataAcquisto) {
      ga4Data.description = errorMessages.invalidPurchaseDateMessage;
      push({ ...ga4Data });
    }
    if (errors.EstensioneDiGaranzia) {
      ga4Data.description = errorMessages.noWarrantyExtensionMessage;
      push({ ...ga4Data });
    }
    if (errors.DataFineGaranziaEstensione) {
      ga4Data.description = errorMessages.invalidWarrantyEndDateMessage;
      push({ ...ga4Data });
    }
  }
};
