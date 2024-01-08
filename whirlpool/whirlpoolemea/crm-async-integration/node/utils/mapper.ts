
const shortUuid = require('short-uuid');
import { AttName, AttSet, CharSize, GenderCRM, OptinCRMQuery, OptinCRMReq, PayloadType } from "../typings/crm/common";
import { CreateConsumerCRM, CreateConsumerCRM_Response, DisplayConsumerCRM, DisplayConsumerCRM_Response, EtReturnCRM, MKTAttrCRM, ProductRegistrationCRM } from "../typings/crm/CRM";
import { CreateConsumerPO, DisplayConsumerPO, DisplayConsumerPO_Response, CreateConsumerPO_Response, EtReturnPO, MKTAttrPO, ProductRegistrationPO } from "../typings/crm/SAPPO";
import { CreateConsumerUK, CreateConsumerUK_Response } from "../typings/crm/UK";
import { ADRecord, CCRecord, CLRecord, DOIStatus, DoubleOptin, Gender, MDNotification, PARecord, TradePolicy, OptinProfiling } from "../typings/md";
import { NewsletterSubscriptionData } from "../typings/NL";
import { ProductRegistrationReq } from "../typings/ProductRegistration";
import { getTradePolicyById, isValid, normalizeAndCutString, removeUndefinedProperties, stringify, valueOrUndefined } from "./commons";
import { convertIso3Code, convertIso2Code } from "./ISOCountryConverter";

function formatGender(gender: any): string | null {
  gender = gender?.toLowerCase();
  return isValid(gender) ?
    (
      gender == Gender.MALE ?
        GenderCRM.MALE :
        (
          gender == Gender.FEMALE ?
            GenderCRM.FEMALE :
            null
        )
    ) :
    null;
}

function formatDate(dateString: any): string | null {
  dateString = isValid(dateString) ? dateString?.split("T")[0]?.split("-")?.join("") : null;
  return dateString;
}

function formatOptin(optin: any, doubleOptinStatus: any, hasDoubleOptin: boolean, profilingOptin: any, hasProfilingOptin: boolean): DoubleOptin {
  let ret: DoubleOptin = {
    optin: OptinCRMReq.DENIED,
    profilingOptin: null,
    DOIStatus: null
  }
  if (hasDoubleOptin) {
    if ((optin + "") == "true") {
      if (!isValid(doubleOptinStatus) || doubleOptinStatus == DOIStatus.PENDING) {
        ret.optin = OptinCRMReq.PENDING;
        ret.DOIStatus = DOIStatus.PENDING;
      } else {
        ret.DOIStatus = DOIStatus.CONFIRMED;
        ret.optin = OptinCRMReq.CONFIRMED;
      }
    } else {
      if (doubleOptinStatus == DOIStatus.PENDING) {
        ret.optin = OptinCRMReq.PENDING
        ret.DOIStatus = doubleOptinStatus;
      }
    }
  } else {
    if ((optin + "") == "true") {
      ret.optin = OptinCRMReq.CONFIRMED;
    }

    if (hasProfilingOptin) {
      if ((optin + "") == "true" && (profilingOptin + "") == "true") {// profiling can be true only if optin true
        ret.profilingOptin = OptinCRMReq.CONFIRMED;
      } else {
        ret.profilingOptin = OptinCRMReq.DENIED;
      }
    }
  }
  return ret;
}

function formatCountry(country: any, defaultCountry: string): string {
  try {
    country = isValid(country) ? country : defaultCountry;
    country = country.length > 2 ? convertIso3Code(country).iso2 : country;
    return country;
  } catch (err) {
    return defaultCountry;
  }
}

function formatLocale(locale: any, defaultLocale: string): string {
  locale = isValid(locale) ? locale : null;
  return locale ? locale.split("-")[0]?.toUpperCase() : defaultLocale;
}

function generateWebId(ctx: Context | OrderEvent | NewsletterSubscription, webId: any): string {
  const prefixLength = ctx.state.appSettings.webIdPrefix.length;
  return isValid(webId) ? webId : ctx.state.appSettings.webIdPrefix + shortUuid.generate().substring(0, (ctx.state.appSettings.maxNumOfCharForWebId - prefixLength));
}

function getStateByCountry(ctx: Context | OrderEvent | NewsletterSubscription, state: any): string | null {
  let states = ctx.state.appSettings.allowedStates?.split(",") ?? [];
  return isValid(state) && states.includes(state) ? state : null;
}

function formatPhoneNumber(ctx: Context | OrderEvent | NewsletterSubscription, phone: any): string | null {
  phone = isValid(phone) ? phone : null;
  let limit = ctx.state.appSettings.maxNumOfDigitsForPhone;
  if (phone && limit) {
    if (phone.length > limit) {
      phone = phone.substr(phone.length - limit, phone.length);
    }
  }
  return phone;
}

export function mapCLInfo(ctx: Context | OrderEvent | NewsletterSubscription, userData: CLRecord | NewsletterSubscriptionData): CCRecord {
  let optinInfo = formatOptin(userData.isNewsletterOptIn, userData.doubleOptinStatus, ctx.state.appSettings.doubleOptin, userData.isProfilingOptIn, ctx.state.appSettings.profilingOptin);
  let customer: CCRecord = {
    webId: generateWebId(ctx, userData.webId),
    vtexUserId: userData.id,
    email: userData.email,
    locale: formatLocale(userData.localeDefault, ctx.state.appSettings.defaultLocale),
    optinConsent: optinInfo.optin,
    profilingConsent: optinInfo.profilingOptin,
    firstName: normalizeAndCutString(userData.firstName, CharSize.char40, true),
    lastName: normalizeAndCutString(userData.lastName, CharSize.char40, true),
    gender: formatGender(userData.gender),
    dateOfBirth: formatDate(userData.birthDate),
    mobilePhone: formatPhoneNumber(ctx, userData.phone),
    homePhone: formatPhoneNumber(ctx, userData.homePhone),
    crmBpId: normalizeAndCutString(userData.crmBpId),
    campaign: normalizeAndCutString(userData.campaign, CharSize.char150),
    userType: normalizeAndCutString(userData.userType),
    partnerCode: normalizeAndCutString(userData.partnerCode),
    doubleOptinStatus: optinInfo.DOIStatus
  }
  if (userData.notification == MDNotification.USER_CREATED || (ctx as NewsletterSubscription).body?.eventId) {
    customer.country = ctx.state.appSettings.defaultCountry;  // calculated in this way because country is not a CL's field
  }
  return customer;
}

