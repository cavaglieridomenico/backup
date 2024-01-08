//@ts-nocheck

import { ACCOUNT } from "@vtex/api";
import { localeMap, defaultLocale } from "./constants";

//03-12-21 For plwhirlpool that use poland locale
let locale = localeMap[ACCOUNT] === undefined ? defaultLocale : localeMap[ACCOUNT]

export const FormatDate = (date: Date = new Date()) => {
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}
