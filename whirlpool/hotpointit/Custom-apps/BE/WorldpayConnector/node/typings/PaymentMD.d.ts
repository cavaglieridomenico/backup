export interface PaymentMD{
    id:string,
    callbackUrl?: string,
    paymentUrl: string,
    value?: number,
    status: string,
    paymentMethod: string,
    orderid: string,
    authorizationId: string,
    lastModified: number,
    debitCreditIndicator: string
}