import { APP } from "@vtex/api";
import { AppSettings } from "../typings/configs";
import {
  CreatePaymentFromExistingCartInput,
  AddPaymentDataInput
} from "../typings/Payment";
import { CustomLogger } from "../utils/CustomLogger";

export const paymentMutations = {

  mutationCreatePaymentFromExistingCart : async (
    _: any,
    params: CreatePaymentFromExistingCartInput,
    ctx: Context
  ) => {
    try {

      ctx.vtex.logger = new CustomLogger(ctx);

      const appSettings: AppSettings = await ctx.clients.apps.getAppSettings(APP.ID);

      let redirectUrl

      let successResponse = {
        error: "",
        body : "",
        redirectUrl : "",
        status: 500
      }

      const {
          clients: { paymentClient },
      } = ctx

      console.log("mutationCreatePaymentFromExistingCart - params: ", params);

      // 1. Place Order
      let placeOrderResponse = await paymentClient.placeOrderFromExistingCart(params, ctx.vtex.logger);

      console.log("mutationCreatePaymentFromExistingCart - placeOrderResponse: ", placeOrderResponse);
      console.log("mutationCreatePaymentFromExistingCart - placeOrderResponse.data: ", placeOrderResponse.data);

      // Extract the orderGroup from the PlaceOrder response
      let orderGroup = placeOrderResponse.data.orderGroup

      console.log("mutationCreatePaymentFromExistingCart - orderGroup: ", orderGroup)

      // Extract the Vtex_CHKO_Auth and the CheckoutDataAccess
      let headers = placeOrderResponse.headers["set-cookie"]

      console.log("mutationCreatePaymentFromExistingCart - headers: ", headers);

      // check over the set-cookie header
      // if not inside retrieve an error
      if(!headers || headers.length <= 0) {

        return {
          body: "",
          redirectUrl: "",
          error: "No set-cookie header was found inside the Place Order response!",
          status: 500
        }

      }

      let vtex_CheckoutDataAccess = headers[0]
      let vtex_CHKO_Auth_Header = headers[1]

      ctx.cookies.set(
        vtex_CheckoutDataAccess.substring(0, vtex_CheckoutDataAccess.indexOf("=")), 
        vtex_CheckoutDataAccess.substring(vtex_CheckoutDataAccess.indexOf("=")+1, vtex_CheckoutDataAccess.indexOf(";"))
      );
      
      ctx.cookies.set(
          vtex_CHKO_Auth_Header.substring(0, vtex_CHKO_Auth_Header.indexOf("=")), 
          vtex_CHKO_Auth_Header.substring(vtex_CHKO_Auth_Header.indexOf("=")+1, vtex_CHKO_Auth_Header.indexOf(";"))
      );

      const {
        id: transactionId,
        receiverUri,
        gatewayCallbackTemplatePath,
        merchantTransactions
      } = placeOrderResponse.data

      console.log("mutationCreatePaymentFromExistingCart - transactionId: ", transactionId, ", receiverUri: ", receiverUri, ", gatewayCallbackTemplatePath: ", gatewayCallbackTemplatePath, ", merchantTransactions: ", merchantTransactions);

      if (transactionId === 'NO-PAYMENT') {

        return {
          body: placeOrderResponse.data,
          redirectUrl: receiverUri,
          error: "",
          status: placeOrderResponse.status
        }
      }

      if (merchantTransactions?.length > 0) {

        // compose the callbackUrl
        // const callbackUrl = `${
        //   `https://${ctx.vtex.account}.myvtex.com`
        // }${gatewayCallbackTemplatePath}`
        const callbackUrl = `${
          `https://${ctx.vtex.host}`
        }${gatewayCallbackTemplatePath}`

        console.log("mutationCreatePaymentFromExistingCart - callbackUrl: ", callbackUrl)

        // 2. Order Transaction
        const paymentsResponse = await paymentClient.processOrderTransaction (

          paymentClient.calculatePaymentsFromPlaceOrder(placeOrderResponse, appSettings.defaultCurrencyCode),
          callbackUrl,
          orderGroup,
          placeOrderResponse.data.id,
          ctx.vtex.logger

        )

        console.log("mutationCreatePaymentFromExistingCart - paymentsResponse: ", paymentsResponse)

        if (paymentsResponse.status === 201) {

          // redirectUrl = `${
          //   `https://${ctx.vtex.account}.myvtex.com`
          // }${gatewayCallbackTemplatePath.replace(
          //   '{messageCode}',
          //   'Success'
          // )}`
          redirectUrl = `${
            `https://${ctx.vtex.host}`
          }${gatewayCallbackTemplatePath.replace(
            '{messageCode}',
            'Success'
          )}`

        } else {

          // return error
          return {

            body: "",
            redirectUrl: "",
            error: paymentsResponse.data,
            status: paymentsResponse.status

          }

        }

        console.log("mutationCreatePaymentFromExistingCart - redirectUrl: ", redirectUrl);

        const callbackResponse = await paymentClient.processOrder(
          orderGroup,
          vtex_CheckoutDataAccess + "; " + vtex_CHKO_Auth_Header,
          ctx.vtex.logger
        )

        console.log("mutationCreatePaymentFromExistingCart - callbackResponse: ", callbackResponse);

        if (callbackResponse.status === 204) {

          return {

            body: callbackResponse.data,
            redirectUrl: redirectUrl,
            error: "",
            status: callbackResponse.status

          }

        } else if (callbackResponse.status === 428) {

          /**
           * @summary
           * Status code 428 means that the payment is a redirect or a connector app
           * that should be rendered to fulfill it
           * @warn
           * THIS APPROACH DOES NOT SUPPORT SPLIT-PAYMENT
           */
          const connectorData = await callbackResponse.data
          const redirectType = connectorData.RedirectResponseCollection
          const renderAuthType = connectorData.paymentAuthorizationAppCollection

          if (redirectType && redirectType.length && redirectType.length > 0) {

            // REDIRECTS TO PAYMENT PROVIDER
            successResponse.body = JSON.stringify(connectorData)
            successResponse.redirectUrl = redirectType[0].redirectUrl
            successResponse.error = ""

          } else if (renderAuthType && renderAuthType.length && renderAuthType.length > 0) {

            /**
             * Here the connector responds with the app name that should be rendered.
             * You should pass the appPayload to your preferred auth app.
             * @example
             * <SequraAuthApp payload={connectorData.paymentAuthorizationAppCollection[0].appPayload}
             */

            // send error
            successResponse.body = ""
            successResponse.redirectUrl = ""
            successResponse.error = JSON.stringify(connectorData)

          } else {

            // send error
            successResponse.body = ""
            successResponse.redirectUrl = ""
            successResponse.error = JSON.stringify(connectorData)

          }

          successResponse.status = callbackResponse.status

          return successResponse

        }

      } else if (!receiverUri) {

        // send error
        return {
          body: "",
          redirectUrl: "",
          error: JSON.stringify(placeOrderResponse.data),
          status: placeOrderResponse.status
        }

      } else if (transactionId === 'NO-PAYMENT') {

        return {
          body: JSON.stringify(placeOrderResponse.data),
          redirectUrl: receiverUri,
          error: "",
          status: placeOrderResponse.status
        }

      }

      return successResponse

    } catch (err) {

      let redirectResponse = (err as any)?.response?.data?.RedirectResponseCollection

      return {
        body: "",
        redirectUrl: redirectResponse?.length > 0 ? redirectResponse[0]?.redirectUrl : JSON.stringify(redirectResponse),
        error: err,
        status: (err as any)?.response?.status
      }

    }

  },

  mutationAddPaymentData : async (
    _: any,
    params: any,
    ctx: Context
  ) => {
    try {

      let response = {
        error: "",
        body : "",
        redirectUrl : "",
        status: 500
      }

      let body = params.query
      let orderFormId = params.orderFormId

      const {
          clients: { paymentClient },
      } = ctx

      // 1. Place Order
      let addPaymentDataResponse = await paymentClient.addPaymentData(orderFormId, body as [AddPaymentDataInput])

      response.status = addPaymentDataResponse.status
      response.body= JSON.stringify(addPaymentDataResponse.data)
      response.error = ""
      response.redirectUrl = ""

      return response

    } catch (err) {

      let redirectResponse = (err as any)?.response?.data?.RedirectResponseCollection

      return {
        body: "",
        redirectUrl: redirectResponse?.length > 0 ? redirectResponse[0]?.redirectUrl : JSON.stringify(redirectResponse),
        error: err,
        status: (err as any)?.response?.status
      }

    }

  }

}
