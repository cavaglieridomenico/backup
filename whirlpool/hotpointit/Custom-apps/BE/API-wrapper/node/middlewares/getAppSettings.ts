import { APP } from "@vtex/api"

export async function GetAppSettings(ctx: Context, next: () => Promise<any>) {
  try{
    ctx.state.appSettings = await ctx.clients.apps.getAppSettings(APP.ID);
    await next();
  }catch(err){
    console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