export function mapADInfo(ctx: Context | OrderEvent | NewsletterSubscription, userData: ADRecord): CCRecord {
  let customer: CCRecord = {
    addressId: userData.id,
    country: formatCountry(userData.country, ctx.state.appSettings.defaultCountry),
    street: normalizeAndCutString(userData.street, CharSize.char60, true),
    number: normalizeAndCutString(userData.number, CharSize.char10, true),
    complement: normalizeAndCutString(userData.complement, CharSize.char40, true),
    city: normalizeAndCutString(userData.city, CharSize.char40),
    postalCode: normalizeAndCutString(userData.postalCode, CharSize.char10),
    state: getStateByCountry(ctx, userData.state)
  };
  return customer;
}

export function CLInfoAreEqual(cl: any, cc: any): boolean {
  let ret = true;
  let ccKyes = Object.keys(cc);
  for (let k of Object.keys(cl)) {
    if (k != "country" && ccKyes.includes(k) && (cl[k] + "").toLowerCase() != (cc[k] + "").toLowerCase()) {
      ret = false;
    }
  }
  return ret;
}

export function ADInfoAreEqual(ad: any, cc: any): boolean {
  let ret = true;
  let ccKyes = Object.keys(cc);
  for (let k of Object.keys(ad)) {
    if (ccKyes.includes(k) && (ad[k] + "").toLowerCase() != (cc[k] + "").toLowerCase()) {
      ret = false;
    }
  }
  return ret;
}

export function CCInfoAreEqual(crm: any, cc: any): boolean {
  let ret = true;
  let ccKyes = Object.keys(cc);
  for (let k of Object.keys(crm)) {
    if (ccKyes.includes(k) && (crm[k] + "").toLowerCase() != (cc[k] + "").toLowerCase()) {
      ret = false;
    }
  }
  return ret;
}

export function getMostRecentAddress(addresses: ADRecord[]): ADRecord {
  let dates: any = [];
  addresses.forEach(a => {
    dates.push(a.lastInteractionIn);
  });
  dates.sort();
  let date = dates[dates.length - 1];
  return addresses.find(f => f.lastInteractionIn == date)!;
}

export function isAddressCreatedyTheBackflow(address: ADRecord): boolean {
  return isValid(address.backflow) ? address.backflow! : false;
}

function isOptinPendingOrConfirmed(value: any): boolean {
  value = value?.toLowerCase();
  return value == OptinCRMQuery.YES || value == OptinCRMQuery.CONFIRMED || value == OptinCRMQuery.PENDING;
}

function isOptinPending(value: any): boolean {
  value = value?.toLowerCase();
  return value == OptinCRMQuery.PENDING;
}

function isOptinConfirmed(value: any): boolean {
  value = value?.toLowerCase();
  return value == OptinCRMQuery.YES || value == OptinCRMQuery.CONFIRMED;
}

function isValidCC(code: any): boolean {
  if (isValid(code)) {
    if (code == TradePolicy.EPP || code == TradePolicy.FF || code == TradePolicy.VIP) {
      return true;
    }
  }
  return false;
}

function mapCRMOptin(ctx: Context | LoggedUser, optin: MKTAttrCRM[] | MKTAttrPO[] | undefined, userType: any): OptinProfiling {
  let optinFound = false;
  let profilingFound = false;
  let ret: OptinProfiling = {
    optin: OptinCRMReq.DENIED,
    profilingOptin: OptinCRMReq.DENIED
  }
  let mktattributes: string[] = ctx.state.appSettings.attrOptin?.split(",") ?? [];
  let profattributes: string[] = ctx.state.appSettings.attrProfiling?.split(",") ?? [];
  optin = optin ?? [];
  switch (userType) {
    case TradePolicy.EPP:
      mktattributes = ctx.state.appSettings.epp?.attrOptinCC?.split(",") ?? [];
      break;
    case TradePolicy.FF:
      mktattributes = ctx.state.appSettings.ff?.attrOptinCC?.split(",") ?? [];
      break;
    case TradePolicy.VIP:
      mktattributes = ctx.state.appSettings.vip?.attrOptinCC?.split(",") ?? [];
      break;
  }
  for (let i = 0; i < mktattributes.length && !optinFound; i++) {
    let opt: any = undefined;
    if (ctx.state.appSettings.useSapPo) {
      opt = (optin as MKTAttrPO[])?.find(f => f.ATT_NAME == mktattributes[i] && isOptinPendingOrConfirmed(f.ATT_VALUE))?.ATT_VALUE;
    } else {
      opt = (optin as MKTAttrCRM[])?.find(f => f.AttName == mktattributes[i] && isOptinPendingOrConfirmed(f.AttValue))?.AttValue;
    }
    optinFound = opt ? true : false;
    ret.optin = isOptinConfirmed(opt) ? OptinCRMReq.CONFIRMED : (isOptinPending(opt) ? OptinCRMReq.PENDING : OptinCRMReq.DENIED);
  }
  if (ctx.state.appSettings.profilingOptin && ret.optin == OptinCRMReq.CONFIRMED) {
    for (let i = 0; i < profattributes.length && !profilingFound; i++) {
      let prof: any = undefined;
      if (ctx.state.appSettings.useSapPo) {
        prof = (optin as MKTAttrPO[])?.find(f => f.ATT_NAME == profattributes[i])?.ATT_VALUE;
      } else {
        prof = (optin as MKTAttrCRM[])?.find(f => f.AttName == profattributes[i])?.AttValue;
      }
      profilingFound = prof ? true : false;
      ret.profilingOptin = isOptinConfirmed(prof) ? OptinCRMReq.CONFIRMED : OptinCRMReq.DENIED;
    }
  }
  return ret;
}

export function mapCRMInfoToCC(ctx: Context | LoggedUser, crmData: DisplayConsumerCRM_Response, userType: any): CCRecord {
  let dbOpt = mapCRMOptin(ctx, crmData.EtMktAttrib?.item, userType);
  let user: CCRecord = {
    email: crmData.EsAddressData.EmailAddress,
    locale: crmData.EsNameData.CorrLanguage,
    country: crmData.EsAddressData.Country,
    optinConsent: dbOpt.optin,
    profilingConsent: ctx.state.appSettings.profilingOptin ? dbOpt.profilingOptin : null,
    firstName: normalizeAndCutString(crmData.EsNameData.FirstName),
    lastName: normalizeAndCutString(crmData.EsNameData.LastName),
    gender: normalizeAndCutString(crmData.EsNameData.TitleKey),
    dateOfBirth: normalizeAndCutString(crmData.EsNameData.DateOfBirth),
    mobilePhone: normalizeAndCutString(crmData.EsAddressData.MobilePhone),
    homePhone: normalizeAndCutString(crmData.EsAddressData.WorkPhone),
    street: normalizeAndCutString(crmData.EsAddressData.Street1),
    number: normalizeAndCutString(crmData.EsAddressData.HouseNum),
    complement: normalizeAndCutString(crmData.EsAddressData.Street2),
    city: normalizeAndCutString(crmData.EsAddressData.City),
    postalCode: normalizeAndCutString(crmData.EsAddressData.PostCode),
    state: normalizeAndCutString(crmData.EsAddressData.State),
    doubleOptinStatus: ctx.state.appSettings.doubleOptin ? (dbOpt.optin == OptinCRMReq.CONFIRMED ? DOIStatus.CONFIRMED : (dbOpt.optin == OptinCRMReq.PENDING ? DOIStatus.PENDING : null)) : null
  }
  return user;
}

