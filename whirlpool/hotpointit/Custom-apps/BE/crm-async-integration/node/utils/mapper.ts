//@ts-nocheck

const shortUuid = require('short-uuid');
const taxonomies = require('./taxonomies.it_IT.json')
import { ACCOUNT } from "@vtex/api";
import { resolve, resolveMx } from "dns";
import { reject } from "ramda";
import { setTimeout } from "timers";
import { optinPerCountry, statesPerCountry, crmTag, brandCode, sourceCampaignPerCountry } from './constants';
import { convertIso3Code, convertIso2Code } from "./ISOCountryConverter";
import { taxonomies } from "./taxonomies";

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
  //console.log(userData)
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
    mobilePhone: isValid(userData.phone) ? formatPhoneNumber(userData.phone) : null,
    homePhone: isValid(userData.homePhone) ? formatPhoneNumber(userData.homePhone) : null,
    //businessPhone: isValid(userData.businessPhone)?userData.businessPhone:null,
    crmBpId: isValid(userData.crmBpId) ? userData.crmBpId : null,
    campaign: isValid(userData.campaign) ? userData.campaign : null
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

/**
 * Map CRM info returned from SAP WSD and map it
 * @param ctx context (for account name)
 * @param crmData xml payload from CRM
 * @returns user data mapped
 */
