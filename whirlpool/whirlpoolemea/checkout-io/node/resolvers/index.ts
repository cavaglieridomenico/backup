import { cartFix_resolver } from "./cartFix"
import { insertCouponWithLogs_resolver } from "./insertCouponWithLogs"
import { isServedPC_resolver } from "./isServedPC"
import { queries, mutations } from "./orderForm"
import { paymentMutations } from "./payment"
import { productQueries } from "./product"
// import { retrieveCookie } from '../middlewares/retrieveCookie'


//devo vedere che fare con le chiamate graphql
export const resolvers = {
  Query: {
    ...queries,
    ...productQueries,
  },
  Mutation: {
    ...mutations,
    ...paymentMutations,
    isServedPC: /*[retrieveCookie,*/ isServedPC_resolver,//],
    cartFix: cartFix_resolver,
    insertCouponWithLogs: insertCouponWithLogs_resolver,
  },
}
