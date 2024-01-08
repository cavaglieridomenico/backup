const ISSERVER = typeof window === 'undefined'

export const saveDataToSessionStorage = (key: string, value: string): void => {
  if (!ISSERVER) {
   return  sessionStorage.setItem(key, value)
  }
}
export const getDataFromSessionStorage = (key: string): string | null | void => {
  if (!ISSERVER) {
  return  sessionStorage.getItem(key)
  }
}
