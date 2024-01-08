import { json } from "co-body"
import { CancelPaymentRequest } from "../typings/CancelPayment/cancelPaymentRequest";
import { CancelPaymentResponse } from "../typings/CancelPayment/cancelPaymentResponse";
import { configs } from "../typings/configs";
import { WPCancelRequest } from "../typings/WPCancel/WPCancelRequest";
import { WPCancelResponse } from "../typings/WPCancel/WPCancelResponse";
import { defaultCancelPaymentResponse, orderSuffix, PaymentStatusVtex } from "../utils/constants";
import { BuildXML, ParseXML } from "../utils/XMLhandler";
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";
import { GetPayment, PaymentKeys, SavePayment } from "../utils/Storage";

export async function CancelPayment(ctx: Context, next: () => Promise<any>) {

  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  process.env.WP_URL = appSettings.wpUrl
  process.env.WP_USERNAME = appSettings.wpusername
  process.env.WP_PASSWORD = appSettings.wppassword

  ctx.vtex.logger = new CustomLogger(ctx)
  let logger = ctx.vtex.logger
  let cancelPaymentRequest: CancelPaymentRequest = await json(ctx.req);
  logger.info(logMessage("[Cancel Payment] paymentID: " + cancelPaymentRequest.paymentId))
  let existingPayment: any = undefined
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
    logger.error(logMessage(" - [Cancel Payment] paymentID: " + cancelPaymentRequest.paymentId + " - No payment found in master data"))
    ctx.status = 200;
    cancelPaymentResponse.code = "cancel-manually"
    cancelPaymentResponse.message = "Cannot find payment with id " + cancelPaymentRequest.paymentId
  } else {

    if (existingPayment.status != PaymentStatusVtex.canceled) {
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
      logger.info(logMessage("[Cancel Payment] order: " + existingPayment.orderid + " - Sending cancel request to worldpay: " + BuildXML(wprequest)))
      let response: string = ""
      await ctx.clients.worldpayAPI.PaymentService(BuildXML(wprequest)).then(
        res => {
          response = res
        }, err => {
          console.log("wp error")
          logger.error(logMessage("[Cancel Payment] order: " + existingPayment.orderid + " - Worldpay cancel request ended with an error: " + JSON.stringify(err.response.data)))
        }
      )
      let jsonRes = ParseXML<WPCancelResponse>(response)
      logger.info(logMessage("[Cancel Payment] order: " + existingPayment.orderid + " - Worldpay cancel response: " + jsonRes))
      if (jsonRes == undefined) {
        console.log("wp error")
        logger.error(logMessage("[Cancel Payment] order: " + existingPayment.orderid + " - Error parsing worldpay response"))
        ctx.status = 200;
        cancelPaymentResponse.code = "cancel-manually"
        cancelPaymentResponse.message = "Unexpected error"
      } else {
        cancelPaymentResponse.cancellationId = cancelPaymentRequest.paymentId
        cancelPaymentResponse.code = "OK"
        cancelPaymentResponse.message = "Cancel Payment request sent"
        logger.info(logMessage("[Cancel Payment] order: " + existingPayment.orderid + " - Cancel payment request sent"))
        existingPayment.status = PaymentStatusVtex.canceled
        SavePayment(ctx, existingPayment.orderid.includes("-01") ? existingPayment.orderid : existingPayment.orderid + orderSuffix, existingPayment, true).then(() => {
          logger.info("[Cancel Payment] order:" + existingPayment.orderid + " - Master data updated")
        }, (err: any) => {
          logger.error("[Cancel Payment] order:" + existingPayment.orderid + " - Error updating master data")
          logger.debug(err)
        })
      }
    } else {
      logger.info(logMessage("[Cancel Payment] order: " + existingPayment.orderid + " - Payment was already canceled"))
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
