import { IOClients } from '@vtex/api'
import searchGraphQL from './SearchGraphQL'
import bazaarvoice from './bazaarvoice'
import vtex from './vtexAPI'
import Rewriter from './rewriter'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get vtex() {
    return this.getOrSet('vtex', vtex)
  }

  public get searchGraphQL() {
    return this.getOrSet('searchGraphQL', searchGraphQL)
  }

  public get bazaarvoice() {
    return this.getOrSet('bazaarvoice', bazaarvoice)
  }

  public get rewriter() {
    return this.getOrSet('rewriter', Rewriter)
  }
}
