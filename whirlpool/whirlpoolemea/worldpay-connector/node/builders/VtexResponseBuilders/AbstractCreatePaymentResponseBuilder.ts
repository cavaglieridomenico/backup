import { configs } from "../../typings/configs";
//import { CreatePaymentRequest } from "../../typings/CreatePayment/createPaymentRequest";
import { CreatePaymentResponse } from "../../typings/CreatePayment/createPaymentResponse";
import { WPCreatePaymentResponse } from "../../typings/WPCreatePayment/WPCreatePaymentResponse";
import { defaultCreatePaymentResponse } from "../../utils/constants";


export abstract class AbstractCreatePaymentResponseBuilder {

    public build( 
        _wpResponse : WPCreatePaymentResponse,
        paymentStatus : string,
        _denytoken : string,
        paymentId : string, 
        _ctx: Context, 
        _appSettings: configs ) : CreatePaymentResponse {

            let createPaymentResponse: CreatePaymentResponse = 
            JSON.parse(JSON.stringify(defaultCreatePaymentResponse));

            createPaymentResponse.status = paymentStatus
            createPaymentResponse.tid = paymentId;
            createPaymentResponse.code = "OK";
            createPaymentResponse.message = "payment created";
            return createPaymentResponse;
    }

    public createEmptyPaymentResponse(paymentStatus : string, paymentId : string) : CreatePaymentResponse {
        let createPaymentResponse: CreatePaymentResponse = 
            JSON.parse(JSON.stringify(defaultCreatePaymentResponse));

            createPaymentResponse.status = paymentStatus
            createPaymentResponse.tid = paymentId;
            createPaymentResponse.code = "OK";
            createPaymentResponse.message = "payment created";
            return createPaymentResponse;
    } 
}