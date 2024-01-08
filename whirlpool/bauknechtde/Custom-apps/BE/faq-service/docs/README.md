## Faq service

# Rest services exposed

# GraphQl services exposed

 Query:
  - getFaqsCategory
  - getFaqGroups
  - getFaq
  - getGroupsWithItsFaqs
  - getFaqByUrl
  - searchFaq

type Mutation {

  createJustCategory(fields: CategoryInput!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

  createFaqCategory(fields: bothFaqInput!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

  createFaqGroup(fields: FaqGroupInputWithFather!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

  createFaq(fields: FaqInput!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

  updateFaqCategory(fields: UpdateCategoryOrGroup!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

  updateFaqGroup(fields: UpdateGroup!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

  updateFaq(fields: UpdateFaqInput!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

  deleteFaqCategory(id:ID!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

  deleteFaqGroup(id:ID!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

  deleteFaq(id:ID!):Boolean @cacheControl(scope:PRIVATE, maxAge:ZERO)

}

