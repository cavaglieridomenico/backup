export interface RefundPaymentRequest{
    requestId: string,
    settleId: string,
    paymentId: string,
    value: number,
    transactionId: string
}