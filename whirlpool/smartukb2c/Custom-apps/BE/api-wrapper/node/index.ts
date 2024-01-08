import type { ClientsConfig } from '@vtex/api';
import {LRUCache, Service} from '@vtex/api';
import { Clients } from './clients'


const TIMEOUT_MS = 5000
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
      memoryCache: memoryCache
    },
    status: {
      memoryCache,
    },
  },
}

export default new Service({
  clients,
  routes: {
  },
})
