export async function crmBackflowStatus(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");   
  ctx.status = ctx.state.appSettings.pixelCrmBackflow ? 200 : 500;
  await next();
}
