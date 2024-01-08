import { SAPPO } from "../typings/sap-po";

export const maxRetry = 10;
export const maxWaitTime = 250;
export const maxPONotificationRetries = 20;
export const maxPONotificationWaitTime = 5000;
export const maxMPNotificationRetries = 5;
export const maxMPNotificationWaitTime = 5000;
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

export const CNETWebAddress = "/RESTAdapter/VTEX_UK/StockAlignment";
export const MPNotificationMethod = "POST";
export const MPNotificationEndpoint = "/app/warehousesyncher/pvt/inventory/notifications";
export const reservationDefaultSalesChannelId = "1";
