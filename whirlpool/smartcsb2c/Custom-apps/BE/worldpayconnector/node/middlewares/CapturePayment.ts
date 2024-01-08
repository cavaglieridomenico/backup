import { json } from "co-body"
import { CapturePaymentRequest } from "../typings/CapturePayment/capturePaymentRequest";
import { CapturePaymentResponse } from "../typings/CapturePayment/capturePaymentResponse";
import { configs } from "../typings/configs";
import { defaultCapturePaymentResponse } from "../utils/constants";
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";
import { GetPayment, PaymentKeys } from "../utils/Storage";

export async function CapturePayment(ctx: Context, next: () => Promise<any>) {

  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  process.env.WP_URL = appSettings.wpUrl
  process.env.WP_USERNAME = appSettings.wpusername
  process.env.WP_PASSWORD = appSettings.wppassword

  let capturePaymentRequest: CapturePaymentRequest = await json(ctx.req);
  ctx.vtex.logger = new CustomLogger(ctx)
  let logger = ctx.vtex.logger
  logger.info(logMessage("[Capture Payment] paymentID: " + capturePaymentRequest.paymentId))
  let existingPayment: any = undefined
  try {
    existingPayment = await GetPayment(ctx, capturePaymentRequest.paymentId, 0, 0, PaymentKeys.PAYMENTID)
  } catch (err) {
    logger.info("[Capture Payment] order:" + capturePaymentRequest.paymentId + " - Payment not found in master data")
    logger.debug(err)
  }

  let capturePaymentResponse: CapturePaymentResponse = JSON.parse(JSON.stringify(defaultCapturePaymentResponse))
  capturePaymentResponse.paymentId = capturePaymentRequest.paymentId
  capturePaymentResponse.requestId = capturePaymentRequest.requestId
  capturePaymentResponse.settleId = existingPayment.authorizationId ? existingPayment.authorizationId : existingPayment.transactionId;
  capturePaymentResponse.value = existingPayment.value
  capturePaymentResponse.code = "captured"
  capturePaymentResponse.message = "payment captured"
  ctx.status = 200

  /*if (existingPayment == undefined || existingPayment.status == PaymentStatusVtex.canceled || existingPayment.status == PaymentStatusVtex.denied) {
    logger.error(logMessage("[Capture Payment] paymentID: " + capturePaymentRequest.paymentId + " - Payment doesn't exist or is in an invalid state"))
    capturePaymentResponse.code = "Payment not found"
    capturePaymentResponse.message = "Payment doesn't exist or is in an invalid state"
    ctx.status = 500;
  } else {
    if (existingPayment.status != PaymentStatusVtex.captured) {
      logger.info(logMessage("[Capture Payment] order: " + existingPayment.orderid + " - Sending Capture request to worldpay"))
      let inquiryReq: WPInquiryRequest = {
        paymentService: {
          $: {
            version: appSettings.wpVersion,
            merchantCode: appSettings.merchantCode
          },
          inquiry: {
            orderInquiry: {
              $: {
                orderCode: existingPayment.orderid,
              }
            }
          }
        }
      }
      console.log(inquiryReq)
      logger.info(logMessage("[Create Payment] order: " + existingPayment.orderid + " - Payment status is undefined, sending inquiry to worldpay"))
      await ctx.clients.worldpayAPI.PaymentService(BuildXML(inquiryReq)).then(
        async res => {
          let jsonRes = ParseXML<WPInquiryResponse>(res);
          console.log(res)
          if (jsonRes != undefined) {
            if (jsonRes.paymentService.reply[0].orderStatus[0].payment[0].lastEvent[0] == "CAPTURED") {
              logger.info(logMessage("[Capture Payment] order: " + existingPayment.orderid + " - Payment captured"))
              capturePaymentResponse.settleId = existingPayment.tid;
              capturePaymentResponse.value = existingPayment.value
              capturePaymentResponse.code = "captured"
              capturePaymentResponse.message = "payment captured"
              ctx.status = 200
            } else {

            }
          } else {
            logger.error(logMessage("[Create Payment] order: " + existingPayment.orderid + " - Error parsing worldpay response body"))
            logger.info(logMessage("[Capture Payment] order: " + existingPayment.orderid + " - Payment has not been captured"))
            capturePaymentResponse.code = "not_captured"
            capturePaymentResponse.message = "Payment has not been captured"
            ctx.status = 500
          }
        },
        err => {
          logger.error(logMessage("[Create Payment] order: " + existingPayment.orderid + " - Worldpay responded with an error"))
          logger.error(err)
        }
      )

    } else { //payment is already captured
      logger.info(logMessage("[Capture Payment] order: " + existingPayment.orderid + " - Payment was already captured"))
      //console.log(JSON.stringify(existingPayment))
      capturePaymentResponse.settleId = existingPayment.tid;
      capturePaymentResponse.value = existingPayment.value
      capturePaymentResponse.code = "captured"
      capturePaymentResponse.message = "payment captured"
      ctx.status = 200
    }
  }*/

  ctx.body = JSON.stringify(capturePaymentResponse);
  ctx.set("Content-Type", "application/json");

  await next()
}
