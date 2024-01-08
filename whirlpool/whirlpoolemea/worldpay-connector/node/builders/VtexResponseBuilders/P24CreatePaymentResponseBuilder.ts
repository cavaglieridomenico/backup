import { configs } from "../../typings/configs";
import { CreatePaymentResponse } from "../../typings/CreatePayment/createPaymentResponse";
import { WPCreatePaymentResponse } from "../../typings/WPCreatePayment/WPCreatePaymentResponse";
import { AbstractCreatePaymentResponseBuilder } from "./AbstractCreatePaymentResponseBuilder";


export class P24CreatePaymentResponseBuilder extends AbstractCreatePaymentResponseBuilder {


    public build(
        wpResponse: WPCreatePaymentResponse,
        paymentStatus: string,
        _denytoken: string,
        paymentId: string, ctx: Context,
        appSettings: configs): CreatePaymentResponse {

        const createPaymentResponse: CreatePaymentResponse = super.build(wpResponse, paymentStatus, _denytoken, paymentId, ctx, appSettings);
        createPaymentResponse.paymentUrl = wpResponse.paymentService.reply[0].orderStatus[0].reference[0]._;
        createPaymentResponse.delayToCancel = appSettings.p24DelayToCancel
        return createPaymentResponse;
    }
}