function cutAddressForUK(street1: any, street2: any): string | null {
  street1 = isValid(street1) ? street1 : "";
  street2 = isValid(street2) ? street2 : "";
  let address: string | null = `${street1} ${street2}`.trim();
  address = isValid(address) ? address : null;
  return address;
}

export function mapSAPPOInfoToCC(ctx: Context | LoggedUser, crmData: DisplayConsumerPO_Response, userType: any): CCRecord {
  let dbOpt = mapCRMOptin(ctx, crmData.ET_MKT_ATTRIB?.item, userType);
  let street = ctx.state.appSettings.isUkProject ? cutAddressForUK(crmData.ES_ADDRESS_DATA.STREET1, crmData.ES_ADDRESS_DATA.STREET2) : normalizeAndCutString(crmData.ES_ADDRESS_DATA.STREET1);
  let complement = ctx.state.appSettings.isUkProject ? null : normalizeAndCutString(crmData.ES_ADDRESS_DATA.STREET2);
  let homePhone = ctx.state.appSettings.isUkProject ? normalizeAndCutString(crmData.ES_ADDRESS_DATA.MOBILE_PHONE) : normalizeAndCutString(crmData.ES_ADDRESS_DATA.WORK_PHONE);
  let mobilePhone = ctx.state.appSettings.isUkProject ? null : normalizeAndCutString(crmData.ES_ADDRESS_DATA.MOBILE_PHONE);
  let user: CCRecord = {
    email: crmData.ES_ADDRESS_DATA.EMAIL_ADDRESS,
    //locale: crmData.ES_NAME_DATA.CORR_LANGUAGE,
    country: crmData.ES_ADDRESS_DATA.COUNTRY,
    optinConsent: dbOpt.optin,
    profilingConsent: ctx.state.appSettings.profilingOptin ? dbOpt.profilingOptin : null,
    firstName: normalizeAndCutString(crmData.ES_NAME_DATA.FIRST_NAME),
    lastName: normalizeAndCutString(crmData.ES_NAME_DATA.LAST_NAME),
    gender: normalizeAndCutString(crmData.ES_NAME_DATA.TITLE_KEY),
    dateOfBirth: normalizeAndCutString(crmData.ES_NAME_DATA.DATE_OF_BIRTH),
    mobilePhone: mobilePhone,
    homePhone: homePhone,
    street: street,
    number: normalizeAndCutString(crmData.ES_ADDRESS_DATA.HOUSE_NUM),
    complement: complement,
    city: normalizeAndCutString(crmData.ES_ADDRESS_DATA.CITY),
    postalCode: normalizeAndCutString(crmData.ES_ADDRESS_DATA.POST_CODE),
    state: normalizeAndCutString(crmData.ES_ADDRESS_DATA.STATE),
    doubleOptinStatus: ctx.state.appSettings.doubleOptin ? (dbOpt.optin == OptinCRMReq.CONFIRMED ? DOIStatus.CONFIRMED : (dbOpt.optin == OptinCRMReq.PENDING ? DOIStatus.PENDING : null)) : null
  }
  return user;
}

function formatGenderReverse(gender: any): string | null {
  return gender ?
    (
      gender == GenderCRM.MALE ?
        Gender.MALE :
        (
          gender == Gender.FEMALE ?
            Gender.FEMALE :
            null
        )
    ) :
    null;
}

function formatDateOfBirthReverse(dateOfBirth: any): string | null {
  let date: any = null;
  if (dateOfBirth) {
    date = `${dateOfBirth.substring(0, 4)}-${dateOfBirth.substring(4, 6)}-${dateOfBirth.substring(6, 8)}T00:00:00Z`;
  }
  return date;
}

function formatOptinReverse(optin: any): boolean {
  return optin && optin == OptinCRMReq.CONFIRMED;
}

export function mapCCToCL(customer: CCRecord): CLRecord {
  let ret: CLRecord = {
    isNewsletterOptIn: formatOptinReverse(customer.optinConsent),
    isProfilingOptIn: formatOptinReverse(customer.profilingConsent),
    firstName: normalizeAndCutString(customer.firstName),
    lastName: normalizeAndCutString(customer.lastName),
    gender: formatGenderReverse(customer.gender),
    birthDate: formatDateOfBirthReverse(customer.dateOfBirth),
    phone: normalizeAndCutString(customer.mobilePhone),
    homePhone: normalizeAndCutString(customer.homePhone),
    doubleOptinStatus: normalizeAndCutString(customer.doubleOptinStatus)
  }
  return ret;
}

function formatCountryReverse(country: any, defaultCountry: string): string {
  return country && country?.length < 3 ? convertIso2Code(country).iso3 : convertIso2Code(defaultCountry).iso3;
}

export function mapCCToAD(customer: CCRecord, ctx: Context | LoggedUser): ADRecord {
  let ret: ADRecord = {
    country: formatCountryReverse(customer.country, ctx.state.appSettings.defaultCountry),
    street: normalizeAndCutString(customer.street),
    number: normalizeAndCutString(customer.number),
    complement: normalizeAndCutString(customer.complement),
    city: normalizeAndCutString(customer.city),
    postalCode: normalizeAndCutString(customer.postalCode)
  }
  return ret;
}

