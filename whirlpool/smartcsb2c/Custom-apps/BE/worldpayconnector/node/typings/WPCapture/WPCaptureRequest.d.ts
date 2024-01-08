export interface WPCaptureRequest {
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
                capture: {
                    $: {
                        sequenceNumber: number,
                        totalCount: number
                    },
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