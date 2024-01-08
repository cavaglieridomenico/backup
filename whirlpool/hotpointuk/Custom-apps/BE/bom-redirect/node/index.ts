import { ClientsConfig, method, Service, ServiceContext } from '@vtex/api'
import { Clients } from './clients'
import { checkInternal } from './middlewares/checkInternal'
import { createInternal } from './middlewares/createInternal'
import { deleteInternal } from './middlewares/deleteInternal'
import { getListInternal } from './middlewares/getListInternal'
import { ManageRedirects } from './middlewares/manageRedirects'

const TIMEOUT_MS = 20000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}

export default new Service({
  clients,
  routes: {
    redirect: method({
      POST: [ManageRedirects]
    }),
    deleteInternal: method({
      DELETE: [deleteInternal]
    }),
    createInternal: method({
      POST: [createInternal]
    }),
    checkInternal: method({
      POST: [checkInternal]
    }),
    getInternalList: method({
      POST: [getListInternal]
    })
  }

})
