import { CancelPaymentResponse } from "../typings/CancelPayment/cancelPaymentResponse";
import { CapturePaymentResponse } from "../typings/CapturePayment/capturePaymentResponse";
import { CreatePaymentResponse } from "../typings/CreatePayment/createPaymentResponse";
import { RefundPaymentResponse } from "../typings/RefundPayment/refundPaymentResponse";
import { WPCreateP24PaymentRequest, WPCreatePaymentRequest } from "../typings/WPCreatePayment/WPCreatePaymentRequest";
import { ManualAuthRequest } from "../typings/xipay/manualAuthReq";

export const credentials: { [index: string]: string } = {
  "vtex_app_key": "74d0b37dfe7c398a8ecd8b73b2f0d5691afc4449cd08157b29729edfa05024d5"
}

export const testCredentials: { [index: string]: string } = {
  "testKey": "4b4a2dd847324503f0febd6955148a7737ca1c9a1ceef7690e0c2b827577ec5f"
}

export const cipherAlghoritm = 'aes-256-cbc'
export const cipherKey = "4a1f2aed70700f938f4bf657ba2d858aac9a4682315c75aca13f9a160e606596"
export const iv = "f4fddea371a5fec9da350aec9d3a85b0"

export const MasterDataEntity = "WP"
export const VBaseBucket = "worldpay_payments"

//SAP data
export const AUTH_FLAG = "X"
export const CC_REACT = "A"
export const CC_STAT_EX = "C"
export const DATAORIGIN = "E"


export const DeniedPaymentNotificationURL = "https://{host}/_v/api/connectors/worldpay/denied/"
export const HelperPageURL = "https://{host}/_v/api/connectors/worldpay/helper"
export const worldpayDomain = "worldpay.com"

export enum authHeaders {
  appkey = "X-VTEX-API-AppKey",
  apptoken = "X-VTEX-API-AppToken"
}

export const Acquirer = "Worldpay"

export const XML = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE paymentService PUBLIC "-//WorldPay/DTD WorldPay PaymentService v1//EN" "http://dtd.worldpay.com/paymentService_v1.dtd">'
export const orderSuffix = "-01"


export const PaymentStatusVtex = {
  approved: "approved",
  denied: "denied",
  undefined: "undefined",
  captured: "captured",
  canceled: "canceled"
}

export const WorldpayStatusToVtexMapping = {
  approved: ["AUTHORISED"],
  denied: ["ERROR", "EXPIRED", "REFUSED", "CANCELLED"],
  captured: ["CAPTURED", "SETTLED"],
  canceled: ["CANCELLED", "REFUNDED"]
}


export const defaultCreatePaymentResponse: CreatePaymentResponse = {
  paymentId: "",
  status: PaymentStatusVtex.denied,
  authorizationId: null,
  tid: "",
  nsu: null,
  acquirer: Acquirer,
  code: "500",
  message: "",
  delayToAutoSettle: 604800,
  delayToAutoSettleAfterAntifraud: 604800,
  delayToCancel: 7200
}

export const defaultCapturePaymentResponse: CapturePaymentResponse = {
  paymentId: "",
  settleId: null,
  value: 0,
  requestId: ""
}

export const defaultCancelPaymentResponse: CancelPaymentResponse = {
  paymentId: "",
  requestId: "",
  cancellationId: null,
  code: "cancel-manually"
}

export const defaultRefundPaymentResponse: RefundPaymentResponse = {
  paymentId: "",
  requestId: "",
  refundId: null,
  value: 0,
  code: "refund-manually"
}

export const xipayPaymentMapping: { [index: string]: string } = {
  "AMEX-SSL": "WAMX",
  "DISCOVER-SSL": "WDIS",
  "MAESTRO-SSL": "WMAE",
  "MASTERPASS-SSL": "WMC",
  "ECMC-SSL": "WMC",
  "VISA_CREDIT-SSL": "WVIS",
  "VISA_DEBIT-SSL": "WVIS",
  "VISA_COMMERCIAL_CREDIT-SSL": "WVIS",
  "VISA_COMMERCIAL_DEBIT-SSL": "WVIS",
  "VISA_ELECTRON-SSL": "WVIS",
  "ECMC_CREDIT-SSL": "WMC",
  "ECMC_DEBIT-SSL": "WMC",
  "ECMC_COMMERCIAL_CREDIT-SSL": "WMC",
  "ECMC_COMMERCIAL_DEBIT-SSL": "WMC",
  "VISA-SSL": "WVIS"
}

