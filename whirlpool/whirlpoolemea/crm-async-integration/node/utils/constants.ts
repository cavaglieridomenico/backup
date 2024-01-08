import { CRMDetails } from "../typings/crm/common";

export const maxRetry = 10;
export const maxWaitTime = 1500;
export const maxRetrySync = 5;
export const maxWaitTimeSync = 250;
export const cipherKey = "36246a8fcf66b68a0cffe0eb70b7e63b";
export const cipherIV = "36f2d92fbc013353";
export const CLEntityName = "CL";
export const CLEntityFields = ["id", "userId", "crmBpId", "webId", "userType", "email", "firstName", "lastName", "gender", "birthDate", "businessPhone", "homePhone", "phone",
  "isNewsletterOptIn", "localeDefault", "campaign", "partnerCode", "doubleOptinStatus", "isProfilingOptIn"]
export const CCEntityFields = ["id", "crmBpId", "webId", "vtexUserId", "email", "locale", "country", "optinConsent", "firstName", "lastName", "gender", "dateOfBirth", "mobilePhone",
  "homePhone", "campaign", "userType", "addressId", "street", "number", "complement", "city", "state", "postalCode", "partnerCode", "doubleOptinStatus", "profilingConsent"];
export const ADEntityName = "AD";
export const ADEntityFields = ["id", "addressType", "street", "number", "complement", "city", "state", "postalCode", "country", "lastInteractionIn"];
export const EMEntityFields = ["id", "email", "status", "clockNumber", "hrNumber", "integrityCode"];
export const PAEntityFields = ["id", "name", "partnerCode", "accessCode", "status"];
export const NLEntityFields = ["id", "firstName", "lastName", "email", "isNewsletterOptIn", "doubleOptinStatus", "isProfilingOptIn", "campaign", "userType", "partnerCode", "homePhone", "businessPhone", "phone",
  "street", "number", "complement", "city", "postalCode", "state", "country"];

export const crm: CRMDetails = {
  getAccount: {
    endpoint: "/sap/bc/srt/rfc/sap/z_es_myacc_displayconsumer/550/z_es_myacc_displayconsumer/z_es_myacc_displayconsumer",
    wsdl: "/usr/local/data/service/src/node/wsdl/DisplayConsumerData_CRM.wsdl",
    namespace: "ZEsDispconMyacc",
    namespaceRef: "urn:sap-com:document:sap:soap:functions:mc-style"
  },
  createAccount: {
    endpoint: "/sap/bc/srt/rfc/sap/z_es_myacc_createconsumer/550/z_es_myacc_createconsumer/z_es_myacc_createconsumer",
    wsdl: "/usr/local/data/service/src/node/wsdl/CreateModifyConsumer_CRM.wsdl",
    namespace: "ZEsCreaconMyacc",
    namespaceRef: "urn:sap-com:document:sap:soap:functions:mc-style"
  },
  productRegistration: {
    endpoint: "/sap/bc/srt/rfc/sap/z_es_prd_registration/550/z_es_prd_registration/z_es_prd_registration",
    wsdl: "/usr/local/data/service/src/node/wsdl/ProductRegistration_CRM.wsdl",
    namespace: "ZEsPrdRegistration",
    namespaceRef: "urn:sap-com:document:sap:soap:functions:mc-style"
  },
  quality: {
    host: "https://webservicesq.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/WEB2CRM_QA_2021.pfx",
    envPath: "/ecq"

  },
  production: {
    host: "https://webservices.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/WEB2CRM_prod_2021.pfx",
    envPath: "/ecp"
  }
}

export const sappo: CRMDetails = {
  getAccount: {
    endpoint: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VTEX&receiverParty=&receiverService=&interface=SI_DisplayConsumerData_Out&interfaceNamespace=urn:whirlpool.com:D2C:ConsumerData",
    wsdl: "/usr/local/data/service/src/node/wsdl/DisplayConsumerData_PO.wsdl",
    namespace: "Z_ES_DISPCON_MYACC",
    namespaceRef: "urn:sap-com:document:sap:rfc:functions"
  },
  createAccount: {
    endpoint: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VTEX&receiverParty=&receiverService=&interface=SI_CreateModifyConsumer_Out&interfaceNamespace=urn:whirlpool.com:D2C:ConsumerData",
    wsdl: "/usr/local/data/service/src/node/wsdl/CreateModifyConsumer_PO.wsdl",
    namespace: "Z_ES_CREACON_MYACC",
    namespaceRef: "urn:sap-com:document:sap:rfc:functions"
  },
  productRegistration: {
    endpoint: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_BRAND_SITES&receiverParty=&receiverService=&interface=SI_ProductRegistration_out&interfaceNamespace=urn:whirlpool.com:brand_sites:prd_registration",
    wsdl: "/usr/local/data/service/src/node/wsdl/ProductRegistration_PO.wsdl",
    namespace: "Z_ES_PRD_REGISTRATION",
    namespaceRef: "urn:sap-com:document:sap:rfc:functions"
  },
  quality: {
    host: "https://emeaservicesq.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/VTEXUSER_QA.pfx",
    envPath: "/eiq"
  },
  production: {
    host: "https://emeaservices.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/VTEXUSER_prod.pfx",
    envPath: "/eip"
  }
}

export const uk: CRMDetails = {
  getAccount: {
    endpoint: "/XISOAPAdapter/MessageServlet?senderParty=UK&senderService=BC_VTEX&receiverParty=&receiverService=&interface=SI_DisplayConsumerData_Out&interfaceNamespace=urn:whirlpool.com:D2C:ConsumerData",
    wsdl: "/usr/local/data/service/src/node/wsdl/DisplayConsumerData_PO.wsdl",
    namespace: "Z_ES_DISPCON_MYACC",
    namespaceRef: "urn:sap-com:document:sap:rfc:functions"
  },
  createAccount: {
    endpoint: "/RESTAdapter/VTEX_UK/ConsumerRegistration",
    contentType: "application/json"
  },
  quality: {
    host: "https://emeaservicesq.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/VTEXUSER_QA.pfx",
    envPath: "/eiq"
  },
  production: {
    host: "https://emeaservices.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/VTEXUSER_prod.pfx",
    envPath: "/eip"
  }
}

export const CronJobExpression = "*/5 * * * *";
export const VBaseBucketCC = "CRM-Customers";
