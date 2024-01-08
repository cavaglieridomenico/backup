import {
  AuthorizationRequest,
  AuthorizationResponse,
  Authorizations,
  CancellationRequest,
  CancellationResponse,
  Cancellations,
  PaymentProvider,
  RefundRequest,
  RefundResponse,
  Refunds,
  SettlementRequest,
  SettlementResponse,
  Settlements,
} from '@vtex/payment-provider'
import { APP, AuthenticationError, VBase } from '@vtex/api'
import { sha512 } from './utils/crypto'
import { randomString } from './utils'
import { executeAuthorization } from './flow'
import { Clients } from './clients'
import { Eligibility, MyAppsSettings, PersistedAuthorizationRes, RetrivePaymentRes, RefundReq, PersistedCustomOrderInfoRes } from './typings/Alma'
import { createPaymentObject } from './utils/paymentMapping'
import { nanoid } from 'nanoid'
import { CustomLogger } from './utils/Logger'
import { getKey, paymentCanBeRefund } from './utils/functions'
import { authorizationsBucket, customInfoBucket } from './utils/constants'

export const persistAuthorizationResponse = async (
  vbase: VBase,
  resp: { paymentId: string, amount?: number, authorizationId?: string | undefined | null, callbackUrl?: string, orderId: string },

) => vbase.saveJSON(authorizationsBucket, resp.paymentId, resp)

export const getPersistedAuthorizationResponse = async (
  vbase: VBase,
  req: { paymentId: string },
) =>
  vbase.getJSON<AuthorizationResponse | undefined | PersistedAuthorizationRes>(  //in case of PersistedAuthorizationRes
    authorizationsBucket,
    req.paymentId,
    true
  )

export const persistCustomOrderInfo = async (
  vbase: VBase,
  resp: { vtexPaymentId: string, almaPaymentId: string, orderId: string },

) => vbase.saveJSON(customInfoBucket, resp.almaPaymentId, resp)


export const getPersistedCustomOrderInfo = async (
  vbase: VBase,
  almaPaymentId: string,
) =>
  vbase.getJSON<AuthorizationResponse | undefined | PersistedCustomOrderInfoRes>(  //in case of PersistedAuthorizationRes
    customInfoBucket,
    almaPaymentId,
    true
  )

export default class AlmaConnector extends PaymentProvider<Clients> {
  private customLogger: CustomLogger
  private setting: MyAppsSettings | undefined = undefined
  constructor(ctx: Context) {
    super(ctx);
    this.customLogger = new CustomLogger(ctx)

  }

  private getSetting = async () => {
    try {
      if (!isValid(this.setting)) {
        this.setting = await this.context.clients.apps.getAppSettings(APP.ID)
      }
      return this.setting
    } catch (e) {
      this.customLogger.error("getSetting() -- alma-connector")
      this.customLogger.error(e)
      this.context.body = "Internal Server Error"
      this.context.status = 500;
      throw new Error(e)
    }
  }


  // connector authentication
  private async authenticate() {
    try {

      if (this.isTestSuite) {
        if (this.apiKey != 'test' || this.appToken != 'test') throw new AuthenticationError("Missing or invalid credentials")
      }
      await this.getSetting()
      const { Authentication: { appkey, hashedAppToken } } = this.setting as MyAppsSettings
      if (this.apiKey != appkey || sha512(this.appToken) != hashedAppToken) {
        throw new AuthenticationError("Missing or invalid credentials")
      }
    } catch (e) {
      this.customLogger.error("authenticate() -- alma-connector")
      this.customLogger.error(e)
      this.context.body = "Internal Server Error"
      this.context.status = 500;
      throw new Error(e)
    }
  }

  private async saveAndRetry(
    req: AuthorizationRequest,
    resp: AuthorizationResponse
  ) {
    await persistAuthorizationResponse(this.context.clients.vbase, {
      paymentId: resp.paymentId,
      orderId: req.orderId
    })
    this.callback(req, resp)
  }

