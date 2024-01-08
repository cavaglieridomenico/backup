export interface WPRefundResponse {
    paymentService: {
        $: {
            version: string,
            merchantCode: string
        },
        reply: [
            {
                ok: [
                    {
                        refundReceived: [
                            {
                                $: {
                                    orderCode: string
                                },
                                amount: [
                                    {
                                        $: {
                                            value: number,
                                            currencyCode: string,
                                            exponent: number,
                                            debitCreditIndicator: string
                                        }
                                    }
                                ]
                            }

                        ]
                    }
                ]
            }
        ]
    }
}