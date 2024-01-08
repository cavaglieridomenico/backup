import { json } from "co-body"
import { CreatePaymentRequest } from "../typings/CreatePayment/createPaymentRequest";
import { CreatePaymentResponse } from "../typings/CreatePayment/createPaymentResponse";
import { WPCreatePaymentRequest } from "../typings/WPCreatePayment/WPCreatePaymentRequest";
import { PaymentStatusVtex, defaultCreatePaymentResponse, MasterDataEntity, DeniedPaymentNotificationURL, defaultWPpaymentRequest, HelperPageURL, CountryCodeMapping, orderSuffix, defaultxipayRequest } from "../utils/constants";
import { WPCreatePaymentResponse } from "../typings/WPCreatePayment/WPCreatePaymentResponse";
import { BuildXML, ParseXML } from "../utils/XMLhandler";
import { CreateToken } from "../utils/CreateToken";
import { WPInquiryRequest } from "../typings/WPInquiry/WPInquiryRequest";
import { WPInquiryResponse } from "../typings/WPInquiry/WPInquiryResponse";
import { GetCreatePaymentStatus } from "../utils/VtexStatusFromWorldpayStatus";
import { configs } from "../typings/configs";
import { WPCancelRequest } from "../typings/WPCancel/WPCancelRequest";
import { ManualAuthRequest } from "../typings/xipay/manualAuthReq";
import { ManualAuthResponse } from "../typings/xipay/manualAuthRes";
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";
import { GetPayment, SavePayment } from "../utils/Storage";

