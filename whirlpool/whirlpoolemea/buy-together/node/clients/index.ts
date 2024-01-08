import { IOClients } from '@vtex/api'
import Graphql from './Graphql'
import VtexAPI from './VtexAPI'

export class Clients extends IOClients {
    public get VtexAPI() {
        return this.getOrSet('VtexAPI', VtexAPI)
      }
      public get Graphql() {
        return this.getOrSet('SearchGraphQL', Graphql)
      }
}