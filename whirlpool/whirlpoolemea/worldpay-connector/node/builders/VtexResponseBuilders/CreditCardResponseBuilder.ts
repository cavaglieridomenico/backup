import { configs } from "../../typings/configs";
//import { CreatePaymentRequest } from "../../typings/CreatePayment/createPaymentRequest";
import { CreatePaymentResponse } from "../../typings/CreatePayment/createPaymentResponse";
import { WPCreatePaymentResponse } from "../../typings/WPCreatePayment/WPCreatePaymentResponse";
//import { CreateToken } from "../../utils/AuthenticationUtils";
import { DeniedPaymentNotificationURL, HelperPageURL } from "../../utils/constants";
import { AbstractCreatePaymentResponseBuilder } from "./AbstractCreatePaymentResponseBuilder";


export class  CreditCardResponseBuilder extends AbstractCreatePaymentResponseBuilder {

    
    public build( 
        wpResponse : WPCreatePaymentResponse, 
        paymentStatus : string,
        denytoken : string,
        paymentId : string, ctx: Context, appSettings: configs ) : CreatePaymentResponse {
        
        const createPaymentResponse = super.build(wpResponse, paymentStatus, denytoken, paymentId, ctx, appSettings);
        
        let orderCode = wpResponse.paymentService.reply[0].orderStatus[0].$.orderCode
        
        createPaymentResponse.paymentAppData = {
        appName: appSettings.paymentAppName,
        payload: JSON.stringify({
          paymentUrl: wpResponse.paymentService.reply[0].orderStatus[0].reference[0]._,
          deniedUrl: DeniedPaymentNotificationURL.replace("{host}", ctx.host) + orderCode + "/" + denytoken,
          helperPageUrl: HelperPageURL.replace("{host}", ctx.host),
          locale: appSettings.locale
        })
      }
    
      return createPaymentResponse;
    }
}