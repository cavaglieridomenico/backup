export const Product = {
    locale: (
        _root: ResolvedPromise<ProductTranslationResponse>,
        _args: unknown,
        ctx: Context
    ) => {
        return ctx.state.locale
    },
    id: (root: ResolvedPromise<ProductTranslationResponse>) =>
        root.data.product.id,
    name: (root: ResolvedPromise<ProductTranslationResponse>) =>
        root.data.product.name,
    description: (root: ResolvedPromise<ProductTranslationResponse>) =>
        root.data.product.description,
    metaTagDescription: (root: ResolvedPromise<ProductTranslationResponse>) =>
        root.data.product.metaTagDescription,
    title: (root: ResolvedPromise<ProductTranslationResponse>) =>
        root.data.product.title,
    linkId: (root: ResolvedPromise<ProductTranslationResponse>) =>
        root.data.product.linkId,
}

const productTranslation = async (
    id: string,
    locale: string,
    ctx: Context
) => {
    const {
        clients: { graphqlTranslation }
    } = ctx

    // Set locale in context state
    ctx.state.locale = locale;

    const translation = await graphqlTranslation.getProductTranslation(id, locale);

    return translation;
}

export const queries = {
    productTranslation
}