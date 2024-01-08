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
    ...paymentMutations
  }
}
