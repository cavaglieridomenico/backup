export interface WPInquiryResponse {
  paymentService: {
    $: {
      version: string,
      merchantCode: string
    },
    reply: [
      {
        orderStatus: [
          {
            $: {
              orderCode: string
            },
            payment: [
              {
                lastEvent: string[],
                paymentMethod: string[],
                AuthorisationId?: [
                  {
                    $: {
                      id: string
                    }
                  }
                ],
                cardNumber: string[],
                cardHolderName: string[],
                amount: [
                  {
                    $: {
                      debitCreditIndicator: string,
                      value: string,
                      currencyCode: string
                    }
                  }
                ],
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
