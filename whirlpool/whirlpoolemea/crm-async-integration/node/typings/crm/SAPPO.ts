export interface AddressDataPO {
  HOUSE_NUM?: string
  STREET1?: string
  STREET2?: string
  STREET3?: string
  CITY?: string
  DISTRICT?: string
  STATE?: string
  COUNTRY: string
  POST_CODE?: string
  EMAIL_ADDRESS: string
  HOUSE_PHONE?: string
  WORK_PHONE?: string
  MOBILE_PHONE?: string
}

export interface NameDataPO {
  CRM_BP_ID?: string
  TITLE_KEY?: string
  FIRST_NAME: string
  MIDDLE_NAME?: string
  LAST_NAME: string
  DATE_OF_BIRTH?: string
  CORR_LANGUAGE: string
  CONTACTABLE?: string
  CREATE_DATE?: string
  CREATE_TIME?: string
  LAST_CHANGE_DATE?: string
  LAST_CHANGE_TIME?: string
  VIP?: string
}

export interface MKTAttrPO {
  ATT_SET: string
  ATT_NAME: string
  ATT_VALUE: string
}

export interface CreateConsumerPO {
  CRM_BP_ID?: string
  WEB_ID?: string
  WEB_CHG_DATE?: string
  WEB_CHG_TIME?: string
  WEB_CRT_DATE?: string
  WEB_CRT_TIME?: string
  CS_ADDRESS_DATA: AddressDataPO
  CS_NAME_DATA: NameDataPO
  CT_MKT_ATTRIB?: {
    item?: MKTAttrPO[]
  }
}

export interface EtReturnPO {
  TYPE?: string
  ID?: string
  NUMBER?: string
  MESSAGE?: string
  LOG_NO?: string
  LOG_MSG_NO?: string
  MESSAGE_V1?: string
  MESSAGE_V2?: string
  MESSAGE_V3?: string
  MESSAGE_V4?: string
  PARAMETER?: string
  ROW?: any
  FIELD?: string
  SYSTEM?: string
}

export interface CreateConsumerPO_Response {
  CS_ADDRESS_DATA: AddressDataPO
  CS_NAME_DATA: NameDataPO
  CT_MKT_ATTRIB?: {
    item?: MKTAttrPO[]
  }
  ET_RETURN?: EtReturnPO[]
}

export interface DisplayConsumerPO {
  CRM_BP_ID: string
  DATE?: string
}

export interface DisplayConsumerPO_Response {
  ES_ADDRESS_DATA: AddressDataPO
  ES_NAME_DATA: NameDataPO
  ET_MKT_ATTRIB?: {
    item?: MKTAttrPO[]
  }
  ET_RETURN?: EtReturnPO[]
}

export interface AddressDataProdRegPO {
  COUNTRY?: string
  CITY?: string
  CITY2?: string
  POSTL_COD1?: string
  STREET?: string
  HOUSE_NO?: string
  STR_SUPPL1?: string
  STR_SUPPL2?: string
  STR_SUPPL3?: string
  TELEPHONE?: string
  OFFICE?: string
  MOBILE?: string
  E_MAIL?: string
}

export interface PersonDataProdRegPO {
  PARTNER_ID?: string
  TITLE_KEY?: string
  FIRSTNAME?: string
  MIDDLENAME?: string
  LASTNAME?: string
  PARTNERLANGUAGE?: string
  CONTACTALLOWANCE?: string
  PARTNEREXTERNAL?: string
  DATAORIGINTYPE?: string
  SP_ID?: string
}

export interface OtherDataProdRegPO {
  DEALER_ID?: string
  OBJECT_ID?: string
  OTHER_INFO?: string
}

export interface ApplianceDataProdRegPO {
  PRODUCT_ID?: string
  CRM_PURCHASE_DATE?: string
  REF_PRODUCT?: string
  ZZ0010?: string
  ZZ0011?: string
  ZZ0012?: string
  ZZ0013?: string
  ZZ0014?: string
  ZZ0017?: any
  ZZ0018?: string
  ZZ0019?: string
  ZZ0020?: string
  ZZEXTWR?: string
  ZZTPTOWN?: string
  CONTRACT_PRODUCT?: string
  ZZ0025?: string
  ZZ0026?: string
  ZZ0027?: string
  ZZ0028?: string
  ZZ0029?: string
  ZZ0030?: string
  ZZ0031?: string
  ZZ0032?: string
  ZZ0033?: string
  ZZ0034?: string
  ZZ0035?: string
  ZZ0016?: string
}

export interface ProductRegistrationPO {
  CS_ADDRESS_DATA: AddressDataProdRegPO
  CS_PERSON_DATA: PersonDataProdRegPO
  CT_APPLIANCE_DATA: {
    item?: ApplianceDataProdRegPO[]
  }
  CT_MKT_DATA?: {
    item?: MKTAttrPO[]
  }
  CT_RETURN?: EtReturnPO[]
  IS_OTHER_DATA?: OtherDataProdRegPO
  IV_COM_CODE?: string
  IV_EW_TYPE?: string
  IV_RED_CODE?: string
}

export interface ProductRegistrationPO_Response {
  CS_ADDRESS_DATA: AddressDataProdRegPO
  CS_PERSON_DATA: PersonDataProdRegPO
  CT_APPLIANCE_DATA: {
    item?: ApplianceDataProdRegPO[]
  }
  CT_MKT_DATA?: {
    item?: MKTAttrPO[]
  }
  CT_RETURN?: EtReturnPO[]
}
