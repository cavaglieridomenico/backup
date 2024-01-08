export interface SearchWithPaginationResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
  }
}