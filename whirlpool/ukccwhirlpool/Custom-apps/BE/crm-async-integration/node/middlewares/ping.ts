//@ts-nocheck

export async function ping(ctx: Context, next: () => Promise<any>){
  ctx.status = 200;
  ctx.body = "OK";
  console.log("ping "+Date.now())
  await next();
}
