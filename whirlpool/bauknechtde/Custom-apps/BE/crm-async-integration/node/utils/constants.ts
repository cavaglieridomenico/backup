//@ts-nocheck

import { CRMDetails } from "../typings/types";

export const maxRetry = 10;
export const maxWaitTime = 3000;
export const cipherKey = "36246a8fcf66b68a0cffe0eb70b7e63b";
export const cipherIV = "36f2d92fbc013353";
export const CLEntityName = "CL";
export const CLEntityFields = ["id", "userId", "crmBpId", "webId", "userType", "email", "firstName", "lastName", "gender", "birthDate", "businessPhone", "homePhone", "phone",
                              "isNewsletterOptIn", "localeDefault", "campaign", "partnerCode", "doubleOptinStatus"]
export const CCEntityName = "CC";
export const CCEntityFields = ["id", "crmBpId", "webId", "vtexUserId", "email", "locale", "country", "optinConsent", "firstName", "lastName", "gender", "dateOfBirth", "mobilePhone",
                              "homePhone", "campaign", "userType", "addressId", "street", "number", "complement", "city", "state", "postalCode", "partnerCode", "doubleOptinStatus"];
export const ADEntityName = "AD";
export const ADEntityFields = ["id", "addressType", "street", "number", "complement", "city", "state", "postalCode", "country", "lastInteractionIn"];
export const EMEntityName = "EM";
export const EMEntityFields = ["id", "email", "status"];
export const PAEntityName  = "PA";
export const PAEntityFields = ["id", "name", "partnerCode", "accessCode", "status"];

export const crm: CRMDetails  = {
  quality: {
    host: "https://webservicesq.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/WEB2CRM_QA_2021.pfx",
    getAccountEndpoint: "/ecq/sap/bc/srt/rfc/sap/z_es_myacc_displayconsumer/550/z_es_myacc_displayconsumer/z_es_myacc_displayconsumer",
    createUpdateAccountEndpoint: "/ecq/sap/bc/srt/rfc/sap/z_es_myacc_createconsumer/550/z_es_myacc_createconsumer/z_es_myacc_createconsumer"
  },
  production: {
    host: "https://webservices.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/WEB2CRM_prod_2021.pfx",
    getAccountEndpoint: "/ecp/sap/bc/srt/rfc/sap/z_es_myacc_displayconsumer/550/z_es_myacc_displayconsumer/z_es_myacc_displayconsumer",
    createUpdateAccountEndpoint: "/ecp/sap/bc/srt/rfc/sap/z_es_myacc_createconsumer/550/z_es_myacc_createconsumer/z_es_myacc_createconsumer"
  }
}

export const sappo: CRMDetails = {
  quality: {
    host: "https://emeaservicesq.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/VTEXUSER_QA.pfx",
    getAccountEndpoint: "/eiq/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VTEX&receiverParty=&receiverService=&interface=SI_DisplayConsumerData_Out&interfaceNamespace=urn:whirlpool.com:D2C:ConsumerData",
    createUpdateAccountEndpoint: "/eiq/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VTEX&receiverParty=&receiverService=&interface=SI_CreateModifyConsumer_Out&interfaceNamespace=urn:whirlpool.com:D2C:ConsumerData"
  },
  production: {
    host: "https://emeaservices.cert.whirlpool.com",
    cert: "/usr/local/data/service/src/node/cert/VTEXUSER_prod.pfx",
    getAccountEndpoint: "/eip/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VTEX&receiverParty=&receiverService=&interface=SI_DisplayConsumerData_Out&interfaceNamespace=urn:whirlpool.com:D2C:ConsumerData",
    createUpdateAccountEndpoint: "/eip/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VTEX&receiverParty=&receiverService=&interface=SI_CreateModifyConsumer_Out&interfaceNamespace=urn:whirlpool.com:D2C:ConsumerData"
  }
}

export const optinPerCommunity = {
  "EPP": ["EU_CONSUMER_EPP"],
  "FF": ["EU_CONSUMER_FF"],
  "VIP": ["EU_CONSUMER_VIP"]
}
