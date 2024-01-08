import { InstanceOptions, ExternalClient, IOContext } from '@vtex/api'
import { ResEligibility, RefundReq, ResCreatePayment, RetrivePaymentRes } from '../typings/Alma'


export default class AlmaClient extends ExternalClient {
    // await ctx.clients.apps.getAppSettings("" + process.env.VTEX_APP_ID)
    production = false

    constructor(context: IOContext, options?: InstanceOptions) {
        super("", context, {
            ...options,
            headers: {
                Accept: "application/json"
            },
        })
    }

    public async checkEligibility(data: any, almaToken: string): Promise<ResEligibility[]> {
        return this.http.post(`https://api.${this.production ? '' : 'sandbox.'}getalma.eu/v2/payments/eligibility`, data, {
            headers: {
                "Authorization": "Alma-Auth " + almaToken
            }
        })
    }

    public async createPayment(data: any, almaToken: string) {
        return this.http.post<ResCreatePayment>(`https://api.${this.production ? '' : 'sandbox.'}getalma.eu/v1/payments`, data, {
            headers: {
                "Authorization": "Alma-Auth " + almaToken
            }
        })
    }

    public async cancelPayment(paymentId: string, almaToken: string): Promise<any> {
        return this.http.put(`https://api.${this.production ? '' : 'sandbox.'}getalma.eu/v1/payments/${paymentId}/cancel`, null, {
            headers: {
                "Authorization": "Alma-Auth " + almaToken
            }
        })
    }


    public async refundPayment(data: RefundReq, paymentId: string, almaToken: string): Promise<any> {
        return this.http.post(`https://api.${this.production ? '' : 'sandbox.'}getalma.eu/v1/payments/${paymentId}/refunds`, data, {
            headers: {
                "Authorization": "Alma-Auth " + almaToken
            }
        })
    }


    public async retrievePayment(paymentId: string, almaToken: string): Promise<RetrivePaymentRes> {
        return this.http.get(`https://api.${this.production ? '' : 'sandbox.'}getalma.eu/v1/payments/${paymentId}`, {
            headers: {
                "Authorization": "Alma-Auth " + almaToken
            }
        })
    }
} 