import { ClientsConfig, method, Service, ServiceContext } from '@vtex/api'
import { Clients } from './clients'
import { ManageRedirects } from './middlewares/manageRedirects'
import { FullUpdate } from './middlewares/fullUpdate'

const TIMEOUT_MS = 5000

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
    full: method({
      POST: [FullUpdate]
    })
  }
})
