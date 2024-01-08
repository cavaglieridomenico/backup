import { createDocument, updatePartialDocument } from "../utils/documentCRUD";
import { EMEntityFields, maxRetry } from "../utils/constants";
import { isValid, stringify, wait } from "../utils/commons";
import { EPPEventType, EPPExportRecord } from "../typings/GCP";
import { KeyFields } from "../typings/config";
import { EMRecord } from "../typings/md";

const eppMaxRetry = 30;
const eppMaxWaitTime = 1000;

export async function eppExportHandler(ctx: Context, next: () => Promise<any>) {
  try {
    let records = await getRequestPayload(ctx);
    getAllEPPUsers(ctx, [])
      .then(epps => {
        let firstRecord = records[0];
        if (firstRecord?.event == EPPEventType.FULL_INSERT) {
          ctx.state.appSettings.epp?.keyFields == KeyFields.EMAIL ?
            handleFull(ctx, records, epps).then(() => ctx.state.logger.info(`EPP full import: requests sent. Expected active users: ${records.length}`)) :
            handleFull_CLN_HRN(ctx, records, epps).then(() => ctx.state.logger.info(`EPP full import: requests sent. Expected active users: ${records.length}`));
        } else {
          let existingUsers = epps.filter(f => f.status).length;
          let newUsers = records?.filter(f => f.event == EPPEventType.DELTA_INSERT)?.length;
          let usersToRemove = records?.filter(f => f.event == EPPEventType.DELTA_DELETE)?.length;
          ctx.state.appSettings.epp?.keyFields == KeyFields.EMAIL ?
            handleDelta(ctx, records, epps).then(() => ctx.state.logger.info(`EPP delta import: requests sent. Expected active users: ${(existingUsers + newUsers - usersToRemove)} -- new users: ${newUsers}; users to remove: ${usersToRemove}`)) :
            handleDelta_CLN_HRN(ctx, records, epps).then(() => ctx.state.logger.info(`EPP delta import: requests sent. Expected active users: ${(existingUsers + newUsers - usersToRemove)} -- new users: ${newUsers}; users to remove: ${usersToRemove}`))
        }
      })
      .catch(err => ctx.state.logger.error(`EPP import: failed --err: ${err.message}`))
    ctx.status = 200;
    ctx.body = "OK";
  } catch (err) {
    console.error(err)
    ctx.status = 500;
    ctx.body = err.message ? (`EPP import: failed --err: ${err.message}`) : "Internal Server Error";
    if (isValid(err.message)) {
      ctx.state.logger.error(`EPP import: failed --err: ${err.message}`);
    }
  }
  await next();
}

async function getRequestPayload(ctx: Context): Promise<EPPExportRecord[]> {
  return new Promise<EPPExportRecord[]>((resolve, reject) => {
    let payload = "";
    ctx.req.on("data", (chunk) => payload += Buffer.from(chunk, "binary").toString("utf8"));
    ctx.req.on("end", () => resolve(JSON.parse(payload)));
    ctx.req.on("error", (err) => reject({ message: `error while retrieving the request payload --details: ${stringify(err)}` }))
  })
}

async function getAllEPPUsers(ctx: Context, output: EMRecord[], token: string | undefined = undefined, size: number = 1000, retry: number = 0): Promise<EMRecord[]> {
  return new Promise<EMRecord[]>((resolve, reject) => {
    ctx.clients.masterdata.scrollDocuments({ dataEntity: ctx.state.appSettings.epp?.mdEntityName!, fields: EMEntityFields, mdToken: token, size: size })
      .then((res: any) => {
        output = output.concat(res.data);
        if (res.data?.length < size) {
          resolve(output)
        } else {
          return getAllEPPUsers(ctx, output, res.mdToken, size, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        }
        return;
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(eppMaxWaitTime);
          return getAllEPPUsers(ctx, output, token, size, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: `scroll ${ctx.state.appSettings.epp?.mdEntityName} failed --details: ${stringify(err)}` });
        }
      })
  })
}

