import { CancelPaymentResponse } from "../typings/CancelPayment/cancelPaymentResponse";
import { CapturePaymentResponse } from "../typings/CapturePayment/capturePaymentResponse";
import { CreatePaymentResponse } from "../typings/CreatePayment/createPaymentResponse";
import { RefundPaymentResponse } from "../typings/RefundPayment/refundPaymentResponse";
import { WPCreatePaymentRequest } from "../typings/WPCreatePayment/WPCreatePaymentRequest";
import { ManualAuthRequest } from "../typings/xipay/manualAuthReq";

export const credentials: { [index: string]: string } = {
  "vtex_app_key": "716a37bc92b1aae0517a0ca3227df9111f29b351808f9853bc49e15fe5c7f7af"
}

export const testCredentials: { [index: string]: string } = {
  "testKey": "4b4a2dd847324503f0febd6955148a7737ca1c9a1ceef7690e0c2b827577ec5f"
}

export const cipherAlghoritm = 'aes-256-cbc'
export const cipherKey = "1080c5d55cfb487de124343405f14dbaeaac138fae62224279e083dd9bef83ff"
export const iv = "1aa8d477e5286ea654cc80d72a853e58"

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

export const Acquirer = "Worldpay"

export const vtexCredentials: { [index: string]: { "X-VTEX-API-AppKey": string, "X-VTEX-API-AppToken": string } } = {
  "smartukb2cqa": {
    "X-VTEX-API-AppKey": 'vtexappkey-smartukb2cqa-YKKZAW',
    "X-VTEX-API-AppToken": 'HLHYGOHXWXDIJSKEMSGLSFIBVQJNWVJUILLGYECQHBXSIXKTDVPMHVZBCFCPEUBBOJAYGDGHQPERIQTYGPKAFWMNLJDSCMLMAVDYXMNAPIWRQITMLEJOKAWSWMMXZNFD'
  },
  "smartukb2c": {
    "X-VTEX-API-AppKey": 'vtexappkey-smartukb2c-PKFYOF',
    "X-VTEX-API-AppToken": 'ETOPZEPPSZYYMIXLFIQWGDJNAVKLRACQDEZMJSAOGPCWPGHQSNDLJVFBJAPEUDYRWHUIJLBNHBQRANYTOTSDWRGIYXDIDWUCRLAHLYHHMQDHEOAVCVPBLVVEBMJLISJK'
  }
}

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
  delayToAutoSettle: 1728000,
  delayToAutoSettleAfterAntifraud: 1728000,
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
        }
        ,
        orderContent: "",
        paymentMethodMask: [
          {
            include:
            {
              $: {
                code: "all"
              }
            }
          }
        ],
        shopper:
        {
          shopperEmailAddress: ""
        },
        billingAddress: undefined,
        createToken: undefined
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
  ]
}

export const CountryCodeMapping = [
  {
    "name": "United Kingdom",
    "code": "GB"
  },
  {
    "name": "schweiz",
    "code": "CH"
  },
  {
    "name": "suisse",
    "code": "CH"
  },
  {
    "name": "svizzera",
    "code": "CH"
  }
]
