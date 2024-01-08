import { AuthenticationError, AuthorizationCallback } from "@vtex/api"
import { Acquirer, orderSuffix, PaymentStatusVtex } from "../utils/constants"
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";
import { GetPayment, SavePayment } from "../utils/Storage";

export async function PaymentDenied(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let logger = ctx.vtex.logger;
  let authToken = ctx.vtex.route.params.token.toString()
  console.log(authToken)
  let orderid = ctx.vtex.route.params.orderid.toString()
  logger.info(logMessage("[Payment Denied] order: " + orderid))

  /*let paymentid = ctx.vtex.route.params.paymentId.toString()
  logger.info(new Date().toLocaleString('en-GB', { timeZone: 'Europe/Rome' }) + " - [Payment Denied] paymentID:" + paymentid)

  logger.info(new Date().toLocaleString('en-GB', { timeZone: 'Europe/Rome' }) + " - [Payment Denied] paymentID:" + paymentid + " - Processing request")*/

  let existingPayment: any = undefined

  try {
    existingPayment = await GetPayment(ctx, orderid.includes("-01") ? orderid : orderid + orderSuffix, 2500, 2)
  } catch (err) {
    logger.error("[Payment Denied] order:" + orderid + " - Error retrieving payment")
    logger.debug(err)
  }

  if (existingPayment == undefined) {
    logger.error(logMessage("[Payment Denied] order: " + orderid + " - No payments found with this ID"))
  } else {
    if (authToken != existingPayment.denytoken) {
      logger.error(logMessage("[Payment Denied] order: " + orderid + " - Invalid token"))
      throw new AuthenticationError("Invalid token")
    }
    logger.info(logMessage("[Payment Denied] order: " + orderid + " - Updating Master data"))

    existingPayment.status = PaymentStatusVtex.denied
    await SavePayment(ctx, orderid.includes("-01") ? orderid : orderid + orderSuffix, existingPayment).then(() => {
      logger.info("[Payment Denied] order:" + existingPayment.orderid + " - Master data updated")
    }, err => {
      logger.error("[Payment Denied] order:" + existingPayment.orderid + " - Error updating master data")
      logger.debug(err)
    })

    let auhtCallback: AuthorizationCallback = {
      paymentId: existingPayment.id,
      status: PaymentStatusVtex.denied,
      tid: existingPayment.id,
      acquirer: Acquirer,
      code: "cancelled",
      message: "Payment cancelled by shopper"
    }

    await ctx.clients.paymentProvider.callback(existingPayment.transactionid, existingPayment.id, auhtCallback).then(
      () => {
        console.log("callback success")
        logger.info(logMessage("[Payment Denied] order: " + existingPayment.orderid + " - Callback correctly sent"))
      },
      () => {
        console.log("callback error")
        logger.error(logMessage("[Payment Denied] order:" + existingPayment.orderid + " - Callback error"))
      }
    )
  }

  ctx.status = 200

  await next()
}
