export interface WPCancelResponse {
    paymentService: {
        $: {
            version: string,
            merchantCode: string
        },
        reply: [
            {
                ok: [
                    {
                        voidReceived: [
                            {
                                $: {
                                    orderCode: string
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
}