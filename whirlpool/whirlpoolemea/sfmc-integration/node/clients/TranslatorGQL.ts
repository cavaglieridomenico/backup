import { AppGraphQLClient, InstanceOptions, IOContext } from "@vtex/api";
import { stringify } from "querystring";
import { GetProductTranslationReq, GetProductTranslationRes } from "../typings/translations";
import { maxRetries, maxTime } from "../utils/constants";
import { wait } from "../utils/functions";

export default class TranslatorGQL extends AppGraphQLClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = {
      ...options?.headers,
      ...{
        VtexIdclientAutCookie: context.authToken
      }
    }
    super("vtex.catalog-graphql@1.x", context, options)
  }

  public async getProductTranslation(product: GetProductTranslationReq, retry: number = 0): Promise<GetProductTranslationRes> {
    this.options!.headers = {
      ...this.options?.headers,
      ...{
        "x-vtex-tenant": product.srcLocale,
        "x-vtex-locale": product.dstLocale
      }
    }
    return new Promise<GetProductTranslationRes>((resolve, reject) => {
      this.graphql.query<GetProductTranslationRes, { identifier: { field: string, value: string | number } }>(
        {
          query: `query getTranslation($identifier: ProductUniqueIdentifier) {
                      product(identifier: $identifier) {
                        id
                        name
                        title
                        description
                        shortDescription
                        metaTagDescription
                        linkId
                        keywords
                      }
                    }`,
          variables: {
            identifier: {
              field: product.identifier.field,
              value: product.identifier.value
            }
          }
        },
        this.options
      )
        .then((res: any) => res.errors ? reject({ msg: "Error while retrieving translations for the product " + product.identifier.value + " --details: " + stringify(res) }) : resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getProductTranslation(product, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: "Error while retrieving translations for the product " + product.identifier.value + " --details: " + stringify(err) })
          }
        })
    })
  }
}
