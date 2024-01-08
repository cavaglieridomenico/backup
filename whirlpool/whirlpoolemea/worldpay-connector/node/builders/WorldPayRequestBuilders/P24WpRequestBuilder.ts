import { configs } from "../../typings/configs";
import { CreatePaymentRequest } from "../../typings/CreatePayment/createPaymentRequest";
import { Order } from "../../typings/Order";
import { WPCreatePaymentRequest } from "../../typings/WPCreatePayment/WPCreatePaymentRequest";
//import { CountryCodeMapping } from "../../utils/constants";
import { AbstractWpRequestBuilder } from "./AbstractWpRequestBuilder";


/**
 * This class extends the AbstractWpRequestBuilder adding
 * the PRZELEWY-SSL payment method information
 */
 export class P24WpRequestBuilder extends AbstractWpRequestBuilder {
     async buildRequest(createPaymentRequest: CreatePaymentRequest, ctx: Context, appSettings: configs): Promise<WPCreatePaymentRequest> {

      let order: Order = await super.getOrder(createPaymentRequest.orderId, ctx);
      let wpCreatePaymentRequest:WPCreatePaymentRequest = await super.buildRequest(createPaymentRequest, ctx, appSettings)

        let CountryCodeMapping = ctx.state.appSettings.countryCodeMapping
        let orderContryName = order.invoiceData?.address.country.trim().toLowerCase();
        let countrycode = CountryCodeMapping.find(country => country.name == orderContryName)?.code;

        wpCreatePaymentRequest.paymentService.submit.order.paymentDetails = [
            {
                'PRZELEWY-SSL' : {
                    $: {
                    shopperCountryCode: countrycode
                    },
                    successURL: createPaymentRequest.returnUrl,
                    cancelURL:  createPaymentRequest.returnUrl +  "&status=denied&message=User-cancelled" ,
                    pendingURL: createPaymentRequest.returnUrl
                }
            }
        ]
        this.buildBillingInformation(createPaymentRequest, ctx);
        return wpCreatePaymentRequest;
    }

    createPaymentToken(_createPaymentRequest: CreatePaymentRequest): boolean {
        return false;
    }

    async buildBillingInformation(createPaymentRequest: CreatePaymentRequest, ctx: Context) {

        let order: Order = await super.getOrder(createPaymentRequest.orderId, ctx);
        let wpRequest : WPCreatePaymentRequest = super.getWorldPayRequest();
        if (order.invoiceData != undefined) {
            let orderContryName = order.invoiceData?.address.country.trim().toLowerCase();
            let CountryCodeMapping = ctx.state.appSettings.countryCodeMapping

            let countrycode = CountryCodeMapping.find(country => country.name == orderContryName)?.code;

            wpRequest.paymentService.submit.order.billingAddress = {
                address: {
                    address1: order.invoiceData.address.street,
                    address2: order.invoiceData.address.number,
                    postalCode: order.invoiceData.address.postalCode,
                    city: order.invoiceData.address.city,
                    state: order.invoiceData.address.state,
                    countryCode: countrycode
                }
            }
        }
    }
}
