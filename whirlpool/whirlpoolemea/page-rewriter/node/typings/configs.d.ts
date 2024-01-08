import { AllowedPageItem } from "./type"
export interface AppSettings {
  appKey: string,
  appToken: string,
  disableSitemapEntry: boolean
  isVBaseEnabled : boolean
  allowedPage: [AllowedPageItem]
}
