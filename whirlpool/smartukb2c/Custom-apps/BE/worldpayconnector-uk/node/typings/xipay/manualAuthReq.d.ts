export interface ManualAuthRequest {
  "soap:Envelope": {
    "$": {
      "xmlns:soap": string,
      "xmlns:mes": string
    },
    "soap:Header":
    {
      "wsse:Security":
      {
        "$": {
          "xmlns:wsse": string
        },
        "wsse:UsernameToken":
        {
          "wsse:Username": string,
          "wsse:Password": string
        }
      },
    },
    "soap:Body":
    {
      "mes:SoapOp":
      {
        "mes:pPacketsIn":
        {
          "mes:count": number,
          "mes:xipayvbresult": boolean,
          "mes:packets": [
            {
              "mes:ITransactionHeader":
              {
                "mes:Amount": string,
                "mes:AuthorizationCode"?: string,
                "mes:CardDataSource": string,
                "mes:CardExpirationDate": string,
                "mes:CardHolderName": string,
                "mes:CardNumber": string,
                "mes:CardType": string,
                "mes:CurrencyKey": string,
                "mes:MerchantID": string,
                "mes:PacketOperation": string,
                "mes:InfoItems":
                {
                  "mes:InfoItem": InfoItem[]
                }
              }
            }
          ]
        }
      }
    }
  }
}

interface InfoItem {
  "mes:Key": string,
  "mes:Value": string
}
