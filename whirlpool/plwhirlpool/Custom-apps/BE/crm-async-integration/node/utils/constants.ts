//@ts-nocheck

export const maxRetry = 10;
export const maxWaitTime = 5000;

export const ccFields = ["id", "crmBpId", "webId", "vtexUserId", "email", "locale", "country", "optinConsent", "firstName", "lastName", "gender", "dateOfBirth", "mobilePhone", "homePhone", "campaign", "userType", "addressId", "street", "number", "complement", "city", "state", "postalCode"];

export const crmHost = {
  "quality": "https://webservicesq.cert.whirlpool.com",
  "production": "https://webservices.cert.whirlpool.com"
}

export const sapPoHost = {
  "quality": "https://emeaservicesq.cert.whirlpool.com",
  "production": "https://emeaservices.cert.whirlpool.com"
}

export const cert = {
  "quality": "/usr/local/data/service/src/node/cert/WEB2CRM_QA_2021.pfx",
  "production": "/usr/local/data/service/src/node/cert/WEB2CRM_prod_2021.pfx",
}

export const certSapPo = {
  "quality": "/usr/local/data/service/src/node/cert/VTEXUSER_QA.pfx",
  "production": "/usr/local/data/service/src/node/cert/VTEXUSER_prod.pfx",
}

export const optinPerBrand = {
  "frwhirlpool": ["EU_CONSUMER_WHIRLPOOL"],
  "frwhirlpoolqa": ["EU_CONSUMER_WHIRLPOOL"],
  "itwhirlpool": ["EU_CONSUMER_WHIRLPOOL"],
  "itwhirlpoolqa": ["EU_CONSUMER_WHIRLPOOL"],
  "ruwhirlpool": ["EU_CONSUMER_WHIRLPOOL", "EU_CONSUMER_KA_MDA", "EU_CONSUMER_INDESIT", "EU_CONSUMER_HOTPOINT"],
  "ruwhirlpoolqa": ["EU_CONSUMER_WHIRLPOOL", "EU_CONSUMER_KA_MDA", "EU_CONSUMER_INDESIT", "EU_CONSUMER_HOTPOINT"],
  "hotpointit": ["EU_CONSUMER_HOTPOINT"],
  "hotpointitqa": ["EU_CONSUMER_HOTPOINT"],
  "plwhirlpool": ["EU_CONSUMER_WHIRLPOOL"],
  "plwhirlpoolqa": ["EU_CONSUMER_WHIRLPOOL"]
}

export const optinPerCommunity = {
  "EPP": ["EU_CONSUMER_EPP"],
  "FF": ["EU_CONSUMER_FF"],
  "VIP": ["EU_CONSUMER_VIP"]
}

export const sourceCampaignPerBrand = {
  "frwhirlpool": ["WHIRLPOOL_SOURCE_CAMPAIGN"],
  "frwhirlpoolqa": ["WHIRLPOOL_SOURCE_CAMPAIGN"],
  "itwhirlpool": ["WHIRLPOOL_SOURCE_CAMPAIGN"],
  "itwhirlpoolqa": ["WHIRLPOOL_SOURCE_CAMPAIGN"],
  "frccwhirlpool": [],
  "frccwhirlpoolqa": [],
  "plwhirlpool": ["WHIRLPOOL_SOURCE_CAMPAIGN"],
  "plwhirlpoolqa": ["WHIRLPOOL_SOURCE_CAMPAIGN"]
}

const FRStates = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2A", "2B", "30", "31",
  "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64",
  "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "97", "971",
  "972", "973", "974", "975", "976", "98", "99"]

const ITStates = ["AG", "AL", "AN", "AO", "AP", "AQ", "AR", "AT", "AV", "BA", "BG",
  "BI", "BL", "BN", "BO", "BR", "BS", "BT", "BZ", "CA", "CB", "CE",
  "CH", "CI", "CL", "CN", "CO", "CR", "CS", "CT", "CZ", "EE", "EN",
  "FC", "FE", "FG", "FI", "FM", "FO", "FR", "FU", "GE", "GO", "GR",
  "IM", "IS", "KR", "LC", "LE", "LI", "LO", "LT", "MB", "MC", "ME",
  "MI", "MN", "MO", "MS", "MT", "NA", "NO", "NU", "OG", "OR", "OT",
  "PA", "PC", "PD", "PE", "PG", "PI", "PL", "PN", "PO", "PR", "PS",
  "PT", "PU", "PV", "PZ", "RA", "RC", "RE", "RG", "RI", "RM", "RN",
  "RO", "RV", "SA", "SI", "SM", "SO", "SP", "SR", "SS", "SV", "TA",
  "TE", "TN", "TO", "TP", "TR", "TS", "TV", "UD", "VA", "VB", "VC",
  "VE", "VI", "VR", "VS", "VT", "VV", "ZA"]

const PLStates = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21",
  "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32",
  "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43",
  "44", "45", "46", "47", "48", "49", "60", "61", "62", "63", "64",
  "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75",
  "AE", "AF", "BE", "BG", "CC", "CD", "CE", "CF", "CG", "DC", "DD",
  "DE", "DF", "DG", "DH", "DSL", "EB", "EC", "ED", "EE", "EF", "EG",
  "EH", "FA", "FB", "FC", "FD", "FE", "FF", "FG", "FH", "FI", "GB",
  "GC", "GD", "GG", "GH", "GI", "HD", "HE", "HG", "HH", "IH", "K-P",
  "LBL", "LBS", "LDZ", "MAL", "MAZ", "OPO", "PDK", "PDL", "POM",
  "SLS", "SWK", "W-M", "WLK", "Z-P"]

export const statesPerCountry = {
  "frwhirlpool": FRStates,
  "frwhirlpoolqa": FRStates,
  "frccwhirlpool": FRStates,
  "frccwhirlpoolqa": FRStates,
  "hotpointit": ITStates,
  "hotpointitqa": ITStates,
  "plwhirlpool": PLStates,
  "plwhirlpoolqa": PLStates,
  "itwhirlpool": [],
  "itwhirlpoolqa": [],
  "ruwhirlpool": [],
  "ruwhirlpoolqa": []
}

export const CUSTOMERS_BUCKET = "cc"
export const ADDRESS_BUCKET = "ca"