  private async manageRetry(authorization: AuthorizationRequest, almaId: string): Promise<any> {
    try {
      this.context.clients.AlmaClient.production = this.setting?.production || false
      let payment: RetrivePaymentRes = await this.context.clients.AlmaClient.retrievePayment(almaId, await getKey(this.context, authorization.orderId, this.customLogger, this.setting) as string)
      switch (payment.state) {
        case "paid":
        case "in_progress":
          const approveRes = Authorizations.approve(authorization, {
            authorizationId: payment.id,
            tid: payment.id
          })
          persistAuthorizationResponse(this.context.clients.vbase, {
            ...approveRes,
            orderId: authorization.orderId
          })
          return approveRes
        default:
          if (payment.expired_at) {
            const denyRes = Authorizations.deny(authorization, {
              tid: almaId
            })
            persistAuthorizationResponse(this.context.clients.vbase, {
              ...denyRes,
              orderId: authorization.orderId
            })
            return denyRes
          } else {
            return Authorizations.pending(authorization, {
              delayToCancel: 3000,
              tid: almaId
            })
          }
      }
    } catch (e) {
      this.context.body = "Internal Server Error"
      this.context.status = 500;
      this.customLogger.error(e)
      this.customLogger.error("manageRetry() -- alma-connector")
      throw new Error(e)
    }
  }

  public async checkPaymentState(payment: RetrivePaymentRes, persistedPayment: PersistedAuthorizationRes) {
    try {
      switch (payment.state) {
        case "paid":
        case "in_progress":
          if (payment.payment_plan?.find(p => p.state == "paid") && formatPrice(payment.purchase_amount) == persistedPayment.amount && payment.refunds.length == 0) {
            this.customLogger.info(`[CHECK PAYMENT STATE] approving payment ${payment.id} - ${payment.custom_data?.payment_id}`)
            persistedPayment.status = "approved"
          } else { persistedPayment.status = "denied" }
          break;
        default:
          break;
      }
      persistAuthorizationResponse(this.context.clients.vbase, persistedPayment)
    } catch (e) {
      this.customLogger.error("checkPaymentState() -- alma-connector")
      this.customLogger.error(e)
      this.context.body = "Internal Server Error"
      this.context.status = 500;
      throw new Error(e)
    }
  }

