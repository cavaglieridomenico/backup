import { json } from "co-body"
import { CreatePaymentRequest } from "../typings/CreatePayment/createPaymentRequest";
import { CreatePaymentResponse } from "../typings/CreatePayment/createPaymentResponse";
import { WPCreatePaymentRequest } from "../typings/WPCreatePayment/WPCreatePaymentRequest";
import { PaymentStatusVtex, defaultCreatePaymentResponse, DeniedPaymentNotificationURL, defaultWPpaymentRequest, HelperPageURL, CountryCodeMapping, orderSuffix } from "../utils/constants";
import { WPCreatePaymentResponse } from "../typings/WPCreatePayment/WPCreatePaymentResponse";
import { BuildXML, ParseXML } from "../utils/XMLhandler";
import { CreateToken } from "../utils/AuthenticationUtils"
import { GetCreatePaymentStatus } from "../utils/VtexStatusFromWorldpayStatus";
import { configs } from "../typings/configs";
import { ManualAuthResponse } from "../typings/xipay/manualAuthRes";
import { CustomLogger } from "../utils/Logger";
import { GetPayment, SavePayment } from "../utils/Storage";
import { BuildXipayAuthRequest, GetSapData } from "../utils/xipay";
import { CancelPaymentReq, Inquiry } from "../utils/WpCommonRequests";


