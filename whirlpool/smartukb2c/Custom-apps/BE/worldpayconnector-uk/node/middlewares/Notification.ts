import { AuthorizationCallback } from "@vtex/api"
import { configs } from "../typings/configs"
import { WPCancelRequest } from "../typings/WPCancel/WPCancelRequest"
import { WPNotification } from "../typings/WPNotification/WPNotification"
import { ManualAuthRequest } from "../typings/xipay/manualAuthReq"
import { ManualAuthResponse } from "../typings/xipay/manualAuthRes"
import { Acquirer, defaultxipayRequest, orderSuffix, PaymentStatusVtex } from "../utils/constants"
import { GetCreatePaymentStatus } from "../utils/VtexStatusFromWorldpayStatus"
import { BuildXML, ParseXML } from "../utils/XMLhandler"
import { GetPayment, SavePayment } from "../utils/Storage"
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";

export async function NotificationHandler(ctx: Context, next: () => Promise<any>) {

  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  process.env.WP_URL = appSettings.wpUrl
  process.env.WP_USERNAME = appSettings.wpusername
  process.env.WP_PASSWORD = appSettings.wppassword
  process.env.XP_URL = appSettings.xipayUrl
  const XiPayPaymentMapping: { [index: string]: string } = {
    "AMEX-SSL": appSettings.xipayAmericanXpress,
    "DISCOVER-SSL": appSettings.xipayDiscover,
    "MAESTRO-SSL": appSettings.xipayMaestro,
    "MASTERPASS-SSL": appSettings.xipayMasterpass,
    "ECMC-SSL": appSettings.xipayECMC,
    "VISA_CREDIT-SSL": appSettings.xipayVisaCredit,
    "VISA_DEBIT-SSL": appSettings.xipayVisaDebit,
    "VISA_COMMERCIAL_CREDIT-SSL": appSettings.xipayVisaCommercialCredit,
    "VISA_COMMERCIAL_DEBIT-SSL": appSettings.xipayVisaCommercialDebit,
    "VISA_ELECTRON-SSL": appSettings.xipayVisaElectron,
    "ECMC_CREDIT-SSL": appSettings.xipayECMCCredit,
    "ECMC_DEBIT-SSL": appSettings.xipayECMCDebit,
    "ECMC_COMMERCIAL_CREDIT-SSL": appSettings.xipayECMCCommercialCredit,
    "ECMC_COMMERCIAL_DEBIT-SSL": appSettings.xipayECMCCommercialDebit,
    "VISA-SSL": appSettings.xipayVisa
  }
  console.log("[Notification] APP Settings: " + JSON.stringify(appSettings))

  ctx.vtex.logger = new CustomLogger(ctx);
  let logger = ctx.vtex.logger

  let xmlBody = ""
  ctx.req.on('data', data => {
    xmlBody += data
  })

  ctx.req.on('end', async () => {
    logger.info(logMessage("[Notification] Notification received: " + xmlBody))
    console.log("[Notification] Notification Response XML: " + xmlBody)
    let notification: WPNotification | undefined = ParseXML<WPNotification>(xmlBody)

    if (notification != undefined) {
      let orderCode = notification.paymentService.notify[0].orderStatusEvent[0].$.orderCode
      console.log(orderCode)
      let paymentStatus = notification.paymentService.notify[0].orderStatusEvent[0].payment[0].lastEvent[0]
      console.log(paymentStatus)

      let existingPayment: any = undefined

      try {
        existingPayment = await GetPayment(ctx, orderCode.includes("-01") ? orderCode : orderCode + orderSuffix, 2500, 2)
        console.log("payment found")
      } catch (err) {
        logger.error("[Notification] order:" + orderCode + " - Error retrieving payment")
        logger.debug(err)
      }

      logger.info(logMessage("[Notification] order: " + orderCode + " - Received notification: " + JSON.stringify(notification) + " - Notification status: " + paymentStatus))
      console.log(existingPayment)
      console.log("Notification response JSON: " + JSON.stringify(notification))

      /*await ctx.clients.masterdata.searchDocuments<PaymentMD>({
        dataEntity: MasterDataEntity,
        fields: ['id', 'callbackUrl', 'status', 'transactionid'],
        pagination: {
          page: 1,
          pageSize: 1
        },
        where: `orderid=${orderCode} AND status=${PaymentStatusVtex.undefined}`
      }).then(results => {
        if (results.length > 0) {
          existingPayment = results[0]
        }
      }, error => {
        logger.error(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }) + " - [Notification] order:" + orderCode + " - Error reading from master data: " + JSON.stringify(error.response.data.Message))
        console.log(error)
      })

      logger.info(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }) + " - [Notification] order:" + orderCode + " - Received notification with status: " + paymentStatus)
      console.log("Existing payment MD: " + JSON.stringify(existingPayment))
      console.log("Notification response JSON: " + JSON.stringify(notification))*/

      if (existingPayment != undefined) {
        //create body and send request to xipay
        let xipayRes: ManualAuthResponse | undefined = undefined
        let vtexStatus = GetCreatePaymentStatus(paymentStatus)
        let date = notification.paymentService.notify[0].orderStatusEvent[0].token[0].paymentInstrument[0].cardDetails[0].expiryDate[0].date[0].$
        let paymentMethod = XiPayPaymentMapping[notification.paymentService.notify[0].orderStatusEvent[0].payment[0].paymentMethod[0]]
        let tokenid = notification.paymentService.notify[0].orderStatusEvent[0].token[0].tokenDetails[0].paymentTokenID[0]
        let cardholderName = xmlBody.split("<cardHolderName>")[1].split("</cardHolderName>")[0]
        cardholderName = cardholderName.split("CDATA[")[1].split("]")[0]
        if (vtexStatus == PaymentStatusVtex.approved) {
          try {
            let xipayReq: ManualAuthRequest = JSON.parse(JSON.stringify(defaultxipayRequest))
            let xipayAmount = (parseFloat(notification.paymentService.notify[0].orderStatusEvent[0].payment[0].amount[0].$.value) / 100).toFixed(2)
            //let date = notification.paymentService.notify[0].token[0].paymentInstrument[0].cardDetails[0].expiryDate[0].date[0].$
            xipayReq["soap:Envelope"]["soap:Header"]["wsse:Security"]["wsse:UsernameToken"]["wsse:Username"] = appSettings.xipayUsername
            xipayReq["soap:Envelope"]["soap:Header"]["wsse:Security"]["wsse:UsernameToken"]["wsse:Password"] = appSettings.xipayPassword
            xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardNumber"] = tokenid
            xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardExpirationDate"] = date.month + "/" + date.year
            xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardHolderName"] = cardholderName
            xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:Amount"] = xipayAmount
            xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardType"] = paymentMethod
            xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CurrencyKey"] = notification.paymentService.notify[0].orderStatusEvent[0].payment[0].amount[0].$.currencyCode
            xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:AuthorizationCode"] = notification.paymentService.notify[0].orderStatusEvent[0].payment[0].AuthorisationId?.[0].$.id
            xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:MerchantID"] = appSettings.xipayMerchantid
            xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:InfoItems"]["mes:InfoItem"] = [{
              "mes:Key": "TR_TRANS_REFID",
              "mes:Value": orderCode
            }]
            console.log("[Notification] XiPay XML request: " + BuildXML(xipayReq, null))
            logger.info(logMessage("[Notification] order: " + orderCode + " - XiPay XML request: " + BuildXML(xipayReq, null)))
            let xmlRes = await ctx.clients.xipayAPI.ManualAuth(BuildXML(xipayReq, null))
            console.log("[Notification] XiPay XML response: " + xmlRes)
            logger.info(logMessage("[Notification] order: " + orderCode + " - XiPay XML response: " + xmlRes))
            xipayRes = ParseXML<ManualAuthResponse>(xmlRes)

          } catch (err) {
            logger.error(logMessage("[Notification] order: " + orderCode + " - Xipay request ended with an error: " + err))
            //logger.error(err)
            console.log("[Notification] order:" + orderCode + " - Xipay request ended with an error")
            console.log(err)
          }
        }

        logger.info(logMessage("[Notification] order:" + orderCode + " - Xipay response: " + JSON.stringify(xipayRes)))

        if (xipayRes != undefined && xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].xipayvbresult[0] && xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].StatusCode[0] > 0) { //xipay ok
          let authCallback: AuthorizationCallback = {
            paymentId: existingPayment.id,
            status: vtexStatus,
            tid: existingPayment.id,
            acquirer: Acquirer,
            code: paymentStatus,
            authorizationId: notification.paymentService.notify[0].orderStatusEvent[0].payment[0].AuthorisationId?.[0].$.id
          }

          ctx.clients.paymentProvider.callback(existingPayment.transactionid, existingPayment.id, authCallback).then(
            () => {
              console.log("callback success")
              logger.info(logMessage("[Notification] order: " + orderCode + " - Callback correctly sent"))
            },
            () => {
              console.log("callback error")
              logger.error(logMessage("[Notification] order: " + orderCode + " - Callback error"))
            }
          )
          let authDate = new Date()
          let refno = xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].AuthorizationReferenceCode[0]
          if (refno == undefined || refno == null || refno.trim() == "")
            refno = xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].TransactionID[0]
          existingPayment.status = authCallback.status
          existingPayment.authorizationId = authCallback.authorizationId
          existingPayment.debitCreditIndicator = notification.paymentService.notify[0].orderStatusEvent[0].payment[0].amount[0].$.debitCreditIndicator
          existingPayment.CC_TYPE = paymentMethod
          existingPayment.CC_NUMBER = tokenid
          existingPayment.CC_VALID_T = date.month + "." + date.year
          existingPayment.CC_NAME = cardholderName
          existingPayment.CURRENCY = notification.paymentService.notify[0].orderStatusEvent[0].payment[0].amount[0].$.currencyCode
          existingPayment.AUTH_DATE = `${authDate.getDate().toString().padStart(2, "0")}.${(authDate.getMonth() + 1).toString().padStart(2, "0")}.${authDate.getFullYear()}`
          existingPayment.AUTH_TIME = authDate.toLocaleTimeString("it-CH", { timeZone: 'Europe/Rome' })
          existingPayment.AUTH_REFNO = refno
          await SavePayment(ctx, orderCode.includes("-01") ? orderCode : orderCode + orderSuffix, existingPayment).then(() => {
            logger.info(`[Notification] order: ${orderCode} - Master data updated with this information ${JSON.stringify(existingPayment)}`)
          }, (err: any) => {
            logger.error(logMessage("[Notification] order: " + orderCode + " - Error updating master data: " + JSON.stringify(err.response.data.Message)))
          })
        } else {
          let auhtCallback: AuthorizationCallback = {
            paymentId: existingPayment.id,
            status: vtexStatus,
            tid: existingPayment.id,
            acquirer: Acquirer,
            code: paymentStatus
          }
          if (vtexStatus == PaymentStatusVtex.approved) {
            console.log("xipay error")
            logger.error(logMessage("[Notification] order: " + orderCode + " - Xipay error, cancelling order"))
            auhtCallback.status = PaymentStatusVtex.denied
            let wprequest: WPCancelRequest = {
              paymentService: {
                $: {
                  version: appSettings.wpVersion,
                  merchantCode: appSettings.merchantCode
                },
                modify: {
                  orderModification: {
                    $: {
                      orderCode: existingPayment.orderid
                    },
                    cancelOrRefund: ""
                  }
                }
              }
            }

            ctx.clients.worldpayAPI.PaymentService(BuildXML(wprequest)).then(
              () => {
                logger.info(logMessage("[Notification] order: " + orderCode + " - Cancel request sent to worldpay"))
              }, () => {
                console.log("wp error")
                logger.error(logMessage("[Notification] order: " + orderCode + " - Worldpay cancel request ended with an error"))
              }
            )
          }

          ctx.clients.paymentProvider.callback(existingPayment.transactionid, existingPayment.id, auhtCallback).then(
            () => {
              console.log("callback success")
              logger.info(logMessage("[Notification] order: " + orderCode + " - Callback correctly sent"))
            },
            () => {
              console.log("callback error")
              logger.error(logMessage("[Notification] order: " + orderCode + " - Callback error"))
            }
          )
        }
      }
    }
    else {
      logger.error(logMessage("[Notification] - Error parsing notification body"))
    }
  })

  ctx.status = 200
  ctx.body = "[OK]"

  await next()
}