export async function CreatePayment(ctx: Context, next: () => Promise<any>) {

  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  process.env.WP_URL = appSettings.wpUrl
  process.env.WP_USERNAME = appSettings.wpusername
  process.env.WP_PASSWORD = appSettings.wppassword
  process.env.XP_URL = appSettings.xipayUrl
  const XiPayPaymentMapping: { [index: string]: string } = {
    "AMEX-SSL": appSettings.xipayAmericanXpress,
    "DISCOVER-SSL": appSettings.xipayDiscover,
    "MAESTRO-SSL": appSettings.xipayMaestro,
    "MASTERPASS-SSL": appSettings.xipayMasterpass,
    "ECMC-SSL": appSettings.xipayECMC,
    "VISA_CREDIT-SSL": appSettings.xipayVisaCredit,
    "VISA_DEBIT-SSL": appSettings.xipayVisaDebit,
    "VISA_COMMERCIAL_CREDIT-SSL": appSettings.xipayVisaCommercialCredit,
    "VISA_COMMERCIAL_DEBIT-SSL": appSettings.xipayVisaCommercialDebit,
    "VISA_ELECTRON-SSL": appSettings.xipayVisaElectron,
    "ECMC_CREDIT-SSL": appSettings.xipayECMCCredit,
    "ECMC_DEBIT-SSL": appSettings.xipayECMCDebit,
    "ECMC_COMMERCIAL_CREDIT-SSL": appSettings.xipayECMCCommercialCredit,
    "ECMC_COMMERCIAL_DEBIT-SSL": appSettings.xipayECMCCommercialDebit,
    "VISA-SSL": appSettings.xipayVisa
  }
  console.log("[Create Payment] APP Settings: " + JSON.stringify(appSettings))
  ctx.vtex.logger = new CustomLogger(ctx);
  let logger = ctx.vtex.logger;
  let createPaymentRequest: CreatePaymentRequest = await json(ctx.req);
  logger.info(logMessage("[Create Payment] order:" + createPaymentRequest.orderId))
  console.log("[Create Payment] create payment request: " + JSON.stringify(createPaymentRequest))
  let existingPayment: any = undefined
  try {
    existingPayment = await GetPayment(ctx, createPaymentRequest.orderId.includes("-01") ? createPaymentRequest.orderId : createPaymentRequest.orderId + orderSuffix, 0, 0)
  } catch (err) {
    logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Payment not found in master data")
    logger.debug(err)
  }

  let createPaymentResponse: CreatePaymentResponse = JSON.parse(JSON.stringify(defaultCreatePaymentResponse));
  createPaymentResponse.paymentId = createPaymentRequest.paymentId;
  if (existingPayment == undefined) { //payment doesn't exists, need to create a new one
    console.log("[Create Payment] new payment")
    logger.info(logMessage("[Create Payment] order:" + createPaymentRequest.orderId + " - Payment does not exist, preparing request to worldpay"))
    let wpRequest: WPCreatePaymentRequest = JSON.parse(JSON.stringify(defaultWPpaymentRequest))
    wpRequest.paymentService.submit.order.$.orderCode = createPaymentRequest.orderId + orderSuffix
    wpRequest.paymentService.submit.order.$.installationId = appSettings.installationID
    wpRequest.paymentService.$.merchantCode = appSettings.merchantCode
    wpRequest.paymentService.$.version = appSettings.wpVersion
    wpRequest.paymentService.submit.order.amount.$.currencyCode = createPaymentRequest.currency
    wpRequest.paymentService.submit.order.amount.$.value = (createPaymentRequest.value * 100).toFixed(0);
    wpRequest.paymentService.submit.order.shopper.shopperEmailAddress = createPaymentRequest.miniCart.buyer.email

    logger.info(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Sending GetOrder request"))
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
            countryCode: countrycode ? countrycode : "CH"
          }
        }
      }
    }, () => {
      logger.warn(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - GetOrder request ended with an error"))
    })

    // ordercontent
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

    //full sap integration
    wpRequest.paymentService.submit.order.createToken = {
      $: {
        tokenScope: "merchant",
      },
      tokenEventReference: createPaymentRequest.paymentId,
      tokenReason: "xipay integration"
    }

    let response: string = ""
    console.log("[Create Payment] WorldPay Request: " + BuildXML(wpRequest))
    logger.info(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Sending request to worldpay: " + BuildXML(wpRequest)))
    await ctx.clients.worldpayAPI.PaymentService(BuildXML(wpRequest)).then(res => {
      response = res
    }, err => {
      console.log(err)
      logger.error(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Worldpay init request ended with an error: " + JSON.stringify(err)))
      //logger.error(err)
      ctx.status = 500;
      ctx.body = {
        "status": "error",
        "code": "wperror",
        "message": "worldpay request ended with an error"
      }
    })
    console.log("[Create Payment] WorldPay Response: " + response)
    logger.info(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Worldpay response: " + response))
    let jsonRes = ParseXML<WPCreatePaymentResponse>(response)
    if (jsonRes != undefined && jsonRes.paymentService.reply[0].error == undefined) {
      let denytoken = CreateToken()
      logger.info(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Payment created, building response to VTEX"))
      createPaymentResponse.status = PaymentStatusVtex.undefined
      createPaymentResponse.paymentAppData = {
        appName: appSettings.paymentAppName,
        payload: JSON.stringify({
          paymentUrl: jsonRes.paymentService.reply[0].orderStatus[0].reference[0]._,
          deniedUrl: DeniedPaymentNotificationURL.replace("{host}", ctx.host) + createPaymentRequest.paymentId + "/" + denytoken,
          helperPageUrl: HelperPageURL.replace("{host}", ctx.host)
        })
      }
      console.log("[Create Payment] App name payment response: " + createPaymentResponse.paymentAppData.appName)
      createPaymentResponse.tid = createPaymentRequest.paymentId
      //createPaymentResponse.nsu = createPaymentRequest.paymentId
      createPaymentResponse.code = "OK";
      createPaymentResponse.message = "payment created"

      await SavePayment(ctx, createPaymentRequest.orderId.includes("-01") ? createPaymentRequest.orderId : createPaymentRequest.orderId + orderSuffix, {
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
    } else {
      console.log("[Create Payment] error parsing response")
      if (ctx.status != 500) {
        if (jsonRes?.paymentService.reply[0].error != undefined) {
          logger.error(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Worldpay request ended with an error: " + jsonRes?.paymentService.reply[0].error))
          ctx.status = 500
          ctx.body = {
            "status": "error",
            "code": "wperror",
            "message": jsonRes?.paymentService.reply[0].error[0]._
          }
        } else {
          logger.error(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Error parsing worldpay response body"))
          ctx.status = 500
          ctx.body = {
            "status": "error",
            "code": "wperror",
            "message": "error parsing worldpay response body"
          }
        }
      }
    }
  } else { //the payment already exists in master data
    logger.info(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Payment found in master data"))
    createPaymentResponse.status = existingPayment.status
    if (existingPayment.status == PaymentStatusVtex.undefined) {
      let inquiryReq: WPInquiryRequest = {
        paymentService: {
          $: {
            version: appSettings.wpVersion,
            merchantCode: appSettings.merchantCode
          },
          inquiry: {
            orderInquiry: {
              $: {
                orderCode: existingPayment.orderid,
              }
            }
          }
        }
      }
      console.log("[Create Payment] WorldPay Inquiry request: " + inquiryReq)
      logger.info(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Payment status is undefined, sending inquiry to worldpay: " + JSON.stringify(inquiryReq)))
      await ctx.clients.worldpayAPI.PaymentService(BuildXML(inquiryReq)).then(
        async res => {
          let jsonRes = ParseXML<WPInquiryResponse>(res);
          console.log("[Create Payment] WorldPay Inquiry response: " + res)
          if (jsonRes != undefined) {
            let expDate = jsonRes.paymentService.reply[0].orderStatus[0].token ? jsonRes.paymentService.reply[0].orderStatus[0].token[0].paymentInstrument[0].cardDetails[0].expiryDate[0].date[0].$ : {
              month: "",
              year: ""
            }
            let paymentMethod = XiPayPaymentMapping[jsonRes.paymentService.reply[0].orderStatus[0].payment ? jsonRes.paymentService.reply[0].orderStatus[0].payment[0].paymentMethod[0] : ""]
            let tokenid = jsonRes.paymentService.reply[0].orderStatus[0].token ? jsonRes.paymentService.reply[0].orderStatus[0].token[0].tokenDetails[0].paymentTokenID[0] : null
            let cardholderName = res.split("<cardHolderName>")[1]?.split("</cardHolderName>")[0]
            cardholderName = cardholderName?.split("CDATA[")[1].split("]")[0]
            //console.log(JSON.stringify(jsonRes,null,2))
            if (jsonRes.paymentService.reply[0].orderStatus[0].payment != undefined && jsonRes.paymentService.reply[0].orderStatus[0].payment.length > 0)
              createPaymentResponse.status = GetCreatePaymentStatus(jsonRes.paymentService.reply[0].orderStatus[0].payment[0].lastEvent[0])
            else
              createPaymentResponse.status = PaymentStatusVtex.undefined
            //create body and send request to xipay
            let xipayRes: ManualAuthResponse | undefined = undefined
            if (createPaymentResponse.status == PaymentStatusVtex.approved) {
              createPaymentResponse.authorizationId = jsonRes.paymentService.reply[0].orderStatus[0].payment[0].AuthorisationId?.[0].$.id
              try {
                let xipayReq: ManualAuthRequest = JSON.parse(JSON.stringify(defaultxipayRequest))
                console.log("[Create Payment] XiPay ManualAuthRequest: " + JSON.stringify(xipayReq))
                let date = jsonRes.paymentService.reply[0].orderStatus[0].token[0].paymentInstrument[0].cardDetails[0].expiryDate[0].date[0].$
                let xipayAmount = createPaymentRequest.value.toFixed(2)
                xipayReq["soap:Envelope"]["soap:Header"]["wsse:Security"]["wsse:UsernameToken"]["wsse:Username"] = appSettings.xipayUsername
                xipayReq["soap:Envelope"]["soap:Header"]["wsse:Security"]["wsse:UsernameToken"]["wsse:Password"] = appSettings.xipayPassword
                xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardNumber"] = jsonRes.paymentService.reply[0].orderStatus[0].token[0].tokenDetails[0].paymentTokenID[0]
                xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardExpirationDate"] = date.month + "/" + date.year
                xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardHolderName"] = jsonRes.paymentService.reply[0].orderStatus[0].payment[0].cardHolderName[0]
                xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:Amount"] = xipayAmount
                xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CardType"] = XiPayPaymentMapping[jsonRes.paymentService.reply[0].orderStatus[0].payment[0].paymentMethod[0]]
                xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:CurrencyKey"] = jsonRes.paymentService.reply[0].orderStatus[0].payment[0].amount[0].$.currencyCode
                xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:AuthorizationCode"] = jsonRes.paymentService.reply[0].orderStatus[0].payment[0].AuthorisationId?.[0].$.id
                xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:MerchantID"] = appSettings.xipayMerchantid
                xipayReq["soap:Envelope"]["soap:Body"]["mes:SoapOp"]["mes:pPacketsIn"]["mes:packets"][0]["mes:ITransactionHeader"]["mes:InfoItems"]["mes:InfoItem"] = [{
                  "mes:Key": "TR_TRANS_REFID",
                  "mes:Value": createPaymentRequest.orderId + orderSuffix
                }]
                console.log("[Create Payment] XiPay XML Request: " + BuildXML(xipayReq, null))
                logger.info(logMessage("[Create Payment] XiPay XML Request: " + BuildXML(xipayReq)))
                let xmlRes = await ctx.clients.xipayAPI.ManualAuth(BuildXML(xipayReq, null))
                console.log("[Create Payment] XiPay XML Response: " + xmlRes)
                logger.info(logMessage("[Create Payment] XiPay XML Response: " + xmlRes))
                xipayRes = ParseXML<ManualAuthResponse>(xmlRes)

              } catch (err) {
                logger.error(logMessage("[Notification] order:" + createPaymentRequest.orderId + " - Xipay request ended with an error: " + err))
                logger.error(err)
                console.log(err)
              }
            }

            logger.info(logMessage("[Notification] order: " + createPaymentRequest.orderId + " - Xipay response: " + JSON.stringify(xipayRes, null, 2)))
            console.log("XiPay Response: " + JSON.stringify(xipayRes, null, 2))

            if (xipayRes != undefined && xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].xipayvbresult[0] && xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].StatusCode[0] > 0) { //xipay ok
              console.log("xipay ok")
              let authDate = new Date()
              //authDate = new Date(authDate.getTime() - authDate.getTimezoneOffset() * 60 *1000)
              let refno = xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].AuthorizationReferenceCode[0]
              if (refno == undefined || refno == null || refno.trim() == "")
                refno = xipayRes["s:Envelope"]["s:Body"][0].SoapOpResponse[0].SoapOpResult[0].packets[0].ITransactionHeader[0].TransactionID[0]
              ctx.clients.masterdata.updatePartialDocument({
                dataEntity: MasterDataEntity,
                id: createPaymentRequest.paymentId,
                fields: {
                  status: createPaymentResponse.status,
                  authorizationId: createPaymentResponse.authorizationId,
                  debitCreditIndicator: jsonRes.paymentService.reply[0].orderStatus[0].payment[0].amount[0].$.debitCreditIndicator,
                  lastModified: Date.now(),
                  //add sap info

                  CC_TYPE: paymentMethod,
                  CC_NUMBER: tokenid,
                  CC_VALID_T: expDate.month + "." + expDate.year,
                  CC_NAME: cardholderName,
                  CURRENCY: jsonRes.paymentService.reply[0].orderStatus[0].payment[0].amount[0].$.currencyCode,
                  AUTH_DATE: `${authDate.getDate().toString().padStart(2, "0")}.${(authDate.getMonth() + 1).toString().padStart(2, "0")}.${authDate.getFullYear()}`,
                  AUTH_TIME: authDate.toLocaleTimeString("it-CH", { timeZone: 'Europe/Rome' }),
                  AUTH_REFNO: refno
                }
              }).then(() => {
                console.log("MD updated")
                logger.info(logMessage("[Notification] order: " + createPaymentRequest.orderId + " - Master data updated"))
                existingPayment = {
                  ...existingPayment,
                  CC_TYPE: paymentMethod,
                  CC_NUMBER: tokenid,
                  CC_VALID_T: expDate.month + "." + expDate.year,
                  CC_NAME: cardholderName,
                  CURRENCY: jsonRes?.paymentService?.reply[0]?.orderStatus[0]?.payment[0]?.amount[0]?.$?.currencyCode,
                  AUTH_DATE: `${authDate.getDate().toString().padStart(2, "0")}.${(authDate.getMonth() + 1).toString().padStart(2, "0")}.${authDate.getFullYear()}`,
                  AUTH_TIME: authDate.toLocaleTimeString("it-CH", { timeZone: 'Europe/Rome' }),
                  AUTH_REFNO: refno
                }
              }, err => {
                console.log(err)
                logger.error(logMessage("[Notification] order: " + createPaymentRequest.orderId + " - Error updating master data: " + JSON.stringify(err.response.data.Message)))
              })
            } else {
              if (createPaymentResponse.status == PaymentStatusVtex.approved) {
                console.log("xipay error")
                logger.error(logMessage("[Notification] order: " + createPaymentRequest.orderId + " - Xipay error, cancelling order"))
                createPaymentResponse.status = PaymentStatusVtex.denied
                let wprequest: WPCancelRequest = {
                  paymentService: {
                    $: {
                      version: appSettings.wpVersion,
                      merchantCode: appSettings.merchantCode
                    },
                    modify: {
                      orderModification: {
                        $: {
                          orderCode: existingPayment.orderid
                        },
                        cancelOrRefund: ""
                      }
                    }
                  }
                }

                ctx.clients.worldpayAPI.PaymentService(BuildXML(wprequest)).then(
                  () => {
                    logger.info(logMessage("[Notification] order: " + createPaymentRequest.orderId + " - Cancel request sent to worldpay"))
                  }, () => {
                    console.log("wp error")
                    logger.error(logMessage("[Notification] order: " + createPaymentRequest.orderId + " - Worldpay cancel request ended with an error"))
                  }
                )
              }
            }
          } else {
            logger.error(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Error parsing worldpay response body"))
          }
        },
        err => {
          logger.error(logMessage("[Create Payment] order: " + createPaymentRequest.orderId + " - Worldpay responded with an error: " + err))
          logger.error(err)
        }
      )
    }
    createPaymentResponse.tid = createPaymentRequest.paymentId
    createPaymentResponse.code = "OK";
    createPaymentResponse.message = createPaymentResponse.status

    if (existingPayment.status == PaymentStatusVtex.approved) {
      createPaymentResponse.authorizationId = existingPayment.authorizationId
    }

    if (existingPayment.status != createPaymentResponse.status && existingPayment.status != PaymentStatusVtex.canceled && existingPayment.status != PaymentStatusVtex.captured) {
      createPaymentResponse.status = existingPayment.status
      logger.info("[Create Payment] order:" + createPaymentRequest.orderId + " - Updating payment status on master data")
      SavePayment(ctx, existingPayment.orderid.includes("-01") ? existingPayment.orderid : existingPayment.orderid + orderSuffix, existingPayment).then(() => {
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