export function mapCRMInfoToCC(ctx: Context, crmData: Object): Object {
  let address = crmData["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]["EsAddressData"];
  let customer = crmData["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]["EsNameData"];
  let optin = crmData["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]["EtMktAttrib"]["item"];
  let user = {
    email: address.EmailAddress,
    locale: customer.CorrLanguage,
    country: address.Country,
    optinConsent: mapCRMOptin(ctx, optin),
    firstName: isValid(customer.FirstName) ? customer.FirstName : null,
    lastName: isValid(customer.LastName) ? customer.LastName : null,
    gender: isValid(customer.TitleKey) ?/*mapCRMGender(customer.TitleKey)*/customer.TitleKey : null,
    dateOfBirth: isValid(customer.DateOfBirth) ? customer.DateOfBirth + "" : null,
    mobilePhone: isValid(address.MobilePhone) ? address.MobilePhone + "" : null,
    //homePhone: isValid(address.HousePhone)?address.HousePhone+"":null,
    //businessPhone: isValid(address.WorkPhone)?address.WorkPhone+"":null,
    homePhone: isValid(address.WorkPhone) ? address.WorkPhone + "" : null,
    street: isValid(address.Street1) ? address.Street1 : null,
    number: isValid(address.HouseNum) ? address.HouseNum + "" : null,
    complement: isValid(address.Street2) ? address.Street2 + "" : null,
    city: isValid(address.City) ? address.City : null,
    postalCode: isValid(address.PostCode) ? address.PostCode + "" : null,
    state: isValid(address.State) ?/*mapCRMState(address.State)*/address.State : null
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
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "‎" && field != !"-" && field != "_";
}

export function formatGender(gender: string): string {
  return (gender.toLowerCase() == "female" || gender.toLowerCase() == "sig.ra") ? "0001" : "0002";
}

export function formatDateOfBirth(dateOfBirth: string): string {
  let birthDate = new Date(dateOfBirth);
  let year = birthDate.getFullYear();
  let month = (birthDate.getMonth() + 1) < 10 ? "0" + (birthDate.getMonth() + 1) : (birthDate.getMonth() + 1);
  let day = birthDate.getDate() < 10 ? "0" + birthDate.getDate() : birthDate.getDate();
  return year + "" + month + "" + day;
}

/**
 * Formate a date with a given separator and a given format
 * @param date date in string format
 * @param separator separator used (eg: /)
 * @param format expected format
 * @returns string date in the expected format
 */
export function formatDate(date: string, separator: string, format: string): string {
  let component = date.split(separator);
  switch (format) {
    case 'YYYYMMDD':
      return component[2] + component[1] + component[0]
  }
}

export function formatCRMDate(stringDate: string): string {
  let date = new Date(stringDate);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return year + "" + month + "" + day;
}

function formatLocaleZone(): [string, string] {
  switch (ACCOUNT) {
    case "frwhirlpool":
    case "frwhirlpoolqa":
    case "frccwhirlpool":
    case "frccwhirlpoolqa": return ["fr-FR", "Europe/Paris"]

    case "hotpointuk":
    case "hotpointukqa": return ["uk-UK", "Europe/London"]

    case "ruwhirlpool":
    case "ruwhirlpoolqa": return ["ru-RU", "Europe/Moscow"]

    case "itwhirlpool":
    case "itwhirlpoolqa":
    case "hotpointit":
    case "hotpointitqa":
    default: return ["it-IT", "Europe/Rome"]
  }
}

export function formatTime(): string {
  const [locale, timeZone] = formatLocaleZone()
  const [hour, minute, second] = new Date().toLocaleTimeString(locale, {
    timeZone: timeZone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).split(':')

  return `${hour}${minute}${second}`;
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
    case "itwhirlpool":
      res = "D2CIT" + shortUuid.generate().substring(0, 15);
      break;
    case "itwhirlpoolqa":
      res = "D2CIT" + shortUuid.generate().substring(0, 15);
      break;
    case "hotpointit":
      res = "D2CIT" + shortUuid.generate().substring(0, 15);
      break;
    case "hotpointitqa":
      res = "D2CIT" + shortUuid.generate().substring(0, 15);
      break;
    case "ruwhirlpool":
      res = "D2CRU" + shortUuid.generate().substring(0, 15);
      break;
    case "ruwhirlpoolqa":
      res = "D2CRU" + shortUuid.generate().substring(0, 15);
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
    case "itwhirlpool":
      res = "IT";
      break;
    case "itwhirlpoolqa":
      res = "IT";
      break;
    case "hotpointit":
      res = "IT";
      break;
    case "hotpointitqa":
      res = "IT";
      break;
    case "ruwhirlpool":
      res = "RU";
      break;
    case "ruwhirlpoolqa":
      res = "RU";
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

export function mapCRMOptin(ctx: Context, optin: []): string {
  let optinFound = false;
  let ret = "2";
  for (let i = 0; i < optinPerCountry[ctx.vtex.account].length && !optinFound; i++) {
    if (optin.find(f => f.AttName == optinPerCountry[ctx.vtex.account][i] && f.AttValue.toLowerCase() == "allowed") != undefined) {
      optinFound = true;
      ret = "1";
    }
  }
  return ret;
}


/*export function mapCRMGender(gender: number): string{
  return gender<10?"000"+gender:"00"+gender;
}*/

/*export function mapCRMState(state: number): string{
  return state<10?"0"+state:state+"";
}*/

export function mapCCToCL(customer: Object): Object {
  let ret = {
    isNewsletterOptIn: isValid(customer.optinConsent) ? formatOptinReverse(customer.optinConsent) : false,
    firstName: isValid(customer.firstName) ? customer.firstName : null,
    lastName: isValid(customer.lastName) ? customer.lastName : null,
    gender: isValid(customer.gender) ? formatGenderReverse(customer.gender) : null,
    birthDate: isValid(customer.dateOfBirth) ? formatDateOfBirthReverse(customer.dateOfBirth) : null,
    localeDefault: isValid(customer.locale) ? formatLocaleReverse(customer.locale) : null,
    phone: isValid(customer.mobilePhone) ? customer.mobilePhone : null,
    homePhone: isValid(customer.homePhone) ? customer.homePhone : null,
    campaign: isValid(customer.campaign) ? customer.campaign : null
    //businessPhone: isValid(customer.businessPhone)?customer.businessPhone:null
  }
  if (isValid(customer.email)) {
    ret["email"] = customer.email;
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

/**
 * Convert Json to Xml format for SAP schemas
 * @param ctx context
 * @param payload input payload in json format
 * @returns output payload in xml format
 */
export function json2Xml(ctx: Context, payload: Object): string {
  let res = '';
  res = res + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<soap:Body>' +
    '<n0:ZEsCreaconMyacc xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">';
  res = payload.webId != null ? res + '<WebId>' + payload.webId + '</WebId>' : res;
  res = payload.crmBpId != null ? res + '<CrmBpId>' + payload.crmBpId + '</CrmBpId>' : res;
  res = res + "<CsAddressData>";
  res = payload.number != null ? res + '<HouseNum>' + payload.number + '</HouseNum>' : res;
  res = payload.street != null ? res + '<Street1>' + payload.street + '</Street1>' : res;
  res = payload.complement != null ? res + '<Street2>' + payload.complement + '</Street2>' : res;
  res = res + "<Street3/>";
  res = payload.city != null ? res + '<City>' + payload.city + '</City>' : res;
  res = res + "<District/>";
  res = payload.state != null ? res + '<State>' + payload.state + '</State>' : res;
  res = payload.country != null ? res + '<Country>' + payload.country + '</Country>' : res;
  res = payload.postalCode != null ? res + '<PostCode>' + payload.postalCode + '</PostCode>' : res;
  res = payload.email != null ? res + '<EmailAddress>' + payload.email + '</EmailAddress>' : res;
  res = res + "<HousePhone/>";
  //res = payload.homePhone!=null? res+'<HousePhone>'+payload.homePhone+'</HousePhone>': res;
  //res = payload.businessPhone!=null?res+'<WorkPhone>'+payload.businessPhone+'</WorkPhone>':res;
  res = payload.homePhone != null ? res + '<WorkPhone>' + payload.homePhone + '</WorkPhone>' : res;
  res = payload.mobilePhone != null ? res + '<MobilePhone>' + payload.mobilePhone + '</MobilePhone>' : res;
  res = res + "</CsAddressData>";
  res = res + "<CsNameData>";
  res = payload.crmBpId != null ? res + '<CrmBpId>' + payload.crmBpId + '</CrmBpId>' : res;
  res = payload.gender != null ? res + '<TitleKey>' + payload.gender + '</TitleKey>' : res;
  res = payload.firstName != null ? res + '<FirstName>' + payload.firstName + '</FirstName>' : res;
  res = res + "<MiddleName/>";
  res = payload.lastName != null ? res + '<LastName>' + payload.lastName + '</LastName>' : res;
  res = payload.dateOfBirth != null ? res + '<DateOfBirth>' + payload.dateOfBirth + '</DateOfBirth>' : res;
  res = payload.locale != null ? res + '<CorrLanguage>' + payload.locale + '</CorrLanguage>' : res;
  res = res + "<Contactable/>";
  res = res + "<CreateDate/>";
  res = res + "<CreateTime/>";
  res = res + "<LastChangeDate/>";
  res = res + "<LastChangeTime/>";
  res = res + "<Vip/>";
  res = res + "</CsNameData>";
  res = res + "<CtMktAttrib>";
  let account = ctx.vtex.account;
  let brands = optinPerCountry[account];
  brands.forEach(b => {
    res = res + '<item>' +
      '<AttSet>EU_CONSUMER_BRAND</AttSet>' +
      '<AttName>' + b + '</AttName>';
    res = payload.optinConsent != null ? res + '<AttValue>' + payload.optinConsent + '</AttValue>' : res + '<AttValue>2</AttValue>';
    res = res + '</item>'
  });
  let sourceCampaign = sourceCampaignPerCountry[account];
  res = res + '<item>' +
    '<AttSet>EU_SOURCE_CAMPAIGN</AttSet>' +
    '<AttName>' + sourceCampaign + '</AttName>';
  res = payload.campaign != null ? res + '<AttValue>' + payload.campaign.toUpperCase() + '</AttValue>' : res + '<AttValue/>';
  res = res + '</item>'
  res = res + "</CtMktAttrib>";
  res = res + "<WebChgDate>" + formatCRMDate(new Date().toDateString()) + "</WebChgDate>";
  res = res + "<WebChgTime>" + formatTime() + "</WebChgTime>";
  res = res + "<WebCrtDate/>";
  res = res + "<WebCrtTime/>";
  res = res + "</n0:ZEsCreaconMyacc>";
  res = res + "</soap:Body>";
  res = res + "</soap:Envelope>";
  return res;
}


/**
 * Map json response to xml for /assistenza/registrazione-prodotti form
 * @param ctx context (account name)
 * @param payload json payload to trasform
 * @returns xml payload transformed
 */
export function json2Xml3YCheckup(ctx: Context, payload: Checkup3Year): string {
  let appliance_data = payload.appliance_data;
  let person_data = payload.person_data;
  let address_data = payload.address_data;
  let mkt_data = payload.mkt_data;
  let res = '';
  res = res + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<soap:Body>' +
    '<n0:ZEsPrdRegistration xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">';

  res = res + crmTag.CT_APPLIANCE_DATA_OPEN;
  for (var item of appliance_data) {
    res = res + crmTag.ITEM_OPEN;
    res = item.product_id != ""
      ? res + crmTag.PRODUCT_ID_OPEN + item.product_id + crmTag.PRODUCT_ID_CLOSE
      : res;
    res = item.purchase_date != ""
      ? res + crmTag.CRM_PURCHASE_DATE_OPEN + formatDate(item.purchase_date, '/', 'YYYYMMDD') + crmTag.CRM_PURCHASE_DATE_CLOSE
      : res;
    res = item.product_id != ""
      ? res + crmTag.REF_PRODUCT_OPEN + item.product_id + crmTag.REF_PRODUCT_CLOSE
      : res;
    res = res + crmTag.ZZ0010_OPEN + brandCode[ctx.vtex.account] + crmTag.ZZ0010_CLOSE;
    res = res + crmTag.ZZ0011_OPEN
      + taxonomies[0]['children'].filter(function (child) { return child.id == item.category })[0].sap.productFamily
      + crmTag.ZZ0011_CLOSE;
    res = res + crmTag.ZZ0012_OPEN
      + taxonomies[0]['children'].filter(function (child) { return child.id == item.category })[0].sap.mag
      + crmTag.ZZ0012_CLOSE;
    res = item.commercial_code != ""
      ? res + crmTag.ZZ0013_OPEN + item.commercial_code + crmTag.ZZ0013_CLOSE
      : res;
    res = item.register != ""
      ? res + crmTag.ZZ0014_OPEN + item.register + crmTag.ZZ0014_CLOSE
      : res;
    res = res + crmTag.ZZ0018_OPEN + 'EUR' + crmTag.ZZ0018_CLOSE;
    res = res + crmTag.ZZ0019_OPEN + '' + crmTag.ZZ0019_CLOSE;
    res = res + crmTag.ZZ0020_OPEN + 'OREG' + crmTag.ZZ0020_CLOSE;
    res = res + crmTag.ITEM_CLOSE;
  }
  res = res + crmTag.CT_APPLIANCE_DATA_CLOSE;

  res = res + crmTag.CS_PERSON_DATA_OPEN;
  res = res + crmTag.CONTACTALLOWANCE_OPEN + '3' + crmTag.CONTACTALLOWANCE_CLOSE;
  res = res + crmTag.DATAORINGTYPE_OPEN + 'OREG' + crmTag.DATAORINGTYPE_CLOSE;
  res = person_data.firstname != ""
    ? res + crmTag.FIRSTNAME_OPEN + cutString(person_data.firstname, 40).trim() + crmTag.FIRSTNAME_CLOSE
    : res;
  res = person_data.lastname != ""
    ? res + crmTag.LASTNAME_OPEN + cutString(person_data.lastname, 40).trim() + crmTag.LASTNAME_CLOSE
    : res;
  res = res + crmTag.PARTNERLANGUAGE_OPEN + 'IT' + crmTag.PARTNERLANGUAGE_CLOSE;
  res = person_data.title_key != ""
    ? res + crmTag.TITLE_KEY_OPEN + formatGender(person_data.title_key) + crmTag.TITLE_KEY_CLOSE
    : res;
  res = res + crmTag.CS_PERSON_DATA_CLOSE;

  res = res + crmTag.CS_ADDRESS_DATA_OPEN;
  res = res + crmTag.COUNTRY_OPEN + 'IT' + crmTag.COUNTRY_CLOSE;
  res = address_data.email != ""
    ? res + crmTag.E_MAIL_OPEN + address_data.email + crmTag.E_MAIL_CLOSE
    : res;
  res = address_data.street != ""
    ? res + crmTag.STREET_OPEN + cutString(address_data.street, 60).trim() + crmTag.STREET_CLOSE
    : res;
  res = address_data.street_int != ""
    ? res + crmTag.STR_SUPPL1_OPEN + cutString(address_data.street_int, 40).trim() + crmTag.STR_SUPPL1_CLOSE
    : res;
  res = address_data.cap != ""
    ? res + crmTag.POSTL_COD1_OPEN + address_data.cap + crmTag.POSTL_COD1_CLOSE
    : res;
  res = address_data.city != ""
    ? res + crmTag.CITY_OPEN + cutString(address_data.city, 40).trim() + crmTag.CITY_CLOSE
    : res;
  res = address_data.province != ""
    ? res + crmTag.CITY2_OPEN + address_data.province + crmTag.CITY2_CLOSE
    : res;
  res = address_data.telephone != ""
    ? res + crmTag.TELEPHONE_OPEN + address_data.telephone + crmTag.TELEPHONE_CLOSE
    : res;
  res = res + crmTag.CS_ADDRESS_DATA_CLOSE;

  res = res + crmTag.IS_OTHER_DATA_OPEN;
  res = res + crmTag.OTHER_INFO_OPEN + '3YCHECKUP' + crmTag.OTHER_INFO_CLOSE;
  res = res + crmTag.IS_OTHER_DATA_CLOSE;

  res = res + crmTag.CT_MKT_DATA_OPEN;
  res = res + crmTag.ITEM_OPEN;
  res = res + crmTag.ATT_SET_OPEN + 'EU_CONSUMER_BRAND' + crmTag.ATT_SET_CLOSE;
  res = res + crmTag.ATT_NAME_OPEN + optinPerCountry[ctx.vtex.account] + crmTag.ATT_NAME_CLOSE;
  res = res + crmTag.ATT_VALUE_OPEN + mkt_data.eu_consumer_brand + crmTag.ATT_VALUE_CLOSE;
  res = res + crmTag.ITEM_CLOSE;
  res = res + crmTag.ITEM_OPEN;
  res = res + crmTag.ATT_SET_OPEN + 'EU_CONSUMER_PRV' + crmTag.ATT_SET_CLOSE;
  res = res + crmTag.ATT_NAME_OPEN + 'THIRD_PARTY_CONTACT' + crmTag.ATT_NAME_CLOSE;
  res = res + crmTag.ATT_VALUE_OPEN + mkt_data.eu_consumer_prv + crmTag.ATT_VALUE_CLOSE;
  res = res + crmTag.ITEM_CLOSE;

  if (mkt_data.eu_consumer_age != "") {
    res = res + crmTag.ITEM_OPEN;
    res = res + crmTag.ATT_SET_OPEN + 'EU_CU_SEGMENTATION' + crmTag.ATT_SET_CLOSE;
    res = res + crmTag.ATT_NAME_OPEN + 'EU_CONSUMER_AGE' + crmTag.ATT_NAME_CLOSE;
    res = res + crmTag.ATT_VALUE_OPEN + mkt_data.eu_consumer_age + crmTag.ATT_VALUE_CLOSE;
    res = res + crmTag.ITEM_CLOSE;
  }

  if (mkt_data.eu_cu_segmentation != "") {
    res = res + crmTag.ITEM_OPEN;
    res = res + crmTag.ATT_SET_OPEN + 'EU_CU_SEGMENTATION' + crmTag.ATT_SET_CLOSE;
    res = res + crmTag.ATT_NAME_OPEN + 'EU_IT_JOBS' + crmTag.ATT_NAME_CLOSE;
    res = res + crmTag.ATT_VALUE_OPEN + mkt_data.eu_cu_segmentation + crmTag.ATT_VALUE_CLOSE;
    res = res + crmTag.ITEM_CLOSE;
  }
  res = res + crmTag.CT_MKT_DATA_CLOSE;

  res = res + "</n0:ZEsPrdRegistration>";
  res = res + "</soap:Body>";
  res = res + "</soap:Envelope>";
  //console.log(res)
  return res;
}

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
}

function formatPhoneNumber(phone: any): any {
  phone = phone + "";
  if (phone.length <= 9) {
    return "0" + phone;
  }
  return "0" + phone.substr(phone.length - 9, phone.length);
}
