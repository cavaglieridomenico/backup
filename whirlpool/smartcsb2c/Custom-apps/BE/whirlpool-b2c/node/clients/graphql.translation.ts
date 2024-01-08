import {AppGraphQLClient, CacheLayer, GraphQLResponse, InstanceOptions, IOContext} from '@vtex/api'

const CATALOG_GRAPHQL_APP = 'vtex.catalog-graphql@1.x';

const TRIGGER_TRANSLATION_TOKEN_QUERY = `
  query getToken{
    authorize
}
`

const GET_CATEGORY_TRANSLATION_QUERY = `
  query getTranslation($id:ID!) {
    category(id: $id) {
      id
      name
      title
      description
      linkId
    }
  }
`

const GET_PRODUCT_TRANSLATION_QUERY = `
  query getProductTranslation($identifier: ProductUniqueIdentifier) {
    product(identifier: $identifier) {
      id
      name
      description
      metaTagDescription
      title
      linkId
    }
  }
`

const TRANSLATE_CATEGORY_MUTATION = `
    mutation TranslateCategory($category: CategoryInputTranslation!, $locale: Locale!) { 
        translateCategory(category: $category, locale: $locale) 
    }
`

const TRANSLATE_PRODUCT_MUTATION = `
    mutation TranslateProduct($product: ProductInputTranslation!, $locale: Locale!) { 
        translateProduct(product: $product, locale: $locale) 
    }
`

export class GraphqlTranslation extends AppGraphQLClient {

    memoryCache? : CacheLayer<string, any>

    constructor(ctx: IOContext, options?: InstanceOptions) {
        super(CATALOG_GRAPHQL_APP, ctx,
            // options
            {
                ...options,
                headers: {
                    VtexIdclientAutCookie: ctx.authToken
                },
            }
        )

        this.memoryCache = options && options?.memoryCache
    }

    // Trigger translation token
    public triggerToken = () => {
        return this.graphql.query<GraphQLResponse<any>, any>(
            {
                query: TRIGGER_TRANSLATION_TOKEN_QUERY,
                variables: {}
            },
            {
                headers: {
                },
            }
        )
    }

    // Retrieve translated category by ID and language
    public getCategoryTranslation = (id: string, locale: string) => {
        return this.graphql.query<CategoryTranslationResponse, { id: string }>(
            {
                query: GET_CATEGORY_TRANSLATION_QUERY,
                variables: { id }
            },
            {
                headers: {
                    'x-vtex-locale': `${locale}`
                },
            }
        )
    }

    // Retrieve translated product by ID and language
    public getProductTranslation = (id: string, locale: string) => {
        return this.graphql.query<ProductTranslationResponse, { identifier: { value: string, field: 'id'} }>(
            {
                query: GET_PRODUCT_TRANSLATION_QUERY,
                variables: {
                    identifier: {
                        field: 'id',
                        value: id
                    }
                }
            },
            {
                headers: {
                    'x-vtex-locale': `${locale}`
                },
            }
        )
    }

    // Translate category
    public translateCategory = (category: object, locale: string, token: string) => {
        return this.graphql.mutate(
            {
                mutate: TRANSLATE_CATEGORY_MUTATION,
                variables: { category, locale }
            },
            {
                headers: {
                    VtexIdclientAutCookie: this.context.authToken,
                    // 'x-vtex-locale': `${locale}`
                    'Authorization': token
                },
            }
        )
    }

    // Translate product
    public translateProduct = (product: object, locale: string, token: string) => {
        return this.graphql.mutate(
            {
                mutate: TRANSLATE_PRODUCT_MUTATION,
                variables: { product, locale }
            },
            {
                headers: {       
                    VtexIdclientAutCookie: this.context.authToken,
                    //'x-vtex-locale': `${locale}`,
                    'Authorization': token
                },
            }
        )
    }
}