async function handleFull(ctx: Context, records: EPPExportRecord[], EPPrecords: EMRecord[]): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    for (let i = 0; i < records.length; i++) {
      let record = EPPrecords?.find(f => f.email?.toLowerCase() == records[i].emailAddress?.toLowerCase());
      if (isValid(record)) {
        if (record!.status != true) {
          updatePartialDocument(ctx, ctx.state.appSettings.epp?.mdEntityName!, record!.id!, { status: true }, 0, eppMaxRetry, eppMaxWaitTime)
            .catch(err => ctx.state.logger.error(`EPP full import - insert EPP user ${records[i].emailAddress}: failed --err: ${stringify(err.message ? err.message : err)} --payload: ${stringify(records[i])}`))
          await wait(1);
        }
      } else {
        createDocument(ctx, ctx.state.appSettings.epp?.mdEntityName!, { email: records[i].emailAddress, status: true }, 0, eppMaxRetry, eppMaxWaitTime)
          .catch(err => ctx.state.logger.error(`EPP full import - insert EPP user ${records[i].emailAddress}: failed --err: ${stringify(err.message ? err.message : err)} --payload: ${stringify(records[i])}`))
        await wait(1);
      }
    }
    for (let i = 0; i < EPPrecords.length; i++) {
      if (!isWhitelisted(ctx, EPPrecords[i])) {
        let record = records?.find(f => f.emailAddress?.toLowerCase() == EPPrecords[i].email?.toLowerCase());
        if (!isValid(record)) {
          updatePartialDocument(ctx, ctx.state.appSettings.epp?.mdEntityName!, EPPrecords[i].id!, { status: false }, 0, eppMaxRetry, eppMaxWaitTime)
            .catch(err => ctx.state.logger.error(`EPP full import - disable EPP user ${EPPrecords[i].email}: failed --err: ${stringify(err.message ? err.message : err)}`))
          await wait(1);
        }
      }
    }
    resolve(true)
  })
}

async function handleDelta(ctx: Context, records: EPPExportRecord[], EPPrecords: EMRecord[]): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    for (let i = 0; i < records.length; i++) {
      switch (records[i].event) {
        case EPPEventType.DELTA_INSERT:
          handleDeltaInsert(ctx, records[i], EPPrecords)
            .then(res => res.recordSkipped ? ctx.state.logger.info(`EPP delta import - insert EPP user ${records[i].emailAddress}: skipped`) : "")
            .catch(err => ctx.state.logger.error(`EPP delta import - insert EPP user ${records[i].emailAddress}: failed --err: ${stringify(err.message ? err.message : err)} --payload: ${stringify(records[i])}`));
          break;
        case EPPEventType.DELTA_DELETE:
          handleDeltaDelete(ctx, records[i], EPPrecords)
            .then(res => res.recordSkipped ? ctx.state.logger.info(`EPP delta import - disable EPP user ${records[i].emailAddress}: skipped`) : "")
            .catch(err => ctx.state.logger.error(`EPP delta import - disable EPP user ${records[i].emailAddress}: failed --err: ${stringify(err.message ? err.message : err)} --payload: ${stringify(records[i])}`));
          break;
        default:
          ctx.state.logger.error(`EPP delta import - unknown event "${records[i].event}" for the EPP user ${records[i].emailAddress}`);
      }
      await wait(1);
    }
    resolve(true)
  })
}

async function handleDeltaInsert(ctx: Context, record: EPPExportRecord, EPPrecords: EMRecord[]): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let user = EPPrecords?.find(f => f.email?.toLowerCase() == record.emailAddress?.toLowerCase());
    if (isValid(user)) {
      if (user!.status != true) {
        return updatePartialDocument(ctx, ctx.state.appSettings.epp?.mdEntityName!, user!.id!, { status: true }, 0, eppMaxRetry, eppMaxWaitTime).then(res => resolve(res)).catch(err => reject(err));
      } else {
        resolve({ recordSkipped: true })
      }
    } else {
      return createDocument(ctx, ctx.state.appSettings.epp?.mdEntityName!, { email: record.emailAddress, status: true }, 0, eppMaxRetry, eppMaxWaitTime).then(res => resolve(res)).catch(err => reject(err));
    }
    return;
  })
}

async function handleDeltaDelete(ctx: Context, record: EPPExportRecord, EPPrecords: EMRecord[]): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let user = EPPrecords?.find(f => f.email?.toLowerCase() == record.emailAddress?.toLowerCase());
    if (isValid(user)) {
      if (user!.status != false) {
        return updatePartialDocument(ctx, ctx.state.appSettings.epp?.mdEntityName!, user!.id!, { status: false }, 0, eppMaxRetry, eppMaxWaitTime).then(res => resolve(res)).catch(err => reject(err));
      } else {
        resolve({ recordSkipped: true })
      }
    } else {
      reject({ status: 404, message: "not found" });
    }
    return;
  })
}

