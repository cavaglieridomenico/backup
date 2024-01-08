import { AuthorizationCallback } from "@vtex/api"
import { configs } from "../typings/configs"
import { WPNotification } from "../typings/WPNotification/WPNotification"
import { ManualAuthResponse } from "../typings/xipay/manualAuthRes"
import { Acquirer, MD_P24_ALERT, PaymentStatusVtex } from "../utils/constants"
import { GetCreatePaymentStatus } from "../utils/VtexStatusFromWorldpayStatus"
import { ParseXML } from "../utils/XMLhandler"
import { CustomLogger } from "../utils/Logger"
import { ReadNotificationBody } from "../utils/notification"
import { BuildXipayAuthRequest, GetSapData } from "../utils/xipay"
import { CancelPaymentReq } from "../utils/WpCommonRequests"
import { GetPayment, SavePayment } from "../utils/Storage"
import { sendAlert } from "../utils/Alerts"

export async function NotificationHandler(ctx: Context, settings: configs) {

  const appSettings: configs = settings
  process.env.WP_URL = appSettings.wpUrl
  process.env.WP_USERNAME = appSettings.wpusername
  process.env.WP_PASSWORD = appSettings.wppassword
  process.env.XP_URL = appSettings.xipayUrl
  let logger = new CustomLogger(ctx)

  ReadNotificationBody(ctx.req).then(async xmlBody => {
    logger.info("[Notification] Notification received:" + xmlBody)
    let notification: WPNotification | undefined = ParseXML<WPNotification>(xmlBody)

    if (notification != undefined) {
      let orderCode = notification.paymentService.notify[0].orderStatusEvent[0].$.orderCode
      let paymentStatus = notification.paymentService.notify[0].orderStatusEvent[0].payment[0].lastEvent[0]
      let payment_type = notification.paymentService.notify[0].orderStatusEvent[0].payment[0].paymentMethod[0]
      logger.info("[Notification] Payment Method: " + payment_type)
      let existingPayment: any = undefined
      try {
        existingPayment = await GetPayment(ctx, orderCode, 2500, 2)
      } catch (err) {
        logger.error("[Notification] order:" + orderCode + " - Error retrieving payment")
        logger.debug(err)
      }

      let vtexStatus = GetCreatePaymentStatus(paymentStatus)
      if (existingPayment && existingPayment.status == PaymentStatusVtex.undefined) {
        let authCallback: AuthorizationCallback = {
          paymentId: existingPayment.id,
          status: vtexStatus,
          tid: existingPayment.id,
          acquirer: Acquirer,
          code: paymentStatus
        }
        if (vtexStatus == PaymentStatusVtex.approved) {
          authCallback.authorizationId = notification.paymentService.notify[0].orderStatusEvent[0].payment[0].AuthorisationId?.[0].$.id
          if (appSettings.useXipay && payment_type != "PRZELEWY-SSL") {
            try {
              let xipayRes: ManualAuthResponse | undefined = undefined
              let xipayData = BuildXipayAuthRequest(appSettings, notification.paymentService.notify[0].orderStatusEvent[0], xmlBody)
              let xmlRes = await ctx.clients.xipayAPI.ManualAuth(xipayData.requestBody)
              logger.info("[Notification] order:" + orderCode + " - Xipay response:" + xmlRes)
              xipayRes = ParseXML<ManualAuthResponse>(xmlRes)
              xipayData.response = xipayRes

              if (xipayRes && xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].xipayvbresult[0] && xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].StatusCode[0] > 0) {
                existingPayment = {
                  ...existingPayment,
                  ...GetSapData(xipayData, notification.paymentService.notify[0].orderStatusEvent[0].payment[0].amount[0].$.currencyCode)
                }
              } else {
                logger.error("[Notification] order:" + orderCode + " - Xipay request ended with an error")
                authCallback.status = PaymentStatusVtex.denied
                authCallback.authorizationId = undefined
                CancelPaymentReq(ctx, appSettings, orderCode).then(
                  () => {
                    logger.debug("[Notification] order:" + orderCode + " - Worldpay cancel response sent")
                  }, (err) => {
                    logger.error("[Notification] order:" + orderCode + " - Worldpay cancel request ended with an error")
                    logger.debug(err)
                  }
                )
              }
            } catch (err) {
              logger.error("[Notification] order:" + orderCode + " - Xipay request ended with an error")
              logger.debug(err)
              authCallback.status = PaymentStatusVtex.denied
              authCallback.authorizationId = undefined
              CancelPaymentReq(ctx, appSettings, orderCode).then(
                () => {
                  logger.debug("[Notification] order:" + orderCode + " - Worldpay cancel response sent")
                }, (err) => {
                  logger.error("[Notification] order:" + orderCode + " - Worldpay cancel request ended with an error")
                  logger.debug(err)
                }
              )
            }
          }
        }

        else if (vtexStatus == PaymentStatusVtex.denied) {
          CancelPaymentReq(ctx, appSettings, orderCode).then(
            () => {
              logger.debug("[Notification] order:" + orderCode + " - Worldpay cancel response sent")
            }, (err) => {
              logger.error("[Notification] order:" + orderCode + " - Worldpay cancel request ended with an error")
              logger.debug(err)
            }
          )
        }

        existingPayment.status = authCallback.status
        existingPayment.authorizationId = authCallback.authorizationId
        existingPayment.debitCreditIndicator = notification.paymentService.notify[0].orderStatusEvent[0].payment[0].amount[0].$.debitCreditIndicator
        await SavePayment(ctx, orderCode, existingPayment).then(() => {
          logger.info("[Notification] order:" + orderCode + " - Master data updated")
        }, err => {
          logger.error("[Notification] order:" + orderCode + " - Error updating master data")
          logger.debug(err)
        })

        ctx.clients.paymentProvider.callback(existingPayment.transactionid, existingPayment.id, authCallback).catch(err => {
          logger.error("[Notification] order:" + orderCode + " - Vtex callback ended with an error")
          logger.debug(err)
        })
      } else if (existingPayment) {
        logger.warn("[Notification] order:" + orderCode + " - Payment status is not undefined: " + existingPayment.status)
        if (existingPayment.status == PaymentStatusVtex.canceled && paymentStatus == "AUTHORISED") {
          sendAlert(ctx,
            MD_P24_ALERT,
            `Received authorised notification for order ${orderCode} - VTEX status is canceled`,
            `Received authorised notification for order ${orderCode} - VTEX status is canceled. Please push it to SAP ASAP`
          )
        }
      }
    }
    else {
      logger.error("[Notification] - Error parsing notification body")
    }
  }, err => {
    logger.error("[Notification] - Error reading notification body")
    logger.debug(err)
  })
}
