import { ClientsConfig, method, RecorderState, Service, ServiceContext } from '@vtex/api'
import { Clients } from './clients'
import { checkCredentials } from './middlewares/checkCredentials'
import { checkInternal } from './middlewares/checkInternal'
import { createInternal } from './middlewares/createInternal'
import { deleteInternal } from './middlewares/deleteInternal'
import { getAppSettings } from './middlewares/getAppSettings'
import { getListInternal } from './middlewares/getListInternal'
import { createInternalCheck, deleteInternalCheck } from './middlewares/isValidInternal'
import { getVBaseQueryParam_resolver } from './resolvers/getVBaseQueryParam'
import { AppSettings } from './typings/configs'
import { CreateRequest, DeleteRequest } from './typings/request'

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
  type Context = ServiceContext<Clients, State>


  interface State extends RecorderState {

    appSettings: AppSettings
    createInternalRequest?: CreateRequest
    deleteInternalRequest?: DeleteRequest

  }
}

export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        getVBaseQueryParam: getVBaseQueryParam_resolver
      }
    }
  },
  routes: {

    deleteInternal: method({
      DELETE: [checkCredentials, getAppSettings, deleteInternalCheck, deleteInternal]
    }),
    createInternal: method({
      POST: [checkCredentials, getAppSettings, createInternalCheck, createInternal]
    }),
    checkInternal: method({
      POST: [checkCredentials, checkInternal]
    }),
    getInternalList: method({
      POST: [checkCredentials, getAppSettings, getListInternal]
    })
  }

})
