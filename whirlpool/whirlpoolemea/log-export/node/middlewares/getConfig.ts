//@ts-nocheck

export async function getConfig(ctx: Context, next: () => Promise<any>){
  try{
    ctx.state.config = await ctx.clients.apps.getAppSettings("whirlpoolemea.log-export")
    await next();
  }catch(err){
    ctx.status = 500;
    ctx.body = "Internal Server Error"
  }
}
