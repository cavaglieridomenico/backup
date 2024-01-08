import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'
import { IbothFaqSchemas } from './typings/Interfaces'
//import { IFaqCategories } from '../typings/Interfaces'

import { Clients } from './clients'
import { createFaqResolver, createFaqMid } from './middlewares/createFaq'
import { createFaqGroup, createFaqGroupResover } from './middlewares/createFaqGroup'
import { createFirstAndSecondLevelFaqMid, createFaqCategoryAndGroupResover } from './middlewares/createFirstAndSecondLevelFaq'
import { deleteFaqMid, deleteFaqResolver } from './middlewares/deleteFaq'
import { deleteFaqCategoryMid, deleteFaqCategoryResolver } from './middlewares/deleteFaqCategory'
import { deleteFaqGroupMid, deleteFaqGroupResolver } from './middlewares/deleteFaqGroup'
import { getFaqMid, getFaqResolver } from './middlewares/getFaq'
import { getCategoryFaqs, getFaqCategories } from './middlewares/getFaqCategories'
import { getQuestionGroupByCategoryId, getGroupsByParentIdResolver } from './middlewares/getQuestionGroupsById'
import { updateFaqCategoryMid, updateFaqCategoryResolver } from './middlewares/updadateFaqCategory'
import { updateFaqMid, updateFaqResolver } from './middlewares/updateFaq'
import { updateFaqGroupMid, updateFaqGroupResolver } from './middlewares/updateFaqGroup'
import { getGroupsDataMid, getGroupsDataResolver } from './middlewares/getAll'
import { createCategoryMid, createCategoryResolver } from './middlewares/createCategory'
import { getFaqByUrlMid, getFaqByUrlResolver } from './middlewares/getFaqByUrl'
import { searchFaqResolver} from './middlewares/searchFaq'
const TIMEOUT_MS = 800

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    code: number,
    firstLevelFaq: IbothFaqSchemas,
    parentId: string,
    childId: string
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        getFaqsCategory: getFaqCategories,
        getFaqGroups: getGroupsByParentIdResolver,
        getFaq: getFaqResolver,
        getGroupsWithItsFaqs: getGroupsDataResolver,
        getFaqByUrl: getFaqByUrlResolver,
        searchFaq: searchFaqResolver
      },
      Mutation: {
        createFaqCategory: createFaqCategoryAndGroupResover,
        createFaqGroup: createFaqGroupResover,
        updateFaqCategory: updateFaqCategoryResolver,
        updateFaqGroup: updateFaqGroupResolver,
        deleteFaqCategory: deleteFaqCategoryResolver,
        deleteFaqGroup: deleteFaqGroupResolver,
        createFaq: createFaqResolver,
        updateFaq: updateFaqResolver,
        deleteFaq: deleteFaqResolver,
        createJustCategory: createCategoryResolver
      }
    }
  },
  routes: {
    // `status` is the route ID from service.json. It maps to an array of middlewares (or a single handler).
    createFirstAndSecondLevelFaqMid: method({
      POST: [createFirstAndSecondLevelFaqMid],
    }),
    getCategoryFaqs: method({
      GET: [getCategoryFaqs],
    }),
    getQuestionGroupByCategoryId: method({
      GET: [getQuestionGroupByCategoryId]
    }),
    createFaqGroup: method({
      POST: [createFaqGroup]
    }),
    deleteFaqGroupMid: method({
      DELETE: [deleteFaqGroupMid]
    }),
    deleteFaqCategoryMid: method({
      DELETE: [deleteFaqCategoryMid]
    }),
    updateFaqCategoryMid: method({
      PUT: [updateFaqCategoryMid]
    }),
    updateFaqGroupMid: method({
      PUT: [updateFaqGroupMid]
    }),
    createFaqMid: method({
      POST: [createFaqMid]
    }),
    updateFaqMid: method({
      PUT: [updateFaqMid]
    }),
    deleteFaqMid: method({
      DELETE: [deleteFaqMid]
    }),
    getFaqMid: method({
      GET: [getFaqMid]
    }),
    getGroupsDataMid: method({
      GET: [getGroupsDataMid]
    }),
    createCategoryMid: method({
      POST: [createCategoryMid]
    }),
    getFaqByUrlMid: method({
      GET: [getFaqByUrlMid]
    })
  },
})