export async function CreatePayment(ctx: Context, next: () => Promise<any>) {

  const appSettings: configs = ctx.state.appSettings
  process.env.WP_URL = appSettings.wpUrl
  process.env.WP_USERNAME = appSettings.wpusername
  process.env.WP_PASSWORD = appSettings.wppassword
  process.env.XP_URL = appSettings.xipayUrl
  let logger = new CustomLogger(ctx);
  ctx.vtex.logger = logger
  let createPaymentRequest: CreatePaymentRequest = await json(ctx.req);
  logger.info("[Create Payment] order:" + createPaymentRequest.orderId)

  let existingPayment: any
  try {
    existingPayment = await GetPayment(ctx, createPaymentRequest.orderId + orderSuffix, 0, 0)
  } catch (err) {
    logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Payment not found in master data")
    logger.debug(err)
  }


  let createPaymentResponse: CreatePaymentResponse = JSON.parse(JSON.stringify(defaultCreatePaymentResponse));
  createPaymentResponse.paymentId = createPaymentRequest.paymentId;
  if (existingPayment == undefined) { //payment doesn't exists, need to create a new one

    logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Payment does not exist, preparing request to worldpay")

    let wpRequest = await BuildWpRequestBody(ctx, appSettings, createPaymentRequest).catch(() => undefined)
    let response: string = ""
    logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Sending request to worldpay")
    await ctx.clients.worldpayAPI.PaymentService(BuildXML(wpRequest)).then(res => {
      response = res
    }, err => {
      logger.error("[Create Payment] order:" + createPaymentRequest.orderId + " - Worldpay init request ended with an error")
      logger.debug(err)
      ctx.status = 500;
      ctx.body = {
        "status": "error",
        "code": "wperror",
        "message": "worldpay request ended with an error"
      }
    })
    let jsonRes = ParseXML<WPCreatePaymentResponse>(response)
    if (jsonRes != undefined && jsonRes.paymentService.reply[0].error == undefined) {
      let denytoken = CreateToken()
      logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Payment created, building response to VTEX")
      createPaymentResponse.status = PaymentStatusVtex.undefined
      createPaymentResponse.paymentAppData = {
        appName: appSettings.paymentAppName,
        payload: JSON.stringify({
          paymentUrl: jsonRes.paymentService.reply[0].orderStatus[0].reference[0]._,
          deniedUrl: DeniedPaymentNotificationURL.replace("{host}", ctx.host) + createPaymentRequest.orderId + orderSuffix + "/" + denytoken,
          helperPageUrl: HelperPageURL.replace("{host}", ctx.host),
          locale: appSettings.locale
        })
      }
      createPaymentResponse.tid = createPaymentRequest.paymentId
      createPaymentResponse.code = "OK";
      createPaymentResponse.message = "payment created"

      await SavePayment(ctx, createPaymentRequest.orderId + orderSuffix, {
        id: createPaymentRequest.paymentId,
        callbackUrl: createPaymentRequest.callbackUrl,
        value: createPaymentRequest.value,
        status: PaymentStatusVtex.undefined,
        paymentMethod: createPaymentRequest.paymentMethod,
        orderid: createPaymentRequest.orderId + orderSuffix,
        paymentUrl: jsonRes.paymentService.reply[0].orderStatus[0].reference[0]._,
        transactionid: createPaymentRequest.transactionId,
        denytoken: denytoken,
        CURRENCY: createPaymentRequest.currency
      }).then(() => {
        logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Payment saved on master data")
        createPaymentResponse.code = "OK";
        ctx.set("Content-Type", "application/json");
        ctx.body = JSON.stringify(createPaymentResponse);
        ctx.status = 200;
      }, err => {
        logger.error("[Create Payment] order:" + createPaymentRequest.orderId + " - Error saving payment on master data")
        logger.debug(err)
        ctx.status = 500;
        ctx.body = {
          "status": "error",
          "code": "MDerror",
          "message": "error creating payment"
        }
      })
    }
    else {
      if (ctx.status != 500) {
        if (jsonRes?.paymentService?.reply[0]?.error != undefined) {
          logger.error("[Create Payment] order:" + createPaymentRequest.orderId + " - Worldpay request ended with an error: " + jsonRes?.paymentService?.reply[0]?.error)
          ctx.status = 500
          ctx.body = {
            "status": "error",
            "code": "wperror",
            "message": jsonRes?.paymentService.reply[0].error[0]._
          }
        }
        else {
          logger.error("[Create Payment] order:" + createPaymentRequest.orderId + " - Error parsing worldpay response body")
          ctx.status = 500
          ctx.body = {
            "status": "error",
            "code": "wperror",
            "message": "error parsing worldpay response body"
          }
        }
      }
    }
  } else { //the payment already exists in master data, checking the status
    logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Payment found in master data")
    createPaymentResponse.status = existingPayment.status
    if (existingPayment.status == PaymentStatusVtex.undefined) {
      logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Payment status is undefined, sending inquiry to wolrdpay")
      let inquiryRes = await Inquiry(ctx, appSettings, existingPayment.orderid).catch(err => {
        logger.warn("[Create Payment] order:" + createPaymentRequest.orderId + " - Inquiry request ended with an error")
        logger.debug(err)
        return undefined
      })

      if (inquiryRes) {
        existingPayment.status = GetCreatePaymentStatus(inquiryRes.jsonRes.paymentService.reply[0].orderStatus[0].payment[0].lastEvent[0])
        existingPayment.debitCreditIndicator = inquiryRes.jsonRes.paymentService.reply[0].orderStatus[0].payment[0].amount[0].$.debitCreditIndicator
        if (existingPayment.status == PaymentStatusVtex.approved) {
          existingPayment.authorizationId = inquiryRes.jsonRes.paymentService.reply[0].orderStatus[0].payment[0].AuthorisationId?.[0].$.id
          if (appSettings.useXipay) {
            try {
              let xipayData = BuildXipayAuthRequest(appSettings, inquiryRes.jsonRes.paymentService.reply[0].orderStatus[0], inquiryRes?.xmlRes || "")
              let xmlRes = await ctx.clients.xipayAPI.ManualAuth(BuildXML(xipayData.requestBody))
              let xipayRes = ParseXML<ManualAuthResponse>(xmlRes)
              xipayData.response = xipayRes
              logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Xipay response: " + xmlRes)
              if ((xipayRes && xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].xipayvbresult[0] && xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].StatusCode[0] > 0)) { //xipay ok
                existingPayment = {
                  ...existingPayment,
                  ...GetSapData(xipayData, inquiryRes.jsonRes.paymentService.reply[0].orderStatus[0].payment[0].amount[0].$.currencyCode)
                }
              } else {
                logger.error("[Create Payment] order:" + createPaymentRequest.orderId + " - Xipay error, cancelling order")
                existingPayment.status = PaymentStatusVtex.denied
                existingPayment.authorizationId = undefined
                CancelPaymentReq(ctx, appSettings, existingPayment.orderid).then(
                  res => {
                    logger.debug("[Create Payment] order:" + createPaymentRequest.orderId + " - Worldpay cancel response: " + res)
                  }, (err) => {
                    logger.error("[Create Payment] order:" + createPaymentRequest.orderId + " - Worldpay cancel request ended with an error")
                    logger.debug(err)
                  }
                )
              }
            } catch (err) {
              logger.error("[Create Payment] order:" + createPaymentRequest.orderId + " - Xipay request ended with an error")
              logger.error(err)
              existingPayment.status = PaymentStatusVtex.denied
              existingPayment.authorizationId = undefined
              CancelPaymentReq(ctx, appSettings, existingPayment.orderid).then(
                res => {
                  logger.debug("[Create Payment] order:" + createPaymentRequest.orderId + " - Worldpay cancel response: " + res)
                }, (err) => {
                  logger.error("[Create Payment] order:" + createPaymentRequest.orderId + " - Worldpay cancel request ended with an error")
                  logger.debug(err)
                }
              )
            }
          }
        }
      }
    }
    createPaymentResponse.tid = createPaymentRequest.paymentId
    createPaymentResponse.code = "OK";
    createPaymentResponse.message = existingPayment.status

    if (existingPayment.status == PaymentStatusVtex.approved) {
      createPaymentResponse.authorizationId = existingPayment.authorizationId
    }

    if (existingPayment.status != createPaymentResponse.status) {
      createPaymentResponse.status = existingPayment.status
      logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Updating payment status on master data")
      SavePayment(ctx, existingPayment.orderid, existingPayment).then(() => {
        logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Master data updated")
      }, err => {
        logger.error("[Create Payment] order:" + createPaymentRequest.orderId + " - Error updating master data")
        logger.debug(err)
      })
    }

    ctx.set("Content-Type", "application/json");
    ctx.body = JSON.stringify(createPaymentResponse);
    ctx.status = 200;
  }
  await next()
}



