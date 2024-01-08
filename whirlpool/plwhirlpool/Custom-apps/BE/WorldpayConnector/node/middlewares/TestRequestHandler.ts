import { json } from "co-body";
import { CancelPaymentRequest } from "../typings/CancelPayment/cancelPaymentRequest";
import { CancelPaymentResponse } from "../typings/CancelPayment/cancelPaymentResponse";
import { CapturePaymentRequest } from "../typings/CapturePayment/capturePaymentRequest";
import { CapturePaymentResponse } from "../typings/CapturePayment/capturePaymentResponse";
import { CreatePaymentRequest } from "../typings/CreatePayment/createPaymentRequest";
import { CreatePaymentResponse } from "../typings/CreatePayment/createPaymentResponse";
import { RefundPaymentRequest } from "../typings/RefundPayment/refundPaymentRequest";
import { RefundPaymentResponse } from "../typings/RefundPayment/refundPaymentResponse";
import { ExecuteHTTPRequest } from "../utils/callback";
import { defaultCancelPaymentResponse, defaultCapturePaymentResponse, defaultCreatePaymentResponse, defaultRefundPaymentResponse, PaymentStatusVtex } from "../utils/constants";

export async function HandleTestRequest(ctx: Context) {
    if (ctx.path.includes("cancellations")) {
        let request: CancelPaymentRequest = await json(ctx.req)
        let response: CancelPaymentResponse = JSON.parse(JSON.stringify(defaultCancelPaymentResponse))
        response.paymentId = request.paymentId
        response.cancellationId = "testRefundId"
        response.requestId = request.requestId
        ctx.body = response
        ctx.status=200
    } else if (ctx.path.includes("refunds")) {
        let request: RefundPaymentRequest = await json(ctx.req)
        let response: RefundPaymentResponse = JSON.parse(JSON.stringify(defaultRefundPaymentResponse))
        response.paymentId = request.paymentId
        response.refundId = "testRefundID"
        response.requestId = request.requestId
        ctx.status=200
        ctx.body=response
    } else if (ctx.path.includes("settlements")) {
        let request: CapturePaymentRequest = await json(ctx.req)
        let response: CapturePaymentResponse = JSON.parse(JSON.stringify(defaultCapturePaymentResponse))
        response.paymentId = request.paymentId
        response.settleId = "testSettleID"
        response.value = request.value
        response.requestId = request.requestId
        ctx.status = 200
        ctx.body = response
    } else {
        let request: CreatePaymentRequest = await json(ctx.req)
        let response: CreatePaymentResponse = JSON.parse(JSON.stringify(defaultCreatePaymentResponse))
        response.paymentId = request.paymentId
        switch (request.card.number) {
            case "4444333322221111": {
                response.status = PaymentStatusVtex.approved
                response.tid = "testTID"
                response.authorizationId = "testAuthorizationID"
                response.nsu = "testNSU"
                break;
            }
            case "4444333322221112": {
                response.status = PaymentStatusVtex.denied
                response.tid = "testTID"
                break;
            }
            case "4222222222222224": {
                response.status = PaymentStatusVtex.undefined
                response.tid = "testTID"
                setTimeout(() => {
                    response.status = PaymentStatusVtex.approved
                    response.authorizationId = "testAuthorizationID"
                    response.nsu = "testNSU"
                    ExecuteHTTPRequest(request.callbackUrl, response)
                }, 5000);
                break;
            }
            case "4222222222222225": {
                response.status = PaymentStatusVtex.undefined
                response.tid = "testTID"
                setTimeout(() => {
                    response.status = PaymentStatusVtex.denied
                    ExecuteHTTPRequest(request.callbackUrl, response)
                }, 5000);
                break;
            }
            default: {
                response.status = PaymentStatusVtex.undefined
                response.tid = "testTID"
                response.paymentUrl = "http://example.com"
                setTimeout(() => {
                    response.status = PaymentStatusVtex.approved
                    response.authorizationId = "testAuthorizationID"
                    response.nsu = "testNSU"
                    ExecuteHTTPRequest(request.callbackUrl, response)
                }, 5000);
            }
        }
        ctx.status = 200
        ctx.body = response
    }
}
