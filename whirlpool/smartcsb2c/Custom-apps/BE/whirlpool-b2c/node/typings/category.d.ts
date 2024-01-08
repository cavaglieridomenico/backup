interface CategoryTranslationResponse {
    category: {
        id: string
        name: string
        title: string
        description: string
        linkId: string
    }
}

interface ResolvedPromise<Response> {
    data: Response
}
