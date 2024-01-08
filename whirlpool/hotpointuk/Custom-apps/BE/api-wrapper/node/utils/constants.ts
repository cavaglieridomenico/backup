import { CreateUpdateCrmCustomerRequestType } from '../typings/CreateUpdateCrmCustomerRequestType'

export const today = {
  year: new Date().getUTCFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  hour: new Date().getUTCHours(),
  minute: new Date().getUTCMinutes(),
  seconds: new Date().getUTCSeconds()
}
export const tomorrowDay = {
  year: new Date().getUTCFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate() + 1,
  hour: new Date().getUTCHours(),
  minute: new Date().getUTCMinutes(),
  seconds: new Date().getUTCSeconds()
}

export const todayPlus3 = {
  year: new Date().getUTCFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate() + 3,
  hour: new Date().getUTCHours(),
  minute: new Date().getUTCMinutes(),
  seconds: new Date().getUTCSeconds()
}

export const defaultCookie = "VtexIdclientAutCookie";

export const xml_header = '<?xml version="1.0" encoding="UTF-8"?>';

export const defaultCrmCreateUpdateCustomerRequestBody: CreateUpdateCrmCustomerRequestType = {
  BP_ID: "",
  Email: "",
  Name: "",
  Surname: "",
  Country: "GB",
  Source: "WEB",
  MarketingTable: []
}

//SALEFORCE Credentials
export const sfmcMID = ""
export const sfmcApiKey = ""

export const stockAvailabilitySpec = "stockavailability";

export const CLEntityName = "CL";
export const CLEntityFields = ["id", "userId", "email", "userType", "partnerCode"];
export const maxRetry = 10;
export const maxWaitTime = 500;
