//@ts-nocheck

import CoBody = require("co-body");
import { CUSTOMERS_BUCKET } from "../utils/constants";
import { mapADInfo, ADInfoAreEqual, mapCLInfo, getMostRecentAddress, CLInfoAreEqual, isAddressCreatedyTheBackflow, wait, getCommunity, getBrandAndCountry, getCCdataByUserId, stringify } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { ForbiddenError } from "@vtex/api";
import { GoogleAuth } from "google-auth-library";
import { createDocument, updatePartialDocument, searchDocuments } from "../utils/documentCRUD";
import { getGCPClient, getGCPAuthToken } from "../clients/GCP";
import { saveObjInVbase, updatePartialObjInVbase } from "../utils/Vbase";

export async function notificationHandler(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    let appSettings = JSON.parse(process.env.CRM);
    const gcpAuth = new GoogleAuth({
      projectId: appSettings.gcpProjectId,
      credentials: {
        client_email: appSettings.gcpClientEmail,
        private_key: (appSettings.gcpPrivateKey + "").replace(/\\n/gm, '\n')
      }
    });
    let userData = await CoBody(ctx.req);
    switch (userData.notification) {
      case "user created":
        handleUserCreated(ctx, userData, gcpAuth)
          .then(res => {
            console.log(res)
            if (!res.ignore) {
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            //console.log(err)
            ctx.vtex.logger.error(err.message != undefined ? err.message : ("create customer: notification failed -- err: " + stringify(err)));
          });
        break;
      case "user updated":
        handleUserUpdated(ctx, userData, gcpAuth)
          .then(res => {
            console.log(res)
            if (!res.ignore) {
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            //console.log(err)
            ctx.vtex.logger.error(err.message != undefined ? err.message : ("update customer: notification failed -- err: " + stringify(err)));
          });
        break;
      case "address created":
        handleAddressCreatedOrUpdated(ctx, userData, gcpAuth)
          .then(res => {
            if (!res.ignore) {
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            //console.log(err)
            ctx.vtex.logger.error(err.message != undefined ? err.message : ("create address: notification failed -- err: " + stringify(err)));
          });
        break;
      case "address updated":
        handleAddressCreatedOrUpdated(ctx, userData, gcpAuth)
          .then(res => {
            if (!res.ignore) {
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            //console.log(err)
            ctx.vtex.logger.error(err.message != undefined ? err.message : ("update address: notification failed -- err: " + stringify(err)));
          });
        break;
      case "address deleted":
        handleAddressDeleted(ctx, userData, gcpAuth)
          .then(res => {
            if (!res.ignore) {
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            //console.log(err)
            ctx.vtex.logger.error(err.message != undefined ? err.message : ("delete address: notification failed -- err: " + stringify(err)));
          });
        break;
      default:
        throw new ForbiddenError("unknown notification");
    }
    ctx.body = "OK";
    ctx.status = 200;
  } catch (err) {
    //console.log(err)
    ctx.body = err.message != undefined ? err.message : "Internal Server Error";
    ctx.status = err.status != undefined ? err.status : 500;
    ctx.vtex.logger.error(err.status == 403 ? ("unknown notification -- err: " + stringify(err)) : ("unknown error -- details: " + stringify(err)));
  }
  await next();
}

async function handleUserCreated(ctx: Context, userData: Object, gcpAuth: GoogleAuth): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      let customer = mapCLInfo(ctx, userData);
      const res = await createDocument(ctx, "CC", customer, 0);
      await updatePartialObjInVbase(ctx, CUSTOMERS_BUCKET, userData.id, { ...customer, id: res.DocumentId })
      ctx.vtex.logger.debug(`document saved ${{ ...customer, id: res.DocumentId }}`)
      await updatePartialDocument(ctx, "CL", customer.vtexUserId, { webId: customer.webId }, 0)
      const gcpClient = await getGCPClient(gcpAuth, 0);
      const token = await getGCPAuthToken(gcpClient, 0);
      await ctx.clients.GCP.notify({ event: "NEW", userId: userData.id, brand: getCommunity(customer.userType), country: getBrandAndCountry(ctx).country }, token, 0);
      resolve({ message: "create customer " + userData.id + ": notification sent -- data: " + JSON.stringify(customer), status: 200, ignore: false });
    } catch (err) {
      //console.log(err)
      reject({
        message: "create customer " + userData.id + ": notification failed -- err: " + stringify(err),
        status: err.status != undefined ? err.status : (err.response?.status != undefined ? err.response.status : 500), ignore: false
      });
    }
  });
}

