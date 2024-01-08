export const maxTime = 250;
export const maxRetries = 10;

export const cipherKey = "36246a8fcf66b68a0cffe0eb70b7e63b";
export const cipherIV = "36f2d92fbc013353";

export const specsXTradePolicy: any = {
  "sellable": {
    "O2P": "sellable",
    "EPP": "sellableEPP",
    "FF": "sellableFF",
    "VIP": "sellableVIP"
  }
}

export const DGFields = ["id", "orderId", "itemId", "typeOfWarranty", "itemToken"];
export const AlertEntity = "AL";
export const leadTimeSpec = "leadtime"
export const fgasSpec = "fgas"

export const FarEyeEntity = "FB"

export const categoryValues = ["fridge", "laundry", "dish", "mwo", "dryer", "oven", "hood", "hobs"]
export const ordersBucket = "Orders"

export const DROP_PRICE_MASTER_DATA_ENTITY = "DA"
export const DROP_PRICE_ENTITY_FIELDS = ['id', 'createdIn', 'email', 'emailSent', 'isDropPriceAlert', 'isDropPriceExpire', 'refId', 'subscriptionPrice']
export const DROP_PRICE_MAX_RESULTS = 1000
export enum AuthHeaders {
  APPKEY = "X-VTEX-API-AppKey",
  APPTOKEN = "X-VTEX-API-AppToken"
}

export const productComparisonServiceEndpoint = "/app/sfmc/productsComparison"
