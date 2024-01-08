import { ParamsContext, ServiceContext, APP } from "@vtex/api"
import { PaymentProviderState } from "@vtex/payment-provider"
import { Clients } from "../clients"
import AlmaConnector, { getPersistedCustomOrderInfo } from "../connector"
import { getPersistedAuthorizationResponse } from "../connector"
import { PersistedAuthorizationRes, PersistedCustomOrderInfoRes } from "../typings/Alma"
import { CustomLogger } from "../utils/Logger";
import { getKey } from "../utils/functions"

export async function getPayment(ctx: ServiceContext<Clients, PaymentProviderState, ParamsContext>, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    let alma = new AlmaConnector(ctx)
    const paymentId: string = ctx.query.pid.toString()
    const [setting, customOrderInfo] = await Promise.all([ctx.clients.apps.getAppSettings(APP.ID), getPersistedCustomOrderInfo(ctx.clients.vbase, paymentId)])
    ctx.clients.AlmaClient.production = setting?.production || false
    const almaPayment = await ctx.clients.AlmaClient.retrievePayment(paymentId, await getKey(ctx, (customOrderInfo as PersistedCustomOrderInfoRes).orderId, ctx.vtex.logger as CustomLogger, setting))
    ctx.vtex.logger.info(`[GET PAYMENT] Payment ${paymentId} saved in Alma: ${JSON.stringify(almaPayment)}`)
    const persistedPayment = await getPersistedAuthorizationResponse(ctx.clients.vbase, {
      paymentId: almaPayment.custom_data.payment_id
    })
    await alma.checkPaymentState(almaPayment, persistedPayment as PersistedAuthorizationRes)
    if (ctx.vtex.route.params.url?.toString() == "ipn") {     //nel caso della retry
      ctx.vtex.logger.info(`[GET PAYMENT] Authorized notification received for payment ${paymentId}: ${JSON.stringify(persistedPayment)}`)
      ctx.status = 200;
      ctx.body = "ok"
    } else if (ctx.vtex.route.params.url?.toString() == "cancel") {
      ctx.vtex.logger.info(`[GET PAYMENT] Cancel notification received for payment ${paymentId}: ${JSON.stringify(persistedPayment)}`)
      ctx.redirect(ctx.query.returnUrl.toString() + "&status=denied&message=User-cancelled")  //nel caso della cancel-payment
    }

    await next()
  } catch (e) {
    ctx.body = 'Internal Server Error';
    ctx.vtex.logger.error("getPayment() -- alma-connector")
    ctx.vtex.logger.error(e)
    ctx.body = "Internal Server Error"
    ctx.status = 500;
    throw new Error(e)
  }
}

/*

- ipn_callback_url : Url called in an asynchronous way by our servers once the payment is done.
It enables to validate the order even if the customer closes his/her browser
 prematurely or meet a network problem during the redirection towards the return_url.

 */

