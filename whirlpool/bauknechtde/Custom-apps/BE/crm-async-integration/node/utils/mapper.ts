//@ts-nocheck

const shortUuid = require('short-uuid');
import { setTimeout } from "timers";
import { ADRecord, CLRecord, PARecord, CCRecord, DoubleOptin, DOIStatus, NewsletterSubscriptionData } from "../typings/types";
import { optinPerCommunity } from "./constants";
import { convertIso3Code, convertIso2Code } from "./ISOCountryConverter";

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

export function mapCLInfo(ctx: Context, userData: CLRecord): CCRecord {
  let optinInfo = formatOptin(userData.isNewsletterOptIn, userData.doubleOptinStatus, ctx.state.appSettings.doubleOptin);
  let customer: CCRecord = {
    webId: isValid(userData.webId) ? userData.webId : generateWebIdByAccountId(ctx),
    vtexUserId: userData.id,
    email: userData.email,
    locale: isValid(userData.localeDefault) ? formatLocale(userData.localeDefault) : getDefaultLocaleAndCountryByAccountId(ctx),
    country: getDefaultLocaleAndCountryByAccountId(ctx),  // calculated in this way because country is not a CL's field
    optinConsent: optinInfo.optin,
    firstName: isValid(userData.firstName) ? cutString(userData.firstName, 40) : null,
    lastName: isValid(userData.lastName) ? cutString(userData.lastName, 40) : null,
    gender: isValid(userData.gender) ? ((userData.gender.toLowerCase() == "male" || userData.gender.toLowerCase() == "female") ? formatGender(userData.gender) : null) : null,
    dateOfBirth: isValid(userData.birthDate) ? formatDate(userData.birthDate) : null,
    mobilePhone: isValid(userData.phone) ? formatPhoneNumber(ctx, userData.phone) : null,
    homePhone: isValid(userData.homePhone) ? formatPhoneNumber(ctx, userData.homePhone) : null,
    crmBpId: isValid(userData.crmBpId) ? userData.crmBpId : null,
    campaign: isValid(userData.campaign) ? userData.campaign : null,
    userType: isValid(userData.userType) ? userData.userType : null,
    partnerCode: isValid(userData.partnerCode) ? userData.partnerCode : null,
    doubleOptinStatus: optinInfo.DOIStatus
  }
  return customer;
}

export function mapADInfo(ctx: Context, userData: ADRecord): CCRecord {
  let customer: CCRecord = {
    addressId: userData.id,
    country: isValid(userData.country) ? formatCountry(userData.country) : getDefaultLocaleAndCountryByAccountId(ctx),
    street: isValid(userData.street) ? cutString(userData.street, 60) : null,
    number: isValid(userData.number) ? cutString(userData.number, 10) : null,
    complement: isValid(userData.complement) ? cutString(userData.complement, 40) : null,
    city: isValid(userData.city) ? cutString(userData.city, 40) : null,
    postalCode: isValid(userData.postalCode) ? cutString(userData.postalCode, 10) : null,
    state: isValid(userData.state) ? getStateByCountry(ctx, userData.state) : null
  };
  return customer;
}

