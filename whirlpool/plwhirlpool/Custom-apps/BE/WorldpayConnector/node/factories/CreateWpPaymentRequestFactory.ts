import { AbstractWpRequestBuilder } from "../builders/WorldPayRequestBuilders/AbstractWpRequestBuilder";
import { CCWpRequestBuilder } from "../builders/WorldPayRequestBuilders/CCWpRequestBuilder";
import { P24WpRequestBuilder } from "../builders/WorldPayRequestBuilders/P24WpRequestBuilder";


export class CreateWpPaymentRequestFactory {
    public createWorldPayRequestBuilder(paymentMethod : string) : AbstractWpRequestBuilder {
        switch(paymentMethod) {
            case "banktransfer" : 
                return new P24WpRequestBuilder();
            case "creditcards" :
                return new CCWpRequestBuilder();
            default: 
                return new CCWpRequestBuilder();
        }
    }
}