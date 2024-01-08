export interface WPCaptureResponse {
    paymentService: {
        $: {
            version: string,
            merchantCode: string
        },
        reply: [
            {
                ok: [
                    {
                        captureReceived: [
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