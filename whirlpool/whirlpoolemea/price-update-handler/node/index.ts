import {
  ParamsContext,
  ServiceContext,
  RecorderState,
  ClientsConfig,
  method,
  PRODUCTION
} from '@vtex/api'
import { Service, EventContext } from '@vtex/api'
import { Clients } from './clients'
import { sendPriceToGCP } from './middlewares/sendPriceToGCP'
import { json } from 'co-body'
import { AppSettings } from './typings/interface'
import { getAppSettings } from './middlewares/getAppSettings'
import { triggerHandler } from './middlewares/triggerHandler'
//import { getAppSettings } from './middlewares/getAppSettings'
const TIMEOUT_MS = 5000


const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 5,
      timeout: TIMEOUT_MS

    }
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    appSettings: AppSettings
  }
}

export interface CatalogUpdateEvent extends EventContext<Clients, State> {
  body: {
    IdSku: string,
    IsActive: string | boolean,
    An: string,
    DateModified: string,
    StockModified: string | boolean,
    PriceModified: string | boolean,
    HasStockKeepingUnitModified: string | boolean,
    HasStockKeepingUnitRemovedFromAffiliate: string | boolean
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients,
  events: {
    skuChange: [sendPriceToGCP],
  },
  routes: {
    test: method({
      POST: [Test]
    }),
    triggerHandler: method({
      POST: [getAppSettings, triggerHandler]
    })

  },
})


async function Test(ctx: Context) {
  //test endpoint for qa environment
  if (PRODUCTION) return
  ctx.set("Cache-Control", "no-store")

  let event: CatalogUpdateEvent = {
    vtex: ctx.vtex,
    state: ctx.state,
    clients: ctx.clients,
    body: await json(ctx.req),
    timings: ctx.timings,
    metrics: ctx.metrics,
    key: "test",
    sender: "test",
    subject: "test"
  }

  await sendPriceToGCP(event, async () => { })

  ctx.status = 200
}
