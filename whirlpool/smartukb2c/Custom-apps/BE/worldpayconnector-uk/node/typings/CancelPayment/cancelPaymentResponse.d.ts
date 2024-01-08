export interface CancelPaymentResponse{
    paymentId: string,
    cancellationId: string | null,
    requestId: string,
    code?: string
    message?: string
}