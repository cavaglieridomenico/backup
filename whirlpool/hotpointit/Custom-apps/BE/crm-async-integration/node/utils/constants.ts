//@ts-nocheck


export const maxRetry = 10;
export const maxWaitTime = 5000;

export const cipherKey = "36246a8fcf66b68a0cffe0eb70b7e63b";
export const cipherIV = "36f2d92fbc013353";

export const accessKey = "bb3daa9963ef9944308848aa8f0acdbfd9eda75b171fd758dbf7ad9e1d4bfbce1f748cb3f689ca451821d6f4b8434c2df276626bb32bdb8c3e0664902d52090a"

export const enabledCredentials = {
  "hotpointit":[
    {
      key: "vtexappkey-hotpointit-INZJFJ",
      token: "QCABLVHTDVRXALJPDTOJRDILYSJXEGFCTAQFQTJNPKGGWKLBVNUPGYOMUPCSMKPWQODAVEYKJATGXCONGHBRLPVVMDLBQQBFVJQHHLGROKFFEHPSAOLEIYLATHNRTXTT"
    },
    {
      key: "vtexappkey-hotpointit-WDZHNY",
      token: "VLZRGIMZKQKOQLYFBZYFEESDPYICWAGCLCRRUVRHUKVWAONBDDGIRKKRTVBHAJCKKHDOTHKGIRKTJVCBLGZTUXKASAXYTJHKILMTLZHVSZAAZQIXTAVTKJPMWCVTJLNY"
    }
  ],
  "hotpointitqa":[
    {
      key: "vtexappkey-hotpointitqa-EPFPPN",
      token: "DILJGPARWWWUXBGKRDYODOYFSWTHJOFUUMKJWZJMIRYGTPWZKCLBDJFPKFRKWTHIQBALRWNRTMGMQRLCATXHDDRKGUZQIZQPJQPSPKINOTIQDTZSUOJCWAFNJPEWXWJT"
    },
    {
      key: "vtexappkey-hotpointitqa-LQFJXO",
      token: "RUJZTLPRJPHVCGURLEXHMOJQPJOKYGTCNCNMALIDFTVYVPYKYJEQNBVCKSKKWFTDWFHZTIRZVTBSTLVALEMOCDPLHKBHBYHAASCQHYRPREVTZDJZXJYRSEBTPWSIHKYW"
    }
  ]
}

export const ccFields = ["id","crmBpId","webId","vtexUserId","email","locale","country","optinConsent","campaign","firstName","lastName","gender","dateOfBirth","mobilePhone","homePhone",/*"businessPhone"*/,"addressId","street","number","complement","city","state","postalCode"];

export const crmHost  = {
  "quality": "https://webservicesq.cert.whirlpool.com",
  "production": "https://webservices.cert.whirlpool.com"
}

export const cert = {
  "quality": "/usr/local/data/service/src/node/cert/WEB2CRM_QA_2021.pfx",
  "production": "/usr/local/data/service/src/node/cert/WEB2CRM_prod_2021.pfx",
}

export const optinPerCountry = {
  "frwhirlpool": ["EU_CONSUMER_WHIRLPOOL"],
  "frwhirlpoolqa": ["EU_CONSUMER_WHIRLPOOL"],
  "itwhirlpool": ["EU_CONSUMER_WHIRLPOOL"],
  "itwhirlpoolqa": ["EU_CONSUMER_WHIRLPOOL"],
  "ruwhirlpool": ["EU_CONSUMER_WHIRLPOOL","EU_CONSUMER_KA_MDA","EU_CONSUMER_INDESIT","EU_CONSUMER_HOTPOINT"],
  "ruwhirlpoolqa": ["EU_CONSUMER_WHIRLPOOL","EU_CONSUMER_KA_MDA","EU_CONSUMER_INDESIT","EU_CONSUMER_HOTPOINT"],
  "hotpointit": ["EU_CONSUMER_HOTPOINT"],
  "hotpointitqa": ["EU_CONSUMER_HOTPOINT"],
  "hotpointuk": ["EU_CONSUMER_HOTPOINT"],
  "hotpointukqa": ["EU_CONSUMER_HOTPOINT"]
}

