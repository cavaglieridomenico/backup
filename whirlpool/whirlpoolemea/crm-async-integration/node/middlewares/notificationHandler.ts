
import { ADEntityFields, ADEntityName, CCEntityFields, CLEntityName } from "../utils/constants";
import { mapADInfo, ADInfoAreEqual, mapCLInfo, getMostRecentAddress, CLInfoAreEqual, isAddressCreatedyTheBackflow, mapCCToCL } from "../utils/mapper";
import { ForbiddenError } from "@vtex/api";
import { createDocument, updatePartialDocument, searchDocuments } from "../utils/documentCRUD";
import { GCPPayload, NotificationType } from "../typings/GCP";
import { ADRecord, CCRecord, CLRecord, DOIStatus, MDNotification } from "../typings/md";
import { checkNameAndSurname, stringify, wait } from "../utils/commons";
import { json } from "co-body";
import { saveOrUpdateCCRecordInVBase } from "../utils/CC-VBase";

export async function notificationHandler(ctx: Context, next: () => Promise<any>) {
  try {
    let userData: CLRecord | ADRecord = await json(ctx.req)
    switch (userData.notification) {
      case MDNotification.USER_CREATED:
        handleUserCreated(ctx, userData)
          .then((res: { ignore: boolean, message: string }) => !res.ignore ? ctx.state.logger.info(res.message) : "")
          .catch(err => ctx.state.logger.error(err.message ? err.message : `create customer: notification failed --err: ${stringify(err.message ? err.message : err)}`))
        break;
      case MDNotification.USER_UPDATED:
        handleUserUpdated(ctx, userData)
          .then((res: { ignore: boolean, message: string }) => !res.ignore ? ctx.state.logger.info(res.message) : "")
          .catch(err => ctx.state.logger.error(err.message ? err.message : `update customer: notification failed --err: ${stringify(err.message ? err.message : err)}`))
        break;
      case MDNotification.ADDRESS_CREATED:
        handleAddressCreatedOrUpdated(ctx, userData)
          .then((res: { ignore: boolean, message: string }) => !res.ignore ? ctx.state.logger.info(res.message) : "")
          .catch(err => ctx.state.logger.error(err.message ? err.message : `create address: notification failed --err: ${stringify(err.message ? err.message : err)}`))
        break;
      case MDNotification.ADDRESS_UPDATED:
        handleAddressCreatedOrUpdated(ctx, userData)
          .then((res: { ignore: boolean, message: string }) => !res.ignore ? ctx.state.logger.info(res.message) : "")
          .catch(err => ctx.state.logger.error(err.message ? err.message : `update address: notification failed --err: ${stringify(err.message ? err.message : err)}`))
        break;
      case MDNotification.ADDRESS_DELETED:
        handleAddressDeleted(ctx, userData)
          .then((res: { ignore: boolean, message: string }) => !res.ignore ? ctx.state.logger.info(res.message) : "")
          .catch(err => ctx.state.logger.error(err.message ? err.message : `delete address: notification failed --err: ${stringify(err.message ? err.message : err)}`))
        break;
      default:
        throw new ForbiddenError("unknown notification");
    }
    ctx.status = 200;
    ctx.body = "OK";
  } catch (err) {
    console.error(err);
    ctx.body = err.message ? err.message : "Internal Server Error";
    ctx.status = 500;
    ctx.state.logger.error(err.status == 403 ? `unknown notification --err: ${stringify(err.message ? err.message : err)}` : `unknown error --details: ${stringify(err)}`);
  }
  await next();
}

async function handleUserCreated(ctx: Context, userData: CLRecord): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      let customer = mapCLInfo(ctx, userData);
      await checkNameAndSurname(customer);
      await Promise.all([
        createDocument(ctx, ctx.state.appSettings.crmEntityName, customer),
        saveOrUpdateCCRecordInVBase(ctx, customer)
      ])
      let updatedCLRecord = mapCCToCL(customer); // for DOI scope
      await updatePartialDocument(ctx, CLEntityName, customer.vtexUserId!, { webId: customer.webId, isNewsletterOptIn: updatedCLRecord.isNewsletterOptIn, doubleOptinStatus: updatedCLRecord.doubleOptinStatus });
      let gcpNotififaction: GCPPayload = {
        event: customer.crmBpId ? NotificationType.OLD : NotificationType.NEW,
        userId: userData.id!
      }
      await wait(5 * 1000);
      await ctx.clients.GCP.sendNotification(gcpNotififaction);
      resolve({ message: `create customer ${userData.id}: notification sent --data: ${stringify(customer)} --notification: ${stringify(gcpNotififaction)}`, ignore: false });
    } catch (err) {
      console.error(err);
      reject({ message: `create customer ${userData.id}: notification failed --err: ${stringify(err.message ? err.message : err)}`, ignore: false });
    }
  });
}

