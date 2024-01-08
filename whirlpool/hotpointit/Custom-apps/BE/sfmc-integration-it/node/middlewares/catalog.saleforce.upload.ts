//@ts-ignore
//@ts-nocheck

import { uploadCatalog } from "./service";

export async function catalogSlfcUpload(
  ctx: Context,
  next: () => Promise<any>
) {
  ctx.set('Cache-Control', 'no-store');
  if (ctx.query.id != undefined && ctx.query.id != null && ctx.query.id != "" && !isNaN(ctx.query.id)) {
    try {
      const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
      process.env.TEST = JSON.stringify(appSettings);
      let res = await uploadCatalog(ctx);
      ctx.status = res.status;
      ctx.body = res.message;
    } catch (e) {
      if (e.response == undefined) {
        ctx.status = 500;
        ctx.message = e.message;
      } else {
        ctx.status = e?.response?.status;
        ctx.message = "Catalog feed - app settings: " + e?.response?.data?.message;
      }
    }
  } else {
    ctx.status = 400;
    ctx.message = "Empty (or bad) query param";
  }
  await next();
}
