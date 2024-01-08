import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { method, Service } from '@vtex/api'
import { Clients } from './clients'
import { GetUserToNotify, UpdateSubscriptions } from './middlewares/SendNotifications'
import { CheckSubscription, Subscribe as SubscribeMiddleware, GetProductDetails_Subscription } from './middlewares/Subscription'
import { AppSettings } from './typings/AppSettings'
import { Subscription, SubscriptionPayload } from './typings/Subscription'
import { Subscribe as SubscribeResolver } from './resolvers/Subscription'
import { version } from './resolvers/Version'
import { Authentication } from './middlewares/Authentication'
import { ManualNotifications } from './middlewares/ManualNotifications'
import { SendOutNotifications , UpdateOutSubscriptions } from './middlewares/SendOutNotifications'
import { Product } from './typings/Product'

const TIMEOUT_MS = 10000

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
    SubscriptionPayload: SubscriptionPayload
    AppSettings: AppSettings
    RefID: string
    NotificationsToSend: Subscription[]
    product: Product
  }
}

export default new Service({
  clients,
  graphql: {
    resolvers: {
      Mutation: {
        Subscribe: SubscribeResolver
      },
      Query: {
        version
      }
    }
  },
  routes: {
    subscribe: method({
      POST: [CheckSubscription, GetProductDetails_Subscription, SubscribeMiddleware]
    }),
    backNotification: method({
      POST: [Authentication, GetUserToNotify, UpdateSubscriptions]
    }),
    outNotification: method({
      POST: [Authentication, SendOutNotifications , UpdateOutSubscriptions ]
    }),
    manualNotification: method({
      POST: [Authentication, ManualNotifications]
    })
  },
})