export const sourceCampaignPerCountry = {
  "frwhirlpool": "WHIRLPOOL_SOURCE_CAMPAIGN",
  "frwhirlpoolqa": "WHIRLPOOL_SOURCE_CAMPAIGN",
  "itwhirlpool": "WHIRLPOOL_SOURCE_CAMPAIGN",
  "itwhirlpoolqa": "WHIRLPOOL_SOURCE_CAMPAIGN",
  "ruwhirlpool": "WHIRLPOOL_SOURCE_CAMPAIGN",
  "ruwhirlpoolqa": "WHIRLPOOL_SOURCE_CAMPAIGN",
  "hotpointit": "HOTPOINT_SOURCE_CAMPAIGN",
  "hotpointitqa": "HOTPOINT_SOURCE_CAMPAIGN",
  "hotpointuk": "HOTPOINT_SOURCE_CAMPAIGN",
  "hotpointukqa": "HOTPOINT_SOURCE_CAMPAIGN"
}

let ITStates = [
  "AG","AL","AN","AO","AP","AQ","AR","AT","AV","BA","BG",
  "BI","BL","BN","BO","BR","BS","BT","BZ","CA","CB","CE",
  "CH","CI","CL","CN","CO","CR","CS","CT","CZ","EE","EN",
  "FC","FE","FG","FI","FM","FO","FR","FU","GE","GO","GR",
  "IM","IS","KR","LC","LE","LI","LO","LT","MB","MC","ME",
  "MI","MN","MO","MS","MT","NA","NO","NU","OG","OR","OT",
  "PA","PC","PD","PE","PG","PI","PL","PN","PO","PR","PS",
  "PT","PU","PV","PZ","RA","RC","RE","RG","RI","RM","RN",
  "RO","RV","SA","SI","SM","SO","SP","SR","SS","SV","TA",
  "TE","TN","TO","TP","TR","TS","TV","UD","VA","VB","VC",
  "VE","VI","VR","VS","VT","VV","ZA"
]

let FRStates = [
  "01","02","03","04","05","06","07","08","09","10","11",
  "12","13","14","15","16","17","18","19","20","21","22",
  "23","24","25","26","27","28","29","2A","2B","30","31",
  "32","33","34","35","36","37","38","39","40","41","42",
  "43","44","45","46","47","48","49","50","51","52","53",
  "54","55","56","57","58","59","60","61","62","63","64",
  "65","66","67","68","69","70","71","72","73","74","75",
  "76","77","78","79","80","81","82","83","84","85","86",
  "87","88","89","90","91","92","93","94","95","97","971",
  "972","973","974","975","976","98","99"
]

export const statesPerCountry = {
  "frwhirlpool": FRStates,
  "frwhirlpoolqa": FRStates,
  "hotpointit": ITStates,
  "hotpointitqa": ITStates,
  "itwhirlpool": [],
  "itwhirlpoolqa": [],
  "ruwhirlpool": [],
  "ruwhirlpoolqa": []
}

export const brandCode = {
  "hotpointit": "32",
  "hotpointitqa": "32"
}

