import { scrollDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { FB_FIELDS } from "../utils/constants";
import { CancelSlotPayload, FB_STATUS } from "../typings/fareye";
import { getRandomReference, routeToLabel, stringify, wait } from "../utils/functions";
import { FBRecord } from "../typings/md_entities";

//useful to cancel all reservations that are expired. Called by a gcp job every x hours so it need to search in MD which reservation needs to be deleted
export async function cancelBatchReservation(ctx: Context, next: () => Promise<any>) {
  try {
    let res: FBRecord[] = await getReservationsToCancel(ctx);
    cancelAllReservations(ctx, res).then(() => ctx.state.logger.info(`Batch cancelation triggered -- Expected cancelation ${res.length}`))
    ctx.status = 200;
  } catch (error) {
    let label = routeToLabel(ctx);
    let msg = error.msg ? error.msg : stringify(error);
    ctx.state.logger.error(`${label} ${msg}`);
    ctx.status = 500;
  }
  await next()
}

//get all reservation older than X (Default = two) hours, based on creationDate (creation of record in MD). We don't use the field CreatedIn due to offset that we don't know.
async function getReservationsToCancel(ctx: Context): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      let currentDate = new Date();
      currentDate.setHours(currentDate.getHours() - ctx.state.appSettings.FarEye_Settings.BookingExpire);
      let whereString = `status=${FB_STATUS.CREATED} AND creationDate<${currentDate.toISOString()}`;
      let response = await scrollDocuments(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, FB_FIELDS, whereString);
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}

async function cancelAllReservations(ctx: Context, reservations: FBRecord[]) {
  let label = routeToLabel(ctx);
  return new Promise<any>(async (resolve) => {
    for (let index = 0; index < reservations.length; index++) {
      let payload: CancelSlotPayload = {
        carrier_code: reservations[index].carrierCode,
        reference_id: getRandomReference(),
        slot_id: reservations[index].reservationCode,
        order_number: reservations[index].referenceNumber
      }
      ctx.clients.FarEye.CancelSlot(payload)
        .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`));
      updatePartialDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, reservations[index].id!, { status: FB_STATUS.CANCELED })
        .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`))
      await wait(500);
    }
    resolve(true);
  })
}