async function handleFull_CLN_HRN(ctx: Context, records: EPPExportRecord[], EPPrecords: EMRecord[]): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    for (let i = 0; i < records.length; i++) {
      let record = EPPrecords?.find(f => (isValid(f.clockNumber) && f.clockNumber == records[i].payrollId) || (isValid(f.hrNumber) && f.hrNumber == records[i].hrNumber));
      let fieldForLog = isValid(records[i].payrollId) ? records[i].payrollId : records[i].hrNumber;
      if (isValid(record)) {
        if (record!.status != true || areDifferentRecords(records[i], record!)) {
          updatePartialDocument(
            ctx,
            ctx.state.appSettings.epp?.mdEntityName!,
            record!.id!,
            {
              clockNumber: records[i].payrollId,
              hrNumber: records[i].hrNumber,
              integrityCode: records[i].surnameInitials,
              status: true
            },
            0,
            eppMaxRetry,
            eppMaxWaitTime
          )
            .catch(err => ctx.state.logger.error(`EPP full import - insert EPP user ${fieldForLog}: failed --err: ${stringify(err.message ? err.message : err)} --payload: ${stringify(records[i])}`))
          await wait(1);
        }
      } else {
        createDocument(
          ctx,
          ctx.state.appSettings.epp?.mdEntityName!,
          {
            clockNumber: records[i].payrollId,
            hrNumber: records[i].hrNumber,
            integrityCode: records[i].surnameInitials,
            status: true
          },
          0,
          eppMaxRetry,
          eppMaxWaitTime
        )
          .catch(err => ctx.state.logger.error(`EPP full import - insert EPP user ${fieldForLog}: failed --err: ${stringify(err.message ? err.message : err)} --payload: ${stringify(records[i])}`))
        await wait(1);
      }
    }
    for (let i = 0; i < EPPrecords.length; i++) {
      if (!isWhitelisted(ctx, EPPrecords[i])) {
        let record = records?.find(f => (f.payrollId == EPPrecords[i].clockNumber && isValid(EPPrecords[i].clockNumber)) || (f.hrNumber == EPPrecords[i].hrNumber && isValid(EPPrecords[i].hrNumber)));
        let fieldForLog = isValid(EPPrecords[i].clockNumber) ? EPPrecords[i].clockNumber : EPPrecords[i].hrNumber;
        if (!isValid(record)) {
          updatePartialDocument(
            ctx,
            ctx.state.appSettings.epp?.mdEntityName!,
            EPPrecords[i]!.id!,
            {
              status: false
            },
            0,
            eppMaxRetry,
            eppMaxWaitTime
          )
            .catch(err => ctx.state.logger.error(`EPP full import - disable EPP user ${fieldForLog}: failed --err: ${stringify(err.message ? err.message : err)}`))
          await wait(1);
        }
      }
    }
    resolve(true)
  })
}

async function handleDelta_CLN_HRN(ctx: Context, records: EPPExportRecord[], EPPrecords: EMRecord[]): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    for (let i = 0; i < records.length; i++) {
      let fieldForLog = isValid(records[i].payrollId) ? records[i].payrollId : records[i].hrNumber;
      switch (records[i].event) {
        case EPPEventType.DELTA_INSERT:
        case EPPEventType.DELTA_UPDATE:
          handleDeltaInsertOrUpdate_CLN_HRN(ctx, records[i], EPPrecords)
            .then(res => res.recordSkipped ? ctx.state.logger.info(`EPP delta import - insert / update EPP user ${fieldForLog}: skipped`) : "")
            .catch(err => ctx.state.logger.error(`EPP delta import - insert / update EPP user ${fieldForLog}: failed --err: ${stringify(err.message ? err.message : err)} --payload: ${stringify(records[i])}`));
          break;
        case EPPEventType.DELTA_DELETE:
          handleDeltaDelete_CLN_HRN(ctx, records[i], EPPrecords)
            .then(res => res.recordSkipped ? ctx.state.logger.info(`EPP delta import - disable EPP user ${fieldForLog}: skipped"`) : "")
            .catch(err => ctx.state.logger.error(`EPP delta import - disable EPP user ${fieldForLog}: failed --err: ${stringify(err.message ? err.message : err)} --payload: ${stringify(records[i])}`));
          break;
        default:
          ctx.state.logger.error(`EPP delta import - unknown event "${records[i].event}" for the EPP user ${fieldForLog}`);
      }
      await wait(1);
    }
    resolve(true)
  })
}

