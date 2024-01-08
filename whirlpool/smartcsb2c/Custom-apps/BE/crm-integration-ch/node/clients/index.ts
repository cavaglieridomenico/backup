import { IOClients } from '@vtex/api'

import PingCrm from './pingCrm'
import CreateUpdateCrmUser from './createUpdateCrmUser'
import UpdateVtexUser from './updateVtexUser'
import GetCrmUser from './getCrmUser'
import GetVtexUser from './getVtexUser'
import GetVtexAddresses from './getVtexAddresses'
import UpdateCrmUserAddress from './updateCrmUserAddress'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients 
{
  public get pingCrm() { return this.getOrSet('pingCRM', PingCrm) }

  public get createUpdateCrmUser() { return this.getOrSet('createUpdateCrmUser', CreateUpdateCrmUser) }

  public get updateVtexUser() { return this.getOrSet('updateVtexUser', UpdateVtexUser) }

  public get getCrmUser() { return this.getOrSet('getCrmUser', GetCrmUser) }

  public get getVtexUser() { return this.getOrSet('getVtexUser', GetVtexUser) }

  public get getVtexAddresses() { return this.getOrSet('getVtexAddresses', GetVtexAddresses) }

  public get updateCrmUserAddress() { return this.getOrSet('updateCrmUserAddress', UpdateCrmUserAddress) }
}
