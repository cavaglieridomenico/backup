export interface WPInquiryRequest{
    paymentService: {
        $: {
            version: string,
            merchantCode: string
        },
        inquiry: {
            orderInquiry: {
                $: {
                    orderCode: string
                }
            }
        }
    }
}