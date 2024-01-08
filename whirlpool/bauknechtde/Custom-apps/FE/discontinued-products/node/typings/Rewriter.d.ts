export interface Route {
  from: string,
  resolveAs: string,
  declarer: string,
  type: string,
  id: string,
  query?: any,
  disableSitemapEntry?: boolean
}
