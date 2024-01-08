import { JanusClient, InstanceOptions, IOContext, IOResponse, Logger } from '@vtex/api'

export default class PaymentClient extends JanusClient {

    configs?: {
        account: string,
        appkey: string,
        apptoken: string
    }

    constructor(context: IOContext, options?: InstanceOptions) {

        super(context, {
            ...options,
            headers: {
              ...(options && options.headers),
              VtexIdclientAutCookie: context.storeUserAuthToken ? context.storeUserAuthToken : context.authToken,
              'Proxy-Authorization': context.authToken
            }
        })

        console.log("Creating new PaymentClient - storeUserAuthToken: ", context.storeUserAuthToken);
        console.log("Creating new PaymentClient - authToken: ", context.authToken);
        console.log("Creating new PaymentClient - vtex_session: ", context.sessionToken);

    }

    public async placeOrderFromExistingCart(params: any, logger: Logger): Promise<IOResponse<any>> {

        let orderFormId = params.query.referenceId

        let headers = {

            'Content-Type': "application/json",
            'Accept': "application/json",

        }

        let placeOrderFromExistingCartUrl = `/api/checkout/pub/orderForm/${orderFormId}/transaction`

        // Made POST
        return this.http.postRaw(placeOrderFromExistingCartUrl, params.query, {
            headers
        }).catch(err => {
            logger.error({...err.response.data, method: "placeOrderFromExistingCart"});
            console.log("mutationCreatePaymentFromExistingCart - placeOrderFromExistingCart - err: ", err);
            return {status:500, data: "", headers: {}}
        })

    }

    public calculatePaymentsFromPlaceOrder(placeOrderResponse: any){

        // get the payment currency code
        let currency = placeOrderResponse?.storePreferencesData?.currencyCode || "GBP"

        const {
            merchantTransactions,
            paymentData: { payments: transactionPayments }
        } = placeOrderResponse.data

        let allPayments

        if (merchantTransactions?.length > 0) {

            /* This calculates the payments needed per payment flag */
            allPayments = transactionPayments.reduce(

                (_payments: any, transactionPayment: any) => {

                    const merchantPayments = transactionPayment.merchantSellerPayments
                        .map((merchantPayment: any) => {

                            const merchantTransaction = merchantTransactions.find(
                                (merchant: any) => merchant.id === merchantPayment.id
                            )

                            if (!merchantTransaction) {
                                return null
                            }

                            const { merchantSellerPayments, ...payment } = transactionPayment

                            return {

                                ...payment,
                                ...merchantPayment,
                                currencyCode: currency as string,
                                installmentsValue: merchantPayment.installmentValue,
                                installmentsInterestRate: merchantPayment.interestRate,
                                transaction: {
                                id: merchantTransaction.transactionId,
                                merchantName: merchantTransaction.merchantName,
                                },

                            }

                        })
                        .filter((merchantPayment: any) => merchantPayment != null)

                    return _payments.concat(merchantPayments)

                },
                []

            )

        }

        return allPayments

    }

    public async  processOrderTransaction(params: any, redUrl: any, orderGroup: any, transactionId: any, logger: Logger): Promise<IOResponse<any>> {

        // add cookies to the request header
        let headers = {

            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Cookie': cookies

        }

        // request URL
        let processOrderTransactionUrl = `/api/payments/pub/transactions/${transactionId}/payments?&orderId=${orderGroup}&redirect=false&callbackUrl=${redUrl}`

        let requestBody = params;

        console.log("mutationCreatePaymentFromExistingCart - processOrderTransaction - requestBody: ", requestBody);

        let response: Promise<IOResponse<any>>;

        try {

            // Make POST
            response = this.http.postRaw(processOrderTransactionUrl, requestBody, {headers : headers})

        } catch(e) {

            logger.error({...e.response.data, method: "processOrderTransaction"});
            console.log("mutationCreatePaymentFromExistingCart - processOrderTransaction - error: ", e);
            response = new Promise( (__success, reject) => reject());

        }

        return response;

    }

    public async  processOrder(orderGroup: any, cookies: any, logger: Logger): Promise<IOResponse<any>> {

        let headers = {

            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': cookies

        }

        console.log("mutationCreatePaymentFromExistingCart - cookies: ", cookies)

        let processOrderUrl = `/api/checkout/pub/gatewayCallback/${orderGroup}`

        let response: IOResponse<any>;

        try {

          // Make POST
          response = await this.http.postRaw(processOrderUrl, {}, {
            headers
          })

        } catch(e) {

            if(e.response.status !== 428) {
                console.log("Saving error into LC entity...");
                logger.error({...e.response.data, method: "processOrder"});
            }
            console.log("mutationCreatePaymentFromExistingCart - processOrder - error: ", e.response);
            response = e.response

        }

        // console.log("mutationCreatePaymentFromExistingCart - response: ", response);

        return response;

    }

    public async  addPaymentData(orderFormId: String, body: any): Promise<IOResponse<any>> {

      let headers = {

          'Content-Type': 'application/json',
          'Accept': 'application/json'

      }

      let addPaymentDataUrl = `/api/checkout/pub/orderForm/${orderFormId}/attachments/paymentData`

      console.log(addPaymentDataUrl)

      let response: IOResponse<any>;

      try {

        // Make POST
        response = await this.http.postRaw(addPaymentDataUrl, {
          "payments": body
        }, {
          headers
        })

      } catch(e) {

        response = e.response

      }

      return response;

  }

}
