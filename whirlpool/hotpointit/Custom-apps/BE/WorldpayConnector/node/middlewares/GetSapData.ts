import { AuthenticationError, PRODUCTION } from "@vtex/api"
import { configs } from "../typings/configs"
import { SAP } from "../typings/SAPdata"
import { sendAlert } from "../utils/Alerts"
import { GetHash } from "../utils/AuthenticationUtils"
import { Acquirer, authHeaders, AUTH_FLAG, CC_REACT, CC_STAT_EX, DATAORIGIN } from "../utils/constants"
import { CustomLogger } from "../utils/Logger"
import { GetPayment } from "../utils/Storage"

export async function GetSapData(ctx: Context, next: () => Promise<any>) {

  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  let logger = new CustomLogger(ctx)
  ctx.vtex.logger = logger
  Authentication(ctx, appSettings)
  let orderid = ctx.vtex.route.params.orderid as string


  logger.info("[SAP data] order:" + orderid)
  let payment: any = undefined
  try {
    payment = await GetPayment(ctx, orderid.includes("-01") ? orderid : orderid + "-01", 2500, 2)
  } catch (err) {
    logger.error("[SAP Data] order:" + orderid + " - Error retrieving payment")
    logger.debug(err)
  }

  if (payment == undefined) {
    let order = await ctx.clients.vtexAPI.GetOrder(orderid)
      .catch((error) => logger.warn(`[SAP data] order: ${orderid} - GetOrder request ended with an error: ${error.response ? JSON.stringify(error.response.data?.error) : error.message}`))

    if (order && order.paymentData?.transactions[0]?.payments[0]?.connectorResponses?.acquirer === Acquirer && PRODUCTION)
      sendAlert(ctx,
        `Send credit card data to SAP for the order ${orderid} - VTEX ERROR`,
        `Unable to retrieve SAP data for the order ${orderid} placed with ${Acquirer}. Payment information not found`
      )

    logger.warn("[SAP data] order:" + orderid + " - Order payment not found in master data")
    ctx.status = 400
  } else {
    let response: SAP = {
      CC_TYPE: payment.CC_TYPE,
      CC_NUMBER: payment.CC_NUMBER,
      CC_VALID_T: payment.CC_VALID_T,
      CC_NAME: payment.CC_NAME,
      BILLAMOUNT: payment.value,
      AUTH_FLAG: AUTH_FLAG,
      AUTHAMOUNT: payment.value,
      CURRENCY: payment.CURRENCY,
      CURR_ISO: payment.CURRENCY,
      AUTH_DATE: payment.AUTH_DATE,
      AUTH_TIME: payment.AUTH_TIME,
      AUTH_CC_NO: payment.authorizationId,
      AUTH_REFNO: payment.AUTH_REFNO,
      CC_REACT: CC_REACT,
      CC_RE_AMOUNT: payment.value,
      GL_ACCOUNT: appSettings.sapgl,
      CC_STAT_EX: CC_STAT_EX,
      CC_REACT_T: payment.orderid,
      MERCHIDCL: appSettings.sapmid,
      DATAORIGIN: DATAORIGIN
    }

    ctx.set("Cache-Control", "no-store")
    ctx.body = response
    ctx.status = 200
  }

  await next()
}

function Authentication(ctx: Context, appSettings: configs) {
  if (ctx.get(authHeaders.appkey) != appSettings.gcpappkey || GetHash(ctx.get(authHeaders.apptoken)) != appSettings.gcpapptoken) {
    ctx.vtex.logger.warn("[SAP data] order:" + ctx.vtex.route.params.orderid as string + " - Authentication error, invalid credentials")
    throw new AuthenticationError("Invalid credentials")
  }
}
