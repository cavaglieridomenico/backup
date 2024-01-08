export interface WPCancelRequest {
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
                cancelOrRefund: string
            }
        }
    }
}