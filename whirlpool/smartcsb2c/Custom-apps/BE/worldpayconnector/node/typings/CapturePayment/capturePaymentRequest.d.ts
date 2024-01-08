
export interface CapturePaymentRequest{
    transactionId: string,
    requestId: string,
    paymentId: string,
    value: number,
    authorizationId: string,
    tid: string
}