  public async authorize(authorization: AuthorizationRequest): Promise<AuthorizationResponse> {
    try {
      await this.authenticate()
      if (this.isTestSuite) {
        const persistedResponse = await getPersistedAuthorizationResponse(
          this.context.clients.vbase,
          authorization
        )
        if (persistedResponse !== undefined && persistedResponse !== null) {
          return persistedResponse
        }

        return executeAuthorization(authorization, response =>
          this.saveAndRetry(authorization, response)
        )
      }
      await this.getSetting()
      this.customLogger.info(`[AUTHORIZE PAYMENT] authorize request received: ${JSON.stringify(authorization)}`)
      let alreadySaved = await getPersistedAuthorizationResponse(this.context.clients.vbase, authorization)
      if (alreadySaved) {
        this.customLogger.info(`[AUTHORIZE PAYMENT] payment already exists. Payment info: ${JSON.stringify(alreadySaved)}`)
        if (alreadySaved.status == "approved") {
          this.customLogger.info(`[AUTHORIZE PAYMENT] payment for order ${authorization.orderId} is approved. Approving it also in VTEX`)
          return Authorizations.approve(authorization, {
            authorizationId: alreadySaved.authorizationId,
            tid: alreadySaved.tid
          })
        } else if (alreadySaved.status == "denied") {
          this.customLogger.warn(`[AUTHORIZE PAYMENT] denying payment for order ${authorization.orderId}`)
          return Authorizations.deny(authorization)
        }
        const manageRetryResponse = await this.manageRetry(authorization, alreadySaved.authorizationId as string)
        this.customLogger.info(`[AUTHORIZE PAYMENT] order ${authorization.orderId} - manageRetry response: ${JSON.stringify(manageRetryResponse)}`)
        return manageRetryResponse
      }
      this.customLogger.info(`[AUTHORIZE PAYMENT] payment for order ${authorization.orderId} doesn't exist. Creating it...`)
      const reqEligibility: Eligibility = {
        purchase_amount: Math.round(authorization.value * 100)
      }
      this.context.clients.AlmaClient.production = this.setting?.production || false//
      const resEligibility = await this.context.clients.AlmaClient.checkEligibility(reqEligibility, await getKey(this.context, authorization.orderId, this.customLogger, this.setting) as string);
      this.customLogger.info(`[AUTHORIZE PAYMENT] eligibility response for order ${authorization.orderId} : ${JSON.stringify(resEligibility)}`)
      if (!resEligibility.some((el: any) => el.eligible)) {
        return Authorizations.deny(authorization)
      }
      const paymentObject = createPaymentObject(this.context, authorization)

      const resCreatePayment = await this.context.clients.AlmaClient.createPayment(paymentObject, await getKey(this.context, authorization.orderId, this.customLogger, this.setting) as string)
      this.customLogger.info(`[AUTHORIZE PAYMENT] creating payment response for order ${authorization.orderId} : ${JSON.stringify(resCreatePayment)}`)
      const authorisationResponse = Authorizations.redirect(authorization, { redirectUrl: resCreatePayment.url, delayToCancel: 3000, tid: resCreatePayment.id })
      persistAuthorizationResponse(this.context.clients.vbase, {
        paymentId: authorization.paymentId,
        amount: authorization.value,
        authorizationId: resCreatePayment.id,
        callbackUrl: authorization.callbackUrl,
        orderId: authorization.orderId
      })

      persistCustomOrderInfo(this.context.clients.vbase, {
        vtexPaymentId: authorization.paymentId,
        almaPaymentId: resCreatePayment.id,
        orderId: authorization.orderId
      })

      return authorisationResponse
    } catch (e) {
      this.customLogger.error(`[AUTHORIZE PAYMENT] ${authorization.orderId} -- alma-connector`)
      this.customLogger.error(e)
      this.context.body = "Internal Server Error"
      this.context.status = 500;
      throw new Error(e)
    }
  }

  public getPaymentId() {

  }

  public async cancel(cancellation: CancellationRequest): Promise<CancellationResponse> {
    try {
      await this.authenticate()
      if (this.isTestSuite) {
        return Cancellations.approve(cancellation, {
          cancellationId: randomString(),
        })
      }
      await this.getSetting()
      let payment: any = await getPersistedAuthorizationResponse(this.context.clients.vbase, cancellation)
      this.context.clients.AlmaClient.production = this.setting?.production || false
      let paymentAlma = await this.context.clients.AlmaClient.retrievePayment(payment?.authorizationId + "", await getKey(this.context, payment?.orderId, this.customLogger, this.setting));
      this.customLogger.info(`[CANCEL PAYMENT] cancel request received: ${JSON.stringify(cancellation)} - payment: ${JSON.stringify(paymentAlma)}`)
      if (paymentAlma.refunds.length == 0 && paymentCanBeRefund(paymentAlma.state)) {
        let merchantRef = paymentAlma.orders?.find(o => o)?.merchant_reference;
        let refundReq: RefundReq = {
          amount: paymentAlma.purchase_amount,
          merchant_reference: merchantRef || "" // --> just fuck typescript
        }
        const almaRefundResponse = await this.context.clients.AlmaClient.refundPayment(refundReq, paymentAlma.id, await getKey(this.context, payment?.orderId, this.customLogger, this.setting))
        this.customLogger.info(`[CANCEL PAYMENT] alma refund response: ${JSON.stringify(almaRefundResponse)}`)
      } else {
        this.customLogger.info(`[CANCEL PAYMENT] payment was not authorized, cancelling it`)
        const almaCancelResponse = await this.context.clients.AlmaClient.cancelPayment(paymentAlma.id, await getKey(this.context, payment?.orderId, this.customLogger, this.setting) as string)
        this.customLogger.info(`[CANCEL PAYMENT] alma cancel response: ${JSON.stringify(almaCancelResponse)}`)
      }
      const cancellationResponse = Cancellations.approve(cancellation, { cancellationId: nanoid() })
      this.customLogger.info(`[CANCEL PAYMENT] cancel response: ${JSON.stringify(cancellationResponse)}`)

      return cancellationResponse
    } catch (e) {
      this.customLogger.error(`[CANCEL PAYMENT] ${cancellation.transactionId} -- alma-connector`)
      this.customLogger.error(e)
      this.context.body = "Internal Server Error"
      this.context.status = 500;
      throw new Error(e)
    }
  }

