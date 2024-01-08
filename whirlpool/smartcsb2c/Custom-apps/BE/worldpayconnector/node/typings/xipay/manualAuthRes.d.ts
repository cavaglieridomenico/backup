export interface ManualAuthResponse {
  "s:Envelope": {
    "s:Body": [
      {
        "SoapOpResponse": [
          {
            "SoapOpResult": [
              {
                "xipayvbresult": boolean[],
                "packets": [
                  {
                    "ITransactionHeader": [
                      {
                        "StatusCode": number[],
                        "StatusTXN": string[],
                        "AuthorizationReferenceCode": string[],
                        "TransactionID": string[]
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
