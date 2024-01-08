//@ts-nocheck

const shortUuid = require('short-uuid');
import { setTimeout } from "timers";
import { optinPerBrand, statesPerCountry, sourceCampaignPerBrand, optinPerCommunity, CUSTOMERS_BUCKET, ccFields } from "./constants";
import { convertIso3Code, convertIso2Code } from "./ISOCountryConverter";
import { getObjFromVbase } from "./Vbase";
import { searchDocuments } from "./documentCRUD";

function normalize(stringToNormalize: string): string {
  stringToNormalize = stringToNormalize.replace(/[\+|\[|\]|\/|\!|\"|\£|\$|\%|\&|\(|\)|\=|\\|\?|\^|\||\{|\}|\°|\#|\;|\.|\:|\_|\<|\>|\•|\²]/g, "");
  stringToNormalize = stringToNormalize.replace(/\-/g, " ");
  stringToNormalize = stringToNormalize.replace(/\,/g, " ");
  stringToNormalize = stringToNormalize.replace(/  /g, " ");
  return stringToNormalize;
}

function cutString(stringToCat: any, maxLength: number): string {
  stringToCat = normalize(stringToCat + "");
  return stringToCat.length > maxLength ? (stringToCat.substr(0, maxLength)[maxLength - 1] == " " ? stringToCat.substr(0, maxLength - 1) : stringToCat.substr(0, maxLength)) : stringToCat;
}

export function mapCLInfo(ctx: Context, userData: Object): Object {
  let customer = {
    webId: isValid(userData.webId) ? userData.webId : generateWebIdByAccountId(ctx),
    vtexUserId: userData.id,
    email: userData.email,
    locale: isValid(userData.localeDefault) ? formatLocale(userData.localeDefault) : getdefaultLocaleAndCountryByAccountId(ctx),
    country: getdefaultLocaleAndCountryByAccountId(ctx),  // calculated in this way beacuse country is not a CL's field
    optinConsent: isValid(userData.isNewsletterOptIn) ? formatOptin(userData.isNewsletterOptIn) : "2",
    firstName: isValid(userData.firstName) ? cutString(userData.firstName, 40) : null,
    lastName: isValid(userData.lastName) ? cutString(userData.lastName, 40) : null,
    gender: isValid(userData.gender) ? ((userData.gender.toLowerCase() == "male" || userData.gender.toLowerCase() == "female") ? formatGender(userData.gender) : null) : null,
    dateOfBirth: isValid(userData.birthDate) ? formatDateOfBirth(userData.birthDate) : null,
    mobilePhone: isValid(userData.phone) ? formatPhoneNumber(ctx, userData.phone) : null,
    homePhone: isValid(userData.homePhone) ? formatPhoneNumber(ctx, userData.homePhone) : null,
    crmBpId: isValid(userData.crmBpId) ? userData.crmBpId : null,
    campaign: isValid(userData.campaign) ? userData.campaign : null
  }
  if (isValid(userData.userType)) {
    customer["userType"] = userData.userType;
  }
  return customer;
}

export function mapADInfo(ctx: Context, userData: Object): Object {
  let customer = {
    addressId: userData.id,
    country: isValid(userData.country) ? formatCountry(userData.country) : getdefaultLocaleAndCountryByAccountId(ctx),
    street: isValid(userData.street) ? cutString(userData.street, 60) : null,
    number: isValid(userData.number) ? cutString(userData.number, 10) : null,
    complement: isValid(userData.complement) ? cutString(userData.complement, 40) : null,
    city: isValid(userData.city) ? cutString(userData.city, 40) : null,
    postalCode: isValid(userData.postalCode) ? cutString(userData.postalCode, 10) : null,
    state: isValid(userData.state) ? getStateByCountry(ctx, userData.state) : null
  };
  return customer;
}

export function mapCRMInfoToCC(ctx: Context, crmData: Object, userType: string | undefined): Object {
  let address = undefined;
  let customer = undefined;
  let optin = undefined;
  let useSap = JSON.parse(process.env.CRM).server === 'sap-po' ? true : false;
  let complementField = undefined;
  if (!useSap) {
    address = crmData["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]["EsAddressData"];
    customer = crmData["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]["EsNameData"];
    optin = crmData["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]["EtMktAttrib"]["item"];
  } else {
    address = crmData["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_DISPCON_MYACC.Response"]["ES_ADDRESS_DATA"];
    customer = crmData["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_DISPCON_MYACC.Response"]["ES_NAME_DATA"];
    optin = crmData["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_DISPCON_MYACC.Response"]["ET_MKT_ATTRIB"]["item"];
  }
  if (ctx.vtex.account == 'plwhirlpool' || ctx.vtex.account == 'plwhirlpoolqa') {
    complementField = useSap ? (isValid(address["STREET3"]) ? address["STREET3"] + "" : null) : (isValid(address.Street3) ? address.Street3 + "" : null);
  } else {
    complementField = useSap ? (isValid(address["STREET2"]) ? address["STREET2"] + "" : null) : (isValid(address.Street2) ? address.Street2 + "" : null);
  }
  let user = {
    email: useSap ? address["EMAIL_ADDRESS"] : address.EmailAddress,
    locale: useSap ? customer["CORR_LANGUAGE"] : customer.CorrLanguage,
    country: useSap ? address["COUNTRY"] : address.Country,
    optinConsent: mapCRMOptin(ctx, optin, userType),
    firstName: useSap ? (isValid(customer["FIRST_NAME"]) ? customer["FIRST_NAME"] : null) : (isValid(customer.FirstName) ? customer.FirstName : null),
    lastName: useSap ? (isValid(customer["LAST_NAME"]) ? customer["LAST_NAME"] : null) : (isValid(customer.LastName) ? customer.LastName : null),
    gender: useSap ? (isValid(customer["TITLE_KEY"]) ? customer["TITLE_KEY"] : null) : (isValid(customer.TitleKey) ? customer.TitleKey : null),
    dateOfBirth: useSap ? (isValid(customer["DATE_OF_BIRTH"]) ? customer["DATE_OF_BIRTH"] + "" : null) : (isValid(customer.DateOfBirth) ? customer.DateOfBirth + "" : null),
    mobilePhone: useSap ? (isValid(address["MOBILE_PHONE"]) ? address["MOBILE_PHONE"] + "" : null) : (isValid(address.MobilePhone) ? address.MobilePhone + "" : null),
    homePhone: useSap ? (isValid(address["WORK_PHONE"]) ? address["WORK_PHONE"] + "" : null) : (isValid(address.WorkPhone) ? address.WorkPhone + "" : null),
    street: useSap ? (isValid(address["STREET1"]) ? address["STREET1"] : null) : (isValid(address.Street1) ? address.Street1 : null),
    number: useSap ? (isValid(address["HOUSE_NUM"]) ? address["HOUSE_NUM"] + "" : null) : (isValid(address.HouseNum) ? address.HouseNum + "" : null),
    complement: complementField,
    city: useSap ? (isValid(address["CITY"]) ? address["CITY"] : null) : isValid(address.City) ? address.City : null,
    postalCode: useSap ? (isValid(address["POST_CODE"]) ? address["POST_CODE"] + "" : null) : (isValid(address.PostCode) ? address.PostCode + "" : null),
    state: useSap ? (isValid(address["STATE"]) ? address["STATE"] : null) : (isValid(address.State) ? address.State : null)
  }
  return user;
}

export function CLInfoAreEqual(cl: Object, cc: Object): Boolean {
  let ret = true;
  for (let k of Object.keys(cl)) {
    if ((cl[k] + "").toLowerCase() != (cc[k] + "").toLowerCase() && k != "country") {
      ret = false;
    }
  }
  return ret;
}

export function ADInfoAreEqual(ad: Object, cc: Object): Boolean {
  let ret = true;
  for (let k of Object.keys(ad)) {
    if ((ad[k] + "").toLowerCase() != (cc[k] + "").toLowerCase()) {
      ret = false;
    }
  }
  return ret;
}

export function isAddressCreatedyTheBackflow(address: Object): Boolean {
  return isValid(address.backflow) ? address.backflow : false;
}

export function CCInfoAreEqual(crm: Object, cc: Object): Boolean {
  let ret = true;
  for (let k of Object.keys(crm)) {
    if ((crm[k] + "").toLowerCase() != (cc[k] + "").toLowerCase()) {
      ret = false;
    }
  }
  return ret;
}

export function isValid(field: string): Boolean {
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "" && field != !"-" && field != "_";
}

export function formatGender(gender: string): string {
  return gender.toLowerCase() == "female" ? "0001" : "0002";
}

export function formatDateOfBirth(dateOfBirth: string): string {
  let birthDate = new Date(dateOfBirth);
  let year = birthDate.getFullYear();
  let month = (birthDate.getMonth() + 1) < 10 ? "0" + (birthDate.getMonth() + 1) : (birthDate.getMonth() + 1);
  let day = birthDate.getDate() < 10 ? "0" + birthDate.getDate() : birthDate.getDate();
  return year + "" + month + "" + day;
}

export function formatOptin(optin: any): string {
  return (optin + "") == "true" ? "1" : "2";
}

export function formatCountry(country: string): string {
  return convertIso3Code(country).iso2;
}

export function formatLocale(locale: string): string {
  return locale.split("-")[1];
}

export function generateWebIdByAccountId(ctx: Context): string {
  let res = "";
  switch (ctx.vtex.account) {
    case "frwhirlpool":
      res = "D2CFR" + shortUuid.generate().substring(0, 15);
      break;
    case "frwhirlpoolqa":
      res = "D2CFR" + shortUuid.generate().substring(0, 15);
      break;
    case "frccwhirlpool":
      res = "CCFR" + shortUuid.generate().substring(0, 16);
      break;
    case "frccwhirlpoolqa":
      res = "CCFR" + shortUuid.generate().substring(0, 16);
      break;
    case "itwhirlpool":
      res = "D2CIT" + shortUuid.generate().substring(0, 15);
      break;
    case "itwhirlpoolqa":
      res = "D2CIT" + shortUuid.generate().substring(0, 15);
      break;
    case "ruwhirlpool":
      res = "D2CRU" + shortUuid.generate().substring(0, 15);
      break;
    case "ruwhirlpoolqa":
      res = "D2CRU" + shortUuid.generate().substring(0, 15);
      break;
    case "plwhirlpool":
      res = "D2CPL" + shortUuid.generate().substring(0, 15);
      break;
    case "plwhirlpoolqa":
      res = "D2CPL" + shortUuid.generate().substring(0, 15);
  }
  return res;
}

export function getdefaultLocaleAndCountryByAccountId(ctx: Context): string {
  let res = "";
  switch (ctx.vtex.account) {
    case "frwhirlpool":
      res = "FR";
      break;
    case "frwhirlpoolqa":
      res = "FR";
      break;
    case "frccwhirlpool":
      res = "FR";
      break;
    case "frccwhirlpoolqa":
      res = "FR";
      break;
    case "itwhirlpool":
      res = "IT";
      break;
    case "itwhirlpoolqa":
      res = "IT";
      break;
    case "ruwhirlpool":
      res = "RU";
      break;
    case "ruwhirlpoolqa":
      res = "RU";
      break;
    case "plwhirlpool":
      res = "PL";
      break;
    case "plwhirlpoolqa":
      res = "PL";
  }
  return res;
}

export function getStateByCountry(ctx: Context, state: string): any {
  return statesPerCountry[ctx.vtex.account].includes(state) ? state : null;
}

export function getMostRecentAddress(addresses: []): Object {
  let dates = [];
  addresses.forEach(a => {
    dates.push(a.lastInteractionIn);
  });
  dates.sort();
  let date = dates[dates.length - 1];
  return addresses.find(f => f.lastInteractionIn == date);
}

export function mapCRMOptin(ctx: Context, optin: [], userType: string | undefined): string {
  let optinFound = false;
  let ret = "2";
  if (!isValidCC(userType)) {
    for (let i = 0; i < optinPerBrand[ctx.vtex.account].length && !optinFound; i++) {
      if (optin?.find(f => f.AttName == optinPerBrand[ctx.vtex.account][i] && f.AttValue.toLowerCase() == "allowed") != undefined) {
        optinFound = true;
        ret = "1";
      }
    }
  } else {
    for (let i = 0; i < optinPerCommunity[userType].length && !optinFound; i++) {
      if (optin?.find(f => f.AttName == optinPerCommunity[userType][i] && f.AttValue.toLowerCase() == "allowed") != undefined) {
        optinFound = true;
        ret = "1";
      }
    }
  }
  return ret;
}

export function mapCCToCL(customer: Object): Object {
  let ret = {
    isNewsletterOptIn: isValid(customer.optinConsent) ? formatOptinReverse(customer.optinConsent) : false,
    firstName: isValid(customer.firstName) ? customer.firstName : null,
    lastName: isValid(customer.lastName) ? customer.lastName : null,
    gender: isValid(customer.gender) ? formatGenderReverse(customer.gender) : null,
    birthDate: isValid(customer.dateOfBirth) ? formatDateOfBirthReverse(customer.dateOfBirth) : null,
    localeDefault: isValid(customer.locale) ? formatLocaleReverse(customer.locale) : null,
    phone: isValid(customer.mobilePhone) ? customer.mobilePhone : null,
    homePhone: isValid(customer.homePhone) ? customer.homePhone : null
  }
  if (isValid(customer.email)) {
    ret["email"] = customer.email;
  }
  if (isValid(customer.userType)) {
    ret["userType"] = customer.userType;
  }
  return ret;
}

export function mapCCToAD(customer: Object): Object {
  let ret = {
    country: isValid(customer.country) ? formatCountryReverse(customer.country) : null,
    street: isValid(customer.street) ? customer.street : null,
    number: isValid(customer.number) ? customer.number : null,
    complement: isValid(customer.complement) ? customer.complement : null,
    city: isValid(customer.city) ? customer.city : null,
    postalCode: isValid(customer.postalCode) ? customer.postalCode : null,
    state: isValid(customer.state) ? customer.state : null
  }
  return ret;
}

export function formatGenderReverse(gender: string): string {
  return gender == "0001" ? "female" : "male";
}

export function formatDateOfBirthReverse(dateOfBirth: string): string {
  let year = dateOfBirth.substring(0, 4);
  let month = dateOfBirth.substring(4, 6);
  let day = dateOfBirth.substring(6, 8);
  return year + "-" + month + "-" + day + "T00:00:00Z";
}

export function formatOptinReverse(optin: string): Boolean {
  return optin == "1" ? true : false;
}

export function formatCountryReverse(country: string): string {
  return convertIso2Code(country).iso3;
}

export function formatLocaleReverse(locale: string): string {
  return locale.toLowerCase() + "-" + locale;
}

export function json2XmlCrm(ctx: Context, payload: Object): string {
  let res = '';
  res = res + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<soap:Body>' +
    '<n0:ZEsCreaconMyacc xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">';
  res = payload.webId != null ? res + '<WebId>' + payload.webId + '</WebId>' : res;
  res = res + "<CsAddressData>";
  res = payload.number != null ? res + '<HouseNum>' + payload.number + '</HouseNum>' : res;
  res = payload.street != null ? res + '<Street1>' + payload.street + '</Street1>' : res;
  res = payload.complement != null ? res + mapComplementCrm(ctx, true) + payload.complement + mapComplementCrm(ctx, false) : res;
  res = payload.city != null ? res + '<City>' + payload.city + '</City>' : res;
  res = payload.state != null ? res + '<State>' + payload.state + '</State>' : res;
  res = payload.country != null ? res + '<Country>' + payload.country + '</Country>' : res;
  res = payload.postalCode != null ? res + '<PostCode>' + payload.postalCode + '</PostCode>' : res;
  res = payload.email != null ? res + '<EmailAddress>' + payload.email + '</EmailAddress>' : res;
  res = payload.homePhone != null ? res + '<WorkPhone>' + payload.homePhone + '</WorkPhone>' : res;
  res = payload.mobilePhone != null ? res + '<MobilePhone>' + payload.mobilePhone + '</MobilePhone>' : res;
  res = res + "</CsAddressData>";
  res = res + "<CsNameData>";
  res = payload.gender != null ? res + '<TitleKey>' + payload.gender + '</TitleKey>' : res;
  res = payload.firstName != null ? res + '<FirstName>' + payload.firstName + '</FirstName>' : res;
  res = payload.lastName != null ? res + '<LastName>' + payload.lastName + '</LastName>' : res;
  res = payload.dateOfBirth != null ? res + '<DateOfBirth>' + payload.dateOfBirth + '</DateOfBirth>' : res;
  res = payload.locale != null ? res + '<CorrLanguage>' + payload.locale + '</CorrLanguage>' : res;
  res = res + "</CsNameData>";
  res = res + "<CtMktAttrib>";
  if (isValidCC(payload.userType)) {
    let ccMktAttr = optinPerCommunity[payload.userType];
    ccMktAttr?.forEach(mktattr => {
      res = res + '<item>' +
        '<AttSet>EU_CONSUMER_BRAND</AttSet>' +
        '<AttName>' + mktattr + '</AttName>';
      res = payload.optinConsent != null ? res + '<AttValue>' + payload.optinConsent + '</AttValue>' : res + '<AttValue>2</AttValue>';
      res = res + '</item>'
    })
    res = res + '<item>' +
      '<AttSet>EU_CONSUMER_CC</AttSet>' +
      '<AttName>EU_CONSUMER_MODEL</AttName>' +
      '<AttValue>' + payload.userType + '</AttValue>' +
      '</item>';
    res = res + '<item>' +
      '<AttSet>EU_CONSUMER_PRV</AttSet>' +
      '<AttName>THIRD_PARTY_CONTACT</AttName>' +
      '<AttValue>TBD</AttValue>' + // TBD
      '</item>';
    switch (payload.userType) {
      case "EPP":
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_EPP_TYPE</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_EPP_LINK</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_EPP_LINK_KEY</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        break;
      case "FF":
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_FF_LINK</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_FF_LINK_KEY</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        break;
      case "VIP":
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_COMPANY</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_COMPANY_CODE</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_ACCESS_CODE</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_LINK</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_LINK_KEY</AttName>' +
          '<AttValue>TBD</AttValue>' + // TBD
          '</item>';
        break;
    }
  } else {
    let brands = optinPerBrand[ctx.vtex.account];
    brands?.forEach(b => {
      res = res + '<item>' +
        '<AttSet>EU_CONSUMER_BRAND</AttSet>' +
        '<AttName>' + b + '</AttName>';
      res = payload.optinConsent != null ? res + '<AttValue>' + payload.optinConsent + '</AttValue>' : res + '<AttValue>2</AttValue>';
      res = res + '</item>'
    });
  }
  if (isValid(payload.campaign)) {
    let scpb = sourceCampaignPerBrand[ctx.vtex.account];
    scpb?.forEach(sc => {
      res = res + '<item>' +
        '<AttSet>EU_SOURCE_CAMPAIGN</AttSet>' +
        '<AttName>' + sc + '</AttName>';
      res = res + '<AttValue>' + payload.campaign + '</AttValue>';
      res = res + '</item>'
    });
  }
  res = res + "</CtMktAttrib>";
  res = res + "</n0:ZEsCreaconMyacc>";
  res = res + "</soap:Body>";
  res = res + "</soap:Envelope>";
  return res;
}


export function json2XmlSap(ctx: Context, payload: Object): string {
  let res = '';
  res = res + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<soap:Body>' +
    '<n0:Z_ES_CREACON_MYACC xmlns:n0="urn:sap-com:document:sap:rfc:functions">';
  res = payload.webId != null ? res + '<WEB_ID>' + payload.webId + '</WEB_ID>' : res;
  res = res + "<CS_ADDRESS_DATA>";
  res = payload.number != null ? res + '<HOUSE_NUM>' + payload.number + '</HOUSE_NUM>' : res;
  res = payload.street != null ? res + '<STREET1>' + payload.street + '</STREET1>' : res;
  res = payload.complement != null ? res + mapComplementSap(ctx, true) + payload.complement + mapComplementSap(ctx, false) : res;
  res = payload.city != null ? res + '<CITY>' + payload.city + '</CITY>' : res;
  res = payload.state != null ? res + '<STATE>' + payload.state + '</STATE>' : res;
  res = payload.country != null ? res + '<COUNTRY>' + payload.country + '</COUNTRY>' : res;
  res = payload.postalCode != null ? res + '<POST_CODE>' + payload.postalCode + '</POST_CODE>' : res;
  res = payload.email != null ? res + '<EMAIL_ADDRESS>' + payload.email + '</EMAIL_ADDRESS>' : res;
  res = payload.homePhone != null ? res + '<WORK_PHONE>' + payload.homePhone + '</WORK_PHONE>' : res;
  res = payload.mobilePhone != null ? res + '<MOBILE_PHONE>' + payload.mobilePhone + '</MOBILE_PHONE>' : res;
  res = res + "</CS_ADDRESS_DATA>";
  res = res + "<CS_NAME_DATA>";
  res = payload.gender != null ? res + '<TITLE_KEY>' + payload.gender + '</TITLE_KEY>' : res;
  res = payload.firstName != null ? res + '<FIRST_NAME>' + payload.firstName + '</FIRST_NAME>' : res;
  res = payload.lastName != null ? res + '<LAST_NAME>' + payload.lastName + '</LAST_NAME>' : res;
  res = payload.dateOfBirth != null ? res + '<DATE_OF_BIRTH>' + payload.dateOfBirth + '</DATE_OF_BIRTH>' : res;
  res = payload.locale != null ? res + '<CORR_LANGUAGE>' + payload.locale + '</CORR_LANGUAGE>' : res;
  res = res + "</CS_NAME_DATA>";
  res = res + "<CT_MKT_ATTRIB>";
  if (isValidCC(payload.userType)) {
    let ccMktAttr = optinPerCommunity[payload.userType];
    ccMktAttr?.forEach(mktattr => {
      res = res + '<item>' +
        '<ATT_SET>EU_CONSUMER_BRAND</ATT_SET>' +
        '<ATT_NAME>' + mktattr + '</ATT_NAME>';
      res = payload.optinConsent != null ? res + '<ATT_VALUE>' + payload.optinConsent + '</ATT_VALUE>' : res + '<ATT_VALUE>2</ATT_VALUE>';
      res = res + '</item>'
    })
    res = res + '<item>' +
      '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
      '<ATT_NAME>EU_CONSUMER_MODEL</ATT_NAME>' +
      '<ATT_VALUE>' + payload.userType + '</ATT_VALUE>' +
      '</item>';
    res = res + '<item>' +
      '<ATT_SET>EU_CONSUMER_PRV</ATT_SET>' +
      '<ATT_NAME>THIRD_PARTY_CONTACT</ATT_NAME>' +
      '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
      '</item>';
    switch (payload.userType) {
      case "EPP":
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_EPP_TYPE</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_EPP_LINK</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_EPP_LINK_KEY</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        break;
      case "FF":
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_FF_LINK</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_FF_LINK_KEY</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        break;
      case "VIP":
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_COMPANY</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_COMPANY_CODE</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_ACCESS_CODE</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_LINK</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_LINK_KEY</ATT_NAME>' +
          '<ATT_VALUE>TBD</ATT_VALUE>' + // TBD
          '</item>';
        break;
    }
  } else {
    let brands = optinPerBrand[ctx.vtex.account];
    brands?.forEach(b => {
      res = res + '<item>' +
        '<ATT_SET>EU_CONSUMER_BRAND</ATT_SET>' +
        '<ATT_NAME>' + b + '</ATT_NAME>';
      res = payload.optinConsent != null ? res + '<ATT_VALUE>' + payload.optinConsent + '</ATT_VALUE>' : res + '<ATT_VALUE>2</ATT_VALUE>';
      res = res + '</item>'
    });
  }
  if (isValid(payload.campaign)) {
    let scpb = sourceCampaignPerBrand[ctx.vtex.account];
    scpb?.forEach(sc => {
      res = res + '<item>' +
        '<ATT_SET>EU_SOURCE_CAMPAIGN</ATT_SET>' +
        '<ATT_NAME>' + sc + '</ATT_NAME>';
      res = res + '<ATT_VALUE>' + payload.campaign + '</ATT_VALUE>';
      res = res + '</item>'
    });
  }
  res = res + "</CT_MKT_ATTRIB>";
  res = res + "</n0:Z_ES_CREACON_MYACC>";
  res = res + "</soap:Body>";
  res = res + "</soap:Envelope>";
  return res;
}

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
}

function formatPhoneNumber(ctx: Context, phone: any): any {
  if (ctx.vtex.account == "frwhirlpool" || ctx.vtex.account == "frwhirlpoolqa" || ctx.vtex.account == "frccwhirlpool" || ctx.vtex.account == "frccwhirlpoolqa") {
    phone = phone + "";
    if (phone.length <= 9) {
      phone = "0" + phone;
    } else {
      phone = "0" + phone.substr(phone.length - 9, phone.length);
    }
  }
  return phone;
}

export function getCommunity(userType: string): string {
  let community = "";
  if (isValidCC(userType)) {
    community = "CC";
  }
  else {
    community = "WHR";
  }
  return community;
}

function isValidCC(code: string): Boolean {
  if (isValid(code)) {
    if (code == "EPP" || code == "FF" || code == "VIP") {
      return true;
    }
  }
  return false;
}

export function getBrandAndCountry(ctx: Context) {
  let res = { brand: null, country: null }
  switch (ctx.vtex.account) {
    case "hotpointit":
      res.brand = "HP";
      res.country = "IT";
      break;
    case "hotpointitqa":
      res.brand = "HP";
      res.country = "IT";
      break;
    case "plwhirlpool":
      res.brand = "WHR";
      res.country = "PL";
      break;
    case "plwhirlpoolqa":
      res.brand = "WHR";
      res.country = "PL";
  }
  return res
}

function mapComplementSap(ctx: Context, open: boolean) {
  var field = ctx.vtex.account == 'plwhirlpool' || ctx.vtex.account == 'plwhirlpoolqa' ? "3" : "2";
  return open ? `<STREET${field}>` : `</STREET${field}>`
}

function mapComplementCrm(ctx: Context, open: boolean) {
  var field = ctx.vtex.account == 'plwhirlpool' || ctx.vtex.account == 'plwhirlpoolqa' ? "3" : "2";
  return open ? `<street${field}>` : `</street${field}>`
}

export async function getCCdataByUserId(ctx: Context, userId: string) {
  return await getObjFromVbase(ctx, CUSTOMERS_BUCKET, userId).catch(() => undefined) ??
    (await searchDocuments(ctx, "CC", ccFields, "vtexUserId=" + userId, { page: 1, pageSize: 1000 }, 0, true))[0];
}

export function stringify(data: any): string {
  return typeof data == "object" ? JSON.stringify(data, getCircularReplacer()) : data + "";
}

export function getCircularReplacer() {
  const seen = new WeakSet();
  return ({ }, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}