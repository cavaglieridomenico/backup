export const maxRetry: number = 10;
export const maxWaitTime: number = 500;
export const FFIEntityFields: string[] = ["id", "invitingUser", "invitedUser", "expirationDate", "activationDate", "cluster"];
export const CLEntityName: string = "CL";
export const CLEntityFields: string[] = ["id", "firstName", "userId", "email", "userType", "totalNumberOfPlacedOrders", "partnerCode", "loginCounter", "invitingUser", "activationDate", "clockNumber", "hrNumber", "orderLimitCounter", "lastPlacedOrderDate"];
export const EPPEntityFields: string[] = ["id", "email", "status", "clockNumber", "hrNumber", "integrityCode"];
export const VIPEntityFields: string[] = ["id", "name", "partnerCode", "accessCode", "status", "autologinEnabled", "companyPassword"];
export const nineDotFiveMinutes: number = 570000; // 9m 30s
export const cipherKey: string = "36246a8fcf66b68a0cffe0eb70b7e63b";
export const cipherIV: string = "36f2d92fbc013353";
export const ordersBucket = "orders";
export const adminCookie = "VtexIdclientAutCookie";
export const LoginLogsEntity = "LL";
export const LoginLogsFields = ["id", "clockNumber", "email", "event", "hrNumber", "invitingUser", "logDescription", "logType", "partnerCode", "timestamp", "userType"]