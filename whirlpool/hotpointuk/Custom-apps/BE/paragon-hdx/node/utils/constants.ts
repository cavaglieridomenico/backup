
import { SAPPO } from "../typings/sap-po";

export const maxRetry = 10;
export const maxWaitTime = 250;
export const cipherKey = "36246a8fcf66b68a0cffe0eb70b7e63b";
export const cipherIV = "36f2d92fbc013353";

export const sappo: SAPPO = {
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

export const HDXWebAppAddress = "/XISOAPAdapter/MessageServlet?senderParty=&senderService=UK_GCP_WEB_APPLICATION&receiverParty=&receiverService=&interface=SI_HDS_Visits_out&interfaceNamespace=urn:whirlpool.com:UK_GCP:WebApplication:HDS";

export const HDSAddress = "http://axida.com/HDi";

export const DMFields = ["id", "majorPostCode", "deliverySunday", "deliveryMonday", "deliveryTuesday", "deliveryWednesday", "deliveryThursday", "deliveryFriday", "deliverySaturday", "satellite",
  "alternativePostCode", "isDepot", "deliveryZone", "deliveryService"];

export const DTFields = ["id", "timeCalCode", "timeCalFixed", "timeCalUnitVar", "timeCalVolVar", "timeCalWeightVar", "timeCalRemoveVar", "timeCalElecConnVar", "timeCalWetConnVar", "timeCalOtherConnVar",
  "timeCalOther1", "timeCalOther2", "timeCalOther3", "timeCalType", "timeCalZone", "timeCalPlant", "timeCalShipTo", "timeCalDesc"];

export const DCFields = ["id", "depotName", "EOD24h", "sameDayEOD", "saturdayEOD", "sundayEOD", "allow24hDelivery", "allowSameDay", "allowSaturdayDelivery", "allowSundayDelivery",
  "allowNextDaySaturdayDelivery", "allowNextDaySundayDelivery", "workingDayList", "hdsForceInSaturdayTrade", "hdsForceInSundayTrade", "hdsForceInSaturdayHD", "hdsForceInSundayHD"];

export const twoMenKeywords = ["1ST FLOOR", "FIRST FLOOR", "2 MAN", "2 MEN", "2MAN", "2MEN", "2ND FLOOR", "SECOND FLOOR", "ACCESS DIFFICULTIES", "FLOOR:2", "FLOOR 2", "FLOOR: 2", "STAIRS", "STEPS", "TWO MAN", "TWO MEN"];

export const stairsToggleValue = "WITH STAIRS";

export const constructionTypeField = "constructionType";

export const bucketHDX = "HDX";

export const VCFields = ["id", "orderId", "reservationCode"];

export const OTFields = ["id", "area", "stdOffset", "adOffset", "carrierPCode", "carrierText"];

export const HTFiedls = ["id", "date"];

export const CLEntity = "CL";

export const CLFields = ["id", "email"];

export const bucketOrderForm = "OrderFormRef"
