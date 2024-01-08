import { json } from "co-body"
import { CancelPaymentRequest } from "../typings/CancelPayment/cancelPaymentRequest";
import { CancelPaymentResponse } from "../typings/CancelPayment/cancelPaymentResponse";
import { configs } from "../typings/configs";
import { defaultCancelPaymentResponse, PaymentStatusVtex } from "../utils/constants";
import { CustomLogger } from "../utils/Logger";
import { GetPayment, PaymentKeys, SavePayment } from "../utils/Storage";
import { CancelPaymentReq } from "../utils/WpCommonRequests";

export async function CancelPayment(ctx: Context, next: () => Promise<any>) {

  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  process.env.WP_URL = appSettings.wpUrl
  process.env.WP_USERNAME = appSettings.wpusername
  process.env.WP_PASSWORD = appSettings.wppassword

  let logger = new CustomLogger(ctx)
  ctx.vtex.logger = logger
  let cancelPaymentRequest: CancelPaymentRequest = await json(ctx.req);
  logger.info("[Cancel Payment] paymentID:" + cancelPaymentRequest.paymentId)
  let existingPayment: any
  try {
    existingPayment = await GetPayment(ctx, cancelPaymentRequest.paymentId, 0, 0, PaymentKeys.PAYMENTID)
  } catch (err) {
    logger.info("[Cancel Payment] order:" + cancelPaymentRequest.paymentId + " - Payment not found in master data")
    logger.debug(err)
  }

  let cancelPaymentResponse: CancelPaymentResponse = JSON.parse(JSON.stringify(defaultCancelPaymentResponse))
  cancelPaymentResponse.paymentId = cancelPaymentRequest.paymentId
  cancelPaymentResponse.requestId = cancelPaymentRequest.requestId

  if (existingPayment == undefined) {
    logger.error("[Cancel Payment] paymentID:" + cancelPaymentRequest.paymentId + " - No payment found in master data")
    ctx.status = 200;
    cancelPaymentResponse.code = "cancel-manually"
    cancelPaymentResponse.message = "Cannot find payment with id " + cancelPaymentRequest.paymentId
  } else {
    if (existingPayment.status != PaymentStatusVtex.canceled) {
      logger.info("[Cancel Payment] order:" + existingPayment.orderid + " - Sending cancel request to worldpay")
      let jsonRes = await CancelPaymentReq(ctx, appSettings, existingPayment.orderid).catch(err => {
        logger.error("[Cancel Payment] order:" + existingPayment.orderid + " - Worldpay cancel request ended with an error")
        logger.debug(err)
        ctx.status = 200;
        cancelPaymentResponse.code = "cancel-manually"
        cancelPaymentResponse.message = "Unexpected error"
        return undefined
      })

      if (jsonRes) {
        cancelPaymentResponse.cancellationId = cancelPaymentRequest.paymentId
        cancelPaymentResponse.code = "OK"
        cancelPaymentResponse.message = "Cancel Payment request sent"
        logger.info("[Cancel Payment] order:" + existingPayment.orderid + " - Cancel payment request sent")
        existingPayment.status = PaymentStatusVtex.canceled
        SavePayment(ctx, existingPayment.orderid, existingPayment, true).then(() => {
          logger.info("[Cancel Payment] order:" + existingPayment.orderid + " - Master data updated")
        }, err => {
          logger.error("[Cancel Payment] order:" + existingPayment.orderid + " - Error updating master data")
          logger.debug(err)
        })
      }
    } else {
      logger.info("[Cancel Payment] order:" + existingPayment.orderid + " - Payment was already canceled")
      cancelPaymentResponse.cancellationId = cancelPaymentResponse.paymentId
      cancelPaymentResponse.code = "canceled"
      cancelPaymentResponse.message = "payment canceled"
      ctx.status = 200;
    }
  }

  ctx.set("Content-Type", "application/json");
  ctx.body = JSON.stringify(cancelPaymentResponse)
  await next()
}
