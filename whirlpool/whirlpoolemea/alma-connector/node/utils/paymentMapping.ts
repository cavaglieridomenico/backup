import { AuthorizationRequest } from "@vtex/payment-provider";
import { PaymentObj, OrderObj, PaymentRequest } from "../typings/Alma";

export const createPaymentObject = (ctx: Context, authorization: AuthorizationRequest) => {
    const paymentObj: PaymentObj = {
        purchase_amount: Math.round(authorization.value * 100),
        installments_count: null,
        ipn_callback_url: `https://${ctx.host}/v1/alma-connector/callback/ipn`,
        return_url: authorization.returnUrl,
        custom_data: {
            payment_id: authorization.paymentId
        },
        customer_cancel_url: `https://${ctx.host}/v1/alma-connector/callback/cancel?returnUrl=${authorization.returnUrl}`
    }

    const orderObj: OrderObj = {
        merchant_reference: authorization.orderId,
        merchant_url: authorization.url
    }


    const paymentRequest: PaymentRequest = {
        payment: paymentObj,
        order: orderObj
    }
    return paymentRequest
}


