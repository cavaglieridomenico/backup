import { configs } from "../../typings/configs";
import { CreatePaymentRequest } from "../../typings/CreatePayment/createPaymentRequest";
import { Order } from "../../typings/Order";
import { WPCreatePaymentRequest} from "../../typings/WPCreatePayment/WPCreatePaymentRequest";
import { CountryCodeMapping } from "../../utils/constants";
import { AbstractWpRequestBuilder } from "./AbstractWpRequestBuilder";


/**
 * This class extends the AbstractWpRequestBuilder adding 
 * customer billing information, accepted payment mask and
 * payment tokenization flags
 */
 export class CCWpRequestBuilder extends AbstractWpRequestBuilder {
    async buildRequest(createPaymentRequest: CreatePaymentRequest, ctx: Context, appSettings: configs): Promise<WPCreatePaymentRequest> {
        let wpCreatePaymentRequest:WPCreatePaymentRequest = await super.buildRequest(createPaymentRequest, ctx, appSettings)
        
        wpCreatePaymentRequest.paymentService.submit.order.paymentMethodMask = [
            {
              include:
              {
                $: {
                  code: "all"
                }
              }
            }
        ]
        this.buildBillingInformation(createPaymentRequest, ctx);
        return wpCreatePaymentRequest;
    }

    createPaymentToken(_createPaymentRequest: CreatePaymentRequest): boolean {
        return true;
    }

    async buildBillingInformation(createPaymentRequest: CreatePaymentRequest, ctx: Context){

        let order: Order = await super.getOrder(createPaymentRequest.orderId, ctx);
        let wpRequest : WPCreatePaymentRequest = super.getWorldPayRequest();

        if (order.invoiceData != undefined) {
            let orderContryName = order.invoiceData?.address.country.trim().toLowerCase();
            let countrycode = CountryCodeMapping.find(country => country.name == orderContryName)?.code;
            
            wpRequest.paymentService.submit.order.billingAddress = {
                address: {
                    address1: order.invoiceData.address.street,
                    address2: order.invoiceData.address.number,
                    postalCode: order.invoiceData.address.postalCode,
                    city: order.invoiceData.address.city,
                    state: order.invoiceData.address.state,
                    countryCode: countrycode ? countrycode : "PL"
                }
            }
        }
    }    
}