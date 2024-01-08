export interface WPCreatePaymentResponse {
    paymentService: {
        $: {
            version: string,
            merchantCode: string
        },
        reply: [
            {
                orderStatus: [
                    {
                        $: {
                            orderCode: string
                        },
                        reference: [
                            {
                                _: string,
                                $: {
                                    id: string
                                }
                            }
                        ]
                    }
                ],
                error?: [
                    {
                        $: {
                            code: string
                        },
                        _: string
                    }
                ]
            }
        ]
    }
}