//Product registration for free check-up
//https://whirlpoolgtm.atlassian.net/browse/D2CHPIT-574
export const crmTag = {
  SOAP_BODY_OPEN: "<soapenv:Body>",
  SOAP_BODY_CLOSE: "</soapenv:Body>",
  CT_APPLIANCE_DATA_OPEN: "<CtApplianceData xmlns:n0=\"urn:sap-com:document:sap:soap:functions:mc-style\">",
  ITEM_OPEN: "<item>",
  PRODUCT_ID_OPEN: "<ProductId>",
  PRODUCT_ID_CLOSE: "</ProductId>",
  CRM_PURCHASE_DATE_OPEN: "<CrmPurchaseDate>",
  CRM_PURCHASE_DATE_CLOSE: "</CrmPurchaseDate>",
  REF_PRODUCT_OPEN: "<RefProduct>",
  REF_PRODUCT_CLOSE: "</RefProduct>",
  ZZ0010_OPEN: "<Zz0010>",
  ZZ0010_CLOSE: "</Zz0010>",
  ZZ0011_OPEN: "<Zz0011>",
  ZZ0011_CLOSE: "</Zz0011>",
  ZZ0012_OPEN: "<Zz0012>",
  ZZ0012_CLOSE: "</Zz0012>",
  ZZ0013_OPEN: "<Zz0013>",
  ZZ0013_CLOSE: "</Zz0013>",
  ZZ0014_OPEN: "<Zz0014>",
  ZZ0014_CLOSE: "</Zz0014>",
  ZZ0018_OPEN: "<Zz0018>",
  ZZ0018_CLOSE: "</Zz0018>",
  ZZ0019_OPEN: "<Zz0019>",
  ZZ0019_CLOSE: "</Zz0019>",
  ZZ0020_OPEN: "<Zz0020>",
  ZZ0020_CLOSE: "</Zz0020>",
  ITEM_CLOSE: "</item>",
  CT_APPLIANCE_DATA_CLOSE: "</CtApplianceData>",
  CS_PERSON_DATA_OPEN: "<CsPersonData xmlns:n0=\"urn:sap-com:document:sap:soap:functions:mc-style\">",
  CONTACTALLOWANCE_OPEN: "<Contactallowance>",
  CONTACTALLOWANCE_CLOSE: "</Contactallowance>",
  DATAORINGTYPE_OPEN: "<Dataorigintype>",
  DATAORINGTYPE_CLOSE: "</Dataorigintype>",
  FIRSTNAME_OPEN: "<Firstname>",
  FIRSTNAME_CLOSE: "</Firstname>",
  LASTNAME_OPEN: "<Lastname>",
  LASTNAME_CLOSE: "</Lastname>",
  PARTNERLANGUAGE_OPEN: "<Partnerlanguage>",
  PARTNERLANGUAGE_CLOSE: "</Partnerlanguage>",
  TITLE_KEY_OPEN: "<TitleKey>",
  TITLE_KEY_CLOSE: "</TitleKey>",
  CS_PERSON_DATA_CLOSE: "</CsPersonData>",
  CS_ADDRESS_DATA_OPEN: "<CsAddressData>",
  COUNTRY_OPEN: "<Country>",
  COUNTRY_CLOSE: "</Country>",
  E_MAIL_OPEN: "<EMail>",
  E_MAIL_CLOSE: "</EMail>",
  STREET_OPEN: "<Street>",
  STREET_CLOSE: "</Street>",
  STR_SUPPL1_OPEN: "<StrSuppl1>",
  STR_SUPPL1_CLOSE: "</StrSuppl1>",
  POSTL_COD1_OPEN: "<PostlCod1>",
  POSTL_COD1_CLOSE: "</PostlCod1>",
  CITY_OPEN: "<City>",
  CITY_CLOSE: "</City>",
  CITY2_OPEN: "<City2>",
  CITY2_CLOSE: "</City2>",
  MOBILE_OPEN: "<MOBILE>",
  MOBILE_CLOSE: "</MOBILE>",
  TELEPHONE_OPEN: "<Telephone>",
  TELEPHONE_CLOSE: "</Telephone>",
  IS_OTHER_DATA_OPEN: "<IsOtherData>",
  IS_OTHER_DATA_CLOSE: "</IsOtherData>",
  OTHER_INFO_OPEN: "<OtherInfo>",
  OTHER_INFO_CLOSE: "</OtherInfo>",
  CS_ADDRESS_DATA_CLOSE: "</CsAddressData>",
  CT_MKT_DATA_OPEN: "<CtMktData xmlns:n0=\"urn:sap-com:document:sap:soap:functions:mc-style\">",
  ATT_SET_OPEN: "<AttSet>",
  ATT_SET_CLOSE: "</AttSet>",
  ATT_NAME_OPEN: "<AttName>",
  ATT_NAME_CLOSE: "</AttName>",
  ATT_VALUE_OPEN: "<AttValue>",
  ATT_VALUE_CLOSE: "</AttValue>",
  CT_MKT_DATA_CLOSE: "</CtMktData>",
}
