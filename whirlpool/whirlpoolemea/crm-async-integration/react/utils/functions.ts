import { maxRetry, maxTime } from "./constants"

export const isValid = (data: any): boolean =>
  data && data != "undefined" && data != "null" && data != "" && data != " " && data != "-" && data != "_" && data != "."

export const wait = async (timeout: number = 250): Promise<boolean> =>
  new Promise<boolean>(resolve => setTimeout(() => resolve(true), timeout))

export const fetchDataFromCRM = async (email: string, retry: number = 0): Promise<any> =>
  new Promise<any>((resolve, reject) => {
    fetch(`/app/crm-async-integration/crm/user?email=${email}`)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxTime);
          return fetchDataFromCRM(email, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject(err)
        }
      })
  })

export const checkPixelStatus = async (retry: number = 0): Promise<any> =>
  new Promise<any>((resolve, reject) => {
    fetch(`/app/crm-async-integration/crm-backflow/status`)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxTime);
          return checkPixelStatus(retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject(err);
        }
      })
  })