const BuildWpRequestBody = async (ctx: Context, appSettings: configs, createPaymentRequest: CreatePaymentRequest): Promise<WPCreatePaymentRequest> => {
  let wpRequest: WPCreatePaymentRequest = JSON.parse(JSON.stringify(defaultWPpaymentRequest))
  wpRequest.paymentService.submit.order.$.orderCode = createPaymentRequest.orderId + orderSuffix
  wpRequest.paymentService.submit.order.$.installationId = appSettings.installationID
  wpRequest.paymentService.$.merchantCode = appSettings.merchantCode
  wpRequest.paymentService.$.version = appSettings.wpVersion
  wpRequest.paymentService.submit.order.amount.$.currencyCode = createPaymentRequest.currency
  wpRequest.paymentService.submit.order.amount.$.value = (createPaymentRequest.value * 100).toFixed(0);
  wpRequest.paymentService.submit.order.shopper.shopperEmailAddress = createPaymentRequest.miniCart.buyer.email

  //full sap integration

  ctx.vtex.logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Sending GetOrder request")
  await ctx.clients.vtexAPI.GetOrder(createPaymentRequest.orderId + orderSuffix).then(res => {
    if (res.invoiceData != undefined) {
      let countrycode = CountryCodeMapping.find(country => country.name == res.invoiceData?.address.country.trim().toLowerCase())?.code
      wpRequest.paymentService.submit.order.billingAddress = {
        address: {
          address1: res.invoiceData.address.street,
          address2: res.invoiceData.address.number,
          postalCode: res.invoiceData.address.postalCode,
          city: res.invoiceData.address.city,
          state: res.invoiceData.address.state,
          countryCode: countrycode ? countrycode : "IT"
        }
      }
    }
  }, () => {
    ctx.vtex.logger.warn("[Create Payment] order:" + createPaymentRequest.orderId + " - GetOrder request ended with an error")
  })

  //ordercontent
  let orderContent = "<ul>"
  createPaymentRequest.miniCart.items.forEach(item => {
    orderContent += "<li>"
    orderContent += "<h2>" + item.name + "</h2>"
    orderContent += "<p>Quantity: " + item.quantity + "</p>"
    orderContent += "<p>Price: " + item.price + "</p>"
    if (item.discount != undefined && item.discount != 0)
      orderContent += "<p>Discount: " + item.discount + "</p>"
    orderContent += "</li>"
  })
  orderContent += "</ul>"

  wpRequest.paymentService.submit.order.orderContent = "<![CDATA[" + orderContent + "]]>"
  wpRequest.paymentService.submit.order.createToken = {
    $: {
      tokenScope: "merchant",
    },
    tokenEventReference: createPaymentRequest.paymentId,
    tokenReason: "xipay integration"
  }

  return wpRequest
}
