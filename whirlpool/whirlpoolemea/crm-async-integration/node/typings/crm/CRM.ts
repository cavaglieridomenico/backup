export interface NameDataCRM {
  CrmBpId?: string
  TitleKey?: string
  FirstName: string
  MiddleName?: string
  LastName: string
  DateOfBirth?: string
  CorrLanguage: string
  Contactable?: string
  CreateDate?: string
  CreateTime?: string
  LastChangeDate?: string
  LastChangeTime?: string
  Vip?: string
}

export interface AddressDataCRM {
  HouseNum?: string
  Street1?: string
  Street2?: string
  Street3?: string
  City?: string
  District?: string
  State?: string
  Country: string
  PostCode?: string
  EmailAddress: string
  HousePhone?: string
  WorkPhone?: string
  MobilePhone?: string
}

export interface MKTAttrCRM {
  AttSet: string
  AttName: string
  AttValue: string
}

export interface CreateConsumerCRM {
  CrmBpId?: string
  WebId?: string
  WebChgDate?: string
  WebChgTime?: string
  WebCrtDate?: string
  WebCrtTime?: string
  CsAddressData: AddressDataCRM
  CsNameData: NameDataCRM
  CtMktAttrib?: {
    item?: MKTAttrCRM[]
  }
}

export interface EtReturnCRM {
  Type?: string
  Id?: string
  Number?: string
  Message?: string
  LogNo?: string
  LogMsgNo?: string
  MessageV1?: string
  MessageV2?: string
  MessageV3?: string
  MessageV4?: string
  Parameter?: string
  Row?: any
  Field?: string
  System?: string
}

export interface CreateConsumerCRM_Response {
  CsAddressData: AddressDataCRM
  CsNameData: NameDataCRM
  CtMktAttrib?: {
    item?: MKTAttrCRM[]
  }
  EtReturn?: EtReturnCRM[]
}

export interface DisplayConsumerCRM {
  CrmBpId: string
  Date?: string
}

export interface DisplayConsumerCRM_Response {
  EsAddressData: AddressDataCRM
  EsNameData: NameDataCRM
  EtMktAttrib?: {
    item?: MKTAttrCRM[]
  }
  EtReturn?: EtReturnCRM[]
}

export interface AddressDataProdRegCRM {
  Country?: string
  City?: string
  City2?: string
  PostlCod1?: string
  Street?: string
  HouseNo?: string
  StrSuppl1?: string
  StrSuppl2?: string
  StrSuppl3?: string
  Telephone?: string
  Office?: string
  Mobile?: string
  EMail?: string
}

export interface PersonDataProdRegCRM {
  PartnerId?: string
  TitleKey?: string
  Firstname?: string
  Middlename?: string
  Lastname?: string
  Partnerlanguage?: string
  Contactallowance?: string
  Partnerexternal?: string
  Dataorigintype?: string
}

export interface ApplianceDataProdRegCRM {
  ProductId?: string
  CrmPurchaseDate?: string
  RefProduct?: string
  Zz0010?: string
  Zz0011?: string
  Zz0012?: string
  Zz0013?: string
  Zz0014?: string
  Zz0017?: any
  Zz0018?: string
  Zz0019?: string
  Zz0020?: string
  Zzextwr?: string
  Zztptown?: string
  ContractProduct?: string
}

export interface OtherDataProdRegCRM {
  DealerId?: string
  ObjectId?: string
  OtherInfo?: string
}

export interface ProductRegistrationCRM {
  CsAddressData: AddressDataProdRegCRM
  CsPersonData: PersonDataProdRegCRM
  CtApplianceData: {
    item?: ApplianceDataProdRegCRM[]
  }
  CtMktData?: {
    item?: MKTAttrCRM[]
  }
  CtReturn?: EtReturnCRM[]
  IsOtherData?: OtherDataProdRegCRM
}

export interface ProductRegistrationCRM_Response {
  CsAddressData: AddressDataProdRegCRM
  CsPersonData: PersonDataProdRegCRM
  CtApplianceData: {
    item?: ApplianceDataProdRegCRM[]
  }
  CtMktData?: {
    item?: MKTAttrCRM[]
  }
  CtReturn?: EtReturnCRM[]
}
