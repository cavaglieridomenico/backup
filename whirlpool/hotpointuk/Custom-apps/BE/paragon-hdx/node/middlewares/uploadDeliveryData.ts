import { DMRecord, DTRecord } from "../typings/md";
import { FileType } from "../typings/types";
import { DMFields, DTFields } from "../utils/constants";
import { createDocument, deleteDocument, scrollDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { equalObjects, getRequestPayload, wait } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function uploadDeliveryData(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    let payload = await getRequestPayload(ctx);
    let unknFile = false;
    if (payload.file == FileType.DM) {
      scrollDocuments(ctx, ctx.state.appSettings.vtex.deliveryMatrix.mdName, DMFields)
        .then(res => {
          handleDMRecords(ctx, res, payload.data)
            .then(() => ctx.vtex.logger.info(`DM import: update processed`))
        })
        .catch(err => ctx.vtex.logger.error(`DM import: failed --err: ${err}`))
    } else {
      if (payload.file == FileType.DT) {
        scrollDocuments(ctx, ctx.state.appSettings.vtex.deliveryTimeCalc.mdName, DTFields)
          .then(res => {
            handleDTRecords(ctx, res, payload.data)
              .then(() => ctx.vtex.logger.info(`DT import: update processed`))
          })
          .catch(err => ctx.vtex.logger.error(`DT import: failed --err: ${err}`))
      } else {
        unknFile = true;
      }
    }
    if (unknFile) {
      ctx.status = 500;
      ctx.body = "Unknown File";
    } else {
      ctx.status = 200;
      ctx.body = "OK";
    }
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}

async function handleDMRecords(ctx: Context, mdRecords: DMRecord[], gcpRecords: DMRecord[]): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    for (let i = 0; i < mdRecords.length; i++) {
      let record = gcpRecords?.find(f => f.majorPostCode == mdRecords[i].majorPostCode);
      if (record) {
        if (!equalObjects(mdRecords[i], record)) {
          updatePartialDocument(ctx, ctx.state.appSettings.vtex.deliveryMatrix.mdName, mdRecords[i].id!, record).catch(err => ctx.vtex.logger.error(`DM import: error while updating ${mdRecords[i].majorPostCode} --err: ${err}`))
          await wait(1);
        }
      } else {
        deleteDocument(ctx, ctx.state.appSettings.vtex.deliveryMatrix.mdName, mdRecords[i].id!).catch(err => ctx.vtex.logger.error(`DM import: error while deleting ${mdRecords[i].majorPostCode} --err: ${err}`))
        await wait(1);
      }
    }
    for (let i = 0; i < gcpRecords.length; i++) {
      let record = mdRecords?.find(f => f.majorPostCode == gcpRecords[i].majorPostCode);
      if (!record) {
        createDocument(ctx, ctx.state.appSettings.vtex.deliveryMatrix.mdName, gcpRecords[i]).catch(err => ctx.vtex.logger.error(`DM import: error while insering ${gcpRecords[i].majorPostCode} --err: ${err}`))
        await wait(1);
      }
    }
    resolve(true);
  })
}

async function handleDTRecords(ctx: Context, mdRecords: DTRecord[], gcpRecords: DTRecord[]): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    for (let i = 0; i < mdRecords.length; i++) {
      let record = gcpRecords?.find(f => f.timeCalCode == mdRecords[i].timeCalCode);
      if (record) {
        if (!equalObjects(mdRecords[i], record)) {
          updatePartialDocument(ctx, ctx.state.appSettings.vtex.deliveryTimeCalc.mdName, mdRecords[i].id!, record).catch(err => ctx.vtex.logger.error(`DT import: error while updating ${mdRecords[i].timeCalCode} --err: ${err}`))
          await wait(1);
        }
      } else {
        deleteDocument(ctx, ctx.state.appSettings.vtex.deliveryTimeCalc.mdName, mdRecords[i].id!).catch(err => ctx.vtex.logger.error(`DT import: error while deleting ${mdRecords[i].timeCalCode} --err: ${err}`))
        await wait(1);
      }
    }
    for (let i = 0; i < gcpRecords.length; i++) {
      let record = mdRecords?.find(f => f.timeCalCode == gcpRecords[i].timeCalCode);
      if (!record) {
        createDocument(ctx, ctx.state.appSettings.vtex.deliveryTimeCalc.mdName, gcpRecords[i]).catch(err => ctx.vtex.logger.error(`DT import: error while insering ${gcpRecords[i].timeCalCode} --err: ${err}`))
        await wait(1);
      }
    }
    resolve(true);
  })
}