function getCurrentTime(ctx: Context | OrderEvent | NewsletterSubscription): string {
  const [hour, minute, second] = new Date().toLocaleTimeString(ctx.state.appSettings.localTimeLocale, {
    timeZone: ctx.state.appSettings.localTimeZone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).split(':')
  return `${hour}${minute}${second}`;
}

export function mapCCToCRM(ctx: Context | OrderEvent | NewsletterSubscription, payload: CCRecord, vipInfo: PARecord | undefined | null): CreateConsumerCRM {
  let req: CreateConsumerCRM = {
    CrmBpId: valueOrUndefined(payload.crmBpId),
    WebId: valueOrUndefined(payload.webId),
    WebChgDate: formatDate(new Date().toISOString())!,
    WebChgTime: getCurrentTime(ctx),
    CsAddressData: {
      HouseNum: valueOrUndefined(payload.number),
      Street1: valueOrUndefined(payload.street),
      Street2: valueOrUndefined(payload.complement),
      City: valueOrUndefined(payload.city),
      State: valueOrUndefined(payload.state),
      Country: payload.country!,
      PostCode: valueOrUndefined(payload.postalCode),
      EmailAddress: payload.email!,
      WorkPhone: valueOrUndefined(payload.homePhone),
      MobilePhone: valueOrUndefined(payload.mobilePhone)
    },
    CsNameData: {
      CrmBpId: valueOrUndefined(payload.crmBpId),
      TitleKey: valueOrUndefined(payload.gender),
      FirstName: valueOrUndefined(payload.firstName),
      LastName: valueOrUndefined(payload.lastName),
      DateOfBirth: valueOrUndefined(payload.dateOfBirth),
      CorrLanguage: valueOrUndefined(payload.locale)
    },
    CtMktAttrib: {
      item: []
    }
  }
  let ccMktAttr: string[] | undefined = undefined;
  let profilingOptinValue = mapOptinForUK(payload.profilingConsent);
  let profilingAttr: string[] | undefined = ctx.state.appSettings.attrProfiling?.split(",") ?? [];
  if (isValidCC(payload.userType)) {
    req.CtMktAttrib!.item!.push(
      {
        AttSet: AttSet.EU_CONSUMER_CC,
        AttName: AttName.EU_CONSUMER_MODEL,
        AttValue: payload.userType!
      }
    )
    switch (payload.userType) {
      case TradePolicy.EPP:
        ccMktAttr = ctx.state.appSettings.epp?.attrOptinCC?.split(",") ?? [];
        req.CtMktAttrib!.item = req.CtMktAttrib!.item!.concat([
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_EPP_LINK,
            AttValue: ctx.state.appSettings.epp!.loginUrl
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_EPP_LINK_KEY,
            AttValue: payload.email!
          }
        ]);
        break;
      case TradePolicy.FF:
        ccMktAttr = ctx.state.appSettings.ff?.attrOptinCC?.split(",") ?? [];
        req.CtMktAttrib!.item = req.CtMktAttrib!.item!.concat([
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_FF_LINK,
            AttValue: ctx.state.appSettings.ff!.loginUrl
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_FF_LINK_KEY,
            AttValue: payload.email!
          }
        ]);
        break;
      case TradePolicy.VIP:
        ccMktAttr = ctx.state.appSettings.vip?.attrOptinCC?.split(",") ?? [];
        req.CtMktAttrib!.item = req.CtMktAttrib!.item!.concat([
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_COMPANY,
            AttValue: vipInfo?.name!
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_COMPANY_CODE,
            AttValue: vipInfo?.partnerCode!
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_ACCESS_CODE,
            AttValue: vipInfo?.accessCode!
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_LINK,
            AttValue: ctx.state.appSettings.vip!.loginUrl
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_LINK_KEY,
            AttValue: payload.email!
          }
        ]);
        break;
    }
  } else {
    ccMktAttr = ctx.state.appSettings.attrOptin?.split(",") ?? [];
  }
  ccMktAttr?.forEach(mktattr => {
    req.CtMktAttrib!.item!.push({
      AttSet: AttSet.EU_CONSUMER_BRAND,
      AttName: mktattr,
      AttValue: valueOrUndefined(payload.optinConsent)
    })
  });
  //INTRODUCED FOR PROFILING
  profilingAttr?.forEach(prfattr => {
    req.CtMktAttrib!.item!.push({
      AttSet: AttSet.COMUNIC_BRAND,
      AttName: prfattr,
      AttValue: profilingOptinValue
    })
  });
  ///////////////////////////////////////////////////
  if (isValid(payload.campaign)) {
    let scpb: string[] = ctx.state.appSettings.attrSourceCampaign?.split(",") ?? [];
    scpb?.forEach(sc => {
      req.CtMktAttrib!.item!.push({
        AttSet: AttSet.EU_SOURCE_CAMPAIGN,
        AttName: sc,
        AttValue: valueOrUndefined(payload.campaign)
      })
    });
  }
  req = removeUndefinedProperties(req);
  return req;
}

export function mapCCToSAPPO(ctx: Context | OrderEvent | NewsletterSubscription, payload: CCRecord, vipInfo: PARecord | undefined | null): CreateConsumerPO {
  let req: CreateConsumerPO = {
    CRM_BP_ID: valueOrUndefined(payload.crmBpId),
    WEB_ID: valueOrUndefined(payload.webId),
    WEB_CHG_DATE: formatDate(new Date().toISOString())!,
    WEB_CHG_TIME: getCurrentTime(ctx),
    CS_ADDRESS_DATA: {
      HOUSE_NUM: valueOrUndefined(payload.number),
      STREET1: valueOrUndefined(payload.street),
      STREET2: valueOrUndefined(payload.complement),
      CITY: valueOrUndefined(payload.city),
      STATE: valueOrUndefined(payload.state),
      COUNTRY: payload.country!,
      POST_CODE: valueOrUndefined(payload.postalCode),
      EMAIL_ADDRESS: payload.email!,
      WORK_PHONE: valueOrUndefined(payload.homePhone),
      MOBILE_PHONE: valueOrUndefined(payload.mobilePhone)
    },
    CS_NAME_DATA: {
      CRM_BP_ID: valueOrUndefined(payload.crmBpId),
      TITLE_KEY: valueOrUndefined(payload.gender),
      FIRST_NAME: valueOrUndefined(payload.firstName),
      LAST_NAME: valueOrUndefined(payload.lastName),
      DATE_OF_BIRTH: valueOrUndefined(payload.dateOfBirth),
      CORR_LANGUAGE: valueOrUndefined(payload.locale)
    },
    CT_MKT_ATTRIB: {
      item: []
    }
  }
  let ccMktAttr: string[] | undefined = undefined;
  let profilingOptinValue = mapOptinForUK(payload.profilingConsent);
  let profilingAttr: string[] | undefined = ctx.state.appSettings.attrProfiling?.split(",") ?? [];
  if (isValidCC(payload.userType)) {
    req.CT_MKT_ATTRIB!.item!.push(
      {
        ATT_SET: AttSet.EU_CONSUMER_CC,
        ATT_NAME: AttName.EU_CONSUMER_MODEL,
        ATT_VALUE: payload.userType!
      }
    )
    switch (payload.userType) {
      case TradePolicy.EPP:
        ccMktAttr = ctx.state.appSettings.epp?.attrOptinCC?.split(",") ?? [];
        req.CT_MKT_ATTRIB!.item = req.CT_MKT_ATTRIB!.item!.concat([
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_EPP_LINK,
            ATT_VALUE: ctx.state.appSettings.epp!.loginUrl
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_EPP_LINK_KEY,
            ATT_VALUE: payload.email!
          }
        ]);
        break;
      case TradePolicy.FF:
        ccMktAttr = ctx.state.appSettings.ff?.attrOptinCC?.split(",") ?? [];
        req.CT_MKT_ATTRIB!.item = req.CT_MKT_ATTRIB!.item!.concat([
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_FF_LINK,
            ATT_VALUE: ctx.state.appSettings.ff!.loginUrl
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_FF_LINK_KEY,
            ATT_VALUE: payload.email!
          }
        ]);
        break;
      case TradePolicy.VIP:
        ccMktAttr = ctx.state.appSettings.vip?.attrOptinCC?.split(",") ?? [];
        req.CT_MKT_ATTRIB!.item = req.CT_MKT_ATTRIB!.item!.concat([
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_COMPANY,
            ATT_VALUE: vipInfo?.name!
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_COMPANY_CODE,
            ATT_VALUE: vipInfo?.partnerCode!
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_ACCESS_CODE,
            ATT_VALUE: vipInfo?.accessCode!
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_LINK,
            ATT_VALUE: ctx.state.appSettings.vip!.loginUrl
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_LINK_KEY,
            ATT_VALUE: payload.email!
          }
        ]);
        break;
    }
  } else {
    ccMktAttr = ctx.state.appSettings.attrOptin?.split(",") ?? [];
  }
  ccMktAttr?.forEach(mktattr => {
    req.CT_MKT_ATTRIB!.item!.push({
      ATT_SET: AttSet.EU_CONSUMER_BRAND,
      ATT_NAME: mktattr,
      ATT_VALUE: valueOrUndefined(payload.optinConsent)
    })
  });
  //INTRODUCED FOR PROFILING
  profilingAttr?.forEach(prfattr => {
    req.CT_MKT_ATTRIB!.item!.push({
      ATT_SET: AttSet.COMUNIC_BRAND,
      ATT_NAME: prfattr,
      ATT_VALUE: profilingOptinValue
    })
  });
  ///////////////////////////////////////////////////
  if (isValid(payload.campaign)) {
    let scpb: string[] = ctx.state.appSettings.attrSourceCampaign?.split(",") ?? [];
    scpb?.forEach(sc => {
      req.CT_MKT_ATTRIB!.item!.push({
        ATT_SET: AttSet.EU_SOURCE_CAMPAIGN,
        ATT_NAME: sc,
        ATT_VALUE: valueOrUndefined(payload.campaign)
      })
    });
  }
  req = removeUndefinedProperties(req);
  return req;
}

