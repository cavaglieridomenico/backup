export async function ping(ctx: Context, next: () => Promise<unknown>) {
  ctx.set('cache-control', 'no-store')
  ctx.status = 200
  await next()
}