export const defaultWPpaymentRequest: WPCreatePaymentRequest = {
  paymentService: {
    $: {
      version: "",
      merchantCode: ""
    },
    submit:
    {
      order:
      {
        $: {
          orderCode: "",
          installationId: "",
          captureDelay: "DEFAULT",
          shopperLanguageCode: "PL",
        },
        description: "Whirlpool order payment",
        amount:
        {
          $: {
            currencyCode: "",
            exponent: "2",
            value: "0"
          }
        },
        orderContent: "",
        paymentMethodMask: [],
        paymentDetails: [],
        shopper:
        {
          shopperEmailAddress: ""
        }
      }
    }
  }
}

export const p24tWPpaymentRequest: WPCreateP24PaymentRequest = {
  paymentService: {
    $: {
      version: "",
      merchantCode: ""
    },
    submit:
    {
      order:
      {
        $: {
          orderCode: "",
          installationId: "",
          captureDelay: "DEFAULT"
        },
        description: "Whirlpool order payment",
        amount:
        {
          $: {
            currencyCode: "",
            exponent: "2",
            value: "0"
          }
        },
        orderContent: "",
        paymentMethodMask: [],
        paymentDetails: [],
        shopper:
        {
          shopperEmailAddress: ""
        }
      }
    }
  }
}

export const defaultxipayRequest: ManualAuthRequest = {
  "soap:Envelope": {
    $: {
      "xmlns:soap": "http://www.w3.org/2003/05/soap-envelope",
      "xmlns:mes": "http://Paymetric/XiPaySoap30/message/"
    },
    "soap:Header": {
      "wsse:Security": {
        $: {
          "xmlns:wsse": "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
        },
        "wsse:UsernameToken": {
          "wsse:Username": "",
          "wsse:Password": ""
        }
      }
    },
    "soap:Body": {
      "mes:SoapOp": {
        "mes:pPacketsIn": {
          "mes:count": 1,
          "mes:xipayvbresult": false,
          "mes:packets": [
            {
              "mes:ITransactionHeader": {
                "mes:Amount": "",
                "mes:AuthorizationCode": "",
                "mes:CardDataSource": "E",
                "mes:CardExpirationDate": "",
                "mes:CardHolderName": "",
                "mes:CardNumber": "",
                "mes:CardType": "",
                "mes:CurrencyKey": "",
                "mes:MerchantID": "",
                "mes:PacketOperation": "12",
                "mes:InfoItems": {
                  "mes:InfoItem": [
                  ]
                }
              }
            }
          ]
        }
      }
    }
  }
}

export const PaymentMethods = ['Promissories']

export const ProviderManifest = {
  paymentMethods: [
    {
      "name": "Promissories",
      "allowsSplit": "disabled"
    }
  ],
  customFields: [
    {
      "name": "paymentType",
      "type": "select",
      "options": [
        {
          "text": "Credit Cards",
          "value": "creditcards",
        },
        {
          "text": "Bank Transfer",
          "value": "banktransfer",
        }
      ]
    }
  ]
}

export const CountryCodeMapping = [
  {
    "name": "italy",
    "code": "IT"
  },
  {
    "name": "italia",
    "code": "IT"
  },
  {
    "name": "ita",
    "code": "IT"
  },
  {
    "name": "san marino",
    "code": "SM"
  },
  {
    "name": "smr",
    "code": "SM"
  },
  {
    "name": "vaticano",
    "code": "VA"
  },
  {
    "name": "vat",
    "code": "VA"
  },
  {
    "name": "france",
    "code": "FR"
  },
  {
    "name": "poland",
    "code": "PL"
  },
  {
    "name": "pol",
    "code": "PL"
  }
]

export const MD_P24_ALERT = "PA"
export const MD_GENERIC_ALERT = "AL"