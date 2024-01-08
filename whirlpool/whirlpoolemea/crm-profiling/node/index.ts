import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { method, Service } from '@vtex/api'
import { Clients } from './clients'
import { AppSettings } from './typings/config'
import { CustomLogger } from './utils/Logger';
import { UpdateUserProfiling } from './middlewares/UpdateUserProfiling'
import { getAppSettings } from './middlewares/getAppSettings'
import { initLogger } from './middlewares/initLogger';

const TIMEOUT_MS = 5000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    }
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {    
    appSettings: AppSettings
    logger: CustomLogger
  }
}

export default new Service({
  clients,
  routes: {
    setProfilingOptin: method({
      POST: [initLogger,getAppSettings,UpdateUserProfiling]
    })
  },
})
