import { AuthenticationError, PRODUCTION } from "@vtex/api"
import { configs } from "../typings/configs"
import { SAP } from "../typings/SAPdata"
import { sendAlert } from "../utils/Alerts";
import { Acquirer, AUTH_FLAG, CC_REACT, CC_STAT_EX, DATAORIGIN, MasterDataEntity, orderSuffix, PaymentStatusVtex, vtexCredentials } from "../utils/constants"
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";
import { GetPaymentVBase } from "../utils/Storage";

export async function GetSapData(ctx: Context, next: () => Promise<any>) {

  ctx.vtex.logger = new CustomLogger(ctx)
  let logger = ctx.vtex.logger
  let orderid = ctx.vtex.route.params.orderid as string
  let appkey = ctx.get('X-VTEX-API-AppKey')
  let apptoken = ctx.get('X-VTEX-API-AppToken')
  if (vtexCredentials[ctx.vtex.account]["X-VTEX-API-AppKey"] != appkey || vtexCredentials[ctx.vtex.account]["X-VTEX-API-AppToken"] != apptoken) {
    logger.error(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }) + " - Request blocked: invalid credentials")
    console.log("auth error")
    throw new AuthenticationError("Credentials are not valid")
  }

  logger.info(logMessage("[SAP data] order: " + orderid))
  let payment: any
  //firstly search payment in vbase cache
  try {
    payment = await GetPaymentVBase(ctx, orderid.includes("-01") ? orderid : orderid + orderSuffix)
  } catch (err) { }
  //if not found or status is not approved retrieve info from MD
  if (!(payment && payment?.status == PaymentStatusVtex.approved))
    payment = await retrievePayment(ctx, orderid.includes("-01") ? orderid : orderid + orderSuffix, logger)

  if (payment == undefined) {
    let order = await ctx.clients.vtexAPI.GetOrder(orderid)
      .catch((error) => logger.warn(`[SAP data] order: ${orderid} - GetOrder request ended with an error: ${error.response ? JSON.stringify(error.response.data?.error) : error.message}`))

    if (order && order.paymentData?.transactions[0]?.payments[0]?.connectorResponses?.acquirer === Acquirer && PRODUCTION)
      sendAlert(ctx,
        `Send credit card data to SAP for the order ${orderid} - VTEX ERROR`,
        `Unable to retrieve SAP data for the order ${orderid} placed with ${Acquirer}. Payment information not found`
      )

    logger.error(logMessage("[SAP data] order: " + orderid + " - Order payment not found in master data"))
    ctx.status = 400
  } else {
    const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
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

async function retrievePayment(ctx: Context, orderid: string, logger: any, nRetry: number = 0, status: string = PaymentStatusVtex.approved, maxRetry: number = 5): Promise<any> {
  return new Promise<any>(async (resolve) => {
    await ctx.clients.masterdata.searchDocuments<any>({
      dataEntity: MasterDataEntity,
      fields: ['_all'],
      pagination: {
        page: 1,
        pageSize: 1
      },
      where: `orderid=${orderid}`
    }).then(results => {
      if (results.length > 0 && results[0].status == status) {
        resolve(results[0])
      } else {
        if (nRetry < maxRetry) {
          setTimeout(() => {
            retrievePayment(ctx, orderid, logger, nRetry + 1).then(res => resolve(res))
          }, 2000)
        } else {
          logger.debug(logMessage(`[SAP data] ${orderid} - order not found, retry: ${nRetry} , payment status is ${results.length > 0 ? results[0].status : "not found"}`));
          resolve(undefined)
        }
      }
    }, error => {
      if (nRetry < maxRetry) {
        setTimeout(() => {
          retrievePayment(ctx, orderid, logger, nRetry + 1).then(res => resolve(res))
        }, 2000)
      } else {
        logger.debug(logMessage(`[SAP data] ${orderid} - order not found, retry: ${nRetry} error: ${error}`));
        resolve(undefined)
      }
    })
  })
}