function mapOptinForUK(optin: any): string {
  return optin == OptinCRMReq.CONFIRMED ? OptinCRMReq.YES : OptinCRMReq.NO;
}

export function mapCCToUK(ctx: Context | OrderEvent | NewsletterSubscription, payload: CCRecord, vipInfo: PARecord | undefined | null): CreateConsumerUK {
  let street = payload.street ?? "";
  let number = payload.number ?? "";
  let address: string | undefined = number?.length > 0 ? `${number} ${street}`.trim() : street;
  address = isValid(address) ? address : undefined;
  let addressLine1 = normalizeAndCutString(address, CharSize.char60);
  let addressLine2 = address && address.length > CharSize.char60 ? address.substring(CharSize.char60, CharSize.char120) : undefined
  let req: CreateConsumerUK = {
    WEB_ID: valueOrUndefined(payload.webId),
    BP_ID: valueOrUndefined(payload.crmBpId),
    Prefix: valueOrUndefined(payload.gender),
    Email: valueOrUndefined(payload.email),
    Name: valueOrUndefined(payload.firstName),
    Surname: valueOrUndefined(payload.lastName),
    Country: valueOrUndefined(payload.country),
    Source: ctx.state.appSettings.defaultSource,
    Address_Line: valueOrUndefined(addressLine1),
    Address_Line2: addressLine2,
    City: valueOrUndefined(payload.city),
    Zip: valueOrUndefined(payload.postalCode),
    Phone: valueOrUndefined(payload.homePhone),
    MarketingTable: []
  }
  let optinValue = mapOptinForUK(payload.optinConsent);
  let channelAttr: string[] | undefined = ctx.state.appSettings.attrChannel?.split(",") ?? [];
  let profilingOptinValue = mapOptinForUK(payload.profilingConsent);
  let ccMktAttr: string[] | undefined = undefined;
  let profilingAttr: string[] | undefined = ctx.state.appSettings.attrProfiling?.split(",") ?? [];
  if (isValidCC(payload.userType)) {
    req.MarketingTable!.push(
      {
        AttributeSet: AttSet.CLOSED_COMMUNITY,
        AttributeName: AttName.EU_CONSUMER_MODEL,
        AttributeValue: payload.userType!
      }
    )
    switch (payload.userType!) {
      case TradePolicy.EPP:
        ccMktAttr = ctx.state.appSettings.epp?.attrOptinCC?.split(",") ?? [];
        req.MarketingTable = req.MarketingTable?.concat([
          {
            AttributeSet: AttSet.CLOSED_COMMUNITY,
            AttributeName: AttName.EU_CONSUMER_EPP_LINK,
            AttributeValue: ctx.state.appSettings.epp!.loginUrl
          },
          {
            AttributeSet: AttSet.CLOSED_COMMUNITY,
            AttributeName: AttName.EU_CONSUMER_EPP_LINK_KEY,
            AttributeValue: payload.email!
          }
        ]);
        break;
      case TradePolicy.FF:
        ccMktAttr = ctx.state.appSettings.ff?.attrOptinCC?.split(",") ?? [];
        req.MarketingTable = req.MarketingTable?.concat([
          {
            AttributeSet: AttSet.CLOSED_COMMUNITY,
            AttributeName: AttName.EU_CONSUMER_FF_LINK,
            AttributeValue: ctx.state.appSettings.ff!.loginUrl
          },
          {
            AttributeSet: AttSet.CLOSED_COMMUNITY,
            AttributeName: AttName.EU_CONSUMER_FF_LINK_KEY,
            AttributeValue: payload.email!
          }
        ]);
        break;
      case TradePolicy.VIP:
        ccMktAttr = ctx.state.appSettings.vip?.attrOptinCC?.split(",") ?? [];
        req.MarketingTable = req.MarketingTable?.concat([
          {
            AttributeSet: AttSet.CLOSED_COMMUNITY,
            AttributeName: AttName.EU_CONSUMER_VIP_COMPANY,
            AttributeValue: vipInfo?.name!
          },
          {
            AttributeSet: AttSet.CLOSED_COMMUNITY,
            AttributeName: AttName.EU_CONSUMER_VIP_COMPANY_CODE,
            AttributeValue: vipInfo?.partnerCode!
          },
          {
            AttributeSet: AttSet.CLOSED_COMMUNITY,
            AttributeName: AttName.EU_CONSUMER_VIP_ACCESS_CODE,
            AttributeValue: vipInfo?.accessCode!
          },
          {
            AttributeSet: AttSet.CLOSED_COMMUNITY,
            AttributeName: AttName.EU_CONSUMER_VIP_LINK,
            AttributeValue: ctx.state.appSettings.vip!.loginUrl
          },
          {
            AttributeSet: AttSet.CLOSED_COMMUNITY,
            AttributeName: AttName.EU_CONSUMER_VIP_LINK_KEY,
            AttributeValue: payload.email!
          }
        ]);
        break;
    }
  } else {
    ccMktAttr = ctx.state.appSettings.attrOptin?.split(",") ?? [];
    // MKT ATTRS introduced with SAP HANA Migration //
    req.MarketingTable = req.MarketingTable?.concat(
      {
        AttributeSet: AttSet.CONSUMER_PRIVACY,
        AttributeName: AttName.SAP_0000010899,
        AttributeValue: optinValue
      },
      {
        AttributeSet: AttSet.CONSUMER_PRIVACY,
        AttributeName: AttName.LEGIT_INTEREST,
        AttributeValue: optinValue
      }
    );
    ///////////////////////////////////////////////////
  }

  const ATTRIBUTE_SET = ctx.state.appSettings.isCCProject ? AttSet.CLOSED_COMMUNITY : AttSet.COMUNIC_BRAND
  ccMktAttr?.forEach(mktattr => {
    req.MarketingTable?.push({
      AttributeSet: ATTRIBUTE_SET,
      AttributeName: mktattr,
      AttributeValue: optinValue
    })
  });
  channelAttr?.forEach(channel => {
    req.MarketingTable?.push({
      AttributeSet: ATTRIBUTE_SET,
      AttributeName: channel,
      AttributeValue: optinValue
    })
  })
  //INTRODUCED FOR PROFILING
  profilingAttr?.forEach(prfattr => {
    req.MarketingTable?.push({
      AttributeSet: ATTRIBUTE_SET,
      AttributeName: prfattr,
      AttributeValue: profilingOptinValue
    })
  });
  ///////////////////////////////////////////////////
  if (isValid(payload.campaign)) {
    let scpb: string[] = ctx.state.appSettings.attrSourceCampaign?.split(",") ?? [];
    scpb?.forEach(sc => {
      req.MarketingTable?.push({
        AttributeSet: AttSet.EU_SOURCE_CAMPAIGN,
        AttributeName: sc,
        AttributeValue: valueOrUndefined(payload.campaign)
      })
    });
  }
  req = removeUndefinedProperties(req);
  return req;
}

