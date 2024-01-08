import { AuthenticationError, AuthorizationCallback } from "@vtex/api"
import { Acquirer, PaymentStatusVtex } from "../utils/constants"
import { CustomLogger } from "../utils/Logger";
import { GetPayment, SavePayment } from "../utils/Storage";

export async function PaymentDenied(ctx: Context, next: () => Promise<any>) {

  ctx.set("Access-Control-Allow-Origin", '*')

  let logger = new CustomLogger(ctx);
  ctx.vtex.logger = logger
  let authToken = ctx.vtex.route.params.token.toString()
  let orderid = ctx.vtex.route.params.orderid.toString()
  logger.info("[Payment Denied] order:" + orderid)

  let existingPayment: any = undefined

  try {
    existingPayment = await GetPayment(ctx, orderid, 2500, 2)
  } catch (err) {
    logger.error("[Payment Denied] order:" + orderid + " - Error retrieving payment")
    logger.debug(err)
  }

  if (existingPayment) {
    if (authToken != existingPayment.denytoken) {
      logger.error("[Payment Denied] order:" + orderid + " - Invalid token")
      throw new AuthenticationError("Invalid token")
    }
    logger.info("[Payment Denied] order:" + orderid + " - Updating Master data")
    existingPayment.status = PaymentStatusVtex.denied
    await SavePayment(ctx, orderid, existingPayment).then(() => {
      logger.info("[Payment Denied] order:" + orderid + " - Master data updated")
    }, err => {
      logger.error("[Payment Denied] order:" + orderid + " - Error updating master data")
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

    await ctx.clients.paymentProvider.callback(existingPayment.transactionid, existingPayment.id, auhtCallback).catch(
      (err) => {
        logger.error("[Payment Denied] order:" + orderid + " - Callback error")
        logger.debug(err)
      }
    )
  }

  ctx.status = 200

  await next()
}
