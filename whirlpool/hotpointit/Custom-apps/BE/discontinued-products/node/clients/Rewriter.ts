import { AppGraphQLClient, InstanceOptions, IOContext } from '@vtex/api'
import { Route } from '../typings/Rewriter'

export default class Rewriter extends AppGraphQLClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`vtex.rewriter@1.x`, context, options)
  }

  public async GetPath(limit: number): Promise<any> {
    return this.graphql.query({
      query: "query($limit:Int){internal{listInternals(limit: $limit){routes{from,resolveAs, query}}}}",
      variables: {
        limit: limit
      }
    })
  }

  public async CreateInternal(route: Route): Promise<any> {
    return this.graphql.mutate({
      mutate: "mutation($route:InternalInput!){internal{save(route:$route){from,resolveAs}}}",
      variables: {
        route: route
      }
    })
  }

  public async DeleteInternal(path: string): Promise<any> {
    return this.graphql.mutate({
      mutate: "mutation($path:String!){internal{delete(path:$path){from,resolveAs}}}",
      variables: {
        path: path
      }
    })
  }

}
