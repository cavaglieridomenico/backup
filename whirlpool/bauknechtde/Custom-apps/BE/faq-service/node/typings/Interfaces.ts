export interface IFaqQuestionGroups {
  url: string,
  name: string
  metaTitle: string,
  metaDescription: string,
  image: string,
  fatherCategory: string,
  id: string
}

export interface IFaqCategories {
  url: string,
  name: string
  metaTitle: string,
  metaDescription: string,
  image: string,
  id: string
  fatherCategory?: string
}


export interface IbothFaqSchemas {
  category: {
    url: string,
    name: string
    metaTitle: string,
    metaDescription: string,
    image: string,
    id: string
  },
  group: {
    url: string,
    name: string
    metaTitle: string,
    metaDescription: string,
    image: string
  }
}


export interface FAQ {
  url: string,
  metaTitle: string,
  metaDescription: string,
  question: string,
  answer: string,
  featuredFrom: boolean,
  category: string,
  group: string
}

export interface GroupNameIdAndFaqs {
  groupName: string,
  groupId: string,
  faqs: FAQ[]
}

export interface ICat {
  url: string,
  name: string
  metaTitle: string,
  metaDescription: string,
  image: string,
  id: string
}