export async function buildReqForCreateConsumer(ctx: Context | OrderEvent | NewsletterSubscription, payload: CCRecord, vipInfo: any): Promise<CreateConsumerCRM | CreateConsumerPO | CreateConsumerUK> {
  return new Promise<CreateConsumerCRM | CreateConsumerPO | CreateConsumerUK>(async (resolve, reject) => {
    try {
      let req: any = undefined;
      let payloadType = ctx.state.appSettings.isUkProject ? PayloadType.JSON : PayloadType.XML;
      if (ctx.state.appSettings.isUkProject) {
        req = mapCCToUK(ctx, payload, vipInfo);
      } else {
        if (ctx.state.appSettings.useSapPo) {
          req = mapCCToSAPPO(ctx, payload, vipInfo);
        } else {
          req = mapCCToCRM(ctx, payload, vipInfo);
        }
      }
      req = await ctx.clients.CRM.buildCreateConsumerReq(req, payloadType);
      resolve(req);
    }
    catch (err) {
      reject(err.message ? err : { message: `Error while building req for "create / update consumer" --details: ${stringify(err)} --data: ${stringify(payload)}` })
    }
  })
}

export function buildReqForDisplayConsumer(ctx: Context | LoggedUser, crmBpdId: string): DisplayConsumerCRM | DisplayConsumerPO {
  let date = (new Date()).toISOString().split("T")[0].replace(/\-/g, "");
  if (ctx.state.appSettings.useSapPo)
    return { CRM_BP_ID: crmBpdId, DATE: date } as DisplayConsumerPO;
  return { CrmBpId: crmBpdId, Date: date } as DisplayConsumerCRM;
}

export function readDisplayConsumerRes(ctx: Context | LoggedUser, crmData: DisplayConsumerCRM_Response | DisplayConsumerPO_Response, userType: any): CCRecord {
  return ctx.state.appSettings.useSapPo ? mapSAPPOInfoToCC(ctx, crmData as DisplayConsumerPO_Response, userType) : mapCRMInfoToCC(ctx, crmData as DisplayConsumerCRM_Response, userType);
}

export function readCreateConsumerRes(ctx: Context | OrderEvent | NewsletterSubscription,
  res: CreateConsumerCRM_Response | CreateConsumerPO_Response | CreateConsumerUK_Response):
  EtReturnCRM[] | EtReturnPO[] | CreateConsumerUK_Response | undefined {
  return ctx.state.appSettings.isUkProject ?
    res as CreateConsumerUK_Response :
    (
      ctx.state.appSettings.useSapPo ?
        (res as CreateConsumerPO_Response).ET_RETURN :
        (res as CreateConsumerCRM_Response).EtReturn
    );
}

export async function readSetCrmBpIdReq(ctx: Context, req: string | CreateConsumerUK_Response | any): Promise<{ email: string, bpId: string }> {
  return new Promise<{ email: string, bpId: string }>(async (resolve, reject) => {
    try {
      let result: any = {};
      if (ctx.state.appSettings.isUkProject) {
        result = {
          email: (req as CreateConsumerUK_Response).MT_CosumerRegistration_Response.Email,
          bpId: (req as CreateConsumerUK_Response).MT_CosumerRegistration_Response.BP_ID
        }
      } else {
        req = await ctx.clients.CRM.parseCreateConsumerRes(req, PayloadType.XML);
        if (ctx.state.appSettings.useSapPo) {
          result = {
            email: (req as CreateConsumerPO_Response).CS_ADDRESS_DATA.EMAIL_ADDRESS,
            bpId: (req as CreateConsumerPO_Response).CS_NAME_DATA.CRM_BP_ID
          }
        } else {
          result = {
            email: (req as CreateConsumerCRM_Response).CsAddressData.EmailAddress,
            bpId: (req as CreateConsumerCRM_Response).CsNameData.CrmBpId
          }
        }
      }
      resolve(result);
    } catch (err) {
      reject(err.message ? err : { message: `Error while parsing CRM res --details: ${stringify(err)} --data: ${stringify(req)}` });
    }
  })
}

function mapThirdPartyConsent(consent: boolean): string {
  return consent ? OptinCRMReq.YES : OptinCRMReq.NO;
}

