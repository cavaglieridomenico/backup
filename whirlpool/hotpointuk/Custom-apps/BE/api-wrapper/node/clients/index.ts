import { IOClients } from '@vtex/api'
import AuthUser from './AuthUser'
import SFMC from './SFMC'
import vtexAPI from './vtexAPI'
import Tradeplace from './TP'
import PTV from './PTV'
import CrmClient from './CrmClient'


// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get vtexAPI() {
    return this.getOrSet('vtexAPI', vtexAPI)
  }

  public get AuthUser() {
    return this.getOrSet('AuthUser', AuthUser)
  }

  public get SFMC() {
    return this.getOrSet('SFMC', SFMC)
  }

  public get TP() {
    return this.getOrSet('TP', Tradeplace)
  }

  public get PTV(){
    return this.getOrSet('PTV', PTV)
  }

  public get CrmClient(){
    return this.getOrSet('CrmClient', CrmClient)
  }

}


