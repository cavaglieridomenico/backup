//GraphQL types

export interface Filter{
  name: string,
  value: string
}

export interface FilterLink{
  filterArray: Filter[]
}

export interface family{
  type: string
  value: string[]
}