  public async refund(refund: RefundRequest): Promise<RefundResponse> {
    try {
      await this.authenticate()
      if (this.isTestSuite) {
        return Refunds.deny(refund)
      }
      await this.getSetting()
      this.context.clients.AlmaClient.production = this.setting?.production || false
      let persistedPayment: any = await getPersistedAuthorizationResponse(this.context.clients.vbase, refund)
      let almaPayment = await this.context.clients.AlmaClient.retrievePayment(refund.tid + "", await getKey(this.context, persistedPayment?.orderId, this.customLogger, this.setting));
      this.customLogger.info(`[REFUND PAYMENT] refund request received: ${JSON.stringify(refund)} - payment: ${JSON.stringify(almaPayment)}`)
      if (almaPayment.refunds.length == 0) {
        let merchantRef = almaPayment.orders?.find(o => o)?.merchant_reference;
        let refundReq: RefundReq = {
          amount: almaPayment.purchase_amount,
          merchant_reference: merchantRef || "" // --> just fuck typescript
        }
        const almaRefundResponse = await this.context.clients.AlmaClient.refundPayment(refundReq, almaPayment.id, await getKey(this.context, persistedPayment?.orderId, this.customLogger, this.setting))
        this.customLogger.info(`[REFUND PAYMENT] alma refund response: ${JSON.stringify(almaRefundResponse)}`)
      }
      const refundResponse = Refunds.approve(refund, { refundId: nanoid() })
      this.customLogger.info(`[REFUND PAYMENT] refund response: ${JSON.stringify(refundResponse)}`)

      return refundResponse
    } catch (e) {
      this.customLogger.error(`[REFUND PAYMENT] ${refund.transactionId} -- alma-connector`)
      this.customLogger.error(e)
      this.context.body = "Internal Server Error"
      this.context.status = 500;
      throw new Error(e)
    }
  }

  public async settle(settlement: SettlementRequest): Promise<SettlementResponse> {
    try {
      await this.authenticate()
      if (this.isTestSuite) {
        return Settlements.deny(settlement)
      }
      //log richiesta settle
      this.customLogger.info(`[SETTLE PAYMENT] settlement request received: ${JSON.stringify(settlement)}`)
      const settlementResponse = Settlements.approve(settlement, { settleId: nanoid() })
      this.customLogger.info(`[SETTLE PAYMENT] settlement response: ${JSON.stringify(settlementResponse)}`)
      return settlementResponse
    } catch (e) {
      this.customLogger.error(`[SETTLE PAYMENT] ${settlement.transactionId} -- alma-connector`)
      this.customLogger.error(e)
      this.context.body = "Internal Server Error"
      this.context.status = 500;
      throw new Error(e)
    }
  }

  public inbound: undefined
}

function formatPrice(price: number): number {
  let priceStr = price + "";
  priceStr = priceStr.substring(0, priceStr.length - 2) + "." + priceStr.substring(priceStr.length - 2, priceStr.length);
  return parseFloat(priceStr);
}

function isValid(field: any): boolean {
  return field != undefined && field != null && field != "";
}
