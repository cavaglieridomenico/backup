import { AppGraphQLClient, InstanceOptions, IOContext } from '@vtex/api'

export default class Rewriter extends AppGraphQLClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`vtex.rewriter@1.x`, context, options)
  }

  public async Get(path: string) {
    return this.graphql.query<any, any>({
      query: "query($path:String!){internal{get(path: $path){resolveAs}}}",
      variables: {
        path: path
      }
    })
  }

}