export function mapCRMInfoToCC(ctx: Context, crmData: Object, userType: string | undefined): CCRecord {
  let address = crmData["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]["EsAddressData"];
  let customer = crmData["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]["EsNameData"];
  let optin = crmData["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]["EtMktAttrib"]["item"];
  let dbOpt = mapCRMOptin(ctx, optin, userType);
  let user: CCRecord = {
    email: address.EmailAddress,
    locale: customer.CorrLanguage,
    country: address.Country,
    optinConsent: dbOpt,
    firstName: isValid(customer.FirstName) ? customer.FirstName : null,
    lastName: isValid(customer.LastName) ? customer.LastName : null,
    gender: isValid(customer.TitleKey) ? customer.TitleKey : null,
    dateOfBirth: isValid(customer.DateOfBirth) ? customer.DateOfBirth + "" : null,
    mobilePhone: isValid(address.MobilePhone) ? address.MobilePhone + "" : null,
    homePhone: isValid(address.WorkPhone) ? address.WorkPhone + "" : null,
    street: isValid(address.Street1) ? address.Street1 : null,
    number: isValid(address.HouseNum) ? address.HouseNum + "" : null,
    complement: isValid(address.Street2) ? address.Street2 + "" : null,
    city: isValid(address.City) ? address.City : null,
    postalCode: isValid(address.PostCode) ? address.PostCode + "" : null,
    state: isValid(address.State) ? address.State : null,
    doubleOptinStatus: dbOpt=="1" ? DOIStatus.CONFIRMED : (dbOpt=="4" ? DOIStatus.PENDING : null)
  }
  return user;
}

export function mapSAPPOInfoToCC(ctx: Context, crmData: Object, userType: string | undefined): CCRecord {
  let address = crmData["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_DISPCON_MYACC.Response"]["ES_ADDRESS_DATA"];
  let customer = crmData["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_DISPCON_MYACC.Response"]["ES_NAME_DATA"];
  let optin = crmData["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_DISPCON_MYACC.Response"]["ET_MKT_ATTRIB"]["item"];
  let dbOpt = mapCRMOptin(ctx, optin, userType);
  let user: CCRecord = {
    email: address.EMAIL_ADDRESS,
    locale: customer.CORR_LANGUAGE,
    country: address.COUNTRY,
    optinConsent: dbOpt,
    firstName: isValid(customer.FIRST_NAME) ? customer.FIRST_NAME : null,
    lastName: isValid(customer.LAST_NAME) ? customer.LAST_NAME : null,
    gender: isValid(customer.TITLE_KEY) ? customer.TITLE_KEY : null,
    dateOfBirth: isValid(customer.DATE_OF_BIRTH) ? customer.DATE_OF_BIRTH + "" : null,
    mobilePhone: isValid(address.MOBILE_PHONE) ? address.MOBILE_PHONE + "" : null,
    homePhone: isValid(address.WORK_PHONE) ? address.WORK_PHONE + "" : null,
    street: isValid(address.STREET1) ? address.STREET1 : null,
    number: isValid(address.HOUSE_NUM) ? address.HOUSE_NUM + "" : null,
    complement: isValid(address.STREET2) ? address.STREET2 + "" : null,
    city: isValid(address.CITY) ? address.CITY : null,
    postalCode: isValid(address.POST_CODE) ? address.POST_CODE + "" : null,
    state: isValid(address.STATE) ? address.STATE : null,
    doubleOptinStatus: dbOpt=="1" ? DOIStatus.CONFIRMED : (dbOpt=="4" ? DOIStatus.PENDING : null)
  }
  return user;
}

export function CLInfoAreEqual(cl: CCRecord, cc: CCRecord): Boolean {
  let ret = true;
  for (let k of Object.keys(cl)) {
    if ((cl[k] + "").toLowerCase() != (cc[k] + "").toLowerCase() && k != "country") {
      ret = false;
    }
  }
  return ret;
}

export function ADInfoAreEqual(ad: CCRecord, cc: CCRecord): Boolean {
  let ret = true;
  for (let k of Object.keys(ad)) {
    if ((ad[k] + "").toLowerCase() != (cc[k] + "").toLowerCase()) {
      ret = false;
    }
  }
  return ret;
}

export function isAddressCreatedyTheBackflow(address: ADRecord): Boolean {
  return isValid(address.backflow) ? address.backflow : false;
}

export function CCInfoAreEqual(crm: CCRecord, cc: CCRecord): Boolean {
  let ret = true;
  for (let k of Object.keys(crm)) {
    if ((crm[k] + "").toLowerCase() != (cc[k] + "").toLowerCase()) {
      ret = false;
    }
  }
  return ret;
}

export function isValid(field: any): Boolean {
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "" && field != !"-" && field != "_";
}

export function formatGender(gender: string): string {
  return gender.toLowerCase() == "female" ? "0001" : "0002";
}

export function formatDate(dateString: string): string {
  let date = new Date(dateString);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return year + "" + month + "" + day;
}

export function getCurrentTime(ctx: Context): string {
  const [hour, minute, second] = new Date().toLocaleTimeString(ctx.state.appSettings.localTimeLocale, {
    timeZone: ctx.state.appSettings.localTimeZone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).split(':')
  return `${hour}${minute}${second}`;
}

export function formatOptin(optin: any, doubleOptinStatus: any, hasDoubleOptin: boolean): DoubleOptin {
  let ret: DoubleOptin = {
    optin: "2",
    DOIStatus: null
  }
  if(hasDoubleOptin){
    if((optin+"")=="true"){
      if(!isValid(doubleOptinStatus) || doubleOptinStatus==DOIStatus.PENDING){
        ret.optin = "4";
        ret.DOIStatus = DOIStatus.PENDING;
      }else{
        ret.DOIStatus = DOIStatus.CONFIRMED;
        ret.optin = "1";
      }
    }else{
      if(doubleOptinStatus==DOIStatus.PENDING){
        ret.optin = "4"
        ret.DOIStatus = doubleOptinStatus;
      }
    }
  }else{
    if((optin+"")=="true"){
      ret.optin = "1";
    }
  }
  return ret;
}

export function formatCountry(country: string): string {
  return convertIso3Code(country).iso2;
}

export function formatLocale(locale: string): string {
  return locale.split("-")[1];
}

export function generateWebIdByAccountId(ctx: Context): string {
  return ctx.state.appSettings.webIdPrefix + shortUuid.generate().substring(0, 15);
}

export function getDefaultLocaleAndCountryByAccountId(ctx: Context): string {
  return ctx.state.appSettings.defaultLocale;
}

export function getStateByCountry(ctx: Context, state: string): any {
  let states = ctx.state.appSettings.allowedStates?.split(",");
  states = states ? states : [];
  return states.includes(state) ? state : null;
}

export function getMostRecentAddress(addresses: ADRecord[]): ADRecord {
  let dates = [];
  addresses.forEach(a => {
    dates.push(a.lastInteractionIn);
  });
  dates.sort();
  let date = dates[dates.length - 1];
  return addresses.find(f => f.lastInteractionIn == date);
}

export function mapCRMOptin(ctx: Context, optin: [], userType: string|undefined): string {
  let optinFound = false;
  let ret = "2";
  let mktattributes = ctx.state.appSettings.attrOptin?.split(",");
  mktattributes = mktattributes ? mktattributes : [];
  if (!isValidCC(userType)) {
    for (let i = 0; i < mktattributes.length && !optinFound; i++) {
      if(ctx.state.appSettings.useSapPo){
        let opt = optin.find(f => f.ATT_NAME == mktattributes[i] && (f.ATT_VALUE.toLowerCase() == "allowed" || f.ATT_VALUE.toLowerCase() == "allowed to be confirmed"))?.ATT_VALUE;
        optinFound = opt ? true : false;
        ret = (opt?.toLowerCase() == "allowed") ? "1" : ((opt?.toLowerCase() == "allowed to be confirmed") ? "4" : "2");
      }else{
        let opt = optin.find(f => f.AttName == mktattributes[i] && (f.AttValue.toLowerCase() == "allowed" || f.AttValue.toLowerCase() == "allowed to be confirmed"))?.AttValue;
        optinFound = opt ? true : false;
        ret = (opt?.toLowerCase() == "allowed") ? "1" : ((opt?.toLowerCase() == "allowed to be confirmed") ? "4" : "2");
      }
    }
  } else {
    for (let i = 0; i < optinPerCommunity[userType].length && !optinFound; i++) {
      if(ctx.state.appSettings.useSapPo){
        let opt = optin.find(f => f.ATT_NAME == optinPerCommunity[userType][i] && (f.ATT_VALUE.toLowerCase() == "allowed" || f.ATT_VALUE.toLowerCase() == "allowed to be confirmed"))?.ATT_VALUE;
        optinFound = opt ? true : false;
        ret = (opt?.toLowerCase() == "allowed") ? "1" : ((opt?.toLowerCase() == "allowed to be confirmed") ? "4" : "2");
      }else{
        let opt = optin.find(f => f.AttName == optinPerCommunity[userType][i] && (f.AttValue.toLowerCase() == "allowed" || f.AttValue.toLowerCase() == "allowed to be confirmed"))?.AttValue;
        optinFound = opt ? true : false;
        ret = (opt?.toLowerCase() == "allowed") ? "1" : ((opt?.toLowerCase() == "allowed to be confirmed") ? "4" : "2");
      }
    }
  }
  return ret;
}

export function mapCCToCL(customer: CCRecord): CLRecord {
  let ret: CLRecord = {
    isNewsletterOptIn: formatOptinReverse(customer.optinConsent),
    firstName: isValid(customer.firstName) ? customer.firstName : null,
    lastName: isValid(customer.lastName) ? customer.lastName : null,
    gender: isValid(customer.gender) ? formatGenderReverse(customer.gender) : null,
    birthDate: isValid(customer.dateOfBirth) ? formatDateOfBirthReverse(customer.dateOfBirth) : null,
    localeDefault: isValid(customer.locale) ? formatLocaleReverse(customer.locale) : null,
    phone: isValid(customer.mobilePhone) ? customer.mobilePhone : null,
    homePhone: isValid(customer.homePhone) ? customer.homePhone : null,
    doubleOptinStatus: customer.doubleOptinStatus
  }
  if (isValid(customer.email)) {
    ret["email"] = customer.email;
  }
  return ret;
}

export function mapCCToAD(customer: CCRecord): ADRecord {
  let ret: ADRecord = {
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

export function formatOptinReverse(optin: string): boolean {
  return optin == "1" ? true : false;
}

export function formatCountryReverse(country: string): string {
  return convertIso2Code(country).iso3;
}

export function formatLocaleReverse(locale: string): string {
  return locale.toLowerCase() + "-" + locale;
}

export function json2XmlCRM(ctx: Context, payload: CCRecord, vipInfo?: PARecord): string {
  let res = '';
  res = res + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<soap:Body>' +
    '<n0:ZEsCreaconMyacc xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">';
  res = payload.crmBpId != null ? res + '<CrmBpId>' + payload.crmBpId + '</CrmBpId>' : res;
  res = payload.webId != null ? res + '<WebId>' + payload.webId + '</WebId>' : res;
  res = res + '<WebChgDate>' + formatDate(new Date().toISOString()) + '</WebChgDate>';
  res = res + '<WebChgTime>' + getCurrentTime(ctx) + '</WebChgTime>';
  res = res + '<CsAddressData>';
  res = payload.number != null ? res + '<HouseNum>' + payload.number + '</HouseNum>' : res;
  res = payload.street != null ? res + '<Street1>' + payload.street + '</Street1>' : res;
  res = payload.complement != null ? res + '<Street2>' + payload.complement + '</Street2>' : res;
  res = payload.city != null ? res + '<City>' + payload.city + '</City>' : res;
  res = payload.state != null ? res + '<State>' + payload.state + '</State>' : res;
  res = payload.country != null ? res + '<Country>' + payload.country + '</Country>' : res;
  res = payload.postalCode != null ? res + '<PostCode>' + payload.postalCode + '</PostCode>' : res;
  res = payload.email != null ? res + '<EmailAddress>' + payload.email + '</EmailAddress>' : res;
  res = payload.homePhone != null ? res + '<WorkPhone>' + payload.homePhone + '</WorkPhone>' : res;
  res = payload.mobilePhone != null ? res + '<MobilePhone>' + payload.mobilePhone + '</MobilePhone>' : res;
  res = res + "</CsAddressData>";
  res = res + "<CsNameData>";
  res = payload.crmBpId != null ? res + '<CrmBpId>' + payload.crmBpId + '</CrmBpId>' : res;
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
    /*res = res + '<item>' +
                  '<AttSet>EU_CONSUMER_PRV</AttSet>' +
                  '<AttName>THIRD_PARTY_CONTACT</AttName>'+
                  '<AttValue>TBD</AttValue>'+ // no information about how to evaluate the attribute
                '</item>';*/
    switch (payload.userType) {
      case "EPP":
        /*res = res + '<item>' +
                      '<AttSet>EU_CONSUMER_CC</AttSet>' +
                      '<AttName>EU_CONSUMER_EPP_TYPE</AttName>'+
                      '<AttValue>TBD</AttValue>'+ // no information about how to evaluate the attribute
                    '</item>';*/
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_EPP_LINK</AttName>' +
          '<AttValue>' + ctx.state.appSettings.eppLoginUrl + '</AttValue>' +
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_EPP_LINK_KEY</AttName>' +
          '<AttValue>' + payload.email + '</AttValue>' +
          '</item>';
        break;
      case "FF":
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_FF_LINK</AttName>' +
          '<AttValue>' + ctx.state.appSettings.ffLoginUrl + '</AttValue>' +
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_FF_LINK_KEY</AttName>' +
          '<AttValue>' + payload.email + '</AttValue>' +
          '</item>';
        break;
      case "VIP":
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_COMPANY</AttName>' +
          '<AttValue>' + vipInfo?.name + '</AttValue>' +
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_COMPANY_CODE</AttName>' +
          '<AttValue>' + vipInfo?.partnerCode + '</AttValue>' +
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_ACCESS_CODE</AttName>' +
          '<AttValue>' + vipInfo?.accessCode + '</AttValue>' +
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_LINK</AttName>' +
          '<AttValue>' + ctx.state.appSettings.vipLoginUrl + '</AttValue>' +
          '</item>';
        res = res + '<item>' +
          '<AttSet>EU_CONSUMER_CC</AttSet>' +
          '<AttName>EU_CONSUMER_VIP_LINK_KEY</AttName>' +
          '<AttValue>' + payload.email + '</AttValue>' +
          '</item>';
        break;
    }
  } else {
    let brands = ctx.state.appSettings.attrOptin?.split(",");
    brands = brands ? brands : [];
    brands?.forEach(b => {
      res = res + '<item>' +
        '<AttSet>EU_CONSUMER_BRAND</AttSet>' +
        '<AttName>' + b + '</AttName>';
      res = payload.optinConsent != null ? res + '<AttValue>' + payload.optinConsent + '</AttValue>' : res + '<AttValue>2</AttValue>';
      res = res + '</item>'
    });
  }
  if (isValid(payload.campaign)) {
    let scpb = ctx.state.appSettings.attrSourceCampaign?.split(",");
    scpb = scpb ? scpb :[];
    scpb?.forEach(sc => {
      res = res + '<item>' +
        '<AttSet>EU_SOURCE_CAMPAIGN</AttSet>' +
        '<AttName>' + sc + '</AttName>';
      res = res + '<AttValue>' + payload.campaign + '</AttValue>';
      res = res + '</item>'
    });
  }
  res = res + '</CtMktAttrib>';
  res = res + '</n0:ZEsCreaconMyacc>';
  res = res + '</soap:Body>';
  res = res + '</soap:Envelope>';
  return res;
}

export function json2XmlSAPPO(ctx: Context, payload: CCRecord, vipInfo?: PARecord): string {
  let res = '';
  res = res + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<soap:Body>' +
    '<n0:Z_ES_CREACON_MYACC xmlns:n0="urn:sap-com:document:sap:rfc:functions">';
  res = payload.crmBpId != null ? res + '<CRM_BP_ID>' + payload.crmBpId + '</CRM_BP_ID>' : res;
  res = payload.webId != null ? res + '<WEB_ID>' + payload.webId + '</WEB_ID>' : res;
  res = res + '<WEB_CHG_DATE>' + formatDate(new Date().toISOString()) + '</WEB_CHG_DATE>';
  res = res + '<WEB_CHG_TIME>' + getCurrentTime(ctx) + '</WEB_CHG_TIME>';
  res = res + '<CS_ADDRESS_DATA>';
  res = payload.number != null ? res + '<HOUSE_NUM>' + payload.number + '</HOUSE_NUM>' : res;
  res = payload.street != null ? res + '<STREET1>' + payload.street + '</STREET1>' : res;
  res = payload.complement != null ? res + '<STREET2>' + payload.complement + '</STREET2>' : res;
  res = payload.city != null ? res + '<CITY>' + payload.city + '</CITY>' : res;
  res = payload.state != null ? res + '<STATE>' + payload.state + '</STATE>' : res;
  res = payload.country != null ? res + '<COUNTRY>' + payload.country + '</COUNTRY>' : res;
  res = payload.postalCode != null ? res + '<POST_CODE>' + payload.postalCode + '</POST_CODE>' : res;
  res = payload.email != null ? res + '<EMAIL_ADDRESS>' + payload.email + '</EMAIL_ADDRESS>' : res;
  res = payload.homePhone != null ? res + '<WORK_PHONE>' + payload.homePhone + '</WORK_PHONE>' : res;
  res = payload.mobilePhone != null ? res + '<MOBILE_PHONE>' + payload.mobilePhone + '</MOBILE_PHONE>' : res;
  res = res + "</CS_ADDRESS_DATA>";
  res = res + "<CS_NAME_DATA>";
  res = payload.crmBpId != null ? res + '<CRM_BP_ID>' + payload.crmBpId + '</CRM_BP_ID>' : res;
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
    /*res = res + '<item>' +
                  '<ATT_SET>EU_CONSUMER_PRV</ATT_SET>' +
                  '<ATT_NAME>THIRD_PARTY_CONTACT</ATT_NAME>'+
                  '<ATT_VALUE>TBD</ATT_VALUE>'+ // no information about how to evaluate the attribute
                '</item>';*/
    switch (payload.userType) {
      case "EPP":
        /*res = res + '<item>' +
                      '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
                      '<ATT_NAME>EU_CONSUMER_EPP_TYPE</ATT_NAME>'+
                      '<ATT_VALUE>TBD</ATT_VALUE>'+ // no information about how to evaluate the attribute
                    '</item>';*/
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_EPP_LINK</ATT_NAME>' +
          '<ATT_VALUE>' + ctx.state.appSettings.eppLoginUrl + '</ATT_VALUE>' +
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_EPP_LINK_KEY</ATT_NAME>' +
          '<ATT_VALUE>' + payload.email + '</ATT_VALUE>' +
          '</item>';
        break;
      case "FF":
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_FF_LINK</ATT_NAME>' +
          '<ATT_VALUE>' + ctx.state.appSettings.ffLoginUrl + '</ATT_VALUE>' +
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_FF_LINK_KEY</ATT_NAME>' +
          '<ATT_VALUE>' + payload.email + '</ATT_VALUE>' +
          '</item>';
        break;
      case "VIP":
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_COMPANY</ATT_NAME>' +
          '<ATT_VALUE>' + vipInfo?.name + '</ATT_VALUE>' +
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_COMPANY_CODE</ATT_NAME>' +
          '<ATT_VALUE>' + vipInfo?.partnerCode + '</ATT_VALUE>' +
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_ACCESS_CODE</ATT_NAME>' +
          '<ATT_VALUE>' + vipInfo?.accessCode + '</ATT_VALUE>' +
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_LINK</ATT_NAME>' +
          '<ATT_VALUE>' + ctx.state.appSettings.vipLoginUrl + '</ATT_VALUE>' +
          '</item>';
        res = res + '<item>' +
          '<ATT_SET>EU_CONSUMER_CC</ATT_SET>' +
          '<ATT_NAME>EU_CONSUMER_VIP_LINK_KEY</ATT_NAME>' +
          '<ATT_VALUE>' + payload.email + '</ATT_VALUE>' +
          '</item>';
        break;
    }
  } else {
    let brands = ctx.state.appSettings.attrOptin?.split(",");
    brands = brands ? brands : [];
    brands?.forEach(b => {
      res = res + '<item>' +
        '<ATT_SET>EU_CONSUMER_BRAND</ATT_SET>' +
        '<ATT_NAME>' + b + '</ATT_NAME>';
      res = payload.optinConsent != null ? res + '<ATT_VALUE>' + payload.optinConsent + '</ATT_VALUE>' : res + '<ATT_VALUE>2</ATT_VALUE>';
      res = res + '</item>'
    });
  }
  if (isValid(payload.campaign)) {
    let scpb = ctx.state.appSettings.attrSourceCampaign?.split(",");
    scpb = scpb ? scpb : [];
    scpb?.forEach(sc => {
      res = res + '<item>' +
        '<ATT_SET>EU_SOURCE_CAMPAIGN</ATT_SET>' +
        '<ATT_NAME>' + sc + '</ATT_NAME>';
      res = res + '<ATT_VALUE>' + payload.campaign + '</ATT_VALUE>';
      res = res + '</item>'
    });
  }
  res = res + '</CT_MKT_ATTRIB>';
  res = res + '</n0:Z_ES_CREACON_MYACC>';
  res = res + '</soap:Body>';
  res = res + '</soap:Envelope>';
  return res;
}

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
}

function formatPhoneNumber(ctx: Context, phone: any): string {
  let limit = ctx.state.appSettings.maxNumOfDigitsForPhone;
  if (isValid(limit)) {
    if (phone.length <= limit) {
      phone = "0" + phone;
    } else {
      phone = "0" + phone.substr(phone.length - limit, phone.length);
    }
  }
  return phone;
}

function isValidCC(code: string): Boolean {
  if (isValid(code)) {
    if (code == "EPP" || code == "FF" || code == "VIP") {
      return true;
    }
  }
  return false;
}

export function routeToLabel(ctx: Context /*| LoggedUser | NewsletterSubscriptionData*/): string {
  let label = "Unknown event: ";
  switch (ctx.vtex.route.id) {
    case "notificationHandler":
      label = "Notification handler: ";
      break;
    case "setCrmBpId":
      label = "Set up crmBpId: ";
      break;
    case "getUserDataFromVtex":
      label = "Get user from Vtex: ";
      break;
    case "getUserDataFromCRM":
      label = "Get user from CRM: ";
      break;
    case "eppExportHandler":
      label = "Epp export handler: ";
      break;
  }
  if(isValid(ctx.body?.eventId)){
    label = ctx.body.eventId;
  }
  if(isValid(ctx.vtex.eventInfo?.sender)){
    label = "Guest user registration: ";
  }
  return label;
}

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return ({}, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export function stringify(data: any): string {
  return typeof data == "object" ? JSON.stringify(data, getCircularReplacer()) : data+"";
}