async function handleUserUpdated(ctx: Context, userData: CLRecord): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    let ignoreLog = true;
    let gcpNotififaction: GCPPayload | undefined = undefined;
    try {
      let customer = mapCLInfo(ctx, userData);
      await checkNameAndSurname(customer);
      let ccRecord: CCRecord = (await searchDocuments(ctx, ctx.state.appSettings.crmEntityName, CCEntityFields, `vtexUserId=${userData.id}`, { page: 1, pageSize: 10 }, true))[0];
      if (!ccRecord) {
        userData.notification = MDNotification.USER_CREATED;
        return handleUserCreated(ctx, userData).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }
      if (!CLInfoAreEqual(customer, ccRecord)) {
        await Promise.all([
          updatePartialDocument(ctx, ctx.state.appSettings.crmEntityName, ccRecord.id!, customer),
          saveOrUpdateCCRecordInVBase(ctx, ccRecord, customer)
        ])
        if (!ctx.state.appSettings.doubleOptin || (ctx.state.appSettings.doubleOptin && userData.doubleOptinStatus != DOIStatus.PENDING)) { //userData needed for the case noOptin --> optin
          gcpNotififaction = {
            event: customer.crmBpId ? NotificationType.OLD : NotificationType.NEW,
            userId: userData.id!
          }
          await wait(5 * 1000);
          await ctx.clients.GCP.sendNotification(gcpNotififaction);

          ignoreLog = false;
        }
      }
      // for DOI Scope //
      if (ctx.state.appSettings.doubleOptin) {
        let updatedCLRecord = mapCCToCL(customer);
        if ((updatedCLRecord.isNewsletterOptIn + "") != (userData.isNewsletterOptIn + "") || (Object.keys(userData).includes("doubleOptinStatus") && (updatedCLRecord.doubleOptinStatus + "") != (userData.doubleOptinStatus + ""))) {
          await updatePartialDocument(ctx, CLEntityName, userData.id!, { isNewsletterOptIn: updatedCLRecord.isNewsletterOptIn, doubleOptinStatus: updatedCLRecord.doubleOptinStatus })
        }
      }
      ///////////////////
      resolve({ message: `update customer ${userData.id}: notification sent --data: ${stringify(customer)} --notification: ${stringify(gcpNotififaction)}`, ignore: ignoreLog });
    } catch (err) {
      console.error(err);
      reject({ message: `update customer ${userData.id}: notification failed --err: ${stringify(err.message ? err.message : err)}`, ignore: false });
    }
  });
}

async function handleAddressCreatedOrUpdated(ctx: Context, userData: ADRecord): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    let ignoreLog = true;
    let gcpNotififaction: GCPPayload | undefined = undefined;
    try {
      let address = mapADInfo(ctx, userData);
      let ccRecord: CCRecord = (await searchDocuments(ctx, ctx.state.appSettings.crmEntityName, CCEntityFields, `vtexUserId=${userData.userId}`, { page: 1, pageSize: 10 }, true))[0];
      await checkNameAndSurname(ccRecord);
      if (!ADInfoAreEqual(address, ccRecord)) {
        await Promise.all([
          updatePartialDocument(ctx, ctx.state.appSettings.crmEntityName, ccRecord.id!, address),
          saveOrUpdateCCRecordInVBase(ctx, ccRecord, address)
        ])
        if (!isAddressCreatedyTheBackflow(userData) && (!ctx.state.appSettings.doubleOptin || (ctx.state.appSettings.doubleOptin && ccRecord.doubleOptinStatus != DOIStatus.PENDING))) {
          gcpNotififaction = {
            event: ccRecord.crmBpId ? NotificationType.OLD : NotificationType.NEW,
            userId: userData.userId!
          }
          await wait(5 * 1000);
          await ctx.clients.GCP.sendNotification(gcpNotififaction);
          ignoreLog = false;
        }
      }
      resolve({ message: `create / update address ${userData.userId}: notification sent --data: ${stringify(address)} --notification: ${stringify(gcpNotififaction)}`, ignore: ignoreLog });
    } catch (err) {
      console.error(err);
      reject({ message: `create / update address ${userData.userId}: notification failed --err: ${stringify(err.message ? err.message : err)}`, ignore: false });
    }
  });
}

async function handleAddressDeleted(ctx: Context, userData: ADRecord): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    let ignoreLog = true;
    let gcpNotififaction: GCPPayload | undefined = undefined;
    try {
      let results = await Promise.all(
        [
          searchDocuments(ctx, ADEntityName, ADEntityFields, `userId=${userData.userId}`, { page: 1, pageSize: 1000 }, false),
          searchDocuments(ctx, ctx.state.appSettings.crmEntityName, CCEntityFields, `vtexUserId=${userData.userId}`, { page: 1, pageSize: 10 }, false)
        ]
      );
      let addresses: ADRecord[] = results[0];
      let ccRecord: CCRecord = results[1][0];
      let address = {};
      await checkNameAndSurname(ccRecord);
      if (addresses.length > 0) {
        let recentAddress = getMostRecentAddress(addresses);
        address = mapADInfo(ctx, recentAddress);
        if (!ADInfoAreEqual(address, ccRecord)) {
          await Promise.all([
            updatePartialDocument(ctx, ctx.state.appSettings.crmEntityName, ccRecord.id!, address),
            saveOrUpdateCCRecordInVBase(ctx, ccRecord, address)
          ])
          if (!ctx.state.appSettings.doubleOptin || (ctx.state.appSettings.doubleOptin && ccRecord.doubleOptinStatus != DOIStatus.PENDING)) {
            gcpNotififaction = {
              event: ccRecord.crmBpId ? NotificationType.OLD : NotificationType.NEW,
              userId: userData.userId!
            }
            await wait(5 * 1000);
            await ctx.clients.GCP.sendNotification(gcpNotififaction);
            ignoreLog = false;
          }
        }
      } else {
        await Promise.all([
          updatePartialDocument(ctx, ctx.state.appSettings.crmEntityName, ccRecord.id!, { addressId: null }),
          saveOrUpdateCCRecordInVBase(ctx, ccRecord, { addressId: null })
        ])
      }
      resolve({ message: `delete address ${userData.userId}: notification sent --data: ${stringify(address)} --notification: ${stringify(gcpNotififaction)}`, ignore: ignoreLog });
    } catch (err) {
      console.error(err);
      reject({ message: `delete address ${userData.userId}: notification failed --err: ${stringify(err.message ? err.message : err)}`, ignore: false });
    }
  });
}
