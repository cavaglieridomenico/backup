import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'
import { Clients } from './clients'
import { ptvPostalImpl } from './middlewares/PtvImpl'

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
    ptv: method({
      GET: [ptvPostalImpl]
    })
  },
})
