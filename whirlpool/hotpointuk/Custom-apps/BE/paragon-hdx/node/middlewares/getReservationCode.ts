import { VCRecord } from "../typings/md";
import { bucketHDX, VCFields } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { isValid } from "../utils/functions";

export async function getReservationCode(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  try {
    let code = await retrieveReservatioCode(ctx, ctx.vtex.route.params.orderId as string);
    ctx.status = 200;
    ctx.body = { reservationCode: code };
  } catch (err) {
    ctx.status = err.ignore ? 200 : 500;
    ctx.body = err.ignore ? { reservationCode: null } : "Internal Server Error";
  }
  await next();
}

async function retrieveReservatioCode(ctx: Context, orderId: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    ctx.clients.vbase.getJSON(bucketHDX, orderId, true)
      .then((code: any) => {
        if (isValid(code)) {
          resolve(code + "");
          ctx.clients.vbase.deleteFile(bucketHDX, orderId);
        } else {
          searchDocuments(ctx, ctx.state.appSettings.vtex.reservationTable.mdName, VCFields, `orderId=${orderId}`, { page: 1, pageSize: 10 }, true)
            .then((res: VCRecord[]) => {
              if (res.length > 0) {
                resolve(res[0].reservationCode);
              } else {
                reject({ msg: `No reservation code found for the order ${orderId}`, ignore: true });
              }
            })
            .catch(err => reject(err));
        }
      })
      .catch(() => {
        searchDocuments(ctx, ctx.state.appSettings.vtex.reservationTable.mdName, VCFields, `orderId=${orderId}`, { page: 1, pageSize: 10 }, true)
          .then((res: VCRecord[]) => {
            if (res.length > 0) {
              resolve(res[0].reservationCode);
            } else {
              reject({ msg: `No reservation code found for the order ${orderId}`, ignore: true });
            }
          })
          .catch(err => reject(err));
      })
  })
}
