import { json } from "co-body"
import { configs } from "../typings/configs";
import { RefundPaymentRequest } from "../typings/RefundPayment/refundPaymentRequest";
import { RefundPaymentResponse } from "../typings/RefundPayment/refundPaymentResponse";
import { WPRefundRequest } from "../typings/WPRefund/WPRefundRequest";
import { WPRefundResponse } from "../typings/WPRefund/WPRefundResponse";
import { defaultRefundPaymentResponse, orderSuffix, PaymentStatusVtex } from "../utils/constants";
import { BuildXML, ParseXML } from "../utils/XMLhandler";
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";
import { GetPayment, PaymentKeys, SavePayment } from "../utils/Storage";

export async function RefundPayment(ctx: Context, next: () => Promise<any>) {

  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  process.env.WP_URL = appSettings.wpUrl
  process.env.WP_USERNAME = appSettings.wpusername
  process.env.WP_PASSWORD = appSettings.wppassword

  let refundPaymentRequest: RefundPaymentRequest = await json(ctx.req);
  ctx.vtex.logger = new CustomLogger(ctx)
  let logger = ctx.vtex.logger
  logger.info(logMessage("[Refund Payment] paymentID: " + refundPaymentRequest.paymentId))
  let existingPayment: any = undefined
  try {
    existingPayment = await GetPayment(ctx, refundPaymentRequest.paymentId, 0, 0, PaymentKeys.PAYMENTID)
  } catch (err) {
    logger.info("[Refund Payment] order:" + refundPaymentRequest.paymentId + " - Payment not found in master data")
    logger.debug(err)
  }

  let refundPaymentResponse: RefundPaymentResponse = JSON.parse(JSON.stringify(defaultRefundPaymentResponse))
  refundPaymentResponse.paymentId = refundPaymentRequest.paymentId
  refundPaymentResponse.requestId = refundPaymentRequest.requestId

  if (existingPayment == undefined) {
    logger.error(logMessage("[Refund Payment] paymentID: " + refundPaymentRequest.paymentId + " - No payment found in master data"))
    ctx.status = 200;
    refundPaymentResponse.code = "refund-manually"
    refundPaymentResponse.message = "Cannot find payment with id " + refundPaymentRequest.paymentId
  }
  else {
    logger.info(logMessage("[Refund Payment] order: " + existingPayment.orderid + " - Sending Refund request to Worldpay"))
    let refundRequest: WPRefundRequest = {
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
            refund: {
              amount: {
                $: {
                  value: (refundPaymentRequest.value * 100).toFixed(0),
                  currencyCode: existingPayment.CURRENCY,
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
    await ctx.clients.worldpayAPI.PaymentService(BuildXML(refundRequest)).then(response => {
      //logger.info("[Refund Payment] paymentID:" + refundPaymentRequest.paymentId + " - Refund response: " + JSON.stringify(response))
      res = response;
    }, error => {
      //logger.error("[Refund Payment] paymentID:" + refundPaymentRequest.paymentId + " - Refund request ended with an error: " + JSON.stringify(error.response.data))
      //console.log(error.response.data)
      ctx.status = 200;
      refundPaymentResponse.message = JSON.stringify(error.response.data)
    })
    //console.log(res)
    let jsonRes = ParseXML<WPRefundResponse>(res);
    if (jsonRes == undefined) {
      console.log("Error parsing worldpay response")
      logger.error(logMessage("[Refund Payment] order: " + existingPayment.orderid + " - Error parsing worldpay response"))
      refundPaymentResponse.code = "refund-manually"
    } else {
      logger.info(logMessage("[Refund Payment] order: " + existingPayment.orderid + " - Refund request sent, updating status on master data"))
      refundPaymentResponse.refundId = refundPaymentRequest.settleId
      refundPaymentResponse.value = refundPaymentRequest.value
      refundPaymentResponse.code = "refunding"
      refundPaymentResponse.message = "refund request sent"
      existingPayment.status = PaymentStatusVtex.canceled
      SavePayment(ctx, existingPayment.orderid.includes("-01") ? existingPayment.orderid : existingPayment.orderid + orderSuffix, existingPayment, true).then(() => {
        logger.info("[Refund Payment] order:" + existingPayment.orderid + " - Master data updated")
      }, err => {
        logger.error("[Refund Payment] order:" + existingPayment.orderid + " - Error updating master data")
        logger.debug(err)
      })
      ctx.status = 200;
    }
  }

  ctx.set("Content-Type", "application/json");
  ctx.body = JSON.stringify(refundPaymentResponse)

  await next()
}
