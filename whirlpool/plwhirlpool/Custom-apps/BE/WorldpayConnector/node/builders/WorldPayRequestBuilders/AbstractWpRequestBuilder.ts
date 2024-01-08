import { configs } from "../../typings/configs";
import { CreatePaymentRequest } from "../../typings/CreatePayment/createPaymentRequest";
import { Order } from "../../typings/Order";
import { WPCreateP24PaymentRequest, WPCreatePaymentRequest } from "../../typings/WPCreatePayment/WPCreatePaymentRequest";
import { defaultWPpaymentRequest, p24tWPpaymentRequest, orderSuffix } from "../../utils/constants";

/**
 * This class is intended to be the basic block of the worldPay integration.
 * It creates the base request to send to WorldPay, which needs to be enriched with
 * fields specific for each integration (CreditCards / Paypal / Przelewy24, ...)
 */
export abstract class AbstractWpRequestBuilder {

  protected wpRequest!: WPCreatePaymentRequest | WPCreateP24PaymentRequest;
  protected order!: Order;


  async buildRequest(createPaymentRequest: CreatePaymentRequest, _ctx: Context, appSettings: configs): Promise<WPCreatePaymentRequest | WPCreateP24PaymentRequest> {

    // creating the requests from a template
    this.wpRequest = JSON.parse(JSON.stringify(defaultWPpaymentRequest || p24tWPpaymentRequest))
    // adding header values
    this.buildWpRequestHeader(createPaymentRequest, appSettings)
    //adding order content description
    this.buildOrderContent(createPaymentRequest);

    if (this.createPaymentToken(createPaymentRequest)) {
      this.wpRequest.paymentService.submit.order.createToken = {
        $: {
          tokenScope: "merchant",
        },
        tokenEventReference: createPaymentRequest.paymentId,
        tokenReason: "xipay integration"
      }
    }

    return this.wpRequest
  }


  buildWpRequestHeader(createPaymentRequest: CreatePaymentRequest, appSettings: configs) {
    this.wpRequest.paymentService.submit.order.$.orderCode = createPaymentRequest.orderId + orderSuffix
    this.wpRequest.paymentService.submit.order.$.installationId = appSettings.installationID
    this.wpRequest.paymentService.$.merchantCode = appSettings.merchantCode
    this.wpRequest.paymentService.$.version = appSettings.wpVersion
    this.wpRequest.paymentService.submit.order.amount.$.currencyCode = createPaymentRequest.currency
    this.wpRequest.paymentService.submit.order.amount.$.value = (createPaymentRequest.value * 100).toFixed(0);
    this.wpRequest.paymentService.submit.order.shopper.shopperEmailAddress = createPaymentRequest.miniCart.buyer.email
  }

  buildOrderContent(createPaymentRequest: CreatePaymentRequest) {
    let orderContent = "<ul>"
    createPaymentRequest.miniCart.items.forEach(item => {
      orderContent +=
        `<li>
            <h2>${item.name} </2>
            <p>Quantity: ${item.quantity}</p>
            <p>Price:${item.price}</p>
            ${typeof item.discount == 'undefined' || item.discount == 0 ?
          '</li>' :
          `<p>Discount:${item.discount}</p></li>`}`
    })
    orderContent += "</ul>"
    this.wpRequest.paymentService.submit.order.orderContent = `"<![CDATA[${orderContent}]]>"`
  }


  public async getOrder(orderId: string, ctx: Context): Promise<Order> {
    if (this.order == null) {
      this.order = await ctx.clients.vtexAPI.GetOrder(orderId + orderSuffix);
    }
    return this.order;
  }

  public getWorldPayRequest(): WPCreatePaymentRequest {
    return this.wpRequest;
  }

  abstract createPaymentToken(createPaymentRequest: CreatePaymentRequest): boolean;

}
