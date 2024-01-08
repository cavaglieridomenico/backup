export interface CapturePaymentResponse{
    paymentId: string,
    settleId: string | null,
    value: number,
    code?: string,
    message?: string,
    requestId: string
}