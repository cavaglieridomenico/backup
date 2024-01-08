import { json } from "co-body"
import { CapturePaymentRequest } from "../typings/CapturePayment/capturePaymentRequest";
import { CapturePaymentResponse } from "../typings/CapturePayment/capturePaymentResponse";
import { configs } from "../typings/configs";
import { WPCaptureRequest } from "../typings/WPCapture/WPCaptureRequest";
import { WPCaptureResponse } from "../typings/WPCapture/WPCaptureResponse";
import { defaultCapturePaymentResponse, PaymentStatusVtex } from "../utils/constants";
import { CustomLogger } from "../utils/Logger";
import { GetPayment, PaymentKeys, SavePayment } from "../utils/Storage";
import { BuildXML, ParseXML } from "../utils/XMLhandler";

export async function CapturePayment(ctx: Context, next: () => Promise<any>) {

  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  process.env.WP_URL = appSettings.wpUrl
  process.env.WP_USERNAME = appSettings.wpusername
  process.env.WP_PASSWORD = appSettings.wppassword

  let capturePaymentRequest: CapturePaymentRequest = await json(ctx.req);
  let logger = new CustomLogger(ctx)
  ctx.vtex.logger = logger
  logger.info("[Capture Payment] paymentID:" + capturePaymentRequest.paymentId)
  let existingPayment: any
  try {
    existingPayment = await GetPayment(ctx, capturePaymentRequest.paymentId, 0, 0, PaymentKeys.PAYMENTID)
  } catch (err) {
    logger.info("[Refund Payment] order:" + capturePaymentRequest.paymentId + " - Payment not found in master data")
    logger.debug(err)
  }

  let capturePaymentResponse: CapturePaymentResponse = JSON.parse(JSON.stringify(defaultCapturePaymentResponse))
  capturePaymentResponse.paymentId = capturePaymentRequest.paymentId
  capturePaymentResponse.requestId = capturePaymentRequest.requestId

  if (existingPayment == undefined || existingPayment.status == PaymentStatusVtex.canceled || existingPayment.status == PaymentStatusVtex.denied) {
    logger.error("[Capture Payment] paymentID:" + capturePaymentRequest.paymentId + " - Payment doesn't exist or is in an invalid state")
    capturePaymentResponse.code = "Payment not found"
    capturePaymentResponse.message = "Payment doesn't exist or is in an invalid state"
    ctx.status = 500;
  } else {
    if (existingPayment.status != PaymentStatusVtex.captured) {
      if (appSettings.useXipay) {
        capturePaymentResponse.settleId = existingPayment.authorizationId ? existingPayment.authorizationId : existingPayment.transactionid;
        capturePaymentResponse.value = existingPayment.value
        capturePaymentResponse.code = "captured"
        capturePaymentResponse.message = "payment captured"
        ctx.status = 200
      } else {
        logger.info("[Capture Payment] order:" + existingPayment.orderid + " - Sending Capture request to worldpay")
        let captureRequest: WPCaptureRequest = {
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
                capture: {
                  $: {
                    sequenceNumber: 1,
                    totalCount: 1
                  },
                  amount: {
                    $: {
                      value: (capturePaymentRequest.value * 100).toFixed(0),
                      currencyCode: "EUR",
                      exponent: 2,
                      debitCreditIndicator: existingPayment.debitCreditIndicator
                    }
                  }
                }
              }
            }
          }
        }
        let res = ""
        await ctx.clients.worldpayAPI.PaymentService(BuildXML(captureRequest)).then(response => {
          logger.info("[Capture Payment] order:" + existingPayment.orderid + " - Capture response: " + response)
          res = response
        }, error => {
          logger.error("[Capture Payment] order:" + existingPayment.orderid + " - Capture request ended with an error")
          logger.debug(error)
          capturePaymentResponse.code = "unexpected error"
          capturePaymentResponse.message = "Error capturing payment"
          ctx.status = 500;
        })
        let jsonRes = ParseXML<WPCaptureResponse>(res)
        if (jsonRes && jsonRes.paymentService?.reply != undefined && jsonRes.paymentService?.reply[0].ok != undefined) {
          capturePaymentResponse.settleId = capturePaymentRequest.paymentId;
          capturePaymentResponse.value = capturePaymentRequest.value
          capturePaymentResponse.code = "OK"
          ctx.status = 200;
          logger.info("[Capture Payment] order:" + existingPayment.orderid + " - Payment captured, updating status on master data")
          existingPayment.status = PaymentStatusVtex.captured
          SavePayment(ctx, existingPayment.orderid, existingPayment, true).then(() => {
            logger.info("[Capture Payment] order:" + existingPayment.orderid + " - Master data updated")
          }, err => {
            logger.error("[Capture Payment] order:" + existingPayment.orderid + " - Error updating master data")
            logger.debug(err)
          })
        } else {
          capturePaymentResponse.settleId = existingPayment.authorizationId ? existingPayment.authorizationId : existingPayment.transactionid;
          capturePaymentResponse.value = existingPayment.value
          capturePaymentResponse.code = "captured"
          capturePaymentResponse.message = "payment captured"
          ctx.status = 200
        }
      }

    } else { //payment is already captured
      logger.info("[Capture Payment] order:" + existingPayment.orderid + " - Payment was already captured")
      capturePaymentResponse.settleId = existingPayment.tid;
      capturePaymentResponse.value = existingPayment.value
      capturePaymentResponse.code = "captured"
      capturePaymentResponse.message = "payment captured"
      ctx.status = 200
    }
  }

  ctx.body = JSON.stringify(capturePaymentResponse);
  ctx.set("Content-Type", "application/json");

  await next()
}