async function handleUserUpdated(ctx: Context, userData: Object, gcpAuth: GoogleAuth): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    let ignoreLog = true;
    try {
      let customer = mapCLInfo(ctx, userData);
      let ccRecord = await getCCdataByUserId(ctx, userData.id)
      ctx.vtex.logger.debug(`data received from vbase ${stringify(ccRecord)}`)
      if (ccRecord == undefined) {
        return handleUserCreated(ctx, userData, gcpAuth).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }
      if (!CLInfoAreEqual(customer, ccRecord)) {
        await updatePartialDocument(ctx, "CC", ccRecord.id, customer, 0);
        await updatePartialObjInVbase(ctx, CUSTOMERS_BUCKET, userData.id, customer)
        const gcpClient = await getGCPClient(gcpAuth, 0);
        const token = await getGCPAuthToken(gcpClient, 0);
        await ctx.clients.GCP.notify({ event: "OLD", userId: userData.id, brand: getCommunity(customer.userType), country: getBrandAndCountry(ctx).country }, token, 0);
        ignoreLog = false;
      }
      resolve({ message: "update customer " + userData.id + ": notification sent -- data: " + JSON.stringify(customer), status: 200, ignore: ignoreLog });
    } catch (err) {
      //console.log(err)
      reject({
        message: "update customer " + userData.id + ": notification failed -- err: " + stringify(err),
        status: err.status != undefined ? err.status : (err.response?.status != undefined ? err.response.status : 500), ignore: false
      });
    }
  });
}

async function handleAddressCreatedOrUpdated(ctx: Context, userData: Object, gcpAuth: GoogleAuth): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    let ignoreLog = true;
    try {
      let address = mapADInfo(ctx, userData);
      let ccRecord = await getCCdataByUserId(ctx, userData.userId)
      if (!ADInfoAreEqual(address, ccRecord)) {
        await updatePartialDocument(ctx, "CC", ccRecord.id, address, 0);
        await updatePartialObjInVbase(ctx, CUSTOMERS_BUCKET, userData.userId, address)
        if (!isAddressCreatedyTheBackflow(userData)) {
          const gcpClient = await getGCPClient(gcpAuth, 0);
          const token = await getGCPAuthToken(gcpClient, 0);
          await ctx.clients.GCP.notify({ event: "OLD", userId: userData.userId, brand: getCommunity(ccRecord.userType), country: getBrandAndCountry(ctx).country }, token, 0);
          ignoreLog = false;
        }
      }
      resolve({ message: "create / update address " + userData.userId + ": notification sent -- data: " + JSON.stringify(address), status: 200, ignore: ignoreLog });
    } catch (err) {
      console.log(error);
      reject({
        message: "create / update address " + userData.userId + ": notification failed -- err: " + stringify(err),
        status: err.status != undefined ? err.status : (err.response?.status != undefined ? err.response.status : 500), ignore: false
      });
    }
  });
}

async function handleAddressDeleted(ctx: Context, userData: Object, gcpAuth: GoogleAuth): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    let ignoreLog = true;
    try {
      let p0 = new Promise<any>((resolve, reject) => {
        searchDocuments(ctx, "AD", ["id", "addressType", "street", "number", "complement", "city", "state", "postalCode", "country", "lastInteractionIn"], "userId=" + userData.userId, { page: 1, pageSize: 1000 }, 0, false)
          .then(res => {
            resolve(res.filter(f => f.addressType?.toLowerCase() == "residential"));
          })
          .catch(err => {
            reject(err);
          })
      });
      let p1 = new Promise<any>((resolve, reject) => {
        getCCdataByUserId(ctx, userData.userId)
          .then(res => {
            resolve(res[0]);
          })
          .catch(err => {
            reject(err);
          })
      });
      let results = await Promise.all([p0, p1]);
      let addresses: [] = results[0];
      let ccRecord = results[1];
      let address = {};
      if (addresses.length > 0) {
        let recentAddress = getMostRecentAddress(addresses);
        address = mapADInfo(ctx, recentAddress);
        if (!ADInfoAreEqual(address, ccRecord)) {
          await updatePartialDocument(ctx, "CC", ccRecord.id, address, 0);
          await updatePartialObjInVbase(ctx, CUSTOMERS_BUCKET, userData.userId, address)
          const gcpClient = await getGCPClient(gcpAuth, 0);
          const token = await getGCPAuthToken(gcpClient, 0);
          await ctx.clients.GCP.notify({ event: "OLD", userId: userData.userId, brand: getCommunity(ccRecord.userType), country: getBrandAndCountry(ctx).country }, token, 0);
          ignoreLog = false;
        }
      } else {
        await updatePartialDocument(ctx, "CC", ccRecord.id, { addressId: null }, 0);
        await updatePartialObjInVbase(ctx, CUSTOMERS_BUCKET, userData.userId, { addressId: null })
      }
      resolve({ message: "delete address " + userData.userId + ": notification sent -- data: " + JSON.stringify(address), status: 200, ignore: ignoreLog });
    } catch (err) {
      //console.log(err)
      reject({
        message: "delete address " + userData.userId + ": notification failed -- err: " + stringify(err),
        status: err.status != undefined ? err.status : (err.response?.status != undefined ? err.response.status : 500), ignore: false
      });
    }
  });
}