export function mapProdRegDataToCRM(ctx: Context, formData: ProductRegistrationReq, vipInfo: PARecord | undefined | null): ProductRegistrationCRM {
  let paylaod: ProductRegistrationCRM = {
    CsAddressData: {
      Country: ctx.state.appSettings.defaultCountry,
      City: valueOrUndefined(normalizeAndCutString(formData.address_data.city, CharSize.char40)),
      //City2: valueOrUndefined(normalizeAndCutString(formData.address_data.province, CharSize.char40)),
      PostlCod1: valueOrUndefined(normalizeAndCutString(formData.address_data.cap, CharSize.char10)),
      Street: valueOrUndefined(normalizeAndCutString(formData.address_data.street, CharSize.char60)),
      StrSuppl1: valueOrUndefined(normalizeAndCutString(formData.address_data.street_int, CharSize.char40)),
      Telephone: valueOrUndefined(normalizeAndCutString(formData.address_data.telephone, CharSize.char30)),
      EMail: formData.address_data.email
    },
    CsPersonData: {
      Firstname: valueOrUndefined(normalizeAndCutString(formData.person_data.firstname, CharSize.char40)),
      Lastname: valueOrUndefined(normalizeAndCutString(formData.person_data.lastname, CharSize.char40)),
      Partnerlanguage: ctx.state.appSettings.defaultLocale,
      Contactallowance: ctx.state.appSettings.productRegistration!.fields!.Contactallowance!,
      Dataorigintype: ctx.state.appSettings.productRegistration!.fields!.Dataorigintype!
    },
    IsOtherData: {
      OtherInfo: ctx.state.appSettings.productRegistration!.fields!.OtherInfo!
    },
    CtApplianceData: {
      item: []
    },
    CtMktData: {
      item: []
    }
  }
  formData.appliance_data.forEach(a => {
    let prodId = valueOrUndefined(normalizeAndCutString(a.product_id, CharSize.char40));
    let productInfo = ctx.state.appSettings.productRegistration?.taxonomy?.find(t => t.id.toLowerCase() == a.category.toLowerCase());
    paylaod.CtApplianceData.item!.push({
      ProductId: prodId,
      RefProduct: prodId,
      CrmPurchaseDate: valueOrUndefined(formatDate(a.purchase_date)),
      Zz0010: ctx.state.appSettings.productRegistration!.fields!.Zz0010!,
      Zz0011: valueOrUndefined(productInfo?.productFamily),
      Zz0012: valueOrUndefined(productInfo?.magCode),
      Zz0013: valueOrUndefined(normalizeAndCutString(a.commercial_code, CharSize.char40)),
      Zz0014: valueOrUndefined(normalizeAndCutString(a.register, CharSize.char12)),
      Zz0018: ctx.state.appSettings.productRegistration!.fields!.Zz0018!,
      Zz0020: ctx.state.appSettings.productRegistration!.fields!.Zz0020!
    })
  })
  let ccMktAttr: string[] | undefined = undefined;
  let userType = isValid(formData.person_data.tradePolicy) ? getTradePolicyById(ctx, formData.person_data.tradePolicy!)! : TradePolicy.O2P;
  if (isValidCC(userType)) {
    paylaod.CtMktData!.item!.push(
      {
        AttSet: AttSet.EU_CONSUMER_CC,
        AttName: AttName.EU_CONSUMER_MODEL,
        AttValue: userType
      }
    )
    switch (userType) {
      case TradePolicy.EPP:
        ccMktAttr = ctx.state.appSettings.epp?.attrOptinCC?.split(",") ?? [];
        paylaod.CtMktData!.item = paylaod.CtMktData!.item!.concat([
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_EPP_LINK,
            AttValue: ctx.state.appSettings.epp!.loginUrl
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_EPP_LINK_KEY,
            AttValue: formData.address_data.email!
          }
        ]);
        break;
      case TradePolicy.FF:
        ccMktAttr = ctx.state.appSettings.ff?.attrOptinCC?.split(",") ?? [];
        paylaod.CtMktData!.item = paylaod.CtMktData!.item!.concat([
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_FF_LINK,
            AttValue: ctx.state.appSettings.ff!.loginUrl
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_FF_LINK_KEY,
            AttValue: formData.address_data.email!
          }
        ]);
        break;
      case TradePolicy.VIP:
        ccMktAttr = ctx.state.appSettings.vip?.attrOptinCC?.split(",") ?? [];
        paylaod.CtMktData!.item = paylaod.CtMktData!.item!.concat([
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_COMPANY,
            AttValue: vipInfo?.name!
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_COMPANY_CODE,
            AttValue: vipInfo?.partnerCode!
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_ACCESS_CODE,
            AttValue: vipInfo?.accessCode!
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_LINK,
            AttValue: ctx.state.appSettings.vip!.loginUrl
          },
          {
            AttSet: AttSet.EU_CONSUMER_CC,
            AttName: AttName.EU_CONSUMER_VIP_LINK_KEY,
            AttValue: formData.address_data.email!
          }
        ]);
        break;
    }
  } else {
    ccMktAttr = ctx.state.appSettings.attrOptin?.split(",") ?? [];
  }
  let optinValue = formatOptin(formData.mkt_data.eu_consumer_brand, undefined, ctx.state.appSettings.doubleOptin, undefined, ctx.state.appSettings.profilingOptin)?.optin;
  ccMktAttr?.forEach(mktattr => {
    paylaod.CtMktData!.item!.push({
      AttSet: AttSet.EU_CONSUMER_BRAND,
      AttName: mktattr,
      AttValue: optinValue
    })
  });
  let thirdPartyValue = mapThirdPartyConsent(formData.mkt_data.eu_consumer_prv);
  paylaod.CtMktData!.item!.push({
    AttSet: AttSet.EU_CONSUMER_PRV,
    AttName: AttName.THIRD_PARTY_CONTACT,
    AttValue: thirdPartyValue
  })
  if (isValid(formData.mkt_data.eu_consumer_age)) {
    paylaod.CtMktData!.item!.push({
      AttSet: AttSet.EU_CU_SEGMENTATION,
      AttName: AttName.EU_CONSUMER_AGE,
      AttValue: formData.mkt_data.eu_consumer_age!
    })
  }
  if (isValid(formData.mkt_data.eu_cu_segmentation)) {
    paylaod.CtMktData!.item!.push({
      AttSet: AttSet.EU_CU_SEGMENTATION,
      AttName: AttName.EU_IT_JOBS,
      AttValue: formData.mkt_data.eu_cu_segmentation!
    })
  }
  return paylaod;
}


