import { CheckOrderReservationRes } from "../typings/types";
import { FB_FIELDS } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";

export async function checkOrderReservation(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  try {
    const orderId = ctx.vtex.route.params.orderId.toString();
    const whereCondition = `orderId=${orderId}`
    const reservation = await searchDocuments(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, FB_FIELDS, whereCondition, { page: 1, pageSize: 1 })

    let res: CheckOrderReservationRes = {
      hasReservation: reservation.length > 0,
      status: reservation[0]?.status ?? "No reservation"
    }

    ctx.body = res
    ctx.status = 200;
    await next()
  } catch (e) {
    console.log(e);

    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}