async function handleDeltaInsertOrUpdate_CLN_HRN(ctx: Context, record: EPPExportRecord, EPPrecords: EMRecord[]): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let user = EPPrecords?.find(f => (record.payrollId == f.clockNumber && isValid(f.clockNumber)) || (record.hrNumber == f.hrNumber && isValid(f.hrNumber)));
    if (isValid(user)) {
      if (user!.status != true || areDifferentRecords(record, user!)) {
        return updatePartialDocument(
          ctx,
          ctx.state.appSettings.epp?.mdEntityName!,
          user!.id!,
          {
            clockNumber: record.payrollId,
            hrNumber: record.hrNumber,
            integrityCode: record.surnameInitials,
            status: true
          },
          0,
          eppMaxRetry,
          eppMaxWaitTime
        ).then(res => resolve(res)).catch(err => reject(err));
      } else {
        resolve({ recordSkipped: true })
      }
    } else {
      return createDocument(
        ctx,
        ctx.state.appSettings.epp?.mdEntityName!,
        {
          clockNumber: record.payrollId,
          hrNumber: record.hrNumber,
          integrityCode: record.surnameInitials,
          status: true
        },
        0,
        eppMaxRetry,
        eppMaxWaitTime
      ).then(res => resolve(res)).catch(err => reject(err));
    }
    return;
  })
}

async function handleDeltaDelete_CLN_HRN(ctx: Context, record: EPPExportRecord, EPPrecords: EMRecord[]): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let user = EPPrecords?.find(f => (record.payrollId == f.clockNumber && isValid(f.clockNumber)) || (record.hrNumber == f.hrNumber && isValid(f.hrNumber)));
    if (isValid(user)) {
      if (user!.status != false) {
        return updatePartialDocument(
          ctx,
          ctx.state.appSettings.epp?.mdEntityName!,
          user!.id!,
          {
            status: false
          },
          0,
          eppMaxRetry,
          eppMaxWaitTime
        ).then(res => resolve(res)).catch(err => reject(err));
      } else {
        resolve({ recordSkipped: true })
      }
    } else {
      reject({ status: 404, message: "not found" });
    }
    return;
  })
}

function areDifferentRecords(gcpRecord: EPPExportRecord, vtexRecord: EMRecord): boolean {
  let gcpNormRecord: EPPExportRecord = {
    hrNumber: isValid(gcpRecord.hrNumber) ? gcpRecord.hrNumber!.toLowerCase() : null,
    payrollId: isValid(gcpRecord.payrollId) ? gcpRecord.payrollId!.toLowerCase() : null,
    surnameInitials: isValid(gcpRecord.surnameInitials) ? gcpRecord.surnameInitials!.toLowerCase() : null
  }
  let vtexNormRecord: EMRecord = {
    hrNumber: isValid(vtexRecord.hrNumber) ? vtexRecord.hrNumber!.toLowerCase() : null,
    clockNumber: isValid(vtexRecord.clockNumber) ? vtexRecord.clockNumber!.toLowerCase() : null,
    integrityCode: isValid(vtexRecord.integrityCode) ? vtexRecord.integrityCode!.toLowerCase() : null
  }
  return gcpNormRecord.hrNumber != vtexNormRecord.hrNumber || gcpNormRecord.payrollId != vtexNormRecord.clockNumber || gcpNormRecord.surnameInitials != vtexNormRecord.integrityCode;
}


function isWhitelisted(ctx: Context, record: EMRecord): boolean {
  let found = false;
  let whiteList = ctx.state.appSettings.epp?.whiteList;
  whiteList = whiteList ? whiteList : [];
  for (let i = 0; i < whiteList.length; i++) {
    if (ctx.state.appSettings.epp?.keyFields == KeyFields.EMAIL) {
      if (whiteList[i].toLowerCase() == record.email?.toLowerCase()) {
        found = true;
      }
    } else {
      if (whiteList[i].toLowerCase() == record.clockNumber?.toLowerCase() || whiteList[i].toLowerCase() == record.hrNumber?.toLowerCase()) {
        found = true;
      }
    }
  }
  return found;
}
