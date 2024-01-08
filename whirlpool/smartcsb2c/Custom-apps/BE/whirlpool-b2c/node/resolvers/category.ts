export const Category = {
    locale: (
        _root: ResolvedPromise<CategoryTranslationResponse>,
        _args: unknown,
        ctx: Context
    ) => { return ctx.state.locale },
    name: (root: ResolvedPromise<CategoryTranslationResponse>) => root.data.category.name,
    title: (root: ResolvedPromise<CategoryTranslationResponse>) => root.data.category.title,
    description: (root: ResolvedPromise<CategoryTranslationResponse>) => root.data.category.description,
    id: (root: ResolvedPromise<CategoryTranslationResponse>) => root.data.category.id,
    linkId: (root: ResolvedPromise<CategoryTranslationResponse>) => root.data.category.linkId,
}

const categoryTranslation = async (
    id: string,
    locale: string,
    ctx: Context
) => {
    const {
        clients: { graphqlTranslation },
    } = ctx;

    // Set locale in context state
    ctx.state.locale = locale;

    const translation = await graphqlTranslation.getCategoryTranslation(id, locale);

    return translation;
}


export const queries = {
    categoryTranslation
}
