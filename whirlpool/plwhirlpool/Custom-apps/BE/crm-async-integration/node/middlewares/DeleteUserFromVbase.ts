import { LINKED } from "@vtex/api";
import { deleteObjFromVbase } from "../utils/Vbase";
import { CUSTOMERS_BUCKET } from "../utils/constants";

export async function deleteEntryFromVbase(ctx: Context, nex: () => Promise<any>) {
  LINKED && ctx.set("Cache-Control", "no-store")
  const id = ctx.vtex.route.params.recordId as string
  await deleteObjFromVbase(ctx, CUSTOMERS_BUCKET, id)

  ctx.status = 200
  await nex()
}