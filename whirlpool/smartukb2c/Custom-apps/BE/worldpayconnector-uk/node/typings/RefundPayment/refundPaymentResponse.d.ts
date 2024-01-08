export interface RefundPaymentResponse{
    requestId: string,
    refundId: string | null,
    paymentId: string,
    value: number,
    code?: string,
    message?: string
}