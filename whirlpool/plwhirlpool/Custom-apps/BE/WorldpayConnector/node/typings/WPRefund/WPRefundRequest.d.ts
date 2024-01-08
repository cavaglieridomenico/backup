export interface WPRefundRequest {
    paymentService: {
        $: {
            version: string,
            merchantCode: string
        },
        modify: {
            orderModification: {
                $: {
                    orderCode: string
                },
                 refund: {
                     amount: {
                         $: {
                             value: string,
                             currencyCode: string,
                             exponent: number,
                             debitCreditIndicator: string
                         }
                     }
                 }
            }
        }
    }
}