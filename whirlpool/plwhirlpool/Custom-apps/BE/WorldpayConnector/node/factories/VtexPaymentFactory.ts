import { AbstractCreatePaymentResponseBuilder } from "../builders/VtexResponseBuilders/AbstractCreatePaymentResponseBuilder";
import { CreditCardResponseBuilder } from "../builders/VtexResponseBuilders/CreditCardResponseBuilder";
import { P24CreatePaymentResponseBuilder } from "../builders/VtexResponseBuilders/P24CreatePaymentResponseBuilder";
// import { CCWpRequestBuilder } from "../builders/WorldPayRequestBuilders/CCWpRequestBuilder";
// import { P24WpRequestBuilder } from "../builders/WorldPayRequestBuilders/P24WpRequestBuilder";


export class VtexPaymentFactory {

    public createPaymentResponseBuilder(paymentMethod : string) : AbstractCreatePaymentResponseBuilder   {
        switch(paymentMethod) {
            case "banktransfer" : 
                return new P24CreatePaymentResponseBuilder();
            case "creditcards" :
                return new CreditCardResponseBuilder();
            default: 
                return new CreditCardResponseBuilder();
        }
    }

}