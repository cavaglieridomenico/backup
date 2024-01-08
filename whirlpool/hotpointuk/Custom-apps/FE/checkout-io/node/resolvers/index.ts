import { add_delivery_resolver } from './addDelivery'
import { cartFix_resolver } from './cartFix'
import { isServedPC_resolver } from './isServedPC'
import { queries, mutations } from './orderForm'
import { paymentMutations } from './payment'
import { productQueries } from './product'

export const resolvers = {
  Query: {
    ...queries,
    ...productQueries
  },
  Mutation: {
    ...mutations,
    ...paymentMutations,
    isServedPC: isServedPC_resolver,
    cartFix: cartFix_resolver,
    addDelivery: add_delivery_resolver
  }
}
