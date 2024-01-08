export interface CreatePaymentFromExistingCartInput {
  query: {
      referenceId: String;
      savePersonalData: Boolean;
      optinNewsLetter: Boolean;
      value: number;
      referenceValue: number;
      interestValue: number;
  };
}

export interface AddPaymentDataInput {
  query: {
    group: String;
    installments: number;
    installmentsInterestRate: number;
    installmentsValue: number;
    paymentSystem: number;
    paymentSystemName: String;
    referenceValue: number;
    value: number;
  };
}
