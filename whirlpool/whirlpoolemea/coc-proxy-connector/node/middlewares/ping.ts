export async function ping(ctx: Context, next: () => Promise<unknown>) {
  ctx.status = 200
  console.log('-------------------- PING --------------------')
  await next()
}