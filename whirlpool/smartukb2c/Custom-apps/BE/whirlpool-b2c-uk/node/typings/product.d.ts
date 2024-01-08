interface ProductTranslationResponse {
    product: {
        id: string
        name: string
        description: string
        metaTagDescription: string
        title: string
        linkId: string
    }
}

interface ResolvedPromise<Response> {
    data: Response
}