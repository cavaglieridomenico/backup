
export async function ping(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  ctx.status = 200;
  ctx.body = "OK";
  console.info("ping " + Date.now())
  await next();
}
