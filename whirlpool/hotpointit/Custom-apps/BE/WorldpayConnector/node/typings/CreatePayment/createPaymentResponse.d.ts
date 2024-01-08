
export interface CreatePaymentResponse{
    paymentId: string,
    status: string,
    authorizationId?: string | null,
    paymentAppData?: PaymentAppData,
    tid:string | undefined,
    nsu:string | null,
    acquirer?: string,
    code: string,
    message:string,
    delayToAutoSettle: number,
    delayToAutoSettleAfterAntifraud: number,
    delayToCancel: number,
    paymentUrl?: string
}

export interface PaymentAppData{
    appName: string,
    payload: string
}

export interface Payload{
    paymentUrl: string,
    deniedUrl: string,
    authToken: string,
    helperPageUrl: string
}