export function mapProdRegDataToPO(ctx: Context, formData: ProductRegistrationReq, vipInfo: PARecord | undefined | null): ProductRegistrationPO {
  let paylaod: ProductRegistrationPO = {
    CS_ADDRESS_DATA: {
      COUNTRY: ctx.state.appSettings.defaultCountry,
      CITY: valueOrUndefined(normalizeAndCutString(formData.address_data.city, CharSize.char40)),
      //CITY2: valueOrUndefined(normalizeAndCutString(formData.address_data.province, CharSize.char40)),
      POSTL_COD1: valueOrUndefined(normalizeAndCutString(formData.address_data.cap, CharSize.char10)),
      STREET: valueOrUndefined(normalizeAndCutString(formData.address_data.street, CharSize.char60)),
      STR_SUPPL1: valueOrUndefined(normalizeAndCutString(formData.address_data.street_int, CharSize.char40)),
      TELEPHONE: valueOrUndefined(normalizeAndCutString(formData.address_data.telephone, CharSize.char30)),
      E_MAIL: formData.address_data.email
    },
    CS_PERSON_DATA: {
      FIRSTNAME: valueOrUndefined(normalizeAndCutString(formData.person_data.firstname, CharSize.char40)),
      LASTNAME: valueOrUndefined(normalizeAndCutString(formData.person_data.lastname, CharSize.char40)),
      PARTNERLANGUAGE: ctx.state.appSettings.defaultLocale,
      CONTACTALLOWANCE: ctx.state.appSettings.productRegistration!.fields!.Contactallowance!,
      DATAORIGINTYPE: ctx.state.appSettings.productRegistration!.fields!.Dataorigintype!
    },
    IS_OTHER_DATA: {
      OTHER_INFO: ctx.state.appSettings.productRegistration!.fields!.OtherInfo!
    },
    CT_APPLIANCE_DATA: {
      item: []
    },
    CT_MKT_DATA: {
      item: []
    }
  }
  formData.appliance_data.forEach(a => {
    let prodId = valueOrUndefined(normalizeAndCutString(a.product_id, CharSize.char40));
    let productInfo = ctx.state.appSettings.productRegistration?.taxonomy?.find(t => t.id.toLowerCase() == a.category.toLowerCase());
    paylaod.CT_APPLIANCE_DATA.item!.push({
      PRODUCT_ID: prodId,
      REF_PRODUCT: prodId,
      CRM_PURCHASE_DATE: valueOrUndefined(formatDate(a.purchase_date)),
      ZZ0010: ctx.state.appSettings.productRegistration!.fields!.Zz0010!,
      ZZ0011: valueOrUndefined(productInfo?.productFamily),
      ZZ0012: valueOrUndefined(productInfo?.magCode),
      ZZ0013: valueOrUndefined(normalizeAndCutString(a.commercial_code, CharSize.char40)),
      ZZ0014: valueOrUndefined(normalizeAndCutString(a.register, CharSize.char12)),
      ZZ0018: ctx.state.appSettings.productRegistration!.fields!.Zz0018!,
      ZZ0020: ctx.state.appSettings.productRegistration!.fields!.Zz0020!
    })
  })
  let ccMktAttr: string[] | undefined = undefined;
  let userType = isValid(formData.person_data.tradePolicy) ? getTradePolicyById(ctx, formData.person_data.tradePolicy!)! : TradePolicy.O2P;
  if (isValidCC(userType)) {
    paylaod.CT_MKT_DATA!.item!.push(
      {
        ATT_SET: AttSet.EU_CONSUMER_CC,
        ATT_NAME: AttName.EU_CONSUMER_MODEL,
        ATT_VALUE: userType
      }
    )
    switch (userType) {
      case TradePolicy.EPP:
        ccMktAttr = ctx.state.appSettings.epp?.attrOptinCC?.split(",") ?? [];
        paylaod.CT_MKT_DATA!.item = paylaod.CT_MKT_DATA!.item!.concat([
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_EPP_LINK,
            ATT_VALUE: ctx.state.appSettings.epp!.loginUrl
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_EPP_LINK_KEY,
            ATT_VALUE: formData.address_data.email!
          }
        ]);
        break;
      case TradePolicy.FF:
        ccMktAttr = ctx.state.appSettings.ff?.attrOptinCC?.split(",") ?? [];
        paylaod.CT_MKT_DATA!.item = paylaod.CT_MKT_DATA!.item!.concat([
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_FF_LINK,
            ATT_VALUE: ctx.state.appSettings.ff!.loginUrl
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_FF_LINK_KEY,
            ATT_VALUE: formData.address_data.email!
          }
        ]);
        break;
      case TradePolicy.VIP:
        ccMktAttr = ctx.state.appSettings.vip?.attrOptinCC?.split(",") ?? [];
        paylaod.CT_MKT_DATA!.item = paylaod.CT_MKT_DATA!.item!.concat([
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_COMPANY,
            ATT_VALUE: vipInfo?.name!
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_COMPANY_CODE,
            ATT_VALUE: vipInfo?.partnerCode!
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_ACCESS_CODE,
            ATT_VALUE: vipInfo?.accessCode!
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_LINK,
            ATT_VALUE: ctx.state.appSettings.vip!.loginUrl
          },
          {
            ATT_SET: AttSet.EU_CONSUMER_CC,
            ATT_NAME: AttName.EU_CONSUMER_VIP_LINK_KEY,
            ATT_VALUE: formData.address_data.email!
          }
        ]);
        break;
    }
  } else {
    ccMktAttr = ctx.state.appSettings.attrOptin?.split(",") ?? [];
  }
  let optinValue = formatOptin(formData.mkt_data.eu_consumer_brand, undefined, ctx.state.appSettings.doubleOptin, undefined, ctx.state.appSettings.profilingOptin)?.optin;
  ccMktAttr?.forEach(mktattr => {
    paylaod.CT_MKT_DATA!.item!.push({
      ATT_SET: AttSet.EU_CONSUMER_BRAND,
      ATT_NAME: mktattr,
      ATT_VALUE: optinValue
    })
  });
  let thirdPartyValue = mapThirdPartyConsent(formData.mkt_data.eu_consumer_prv);
  paylaod.CT_MKT_DATA!.item!.push({
    ATT_SET: AttSet.EU_CONSUMER_PRV,
    ATT_NAME: AttName.THIRD_PARTY_CONTACT,
    ATT_VALUE: thirdPartyValue
  })
  if (isValid(formData.mkt_data.eu_consumer_age)) {
    paylaod.CT_MKT_DATA!.item!.push({
      ATT_SET: AttSet.EU_CU_SEGMENTATION,
      ATT_NAME: AttName.EU_CONSUMER_AGE,
      ATT_VALUE: formData.mkt_data.eu_consumer_age!
    })
  }
  if (isValid(formData.mkt_data.eu_cu_segmentation)) {
    paylaod.CT_MKT_DATA!.item!.push({
      ATT_SET: AttSet.EU_CU_SEGMENTATION,
      ATT_NAME: AttName.EU_IT_JOBS,
      ATT_VALUE: formData.mkt_data.eu_cu_segmentation!
    })
  }
  return paylaod;
}

export function buildReqForProductregistration(ctx: Context, formData: ProductRegistrationReq, vipInfo: PARecord | null | undefined): ProductRegistrationCRM | ProductRegistrationPO {
  return ctx.state.appSettings.useSapPo ? mapProdRegDataToPO(ctx, formData, vipInfo) : mapProdRegDataToCRM(ctx, formData, vipInfo);
}
