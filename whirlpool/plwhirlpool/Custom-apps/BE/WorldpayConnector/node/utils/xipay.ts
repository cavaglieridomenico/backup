import { configs } from "../typings/configs"
import { ManualAuthRequest } from "../typings/xipay/manualAuthReq"
import { ManualAuthResponse } from "../typings/xipay/manualAuthRes"
import { defaultxipayRequest, xipayPaymentMapping } from "./constants"
import { DecryptKey } from "./AuthenticationUtils"
import { BuildXML } from "./XMLhandler"


interface XiPayData {
  requestBody: string,
  response?: ManualAuthResponse,
  date: {
    month: string,
    year: string
  },
  paymentMethod: string,
  tokenid: string,
  cardholderName: string
}

export const BuildXipayAuthRequest = (appSettings: configs, wpData: any, xmlNotification: string): XiPayData => {

  let date = wpData.token[0].paymentInstrument[0].cardDetails[0].expiryDate[0].date[0].$
  let paymentMethod = xipayPaymentMapping[wpData.payment[0].paymentMethod[0]]
  let tokenid = wpData.token[0].tokenDetails[0].paymentTokenID[0]
  let cardholderName = xmlNotification.split("<cardHolderName>")[1].split("</cardHolderName>")[0]
  cardholderName = cardholderName.split("CDATA[")[1].split("]")[0]

  let xipayReq: ManualAuthRequest = JSON.parse(JSON.stringify(defaultxipayRequest))
  let xipayAmount = (parseFloat(wpData.payment[0].amount[0].$.value) / 100).toFixed(2)
  //let date = notification.paymentService.notify[0].token[0].paymentInstrument[0].cardDetails[0].expiryDate[0].date[0].$
  xipayReq["soap:Envelope"]["soap:Header"]["wsse:Security"]["wsse:UsernameToken"]["wsse:Username"] = appSettings.xipayUsername
  xipayReq["soap:Envelope"]["soap:Header"]["wsse:Security"]["wsse:UsernameToken"]["wsse:Password"] = DecryptKey(appSettings.xipayPassword)
  xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardNumber"] = tokenid
  xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardExpirationDate"] = date.month + "/" + date.year
  xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardHolderName"] = cardholderName
  xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:Amount"] = xipayAmount
  xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardType"] = paymentMethod
  xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CurrencyKey"] = wpData.payment[0].amount[0].$.currencyCode
  xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:AuthorizationCode"] = wpData.payment[0].AuthorisationId?.[0].$.id
  xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:MerchantID"] = appSettings.xipayMerchantid
  xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:InfoItems"]["mes:InfoItem"] = [{
    "mes:Key": "TR_TRANS_REFID",
    "mes:Value": wpData.$.orderCode
  }]

  return {
    requestBody: BuildXML(xipayReq, null),
    date: date,
    paymentMethod: paymentMethod,
    tokenid: tokenid,
    cardholderName: cardholderName
  }
}

interface SapData {
  CC_TYPE: string,
  CC_NUMBER: string,
  CC_VALID_T: string,
  CC_NAME: string,
  CURRENCY: string,
  AUTH_DATE: string,
  AUTH_TIME: string,
  AUTH_REFNO: string
}

export const GetSapData = (xipayData: XiPayData, currency: string): SapData | undefined => {
  if (xipayData.response) {
    let [AUTH_DATE, AUTH_TIME] = FormatDateTime(xipayData.response["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].AuthorizationDate[0])
    let refno = xipayData.response["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].AuthorizationReferenceCode[0]
    if (refno == undefined || refno == null || refno.trim() == "")
      refno = xipayData.response["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].TransactionID[0]

    return {
      CC_TYPE: xipayData.paymentMethod,
      CC_NUMBER: xipayData.tokenid,
      CC_VALID_T: xipayData.date.month + "." + xipayData.date.year,
      CC_NAME: xipayData.cardholderName,
      CURRENCY: currency,
      AUTH_DATE: AUTH_DATE,
      AUTH_TIME: AUTH_TIME,
      AUTH_REFNO: refno
    }
  }

  return undefined
}


const FormatDateTime = (dateTime: string) => {
  let [date, time] = dateTime.split('T')
  let [year, month, day] = date.split('-')
  return [
    `${day}.${month}.${year}`,
    time
  ]
}
