import { ClientsConfig, ServiceContext, method, ParamsContext } from '@vtex/api'
import { PaymentProviderService, PaymentProviderState } from '@vtex/payment-provider'
import { Clients } from './clients'

import AlmaConnector from './connector'
import { getPayment } from './middlewares/getPayment'
import { vtexPing } from './middlewares/vtex_ping'
const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: 15000,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, PaymentProviderState, ParamsContext>
  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
}



export default new PaymentProviderService({
  connector: AlmaConnector,
  clients,
  routes: {
    getPayment: method({
      GET: [getPayment]
    }),
    vtexPing: method({
      GET: [vtexPing]
    })
  }
})

