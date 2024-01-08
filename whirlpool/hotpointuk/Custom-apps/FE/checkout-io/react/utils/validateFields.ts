export const hasValidFields = function <T>(obj: T, fields: object): boolean {
  for (const key in fields) {
    if (
      obj &&
      Object.prototype.hasOwnProperty.call(obj, key) &&
      !obj[key as keyof T]
    ) {
      return false
    }
  }

  return true
}

export const isFieldValid = (field: string | undefined | null) => {
  return field != undefined && field != null && field != ""
}

export const EMAIL_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
export const FIELD_REGEX =  /^[^\x00-\x0F]*$/