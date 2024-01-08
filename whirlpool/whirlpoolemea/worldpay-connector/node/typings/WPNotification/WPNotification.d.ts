export interface WPNotification {
  paymentService: {
    $: {
      version: string,
      merchantCode: string
    },
    notify: [
      {
        orderStatusEvent: [
          {
            $: {
              orderCode: string
            },
            payment: [
              {
                lastEvent: string[],
                paymentMethod: string[],
                amount: [
                  {
                    $: {
                      debitCreditIndicator: string,
                      value: string,
                      currencyCode: string
                    }
                  }
                ],
                AuthorisationId?: [
                  {
                    $: {
                      id: string
                    }
                  }
                ],
                cardHolderName: string[],
                cardNumber?: string[],
                riskScore?: [
                  {
                    $: {
                      value: string
                    }
                  }
                ]
              }
            ],
            token: [
              {
                tokenDetails: [{
                  paymentTokenID: string[]
                }],
                paymentInstrument: [
                  {
                    cardDetails: [
                      {
                        expiryDate: [
                          {
                            date: [
                              {
                                $: {
                                  month: string,
                                  year: string
                                }
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
