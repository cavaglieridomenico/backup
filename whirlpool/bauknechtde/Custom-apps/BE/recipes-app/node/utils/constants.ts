export const defaultCookie = "VtexIdclientAutCookie"
export const deafultLocale = "en-US"

export const AuthenticationCredentials: { [index: string]: string } = {
  "wrapper_app_key": "4JaYkYpJga2KapvAaJaVv6hhJkfwe2evs8PRgkLaY5EDyj5yHAd3EyfnuhauQAnL"
}

export const VBaseBucket = "api-wrapper"

export const EMAIL_VALIDATION_ENTITY = "EV"
export const GA_TRANSACTION_ENTITY = "TI"

export const sapCodeToBillingType = {
  "ZF2": {
    "it-IT": "fattura",
    "fr-FR": "facture",
    "de-DE": "rechnung"
  },
  "ZRE": {
    "it-IT": "credito",
    "fr-FR": "avoir",
    "de-DE": "kredit"
  },
  "ZG2": {
    "it-IT": "credito",
    "fr-FR": "avoir",
    "de-DE": "kredit"
  },
  "ZL2": {
    "it-IT": "debito",
    "fr-FR": "débit",
    "de-DE": "schuld"
  },
}

export const localeMap = {
  frwhirlpool: "fr-FR",
  frwhirlpoolqa: "fr-FR",
  frccwhirlpool: "fr-FR",
  frccwhirlpoolqa: "fr-FR",
  itwhirlpool: "it-IT",
  itwhirlpoolqa: "it-IT",
  hotpointit: "it-IT",
  bauknechtde: "de-DE",
  bauknechtdeqa: "de-DE",
}

export const currencyToSymbol = {
  "EUR": "€"
}

export const maxRetry = 10;
export const maxWaitTime = 500;
export const FFIEntityName = "FF";
export const FFIEntityFields = ["id", "invitingUser", "invitedUser", "expirationDate", "activationDate"];
export const CLEntityName = "CL";
export const CLEntityFields = ["id", "userId", "email", "userType", "totalNumberOfPlacedOrders", "totalNumberOfBoughtFG", "partnerCode"];
export const EPPEntityName = "EM";
export const EPPEntityFields = ["id", "email", "status"];
export const VIPEntityName = "PA";
export const VIPEntityFields = ["id", "name", "partnerCode", "accessCode", "status"];
export const nineDotFiveMinutes = 570000; // 9m 30s
export const cipherKey = "36246a8fcf66b68a0cffe0eb70b7e63b";
export const cipherIV = "36f2d92fbc013353";
export const sessionItems = ["account.id", "account.accountName", "store.channel", "store.countryCode", "store.cultureInfo", "store.currencyCode", "store.currencySymbol", "store.admin_cultureInfo",
  "creditControl.creditAccounts", "creditControl.deadlines", "creditControl.minimumInstallmentValue", "authentication.storeUserId", "authentication.storeUserEmail",
  "profile.firstName", "profile.document", "profile.email", "profile.id", "profile.isAuthenticated", "profile.lastName", "profile.phone", "public.favoritePickup",
  "public.utm_source", "public.utm_medium", "public.utm_campaign", "public.utmi_cp", "public.utmi_p", "public.utmi_pc"]
